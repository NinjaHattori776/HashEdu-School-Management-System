<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_class_id')->constrained()->cascadeOnDelete();
            $table->string('name'); // A, B, C
            $table->unsignedInteger('capacity')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('sections'); }
};
