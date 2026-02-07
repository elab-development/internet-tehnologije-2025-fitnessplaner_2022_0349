<?php

namespace App\Http\Controllers;

use App\Models\DnevnikIshrane;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DnevnikIshraneController extends Controller
{
    /**
     * Klijent vidi samo svoje dnevnike + stavke + namirnice
     */
    public function index()
    {
        return DnevnikIshrane::where('korisnik_id', auth()->id())
            ->with(['stavke.namirnica'])
            ->orderByDesc('datum')
            ->get();
    }

    /**
     * Kreiraj dnevnik za sebe (ako vec postoji za taj datum - ne pravi duplikat)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'datum' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validacija nije prosla',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        $dnevnik = DnevnikIshrane::firstOrCreate([
            'korisnik_id' => auth()->id(),
            'datum'       => $data['datum'],
        ]);

        return response()->json($dnevnik, 201);
    }

    /**
     * Prikazi jedan dnevnik (samo ako je korisnikov) + stavke + namirnice
     */
    public function show($id)
    {
        $dnevnik = DnevnikIshrane::where('id', $id)
            ->where('korisnik_id', auth()->id())
            ->with(['stavke.namirnica'])
            ->firstOrFail();

        return response()->json($dnevnik);
    }

    /**
     * Izmeni dnevnik (samo datum, samo svoj)
     */
    public function update(Request $request, $id)
    {
        $dnevnik = DnevnikIshrane::where('id', $id)
            ->where('korisnik_id', auth()->id())
            ->firstOrFail();

        $validator = Validator::make($request->all(), [
            'datum' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validacija nije prosla',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $dnevnik->update($validator->validated());

        return response()->json($dnevnik, 200);
    }

    /**
     * Obrisi dnevnik (samo svoj)
     */
    public function destroy($id)
    {
        $dnevnik = DnevnikIshrane::where('id', $id)
            ->where('korisnik_id', auth()->id())
            ->firstOrFail();

        $dnevnik->delete();

        return response()->json(['message' => 'Dnevnik ishrane je obrisan.'], 200);
    }

    /**
     * Dnevnik za datum + stavke + totals + totals_po_obroku
     */
    public function byDate(string $datum)
    {
        $dnevnik = DnevnikIshrane::where('korisnik_id', auth()->id())
            ->whereDate('datum', $datum)
            ->with(['stavke.namirnica'])
            ->first();

        $emptyTotals = fn() => [
            'kalorije' => 0,
            'proteini' => 0,
            'ugljeni_hidrati' => 0,
            'masti' => 0,
        ];

        if (!$dnevnik) {
            return response()->json([
                'datum' => $datum,
                'stavke' => [],
                'totali' => $emptyTotals(),
                'totali_po_obroku' => [
                    'dorucak' => $emptyTotals(),
                    'rucak' => $emptyTotals(),
                    'vecera' => $emptyTotals(),
                    'uzina' => $emptyTotals(),
                ],
            ]);
        }

        $totali = $emptyTotals();
        $totaliPoObroku = [
            'dorucak' => $emptyTotals(),
            'rucak' => $emptyTotals(),
            'vecera' => $emptyTotals(),
            'uzina' => $emptyTotals(),
        ];

        foreach ($dnevnik->stavke as $s) {
            if (!$s->namirnica) continue;

            $kolicina = (float) $s->kolicina_g;
            $f = $kolicina / 100.0;

            $kal = ((float) $s->namirnica->kalorije_na_100g) * $f;
            $p   = ((float) $s->namirnica->proteini_na_100g) * $f;
            $uh  = ((float) $s->namirnica->ugljeni_hidrati_na_100g) * $f;
            $m   = ((float) $s->namirnica->masti_na_100g) * $f;

            // ukupno
            $totali['kalorije'] += $kal;
            $totali['proteini'] += $p;
            $totali['ugljeni_hidrati'] += $uh;
            $totali['masti'] += $m;

            // po obroku
            $obrok = strtolower((string) $s->obrok);
            if (!array_key_exists($obrok, $totaliPoObroku)) {
                $obrok = 'uzina';
            }

            $totaliPoObroku[$obrok]['kalorije'] += $kal;
            $totaliPoObroku[$obrok]['proteini'] += $p;
            $totaliPoObroku[$obrok]['ugljeni_hidrati'] += $uh;
            $totaliPoObroku[$obrok]['masti'] += $m;
        }

        $roundTotals = function (array $t) {
            return [
                'kalorije' => round($t['kalorije'], 2),
                'proteini' => round($t['proteini'], 2),
                'ugljeni_hidrati' => round($t['ugljeni_hidrati'], 2),
                'masti' => round($t['masti'], 2),
            ];
        };

        return response()->json([
            'id' => $dnevnik->id,
            'datum' => $dnevnik->datum->toDateString(),
            'stavke' => $dnevnik->stavke,
            'totali' => $roundTotals($totali),
            'totali_po_obroku' => [
                'dorucak' => $roundTotals($totaliPoObroku['dorucak']),
                'rucak'   => $roundTotals($totaliPoObroku['rucak']),
                'vecera'  => $roundTotals($totaliPoObroku['vecera']),
                'uzina'   => $roundTotals($totaliPoObroku['uzina']),
            ],
        ]);
    }

    /**
     * Grupisane stavke po obroku (za taj datum)
     */
    public function byDateGrouped(string $datum)
    {
        $dnevnik = DnevnikIshrane::where('korisnik_id', auth()->id())
            ->whereDate('datum', $datum)
            ->with(['stavke.namirnica'])
            ->first();

        if (!$dnevnik) {
            return response()->json(null, 200);
        }

        $grupe = $dnevnik->stavke
            ->groupBy('obrok')
            ->map(fn($items) => $items->values());

        return response()->json([
            'id' => $dnevnik->id,
            'datum' => $dnevnik->datum->toDateString(),
            'obroci' => [
                'dorucak' => $grupe->get('dorucak', collect())->values(),
                'rucak'   => $grupe->get('rucak', collect())->values(),
                'vecera'  => $grupe->get('vecera', collect())->values(),
                'uzina'   => $grupe->get('uzina', collect())->values(),
            ],
        ]);
    }
}
