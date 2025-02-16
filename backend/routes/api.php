<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\SaleController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::post('/contact', [ContactController::class, 'store']);
Route::get('/contact', [ContactController::class, 'index']);
Route::put('/contact/{id}', [ContactController::class, 'update']);
Route::get('/contact/{id}', [ContactController::class, 'show']);
Route::delete('/contact/{id}', [ContactController::class, 'destroy']);

Route::post('/activity', [ActivityController::class, 'store']);
Route::get('/activity/{id}/{type}', [ActivityController::class, 'getActivitiesByTypeAndContact']);

Route::post('/sales', [SaleController::class, 'store']);
Route::get('/sales', [SaleController::class, 'index']);
Route::put('/sales/{id}', [SaleController::class, 'update']);
Route::get('/data', [SaleController::class, 'getDashboardData']);
Route::delete('/sales/{id}', [SaleController::class, 'destroy']);
