<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ProveriUlogu
{
    public function handle(Request $request, Closure $next, ...$uloge): Response
    {
        $user = $request->user(); // korisnik iz tokena (sanctum)

        if (!$user) {
            return response()->json(['message' => 'Niste prijavljeni.'], 401);
        }

        if (!in_array($user->uloga, $uloge, true)) {
            return response()->json(['message' => 'Nemate pravo pristupa.'], 403);
        }

        return $next($request);
    }
}

