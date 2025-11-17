<?php

use Illuminate\Support\Facades\Route;

Route::view('/', 'app');

Route::view('/{view?}', 'app')
    ->where('view', '^(?!api).*$');
