<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\VezbaController;

use App\Http\Controllers\TreningController;
use App\Http\Controllers\HidratacijaController;
use App\Http\Controllers\DnevnikIshraneController; // <-- VAŽNO: koristi controller, ne model

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

    Route::get('/treninzi', [TreningController::class, 'index']);
    Route::get('/treninzi/{id}', [TreningController::class, 'show']);
    Route::post('/treninzi', [TreningController::class, 'store']);
    Route::put('/treninzi/{id}', [TreningController::class, 'update']);
    Route::delete('/treninzi/{id}', [TreningController::class, 'destroy']);

    Route::get('/hidratacije', [HidratacijaController::class, 'index']);
    Route::get('/hidratacije/{id}', [HidratacijaController::class, 'show']);
    Route::post('/hidratacije', [HidratacijaController::class, 'store']);
    Route::put('/hidratacije/{id}', [HidratacijaController::class, 'update']);
    Route::delete('/hidratacije/{id}', [HidratacijaController::class, 'destroy']);

    Route::get('/dnevnici_ishrane', [DnevnikIshraneController::class, 'index']);
    Route::get('/dnevnici_ishrane/{id}', [DnevnikIshraneController::class, 'show']);
    Route::post('/dnevnici_ishrane', [DnevnikIshraneController::class, 'store']);
    Route::put('/dnevnici_ishrane/{id}', [DnevnikIshraneController::class, 'update']);
    Route::delete('/dnevnici_ishrane/{id}', [DnevnikIshraneController::class, 'destroy']);

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
        Route::post('/admin/users', [AuthController::class, 'createUser']);
        Route::get('/admin/users', [AuthController::class, 'listUsers']);
        Route::put('/admin/users/{id}', [AuthController::class, 'updateUser']);
        Route::delete('/admin/users/{id}', [AuthController::class, 'deleteUser']);
    });
});
