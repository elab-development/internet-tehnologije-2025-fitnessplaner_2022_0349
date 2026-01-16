<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('vezbe', function (Blueprint $table) {
            $table->id();
            $table->string('naziv');
            $table->text('opis')->nullable();
            $table->string('misicna_grupa')->nullable();
            $table->string('oprema')->nullable();
            $table->string('video_url');
            $table->timestamps();

            $table->index('misicna_grupa');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vezbe');
    }
};

