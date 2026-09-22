<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('timetables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_class_id')->constrained();
            $table->foreignId('section_id')->constrained();
            $table->foreignId('subject_id')->constrained();
            $table->foreignId('teacher_user_id')->constrained('users');
            $table->foreignId('academic_year_id')->constrained();
            $table->enum('day_of_week', ['mon', 'tue', 'wed', 'thu', 'fri', 'sat']);
            $table->time('start_time');
            $table->time('end_time');
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('timetables'); }
};
