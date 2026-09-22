<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('exam_subjects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained();
            $table->unsignedInteger('max_marks')->default(100);
            $table->unsignedInteger('pass_marks')->default(35);
            $table->date('exam_date')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('exam_subjects'); }
};
