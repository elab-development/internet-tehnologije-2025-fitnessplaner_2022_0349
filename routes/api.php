<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\VezbaController;

/*
|--------------------------------------------------------------------------
| API RUTE – AUTENTIFIKACIJA
|--------------------------------------------------------------------------
| Javni endpointi – dostupni bez logovanja
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| API RUTE – ZA ULOGOVANE KORISNIKE
|--------------------------------------------------------------------------
| Sve rute ispod zahtevaju validan Sanctum token
*/
Route::middleware('auth:sanctum')->group(function () {

    // osnovne auth rute
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    /*
    |--------------------------------------------------------------------------
    | RUTE DOSTUPNE SVIM ULOGOVANIM KORISNICIMA
    |--------------------------------------------------------------------------
    | klijent, trener i admin
    */
    Route::get('/vezbe', [VezbaController::class, 'index']);
    Route::get('/vezbe/{id}', [VezbaController::class, 'show']);

    /*
    |--------------------------------------------------------------------------
    | RUTE ZA TRENERA I ADMINA
    |--------------------------------------------------------------------------
    | samo trener i admin mogu da dodaju, menjaju i brišu vežbe
    */
    Route::middleware('uloga:trener,admin')->group(function () {
        Route::post('/vezbe', [VezbaController::class, 'store']);
        Route::put('/vezbe/{id}', [VezbaController::class, 'update']);
        Route::delete('/vezbe/{id}', [VezbaController::class, 'destroy']);
    });

    /*
    |--------------------------------------------------------------------------
    | ADMIN RUTE
    |--------------------------------------------------------------------------
    | samo admin ima pristup upravljanju korisnicima
    */
    Route::middleware('uloga:admin')->group(function () {

        // kreiranje novih korisnika (trener / admin)
        Route::post('/admin/users', [AuthController::class, 'createUser']);

        // lista korisnika (uz opcioni filter po ulozi)
        Route::get('/admin/users', [AuthController::class, 'listUsers']);

        // izmena korisnika (trener ili sam admin)
        Route::put('/admin/users/{id}', [AuthController::class, 'updateUser']);

        // brisanje korisnika (trener ili sam admin)
        Route::delete('/admin/users/{id}', [AuthController::class, 'deleteUser']);
    });
});
