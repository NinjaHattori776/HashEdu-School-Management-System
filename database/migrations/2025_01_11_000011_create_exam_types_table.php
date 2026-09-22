<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('exam_types', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Unit Test, Midterm, Final
            $table->decimal('weight_percent', 5, 2)->default(0); // used for report card weighting
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('exam_types'); }
};
