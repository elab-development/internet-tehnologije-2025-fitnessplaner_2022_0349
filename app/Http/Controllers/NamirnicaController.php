<?php

namespace App\Http\Controllers;

use App\Models\Namirnica;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NamirnicaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
                return Namirnica::all();

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
        $validator = Validator::make($request->all(), [
    'naziv'                     => 'required|string|max:255',
    'kalorije_na_100g'          => 'required|integer',
    'proteini_na_100g'          => 'required|numeric',
    'ugljeni_hidrati_na_100g'   => 'required|numeric',
    'masti_na_100g'             => 'required|numeric',
]);
        
       if($validator->fails()){
            return response()->json([
        'message'=> 'Validacija nije prosla',
        'errors'=> $validator->errors(),
            ],422);
        }
        $data=$validator->validated();
        $namirnica=Namirnica::create($data);
        return response()->json($namirnica,201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Namirnica::find($id);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Namirnica $namirnica)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request,$id)
    {
        $namirnica=Namirnica::find($id);

        if(!$namirnica){
            return response()->json(['message'=>'Namirnica nije pronadjena.'],404);
        }
        $validator = Validator::make($request->all(), [
    'naziv'                     => 'required|string|max:255',
    'kalorije_na_100g'          => 'required|integer',
    'proteini_na_100g'          => 'required|numeric',
    'ugljeni_hidrati_na_100g'   => 'required|numeric',
    'masti_na_100g'             => 'required|numeric',
]);

   if($validator->fails()){
    return response()->json([
   'message'=> 'Validacija nije prosla',
   'errors'=> $validator->errors(),
    ],422);
   }
   $data=$validator->validated();
   //$namirnica->update($data);
   return response()->json($namirnica,200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $namirnica=Namirnica::find($id);

        if(!$namirnica){
            return response()->json(['message'=>'Namirnica nije pronadjena.'],404);
        }
        $namirnica->delete;
        return response()->json(['message'=>'Namirnica je obrisana.'],200);
    }
}
