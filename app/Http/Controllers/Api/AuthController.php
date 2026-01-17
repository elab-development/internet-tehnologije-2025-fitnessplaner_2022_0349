<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
 use Illuminate\Validation\Rule;
class AuthController extends Controller
{
    // POST /api/register
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'uloga' => 'klijent', // default
        ]);

        $token = $user->createToken('react-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'ime' => $user->name,
                'email' => $user->email,
                'uloga' => $user->uloga,
            ]
        ], 201);
    }

    // POST /api/login
    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Pogrešan email ili lozinka.'], 401);
        }

        // opcionalno: obriši stare tokene
        $user->tokens()->delete();

        $token = $user->createToken('react-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'uloga' => $user->uloga,
            ]
        ]);
    }

    // GET /api/me
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    // POST /api/logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Odjavljeni ste.']);
    }
   // ADMIN: lista korisnika (filtriranje po ulozi)
public function listUsers(Request $request)
{
    $query = User::query()
        ->select('id', 'name', 'email', 'uloga', 'created_at');

    // npr. ?uloga=trener ili ?uloga=admin
    if ($request->has('uloga')) {
        $query->where('uloga', $request->query('uloga'));
    }

    return response()->json(
        $query->orderBy('created_at', 'desc')->get()
    );
}
public function updateUser(Request $request, $id)
{
    $actor = $request->user(); // admin koji radi akciju
    $user = User::findOrFail($id);

    // Admin sme menjati:
    // - trenere (uvek)
    // - sebe (uvek)
    // Ne sme menjati druge admine
    if ($user->uloga === 'admin' && $user->id !== $actor->id) {
        return response()->json(['message' => 'Ne možete menjati druge admine.'], 403);
    }

    $data = $request->validate([
        'name' => 'sometimes|required|string|max:255',
        'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
        'password' => 'sometimes|nullable|string|min:6',
        'uloga' => ['sometimes', Rule::in(['klijent', 'trener', 'admin'])],
    ]);

    // uloga: ne dozvoli promenu uloge drugog admina (već gore blokirano),
    // ali dodatno: ne dozvoli da klijenta pretvoriš u admin kroz update (opciono)
    if (isset($data['uloga'])) {
        // dozvoli samo sebi da bude admin, a trenere da ostanu trener (najčistije)
        if ($user->uloga === 'admin' && $user->id === $actor->id) {
            // sebi ne moraš menjati ulogu, ignoriši
            unset($data['uloga']);
        } else {
            // za sve ostale dozvoli samo trener/klijent, ali u praksi ti ovde radiš trenere
            if ($data['uloga'] === 'admin') {
                return response()->json(['message' => 'Ne možete dodeliti admin ulogu kroz izmenu.'], 403);
            }
        }
    }

    if (array_key_exists('password', $data)) {
        if ($data['password']) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }
    }

    $user->update($data);

    return response()->json([
        'message' => 'Izmena uspešna.',
        'user' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'uloga' => $user->uloga,
            'created_at' => $user->created_at,
        ],
    ]);
}

public function deleteUser(Request $request, $id)
{
    $actor = $request->user();
    $user = User::findOrFail($id);

    // Ne briši druge admine
    if ($user->uloga === 'admin' && $user->id !== $actor->id) {
        return response()->json(['message' => 'Ne možete brisati druge admine.'], 403);
    }

    // (opciono) Ne dozvoli da admin obriše sam sebe ako to ne želiš
    // Ako želiš da NE može ni sebe:
    // if ($user->id === $actor->id) return response()->json(['message'=>'Ne možete obrisati sebe.'], 403);

    $user->delete();

    return response()->json(['message' => 'Brisanje uspešno.']);
}
// ADMIN: kreiranje korisnika (trener ili admin)
public function createUser(Request $request)
{
    $data = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255|unique:users,email',
        'password' => 'required|string|min:6',
        'uloga' => ['required', Rule::in(['trener', 'admin'])], // admin sme da pravi samo trenera ili admina
    ]);

    $user = User::create([
        'name' => $data['name'],
        'email' => $data['email'],
        'password' => Hash::make($data['password']),
        'uloga' => $data['uloga'],
    ]);

    return response()->json([
        'message' => 'Korisnik uspešno kreiran.',
        'user' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'uloga' => $user->uloga,
        ],
    ], 201);
}



}

