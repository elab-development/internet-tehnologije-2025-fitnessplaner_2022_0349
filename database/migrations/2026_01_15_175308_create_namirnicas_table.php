<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('namirnice', function (Blueprint $table) {
            $table->id();

            $table->string('naziv')->unique();

            $table->unsignedSmallInteger('kalorije_na_100g');
            $table->decimal('proteini_na_100g', 6, 2)->default(0);
            $table->decimal('ugljeni_hidrati_na_100g', 6, 2)->default(0);
            $table->decimal('masti_na_100g', 6, 2)->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('namirnice');
    }
};
