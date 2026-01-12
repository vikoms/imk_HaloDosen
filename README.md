# HaloDosen - Sistem Informasi Pengajuan Dosen

Selamat datang di repository HaloDosen. Dokumen ini berisi panduan lengkap untuk mempersiapkan, menginstall, dan menjalankan project ini di komputer lokal Anda. Panduan ini dibuat sedetail mungkin agar rekan developer yang baru memulai atau belum memiliki environment yang sesuai dapat mengikutinya dengan mudah.

## 📋 Persyaratan Sistem (Prerequisites)

Sebelum memulai, pastikan komputer Anda telah terinstall software berikut. Jika belum, silakan install terlebih dahulu :

1.  **PHP** (Versi minimal 8.2)
2.  **Composer** (Dependency manager untuk PHP)
3.  **Node.js & NPM** (Untuk frontend React & build tools)
4.  **MySQL** atau **MariaDB** (Database management system)
5.  **Git** (Version control)

### 💡 Rekomendasi Instalasi Environment

Jika Anda menggunakan **Windows** dan belum memiliki PHP/MySQL:

-   **Opsi Termudah:** Download dan install **[Laragon](https://laragon.org/download/)** (Full, + PHP 8.x). Laragon sudah mempaketkan PHP, MySQL, Nginx/Apache, dan Composer dalam satu instalasi ringan.
-   **Alternatif:** Anda bisa menggunakan **XAMPP**, namun pastikan versi PHP-nya sesuai (> 8.2).

Jika Anda menggunakan **macOS**:

-   Disarankan menggunakan **[Homebrew](https://brew.sh/)** untuk menginstall PHP, MySQL, dan Node.js.
-   Atau gunakan **Laravel Valet**.

Jika Anda menggunakan **Linux (Ubuntu/Debian)**:

-   Install via terminal: `sudo apt install php php-mysql php-xml php-mbstring composer mysql-server nodejs npm`.

---

## 🚀 Panduan Instalasi (Langkah demi Langkah)

Ikuti langkah-langkah ini secara berurutan di terminal (Command Prompt, PowerShell, atau Terminal VS Code).

### 1. Clone Repository

Unduh source code project ke komputer Anda.

```bash
git clone <repository-url-anda>
cd si_pengajuan_dosen
```

### 2. Install Dependency Backend (Laravel)

Jalankan perintah ini untuk mengunduh semua library PHP yang dibutuhkan oleh Laravel.

```bash
composer install
```

_Catatan: Jika terjadi error terkait ekstensi PHP, pastikan ekstensi seperti `fileinfo`, `mbstring`, `pdo_mysql` sudah aktif di `php.ini` Anda._

### 3. Install Dependency Frontend (React + Vite)

Jalankan perintah ini untuk mengunduh library JavaScript (React, Tailwind, dll).

```bash
npm install
```

### 4. Konfigurasi Environment (.env)

Project Laravel membutuhkan file konfigurasi `.env`. Salin file contoh `.env.example` menjadi `.env`.

```bash
cp .env.example .env
```

_(Untuk pengguna Windows CMD: `copy .env.example .env`)_

Selanjutnya, buka file `.env` yang baru saja dibuat dengan text editor Anda, dan sesuaikan konfigurasi Database. Cari bagian `DB_CONNECTION` dan ubah seperti di bawah ini (sesuaikan `DB_PASSWORD` dengan password MySQL local Anda, biasanya kosong jika menggunakan XAMPP/Laragon default):

```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=si_pengajuan_dosen
DB_USERNAME=root
DB_PASSWORD=
```

### 5. Generate Application Key

Laravel membutuhkan key enkripsi unik.

```bash
php artisan key:generate
```

### 6. Setup Database

Pastikan service MySQL Anda sudah berjalan.
Buat database baru bernama `si_pengajuan_dosen` di MySQL Anda (bisa lewat phpMyAdmin, DBeaver, atau terminal).

Setelah database dibuat, jalankan migrasi untuk membuat tabel-tabel yang diperlukan:

```bash
php artisan migrate
```

_(Opsional) Jika ada data dummy/seeder yang perlu dimasukkan:_

```bash
php artisan db:seed
```

### 7. Link Storage (Untuk Upload File)

Agar file yang diupload bisa diakses publik:

```bash
php artisan storage:link
```

---

## ▶️ Cara Menjalankan Project

Ada dua cara untuk menjalankan project ini.

### Cara 1: Satu Perintah (Recommended)

Kami telah menyediakan script untuk menjalankan backend dan frontend sekaligus.

```bash
npm run start
```

Perintah ini akan menjalankan `php artisan serve` dan `npm run dev` secara bersamaan.
Akses aplikasi di browser melalui: **http://localhost:8000**

### Cara 2: Manual (Dua Terminal)

Jika cara di atas tidak berhasil, buka **dua** terminal terpisah.

**Terminal 1 (Backend):**

```bash
php artisan serve
```

**Terminal 2 (Frontend - Hot Reload):**

```bash
npm run dev
```

Akses aplikasi di **http://localhost:8000** (atau URL yang muncul di terminal Vite jika berbeda).

---

## ⚠️ Troubleshooting Umum

**Masalah Permission (Linux/Mac):**
Jika muncul error "Permission Denied" pada folder storage:

```bash
chmod -R 775 storage bootstrap/cache
```

**Vite manifest not found:**
Jika halaman blank atau style tidak termuat, pastikan `npm run dev` sedang berjalan. Jika ingin menjalankan di mode production (tanpa `npm run dev`), build asset terlebih dahulu:

```bash
npm run build
```

**Error Database "Connection Refused":**

-   Cek apakah MySQL sudah berjalan?
-   Cek apakah credentials di `.env` (Username/Password/Port) sudah benar?
-   Pastikan nama database di `.env` sama dengan yang Anda buat di MySQL.

Selamat coding! 🚀
