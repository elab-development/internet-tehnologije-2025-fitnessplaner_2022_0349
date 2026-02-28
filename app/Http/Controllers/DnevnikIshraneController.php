<?php

namespace App\Http\Controllers;

use App\Models\DnevnikIshrane;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
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

    public function getAiSummary(Request $request)
    {
        $stavke = $request->input('stavke', []);
        $totali = $request->input('totali', []);

        if (empty($stavke)) {
            return response()->json(['summary' => 'Nema dovoljno podataka za analizu.']);
        }

        $mealText = "";
        foreach ($stavke as $s) {
            $naziv = $s['namirnica']['naziv'] ?? 'Hrana';
            $mealText .= "- {$s['obrok']}: {$naziv} ({$s['kolicina_g']}g)\n";
        }

        $kcal = $totali['kalorije'] ?? 0;
        $prot = $totali['proteini'] ?? 0;
        $uh = $totali['ugljeni_hidrati'] ?? 0;
        $masti = $totali['masti'] ?? 0;
        $totalsText = "Ukupno: $kcal kcal, $prot g proteina, $uh g UH, $masti g masti.";

        $systemPrompt = "Ti si licencirani sportski nutricionista i specijalista za metaboličku optimizaciju. " .
                "Tvoj ton je autoritativan, analitičan i profesionalan. Fokusiraš se na nutritivnu gustinu, " .
                "tajming obroka i uticaj na performans.";

        $userPrompt = "Izvrši stručnu evaluaciju dnevnog nutritivnog profila na osnovu sledećih podataka:\n\n" .
              "UNOS:\n$mealText\n$totalsText\n\n" .
              "ZAHTEV:\n" .
              "1. Analiziraj nutritivnu vrednost i balans makronutrijenata.\n" .
              "2. Navedi jednu ključnu prednost trenutnog unosa.\n" .
              "3. Pruži jednu do dve precizne, naučno utemeljene preporuke za optimizaciju (npr. glikemijska kontrola, sinteza proteina ili hidratacija).\n" .
              "ODGOVOR: Maksimalno 4 rečenice, isključivo na srpskom jeziku (latinica).";

        try {
            $response = Http::withToken(env('GROQ_API_KEY'))
                ->timeout(10) 
                ->post('https://api.groq.com/openai/v1/chat/completions', [
                    'model' => 'llama-3.3-70b-versatile',
                    'messages' => [
                        ['role' => 'system', 'content' => $systemPrompt],
                        ['role' => 'user', 'content' => $userPrompt]
                    ],
                    'temperature' => 0.5,
                ]);

            if ($response->successful()) {
                return response()->json(['summary' => $response->json('choices.0.message.content')]);
            }
            
            return response()->json(['summary' => 'AI trenutno nije dostupan.'], 500);

        } catch (\Exception $e) {
            return response()->json(['summary' => 'Greška pri povezivanju sa AI asistentom.'], 500);
        }
    }
}
