<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Menja ograničenje: uloga sme samo ove vrednosti + default
            $table->enum('uloga', ['klijent', 'trener', 'admin'])
                  ->default('klijent')
                  ->change();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Vraćanje (primer): string bez enum ograničenja
            $table->string('uloga')->default('klijent')->change();
        });
    }
};

