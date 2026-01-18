<?php

namespace App\Http\Controllers;

use App\Models\Vezba;
use Illuminate\Http\Request;

class VezbaController extends Controller
{
    public function index()
    {
        return response()->json(Vezba::all());
    }

    public function show($id)
    {
        $vezba = Vezba::find($id);

        if (!$vezba) {
            return response()->json(['message' => 'Vežba nije pronađena.'], 404);
        }

        return response()->json($vezba);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'naziv' => 'required|string|max:255',
            'opis' => 'nullable|string',
            'misicna_grupa' => 'nullable|string|max:255',
            'oprema' => 'nullable|string|max:255',
            'video_url' => 'nullable|string|max:2048',
        ]);

        $vezba = Vezba::create($data);

        return response()->json($vezba, 201);
    }

    public function update(Request $request, $id)
    {
        $vezba = Vezba::find($id);

        if (!$vezba) {
            return response()->json(['message' => 'Vežba nije pronađena.'], 404);
        }

        $data = $request->validate([
            'naziv' => 'sometimes|required|string|max:255',
            'opis' => 'nullable|string',
            'misicna_grupa' => 'nullable|string|max:255',
            'oprema' => 'nullable|string|max:255',
            'video_url' => 'nullable|string|max:2048',
        ]);

        $vezba->update($data);

        return response()->json($vezba);
    }

    public function destroy($id)
    {
        $vezba = Vezba::find($id);

        if (!$vezba) {
            return response()->json(['message' => 'Vežba nije pronađena.'], 404);
        }

        $vezba->delete();

        return response()->json(['message' => 'Vežba je obrisana.']);
    }
}
