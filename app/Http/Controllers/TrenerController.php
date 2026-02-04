<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class TrenerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
         $trener = $request->user();

        if ($trener->uloga !== 'trener') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $klijenti = User::query()
            ->where('uloga', 'klijent')
            ->where('trener_id', $trener->id)
            ->select('id', 'ime_i_prezime', 'email', 'trener_id', 'created_at')
            ->orderBy('ime_i_prezime')
            ->get();

        return response()->json($klijenti);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return response()->json(['message' => 'Not supported'], 405);
    }

    /**
     * Store a newly created resource in storage.
     */
   public function store(Request $request)
    {
        $trener = $request->user();

        if ($trener->uloga !== 'trener') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Ovde pretpostavljam da trener “preuzima” klijenta po ID-u
        $data = $request->validate([
            'klijent_id' => ['required', 'integer', 'exists:users,id'],
        ]);

        $klijent = User::findOrFail($data['klijent_id']);

        if ($klijent->uloga !== 'klijent') {
            return response()->json(['message' => 'User is not a client'], 422);
        }

        // Opcija: zabrani preuzimanje ako klijent već ima trenera
        if ($klijent->trener_id !== null && $klijent->trener_id !== $trener->id) {
            return response()->json(['message' => 'Client already assigned to another trainer'], 409);
        }

        $klijent->trener_id = $trener->id;
        $klijent->save();

        return response()->json([
            'message' => 'Client assigned',
            'client' => $klijent->only(['id', 'name', 'email', 'trener_id']),
        ]);
    }

    /**
     * Display the specified resource.
     */
     public function show(Request $request, User $user)
    {
        $trener = $request->user();

        if ($trener->uloga !== 'trener') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Trener sme da vidi samo svog klijenta
        if ($user->uloga !== 'klijent' || $user->trener_id !== $trener->id) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json($user->only(['id', 'ime_i_prezime', 'email', 'trener_id', 'created_at']));
    }
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $trener = $request->user();

        if ($trener->uloga !== 'trener') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Trener sme da menja samo svog klijenta
        if ($user->uloga !== 'klijent' || $user->trener_id !== $trener->id) {
            return response()->json(['message' => 'Not found'], 404);
        }

        // Dozvoli samo bezbedna polja (ne da menja ulogu, email, password itd. bez potrebe)
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
        ]);

        $user->fill($data);
        $user->save();

        return response()->json([
            'message' => 'Updated',
            'client' => $user->only(['id', 'ime_i_prezime', 'email', 'trener_id']),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
  public function destroy(Request $request, User $user)
    {
        // U većini fitness app scenarija trener ne briše korisnike.
        return response()->json(['message' => 'Not supported'], 405);
    }
}
