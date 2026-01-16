<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vezba;
use Illuminate\Http\Request;

class VezbaController extends Controller
{
    // GET /api/vezbe
    public function index()
    {
        return response()->json(Vezba::all());
    }

    // GET /api/vezbe/{id}
    public function show($id)
    {
        $vezba = Vezba::find($id);

        if (!$vezba) {
            return response()->json(['message' => 'Vežba nije pronađena.'], 404);
        }

        return response()->json($vezba);
    }

    // POST /api/vezbe
    public function store(Request $request)
    {
        // Validacija ulaza (Laravel automatski vrati 422 JSON ako nije validno)
        $data = $request->validate([
            'naziv' => 'required|string|max:255',
            'opis' => 'nullable|string',
            'misicna_grupa' => 'nullable|string|max:255',
            'oprema' => 'nullable|string|max:255',
            'video_url' => 'required|string|max:2048',
        ]);

        $vezba = Vezba::create($data);

        return response()->json($vezba, 201);
    }

    // PUT /api/vezbe/{id}
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
            'video_url' => 'sometimes|required|string|max:2048',
        ]);

        $vezba->update($data);

        return response()->json($vezba);
    }

    // DELETE /api/vezbe/{id}
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
