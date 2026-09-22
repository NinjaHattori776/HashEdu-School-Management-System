<?php
// Add these relationships + $fillable fields to your existing app/Models/User.php
// (do not overwrite the file — merge these into it)

/*
protected $fillable = [
    'name', 'email', 'password', 'role', 'phone', 'profile_photo', 'status',
];
*/

// public function studentProfile() { return $this->hasOne(\App\Models\Student::class); }
// public function children() { return $this->belongsToMany(\App\Models\Student::class, 'parent_student', 'parent_user_id', 'student_id'); }
// public function teachingAssignments() { return $this->hasMany(\App\Models\TeacherSubjectClass::class, 'teacher_user_id'); }

// Helper scopes/methods worth adding:
// public function isSuperAdmin(): bool { return $this->role === 'super_admin'; }
// public function isAdmin(): bool { return in_array($this->role, ['admin', 'super_admin']); }
// public function isTeacher(): bool { return $this->role === 'teacher'; }
// public function isStudent(): bool { return $this->role === 'student'; }
// public function isParent(): bool { return $this->role === 'parent'; }
