<?php

namespace App\Http\Controllers;

use App\Models\DnevnikIshrane;
use App\Models\StavkaIshrane;
use Illuminate\Http\Request;

class StavkaIshraneController extends Controller
{
    public function store(Request $request)
    {
        // normalizuj obrok na mala slova
        $request->merge([
            'obrok' => strtolower((string) $request->input('obrok')),
        ]);

        $validated = $request->validate([
            'datum' => ['required', 'date'],
            'namirnica_id' => ['required', 'integer', 'exists:namirnice,id'],
            'kolicina_g' => ['required', 'numeric', 'min:1'],
            'obrok' => ['required', 'in:dorucak,rucak,vecera,uzina'],
            'vreme' => ['nullable', 'date_format:H:i:s'],
        ]);

        $dnevnik = DnevnikIshrane::firstOrCreate([
            'korisnik_id' => auth()->id(),
            'datum' => $validated['datum'],
        ]);

        $stavka = StavkaIshrane::create([
            'dnevnik_ishrane_id' => $dnevnik->id,
            'namirnica_id' => $validated['namirnica_id'],
            'kolicina_g' => $validated['kolicina_g'],
            'obrok' => $validated['obrok'],
            'vreme' => $validated['vreme'] ?? null,
        ]);

        return response()->json($stavka->load('namirnica'), 201);
    }

    public function destroy($id)
    {
        $stavka = StavkaIshrane::findOrFail($id);

        // proveri da stavka pripada ulogovanom korisniku
        $dnevnik = DnevnikIshrane::where('id', $stavka->dnevnik_ishrane_id)
            ->where('korisnik_id', auth()->id())
            ->firstOrFail();

        $stavka->delete();

        return response()->json(['message' => 'Stavka obrisana.'], 200);
    }
}
