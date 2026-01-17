<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Student User
        $student = User::create([
            'name' => 'Mahasiswa Test',
            'email' => 'mahasiswa@test.com',
            'password' => bcrypt('password'),
            'role' => 'student',
        ]);

        // Create Student Profile manually (using DB facade or model if exists, let's use DB to be safe/quick if models aren't ready, but creating models is better. I'll use DB facade for now to avoid model issues if they aren't made yet, or I can create generic models inline or assume they exist. Wait, I haven't made Profile models yet. I should use DB facade.)
        \Illuminate\Support\Facades\DB::table('student_profiles')->insert([
            'user_id' => $student->id,
            'nim' => '10120123',
            'batch_year' => 2023,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 2. Lecturer User
        $lecturer = User::create([
            'name' => 'Dosen Test',
            'email' => 'dosen@test.com',
            'password' => bcrypt('password'),
            'role' => 'lecturer',
        ]);

        \Illuminate\Support\Facades\DB::table('lecturer_profiles')->insert([
            'user_id' => $lecturer->id,
            'nidn' => '0412058801',
            'current_quota' => 10,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 3. Head (Kaprodi) User
        User::create([
            'name' => 'Kaprodi Test',
            'email' => 'head@test.com',
            'password' => bcrypt('password'),
            'role' => 'head',
        ]);

        // Generate 20 Random Students
        User::factory(20)->create([
            'role' => 'student',
        ])->each(function ($user) {
            \App\Models\StudentProfile::factory()->create([
                'user_id' => $user->id,
            ]);
        });

        // Generate 20 Random Lecturers
        User::factory(20)->create([
            'role' => 'lecturer',
        ])->each(function ($user) {
            \App\Models\LecturerProfile::factory()->create([
                'user_id' => $user->id,
            ]);
        });
    }
}
