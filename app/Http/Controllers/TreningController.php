<?php

namespace App\Http\Controllers;

use App\Models\Trening;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TreningController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Trening::all();
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
      $validator= Validator::make($request->all(),[
        'korisnik_id'       => 'required|integer|exists:users,id',
        'naziv'             => 'required|string|max:255',
        'trajanje_minuta'   => 'required|integer',
        'tezina'            => 'required|string|max:255',
        'created_at'        => 'required|date',
        'updated_at'        => 'required|date',

      ]);

   if($validator->fails()){
    return response()->json([
   'message'=> 'Validacija nije prosla',
   'errors'=> $validator->errors(),
    ],422);
   }
   $data=$validator->validated();
   $trening=Trening::create($data);
   return response()->json($trening,201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Trening::find($id);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Trening $trening)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request,$id)
    {   
        $trening=Trening::find($id);

        if(!$trening){
            return response()->json(['message'=>'Trening nije pronadjen.'],404);
        }
        $validator= Validator::make($request->all(),[
        'korisnik_id'       => 'required|integer|exists:users,id',
        'naziv'             => 'required|string|max:255',
        'trajanje_minuta'   => 'required|integer',
        'tezina'            => 'required|string|max:255',
        'created_at'        => 'required|date',
        'updated_at'        => 'required|date',

      ]);

   if($validator->fails()){
    return response()->json([
   'message'=> 'Validacija nije prosla',
   'errors'=> $validator->errors(),
    ],422);
   }
   $data=$validator->validated();
   //$trening->update($data);
   return response()->json($trening,200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $trening=Trening::find($id);

        if(!$trening){
            return response()->json(['message'=>'Trening nije pronadjen.'],404);
        }
        $trening->delete;
        return response()->json(['message'=>'Trening je obrisan.'],200);


       

    }
}
