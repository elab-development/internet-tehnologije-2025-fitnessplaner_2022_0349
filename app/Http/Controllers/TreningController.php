<?php

namespace App\Http\Controllers;

use App\Models\Trening;
use App\Models\Vezba;
use App\Models\IzvodjenjeVezbe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TreningController extends Controller
{
    // GET /api/treninzi
    public function index(Request $request)
    {
        $user = $request->user();

        // Klijent vidi samo svoje treninge.
        // Ako želiš da admin/trener vide sve, proširi uslov.
        $query = Trening::query()
            ->where('korisnik_id', $user->id)
            ->orderByDesc('created_at');

        return response()->json(
            $query->get()
        );
    }

    // GET /api/treninzi/{id}
    public function show(Request $request, $id)
    {
        $user = $request->user();

        $trening = Trening::with(['izvodjenja.vezba'])
            ->find($id);

        if (!$trening) {
            return response()->json(['message' => 'Trening nije pronađen.'], 404);
        }

        if ($trening->korisnik_id !== $user->id) {
            return response()->json(['message' => 'Nemate pravo pristupa.'], 403);
        }

        return response()->json($trening);
    }

    // POST /api/treninzi
    // payload:
    // {
    //   naziv: "Noge A",
    //   trajanje_minuta: 60,
    //   tezina: "srednje",
    //   vezbe: [1,5,9]
    // }
    public function store(Request $request)
    {
        $user = $request->user();

    $data = $request->validate([
        'naziv' => ['required', 'string', 'max:100'],
        'trajanje_minuta' => ['nullable', 'integer', 'min:1', 'max:600'],
        'tezina' => ['nullable', 'string', 'max:50'],

        'izvodjenja' => ['required', 'array', 'min:1'],
        'izvodjenja.*.vezba_id' => ['required', 'integer', 'exists:vezbe,id'],
        'izvodjenja.*.redosled' => ['required', 'integer', 'min:1', 'max:500'],
        'izvodjenja.*.serije' => ['nullable', 'integer', 'min:1', 'max:50'],
        'izvodjenja.*.ponavljanja' => ['nullable', 'integer', 'min:1', 'max:200'],
        'izvodjenja.*.pauza_sekundi' => ['nullable', 'integer', 'min:0', 'max:3600'],
        'izvodjenja.*.napomena' => ['nullable', 'string', 'max:255'],
    ]);

    return DB::transaction(function () use ($user, $data) {
        $trening = Trening::create([
            'korisnik_id' => $user->id,
            'naziv' => $data['naziv'],
            'trajanje_minuta' => $data['trajanje_minuta'] ?? null,
            'tezina' => $data['tezina'] ?? null,
        ]);

        foreach ($data['izvodjenja'] as $item) {
            IzvodjenjeVezbe::create([
                'trening_id' => $trening->id,
                'vezba_id' => $item['vezba_id'],
                'redosled' => $item['redosled'],
                'serije' => $item['serije'] ?? null,
                'ponavljanja' => $item['ponavljanja'] ?? null,
                'pauza_sekundi' => $item['pauza_sekundi'] ?? null,
                'napomena' => $item['napomena'] ?? null,
            ]);
        }

        $trening->load(['izvodjenja.vezba']);

        return response()->json($trening, 201);
    
        });
    }

    // PUT /api/treninzi/{id}
    // payload može biti:
    // {
    //   naziv: "...",
    //   trajanje_minuta: ...,
    //   tezina: ...,
    //   vezbe: [..]   // kompletna nova lista vežbi
    // }
    public function update(Request $request, $id)
    {
           $user = $request->user();

    $trening = Trening::find($id);
    if (!$trening) {
        return response()->json(['message' => 'Trening nije pronađen.'], 404);
    }

    if ($trening->korisnik_id !== $user->id) {
        return response()->json(['message' => 'Nemate pravo pristupa.'], 403);
    }

    $data = $request->validate([
        'naziv' => ['sometimes', 'required', 'string', 'max:100'],
        'trajanje_minuta' => ['nullable', 'integer', 'min:1', 'max:600'],
        'tezina' => ['nullable', 'string', 'max:50'],

        'izvodjenja' => ['sometimes', 'array', 'min:1'],
        'izvodjenja.*.vezba_id' => ['required', 'integer', 'exists:vezbe,id'],
        'izvodjenja.*.redosled' => ['required', 'integer', 'min:1', 'max:500'],
        'izvodjenja.*.serije' => ['nullable', 'integer', 'min:1', 'max:50'],
        'izvodjenja.*.ponavljanja' => ['nullable', 'integer', 'min:1', 'max:200'],
        'izvodjenja.*.pauza_sekundi' => ['nullable', 'integer', 'min:0', 'max:3600'],
        'izvodjenja.*.napomena' => ['nullable', 'string', 'max:255'],
    ]);

    return DB::transaction(function () use ($trening, $data) {
        $trening->update([
            'naziv' => $data['naziv'] ?? $trening->naziv,
            'trajanje_minuta' => array_key_exists('trajanje_minuta', $data) ? $data['trajanje_minuta'] : $trening->trajanje_minuta,
            'tezina' => array_key_exists('tezina', $data) ? $data['tezina'] : $trening->tezina,
        ]);

        if (array_key_exists('izvodjenja', $data)) {
            IzvodjenjeVezbe::where('trening_id', $trening->id)->delete();

            foreach ($data['izvodjenja'] as $item) {
                IzvodjenjeVezbe::create([
                    'trening_id' => $trening->id,
                    'vezba_id' => $item['vezba_id'],
                    'redosled' => $item['redosled'],
                    'serije' => $item['serije'] ?? null,
                    'ponavljanja' => $item['ponavljanja'] ?? null,
                    'pauza_sekundi' => $item['pauza_sekundi'] ?? null,
                    'napomena' => $item['napomena'] ?? null,
                ]);
            }
        }

        $trening->load(['izvodjenja.vezba']);

        return response()->json($trening);
    });
    }

    // DELETE /api/treninzi/{id}
    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        $trening = Trening::find($id);
        if (!$trening) {
            return response()->json(['message' => 'Trening nije pronađen.'], 404);
        }

        if ($trening->korisnik_id !== $user->id) {
            return response()->json(['message' => 'Nemate pravo pristupa.'], 403);
        }

        $trening->delete(); // cascade briše izvodjenja

        return response()->json(['message' => 'Trening obrisan.']);
    }

    // DELETE /api/treninzi/{treningId}/izvodjenja/{izvodjenjeId}
    // uklanjanje vežbe iz treninga
    public function destroyIzvodjenje(Request $request, $treningId, $izvodjenjeId)
    {
        $user = $request->user();

        $trening = Trening::find($treningId);
        if (!$trening) {
            return response()->json(['message' => 'Trening nije pronađen.'], 404);
        }

        if ($trening->korisnik_id !== $user->id) {
            return response()->json(['message' => 'Nemate pravo pristupa.'], 403);
        }

        $izv = IzvodjenjeVezbe::where('id', $izvodjenjeId)
            ->where('trening_id', $trening->id)
            ->first();

        if (!$izv) {
            return response()->json(['message' => 'Stavka treninga nije pronađena.'], 404);
        }

        $izv->delete();

        return response()->json(['message' => 'Vežba uklonjena iz treninga.']);
    }
}
