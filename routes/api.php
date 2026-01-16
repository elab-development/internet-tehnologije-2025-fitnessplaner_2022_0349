<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\VezbaController;

Route::get('/vezbe', [VezbaController::class, 'index']);
Route::get('/vezbe/{id}', [VezbaController::class, 'show']);

Route::post('/vezbe', [VezbaController::class, 'store']);
Route::put('/vezbe/{id}', [VezbaController::class, 'update']);
Route::delete('/vezbe/{id}', [VezbaController::class, 'destroy']);
