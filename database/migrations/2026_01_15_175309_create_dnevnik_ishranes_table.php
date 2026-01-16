<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('dnevnici_ishrane', function (Blueprint $table) {
            $table->id();

            $table->foreignId('korisnik_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->date('datum');

            $table->timestamps();

            // Jedan dnevnik po korisniku po datumu
            $table->unique(['korisnik_id', 'datum']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dnevnici_ishrane');
    }
};
