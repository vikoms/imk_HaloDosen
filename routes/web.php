<?php

use Illuminate\Support\Facades\Route;

// Handle all routes except API routes
Route::view('/{path?}', 'react')
    ->where('path', '^(?!api|sanctum|up).*$');
