<?php

namespace App\Http\Controllers;

use App\Models\Namirnica;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class OpenFoodFactsController extends Controller
{
    public function search(Request $request)
    {
        $q = trim((string) $request->query('q', ''));
        if (mb_strlen($q) < 2) return response()->json([]);

        // Search endpoint
        $res = Http::get('https://world.openfoodfacts.org/cgi/search.pl', [
            'search_terms' => $q,
            'search_simple' => 1,
            'action' => 'process',
            'json' => 1,
            'page_size' => 10,
        ]);

        if (!$res->ok()) {
            return response()->json(['message' => 'OpenFoodFacts error'], 502);
        }

        $data = $res->json();
        $products = $data['products'] ?? [];

        $mapped = array_map(function ($p) {
            return [
                'name' => $p['product_name'] ?? null,
                'brand' => $p['brands'] ?? null,
                'image' => $p['image_small_url'] ?? null,
                'nutriments' => $p['nutriments'] ?? [],
            ];
        }, $products);

        $mapped = array_values(array_filter($mapped, fn($x) => !empty($x['name'])));
        return response()->json($mapped);
    }

    public function import(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string'],
            // nutrimenti dolaze iz search rezultata (front prosledi)
            'kcal_100g' => ['nullable', 'numeric'],
            'p_100g' => ['nullable', 'numeric'],
            'carb_100g' => ['nullable', 'numeric'],
            'fat_100g' => ['nullable', 'numeric'],
        ]);

        // Upsert u tvoju tabelu
        $namirnica = Namirnica::updateOrCreate(
            ['naziv' => $validated['name']],
            [
                'kalorije_na_100g' => (int) round((float) ($validated['kcal_100g'] ?? 0)),
                'proteini_na_100g' => (float) ($validated['p_100g'] ?? 0),
                'ugljeni_hidrati_na_100g' => (float) ($validated['carb_100g'] ?? 0),
                'masti_na_100g' => (float) ($validated['fat_100g'] ?? 0),
            ]
        );

        return response()->json([
            'namirnica_id' => $namirnica->id,
            'namirnica' => $namirnica,
        ]);
    }
}
