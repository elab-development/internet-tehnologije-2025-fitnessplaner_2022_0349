<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('stavke_ishrane', function (Blueprint $table) {
            $table->id();

            $table->foreignId('dnevnik_ishrane_id')
                ->constrained('dnevnici_ishrane')
                ->cascadeOnDelete();

            $table->foreignId('namirnica_id')
                ->constrained('namirnice')
                ->restrictOnDelete();

            $table->decimal('kolicina_g', 8, 2);
            $table->string('obrok')->nullable(); // dorucak/rucak/vecera/uzina
            $table->time('vreme')->nullable();

            $table->timestamps();

            $table->index('dnevnik_ishrane_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stavke_ishrane');
    }
};
