<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\VezbaController;
use App\Http\Controllers\TreningController;
use App\Http\Controllers\HidratacijaController;
use App\Http\Controllers\DnevnikIshraneController;
use App\Http\Controllers\NamirnicaController;
use App\Http\Controllers\RasporedTreningaController;
use App\Http\Controllers\StavkaIshraneController;
use App\Http\Controllers\TrenerController;
use App\Http\Controllers\OpenFoodFactsController;
/*
|--------------------------------------------------------------------------
| API RUTE – AUTENTIFIKACIJA
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| API RUTE – ZA ULOGOVANE KORISNIKE
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // Osnovne auth rute
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Vezbe
    Route::get('/vezbe', [VezbaController::class, 'index']);
    Route::get('/vezbe/{id}', [VezbaController::class, 'show']);

    // Treninzi
    Route::get('/treninzi', [TreningController::class, 'index']);
    Route::get('/treninzi/{id}', [TreningController::class, 'show']);
    Route::post('/treninzi', [TreningController::class, 'store']);
    Route::put('/treninzi/{id}', [TreningController::class, 'update']);
    Route::delete('/treninzi/{id}', [TreningController::class, 'destroy']);

    // Hidratacija
    Route::get('/hidratacije', [HidratacijaController::class, 'index']);
    Route::get('/hidratacije/{id}', [HidratacijaController::class, 'show']);
    Route::post('/hidratacije', [HidratacijaController::class, 'store']);
    Route::put('/hidratacije/{id}', [HidratacijaController::class, 'update']);
    Route::delete('/hidratacije/{id}', [HidratacijaController::class, 'destroy']);

    // Namirnice
    Route::get('/namirnice', [NamirnicaController::class, 'index']);
    Route::get('/namirnice/{id}', [NamirnicaController::class, 'show']);
    Route::post('/namirnice', [NamirnicaController::class, 'store']);
    Route::put('/namirnice/{id}', [NamirnicaController::class, 'update']);
    Route::delete('/namirnice/{id}', [NamirnicaController::class, 'destroy']);

    // Rasporedi treninga
    Route::get('/rasporedi_treninga', [RasporedTreningaController::class, 'index']);
    Route::get('/rasporedi_treninga/{id}', [RasporedTreningaController::class, 'show']);
    Route::post('/rasporedi_treninga', [RasporedTreningaController::class, 'store']);
    Route::put('/rasporedi_treninga/{id}', [RasporedTreningaController::class, 'update']);
    Route::delete('/rasporedi_treninga/{id}', [RasporedTreningaController::class, 'destroy']);

        // Dnevnici ishrane
    Route::get('/dnevnici_ishrane', [DnevnikIshraneController::class, 'index']);
    Route::post('/dnevnici_ishrane', [DnevnikIshraneController::class, 'store']);

  
    Route::get('/dnevnici_ishrane-datum/{datum}', [DnevnikIshraneController::class, 'byDate']);
    Route::get('/dnevnici_ishrane/{datum}/grupisano', [DnevnikIshraneController::class, 'byDateGrouped']);

    Route::get('/dnevnici_ishrane/{id}', [DnevnikIshraneController::class, 'show'])->whereNumber('id');
    Route::put('/dnevnici_ishrane/{id}', [DnevnikIshraneController::class, 'update'])->whereNumber('id');
    Route::delete('/dnevnici_ishrane/{id}', [DnevnikIshraneController::class, 'destroy'])->whereNumber('id');

    Route::post('/dnevnik/ai-summary', [DnevnikIshraneController::class, 'getAiSummary']);

    // Stavke ishrane
    Route::post('/stavke_ishrane', [StavkaIshraneController::class, 'store']);
    Route::delete('/stavke_ishrane/{id}', [StavkaIshraneController::class, 'destroy'])->whereNumber('id');
    Route::get('/off/search', [OpenFoodFactsController::class, 'search']);
    Route::post('/off/import', [OpenFoodFactsController::class, 'import']);


    Route::middleware('uloga:trener')->group(function () {

        Route::post('/vezbe', [VezbaController::class, 'store']);
        Route::put('/vezbe/{id}', [VezbaController::class, 'update']);
        Route::delete('/vezbe/{id}', [VezbaController::class, 'destroy']);

      
    });

     Route::middleware('uloga:trener')->group(function () {
        Route::get('/trener/users', [TrenerController::class, 'index']);
    });

   

    Route::middleware('uloga:admin')->group(function () {
        Route::post('/admin/users', [AuthController::class, 'createUser']);
        Route::get('/admin/users', [AuthController::class, 'listUsers']);
        Route::put('/admin/users/{id}', [AuthController::class, 'updateUser']);
        Route::delete('/admin/users/{id}', [AuthController::class, 'deleteUser']);
    });

 });