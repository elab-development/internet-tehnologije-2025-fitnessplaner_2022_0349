<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('izvodjenja_vezbi', function (Blueprint $table) {
            $table->id();

            $table->foreignId('trening_id')
                ->constrained('treninzi')
                ->cascadeOnDelete();

            $table->foreignId('vezba_id')
                ->constrained('vezbe')
                ->restrictOnDelete();

            $table->unsignedSmallInteger('redosled')->default(1);
            $table->unsignedSmallInteger('serije')->nullable();
            $table->unsignedSmallInteger('ponavljanja')->nullable();
            $table->unsignedSmallInteger('pauza_sekundi')->nullable();
            $table->string('napomena')->nullable();

            $table->timestamps();

            // Da ne dupliraš istu vežbu u istom treningu (ako želiš dupliranje, ukloni ovaj red)
            $table->unique(['trening_id', 'vezba_id']);

            $table->index(['trening_id', 'redosled']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('izvodjenja_vezbi');
    }
};
