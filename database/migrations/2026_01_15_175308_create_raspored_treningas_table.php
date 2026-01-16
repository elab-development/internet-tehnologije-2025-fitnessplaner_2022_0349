<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('rasporedi_treninga', function (Blueprint $table) {
            $table->id();

            $table->foreignId('korisnik_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('trening_id')
                ->constrained('treninzi')
                ->cascadeOnDelete();

            $table->date('datum');
            $table->string('status')->default('planirano'); // planirano|odradjeno|preskoceno

            $table->timestamps();

            // Jedan trening po korisniku po datumu (ako želiš više treninga istog dana, menjamo ovo)
            $table->unique(['korisnik_id', 'datum']);

            $table->index(['korisnik_id', 'datum']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rasporedi_treninga');
    }
};
