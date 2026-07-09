# MEGP Portfolio - Release Notes

## Version 0.1.0.6 (Beta) - 2026-07-10

### 📝 Completed Work

#### 1. Keamanan & Kestabilan (Security & System)
* **Client-Side Inactivity Auto Logout:** Sesi admin otomatis ditutup dan dialihkan ke login jika tidak ada aktivitas (gerakan mouse, gulir layar, ketukan keyboard) selama **15 menit**.
* **Edge & Background Session Protection:** Menghapus loading screen pemblokir render halaman sehingga dashboard memuat secara seketika (*instant*), serta memindahkan validasi sesi di latar belakang (*background validation*) sementara perlindungan rute utama tetap dijamin server-side oleh Next.js `middleware.ts`.
* **API Rate Limiting:** Pembatasan spam pada email kontak (`POST /api/contact`) maksimal **3 email per 2 menit per IP** menggunakan algoritma in-memory sliding window.
* **Environment Variables Validator:** Integrasi Zod schema validator di server-side (`lib/env.ts`) untuk memastikan semua parameter API kunci lengkap saat inisialisasi dev/build.

#### 2. SEO & Metadata Dinamis
* **Pengaturan SEO Dinamis di Panel Admin:** Kolom meta title, meta description, dan keywords untuk optimasi SEO sekarang dapat dikelola langsung dari panel admin di halaman About.
* **Dukungan Next.js generateMetadata:** Konfigurasi layout utama diubah ke dynamic generator menggunakan `generateMetadata()` untuk optimasi indexing halaman oleh Google.

#### 3. Dashboard Admin & Visualisasi Data
* **Data Backup & Restore:** Penambahan tombol ekspor data pengaturan ke JSON dan impor kembali berkas JSON tersebut untuk migrasi/restorasi database yang mudah.
* **Diagram Visitor Trends:** Integrasi grafik tren kunjungan mingguan berbasis SVG dengan efek hover tooltip dan pembaruan data secara real-time via Supabase realtime channel.
* **Serialization Bugfix:** Menyelesaikan error Turbopack Next.js dengan mengubah komponen Lucide non-serializable pada data statistik menjadi string pengenal (`iconName`).

#### 4. Pembenahan Desain (UI/UX Refinements)
* **Contact Social Icons:** Ikon sosial media di halaman kontak diposisikan rata tengah (*center-aligned*) agar kartu informasi terlihat seimbang.
* **Hero Admin Editor:** Layout kartu input dan Live Preview yang estetik dengan simulasi visual status lowongan kerja (efek pulsing hijau).
* **Form & Input Responsif:** Input tag teknologi kustom pada projects dan kata animasi hero diatur agar otomatis bertumpuk vertikal di mobile dan sejajar horizontal di desktop.
* **Single Save Button:** Tombol simpan ganda di atas form telah dihapus untuk menyamakan konsistensi desain formulir admin.

---

### 🚀 Future TODO List (Rencana Pengembangan)

#### 🛡️ Keamanan Lanjutan (Advanced Security)
- [ ] **Row-Level Security (RLS) di Supabase:** Memastikan tabel `projects` dan `site_settings` terkunci dengan hak akses SELECT untuk publik dan full-access (INSERT, UPDATE, DELETE) hanya untuk akun Admin yang terotentikasi.
- [ ] **Google reCAPTCHA v3 / Cloudflare Turnstile:** Proteksi bot spamming tingkat lanjut pada form kontak.

#### 📊 Peningkatan Fitur Dashboard
- [ ] **Statistik Detail Pengunjung:** Menampilkan data browser (Chrome, Safari, Mobile), negara asal pengunjung, dan sumber rujukan (*Referral* seperti LinkedIn, GitHub) menggunakan visualisasi chart.
- [ ] **Markdown Editor (Rich Text) untuk Projects:** Mengganti textarea deskripsi project dengan editor markdown sederhana agar deskripsi project bisa menggunakan format teks tebal, miring, list, dan tautan tautan khusus.

#### 📈 SEO & Media Sosial
- [ ] **Dynamic OpenGraph (OG) Images Generator:** Memanfaatkan pustaka `@vercel/og` untuk menghasilkan gambar pratinjau sosial media secara dinamis (menampilkan nama, foto profile, dan title saat tautan dibagikan).
