<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('fee_structures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_class_id')->constrained();
            $table->foreignId('academic_year_id')->constrained();
            $table->foreignId('fee_category_id')->constrained();
            $table->decimal('amount', 10, 2);
            $table->enum('frequency', ['monthly', 'quarterly', 'annual', 'one_time'])->default('monthly');
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('fee_structures'); }
};
