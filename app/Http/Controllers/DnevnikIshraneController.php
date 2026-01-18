<?php

namespace App\Http\Controllers;

use App\Models\DnevnikIshrane;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DnevnikIShraneController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return DnevnikIshrane::all();
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
    'korisnik_id' => 'required|integer|exists:users,id',
    'datum'       => 'required|date',
    'created_at'   => 'required|date',
    'updated_at'   => 'required|date',

  
]);

if($validator->fails()){
    return response()->json([
   'message'=> 'Validacija nije prosla',
   'errors'=> $validator->errors(),
    ],422);
   }
        $data=$validator->validated();
        $dnevnikIshrane=DnevnikIshrane::create($data);
        return response()->json($dnevnikIshrane,201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return DnevnikIshrane::find($id);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DnevnikIshrane $dnevnikIshrane)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request,$id)
    {
        $dnevnikIshrane=DnevnikIshrane::find($id);

        if(!$dnevnikIshrane){
            return response()->json(['message'=>'Dnevnik ishrane nije pronadjen.'],404);
        }
       $validator = Validator::make($request->all(), [
    'korisnik_id' => 'required|integer|exists:users,id',
    'datum'       => 'required|date',
    'created_at'   => 'required|date',
    'updated_at'   => 'required|date',
]);

if($validator->fails()){
    return response()->json([
   'message'=> 'Validacija nije prosla',
   'errors'=> $validator->errors(),
    ],422);
   }
   $data=$validator->validated();
   //$dnevnikIshrane->update($data);
   return response()->json($dnevnikIshrane,200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
         $dnevnikIshrane=DnevnikIshrane::find($id);

        if(!$dnevnikIshrane){
            return response()->json(['message'=>'Dnevnik ishrane nije pronadjen.'],404);
        }
        $dnevnikIshrane->delete;
        return response()->json(['message'=>'Dnevnik ishrane je obrisan.'],200);
    }
}
