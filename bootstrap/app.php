<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
    // 1) CORS (da React može da zove Laravel)
    $middleware->append(\Illuminate\Http\Middleware\HandleCors::class);

    // 2) Alias za  middleware-e (uloge)
    $middleware->alias([
        'uloga' => \App\Http\Middleware\ProveriUlogu::class,
    ]);
})
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
