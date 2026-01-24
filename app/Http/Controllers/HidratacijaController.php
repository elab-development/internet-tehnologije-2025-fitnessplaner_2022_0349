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
        return Hidratacija::all();
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
            'datum'         => 'required|date',
            'cilj_ml'       => 'required|integer',
            'uneseno_ml'    => 'required|integer',
           
      ]);

        if($validator->fails()){
            return response()->json([
        'message'=> 'Validacija nije prosla',
        'errors'=> $validator->errors(),
            ],422);
        }
        $data=$validator->validated();
        $hidratacija=Hidratacija::create($data);
        return response()->json($hidratacija,201);
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
    public function update(Request $request,$id)
    {   
        $hidratacija=Hidratacija::find($id);

        if(!$hidratacija){
            return response()->json(['message'=>'Hidratacija nije pronadjena.'],404);
        }
        $validator= Validator::make($request->all(),[
            'datum'         => 'required|date',
            'cilj_ml'       => 'required|integer',
            'uneseno_ml'    => 'required|integer',
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
   $hidratacija->update($data);
   return response()->json($hidratacija,200);
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
