<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('report_cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('academic_year_id')->constrained();
            $table->foreignId('exam_id')->nullable()->constrained()->nullOnDelete(); // null = full-year summary
            $table->decimal('overall_percentage', 5, 2)->nullable();
            $table->string('overall_grade')->nullable();
            $table->unsignedInteger('class_rank')->nullable();
            $table->string('file_path')->nullable(); // generated PDF
            $table->timestamp('generated_at')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('report_cards'); }
};
