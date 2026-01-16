<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('treninzi', function (Blueprint $table) {
            $table->id();

            $table->foreignId('korisnik_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('naziv');
            $table->unsignedSmallInteger('trajanje_minuta')->nullable();
            $table->string('tezina')->nullable(); // lako/srednje/tesko

            $table->timestamps();

            $table->index('korisnik_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('treninzi');
    }
};
