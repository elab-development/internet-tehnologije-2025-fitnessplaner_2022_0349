<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\VezbaController;
use App\Http\Controllers\HidratacijaController;
use App\Http\Controllers\TreningController;
use App\Models\DnevnikIshrane;

// 🔐 Javni endpointi (bez logovanja)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// 🧍‍♂️ Sve rute ispod su za prijavljene korisnike (auth:sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // svi prijavljeni mogu gledati
    Route::get('/vezbe', [VezbaController::class, 'index']);
    Route::get('/vezbe/{id}', [VezbaController::class, 'show']);

    // trener i admin mogu dodavati / menjati / brisati
    Route::middleware('uloga:trener,admin')->group(function () {
        Route::post('/vezbe', [VezbaController::class, 'store']);
        Route::put('/vezbe/{id}', [VezbaController::class, 'update']);
        Route::delete('/vezbe/{id}', [VezbaController::class, 'destroy']);
    });
});
Route::get('/treninzi/{id}',[TreningController::class, 'show']);
Route::get('/treninzi',[TreningController::class, 'index']);
Route::post('/treninzi',[TreningController::class, 'store']);
Route::delete('/treninzi/{id}',[TreningController::class, 'destroy']);
Route::put('/treninzi/{id}',[TreningController::class, 'update']);

Route::get('/hidratacije/{id}',[HidratacijaController::class, 'show']);
Route::get('/hidratacije',[HidratacijaController::class, 'index']);
Route::post('/hidratacije',[HidratacijaController::class, 'store']);
Route::delete('/hidratacije/{id}',[HidratacijaController::class, 'destroy']);
Route::put('/hidratacije/{id}',[HidratacijaController::class, 'update']);

Route::get('/dnevnici_ishrane/{id}',[DnevnikIshrane::class, 'show']);
Route::get('/dnevnici_ishrane',[DnevnikIshrane::class, 'index']);
Route::post('/dnevnici_ishrane',[DnevnikIshrane::class, 'store']);
Route::delete('/dnevnici_ishrane/{id}',[DnevnikIshrane::class, 'destroy']);
Route::put('/dnevnici_ishrane/{id}',[DnevnikIshrane::class, 'update']);


