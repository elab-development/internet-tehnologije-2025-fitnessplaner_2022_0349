<?php

namespace App\Http\Controllers;

use App\Models\RasporedTreninga;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RasporedTreningaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return RasporedTreninga::all();
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
  'korisnik_id' => 'sometimes|integer|exists:users,id',
    'datum'       => 'sometimes|date',
]);

if($validator->fails()){
    return response()->json([
   'message'=> 'Validacija nije prosla',
   'errors'=> $validator->errors(),
    ],422);
   }
        $data=$validator->validated();
        $rasporedTreninga=RasporedTreninga::create($data);
        return response()->json($rasporedTreninga,201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return RasporedTreninga::find($id);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(RasporedTreninga $rasporedTreninga)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request,$id)
    {
         $rasporedTreninga=RasporedTreninga::find($id);

        if(!$rasporedTreninga){
            return response()->json(['message'=>'Raspored treninga nije pronadjen.'],404);
        }
       $validator = Validator::make($request->all(), [
    'korisnik_id'  => 'required|integer|exists:users,id',
    'trening_id'   => 'required|integer|exists:treninzi,id', // promeni ime tabele ako je drugačije
    'datum'        => 'required|date',
    'status'       => 'required|string|max:255',
    'created_at'   => 'sometimes|date',
    'updated_at'   => 'sometimes|date',
]);

if($validator->fails()){
    return response()->json([
   'message'=> 'Validacija nije prosla',
   'errors'=> $validator->errors(),
    ],422);
   }
   $data=$validator->validated();
   //$rasporedTreninga->update($data);
   return response()->json($rasporedTreninga,200);
    }
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $rasporedTreninga=RasporedTreninga::find($id);

        if(!$rasporedTreninga){
            return response()->json(['message'=>'Raspored treninga nije pronadjen.'],404);
        }
        $rasporedTreninga->delete;
        return response()->json(['message'=>'Raspored treninga je obrisana.'],200);
    }
}
