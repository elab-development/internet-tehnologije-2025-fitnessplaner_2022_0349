<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('hidratacije', function (Blueprint $table) {
            $table->id();

            $table->foreignId('korisnik_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->date('datum');
            $table->unsignedSmallInteger('cilj_ml')->default(2000);
            $table->unsignedSmallInteger('uneseno_ml')->default(0);

            $table->timestamps();

            // Jedan zapis po korisniku po datumu
            $table->unique(['korisnik_id', 'datum']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hidratacije');
    }
};
