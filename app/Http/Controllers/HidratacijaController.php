<?php

namespace App\Http\Controllers;

use App\Models\Hidratacija;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class HidratacijaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
   public function index()
{
    return Hidratacija::where('korisnik_id', auth()->id())
        ->orderBy('datum', 'desc')
        ->get();
}

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
  public function store(Request $request)
{
    $request->validate([
        'datum' => 'required|date',
        'cilj_ml' => 'required|integer|min:1',
        'uneseno_ml' => 'required|integer|min:0',
    ]);

    $korisnik_id = auth()->id();

    $exists = Hidratacija::where('korisnik_id', $korisnik_id)
        ->where('datum', $request->datum)
        ->exists();

    if ($exists) {
        return response()->json([
            'message' => 'Unos za danas već postoji.'
        ], 409);
    }

    $hidratacija = Hidratacija::create([
        'korisnik_id' => $korisnik_id,
        'datum' => $request->datum,
        'cilj_ml' => $request->cilj_ml,
        'uneseno_ml' => $request->uneseno_ml,
    ]);

    return response()->json($hidratacija, 201);
}

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
         return Hidratacija::find($id);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Hidratacija $hidratacija)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
{
    $hidratacija = Hidratacija::where('id', $id)
        ->where('korisnik_id', auth()->id())
        ->first();

    if (!$hidratacija) {
        return response()->json(['message' => 'Nije pronađeno'], 404);
    }

    $validated = $request->validate([
        'datum' => 'required|date',
        'cilj_ml' => 'required|integer|min:1',
        'uneseno_ml' => 'required|integer|min:0',
    ]);

    $hidratacija->update($validated);

    return response()->json($hidratacija, 200);
}


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $hidratacija=Hidratacija::find($id);

        if(!$hidratacija){
            return response()->json(['message'=>'Hidratacija nije pronadjena.'],404);
        }
        $hidratacija->delete();
        return response()->json(['message'=>'Hidratacija je obrisana.'],200);
    }
}
