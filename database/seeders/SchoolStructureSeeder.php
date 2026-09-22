<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\SchoolClass;
use App\Models\Section;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SchoolStructureSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Current academic year
        $year = AcademicYear::firstOrCreate(
            ['name' => '2026-2027'],
            ['start_date' => '2026-04-01', 'end_date' => '2027-03-31', 'is_current' => true]
        );

        // 2. Classes 1–13, each with sections A and B
        for ($level = 1; $level <= 13; $level++) {
            $class = SchoolClass::firstOrCreate(
                ['numeric_level' => $level],
                ['name' => "Class {$level}"]
            );

            foreach (['A', 'B'] as $sectionName) {
                Section::firstOrCreate([
                    'school_class_id' => $class->id,
                    'name' => $sectionName,
                ], ['capacity' => 40]);
            }
        }

        // 3. A standard subject list, assigned to every class for now
        //    (tune per class later via the subjects screen / syncSubjects endpoint)
        $subjects = [
            ['name' => 'English', 'code' => 'ENG'],
            ['name' => 'Mathematics', 'code' => 'MATH'],
            ['name' => 'Science', 'code' => 'SCI'],
            ['name' => 'Social Studies', 'code' => 'SST'],
            ['name' => 'Computer Studies', 'code' => 'COMP'],
            ['name' => 'Art', 'code' => 'ART', 'is_elective' => true],
        ];

        $subjectModels = collect($subjects)->map(
            fn ($s) => Subject::firstOrCreate(['code' => $s['code']], $s)
        );

        foreach (SchoolClass::all() as $class) {
            $class->subjects()->syncWithoutDetaching($subjectModels->pluck('id'));
        }

        // 4. One super admin to log in with
        User::firstOrCreate(
            ['email' => 'superadmin@school.test'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'role' => 'super_admin',
                'status' => 'active',
            ]
        );
    }
}
