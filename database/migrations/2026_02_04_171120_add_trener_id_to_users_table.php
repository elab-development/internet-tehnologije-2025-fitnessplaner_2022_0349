<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
             // trener_id može biti null (za trenere i admina)
            $table->foreignId('trener_id')
                ->nullable()
                ->constrained('users') // FK na users.id
                ->nullOnDelete(); // ako se trener obriše, klijentov trener_id -> null
        
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
             $table->dropConstrainedForeignId('trener_id');
        });
    }
};
