# 🚀 Go Class - Sistem Manajemen Siswa Modern

**Go Class** adalah aplikasi web manajemen siswa yang dirancang khusus untuk guru guna memudahkan pencatatan poin sikap dan presensi siswa secara real-time di dalam kelas. Aplikasi ini fokus pada kecepatan penggunaan (speed), kesederhanaan (minimalist), dan kenyamanan di berbagai perangkat (responsive).

![Status](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)
![Tech](https://img.shields.io/badge/Tech-React%20+%20Vite-blue?style=for-the-badge)

## ✨ Fitur Utama

- **Penilaian Sikap Instan**: Catat poin **Rajin, Sopan, dan Disiplin** dengan satu kali klik.
- **Sistem Per Pertemuan (Session-based)**: Simpan data penilaian dan presensi berdasarkan tanggal pertemuan.
- **Presensi Cepat**: Default absensi "Alpa" memudahkan guru hanya mencentang siswa yang hadir.
- **Pencarian Cerdas**: Cari siswa berdasarkan nama atau kelas dalam sekejap.
- **Responsif Penuh**: Tampilan khusus kartu (card-view) untuk penggunaan nyaman di Smartphone.
- **Penyimpanan Lokal**: Data tetap aman meski halaman di-reload atau browser ditutup.
- **UI Modern**: Desain bersih dengan skema warna profesional dan animasi halus.

## 🛠️ Tech Stack

- **React 19** (Frontend Library)
- **Vite** (Build Tool)
- **Vanilla CSS** (Custom Styling)
- **LocalStorage API** (Data Persistence)
- **GitHub Actions** (Auto Deployment)

## 🚀 Cara Menjalankan Secara Lokal

Jika Anda ingin menjalankan atau mengembangkan aplikasi ini di komputer sendiri:

### 1. Prasyarat
Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/) (versi 18 ke atas) di komputer Anda.

### 2. Kloning Repositori
```bash
git clone https://github.com/AndikaWiranata/go-class.git
cd go-class
```

### 3. Instal Dependensi
```bash
npm install
```

### 4. Jalankan Development Server
```bash
npm run dev
```
Buka browser dan akses ke `http://localhost:5173`.

## 📦 Cara Build untuk Produksi
```bash
npm run build
```
Hasil build akan berada di folder `dist/`.

## 🌐 Deployment di GitHub Pages

Proyek ini sudah dilengkapi dengan **GitHub Actions**. Setiap kali Anda melakukan `git push` ke cabang `main`, aplikasi akan secara otomatis di-build dan di-deploy ke URL GitHub Pages Anda.

---
Dibuat dengan ❤️ untuk memudahkan pekerjaan guru di sekolah.
