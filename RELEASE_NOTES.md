## Version 0.1.3.0 (Beta) - 2026-07-14

### 📝 Completed Work

#### 1. Health Check & Link Demo Access
* **Open Public Demo Health Checks:** Mengubah `/api/health` agar menerima semua URL publik `http/https` untuk link demo proyek, sambil tetap menolak `localhost` dan private IP.
* **Offline Detection Fix:** Menghilangkan 403 palsu saat cek status domain demo subdomain.

#### 2. Build & Type Safety Fixes
* **Admin Login Build Fix:** Menghapus destructuring `data` yang tidak dipakai pada `signInWithPassword()` supaya TypeScript build lolos.
* **Route/Component Audit:** Menyelaraskan route dan komponen yang terdampak perubahan admin dan data layer.

#### 3. E2E Stabilization
* **Contact Form Test Hardening:** Memperbaiki selector dan trigger blur di Playwright contact test agar validasi form stabil.
* **Render Checks:** Menyesuaikan assert halaman contact dengan struktur DOM aktual.

#### 4. Admin & UI Maintenance
* **Admin/Auth Cleanup:** Menyelaraskan helper autentikasi admin dan route terkait.
* **UI Simplification:** Menambah `components/ui/social-link.tsx` dan menghapus komponen UI usang yang tidak lagi dipakai.

---
# MEGP Portfolio - Release Notes

## Version 0.1.2.0 (Beta) - 2026-07-11

### 📝 Completed Work

#### 1. Keamanan & Kestabilan (Security & System)
* **Middleware & Auth Security Patch:** Menutup celah bypass pengecekan email admin di level Next.js middleware dan helper otentikasi server saat variabel `ADMIN_EMAIL` tidak terkonfigurasi.
* **Orphaned File Storage Clean-up:** Menghapus gambar/dokumen lama di Supabase Storage secara otomatis saat pengguna mengunggah berkas baru atau menghapus proyek portofolio.
* **Manual Clean Storage Tool:** Menambahkan tombol "Clean Storage" di Dashboard Admin untuk memindai dan menghapus seluruh file yatim piatu di storage sekali klik.
* **30-Day Logs Auto-Pruning:** Menambahkan database trigger PostgreSQL untuk menghapus log kunjungan yang berusia lebih dari 30 hari secara berkala.

#### 2. Visitor Analytics & Realtime Presence
* **Refreshes Deduplication (Session Lock):** Menerapkan sessionStorage lock di browser untuk mencegah penambahan log kunjungan ganda saat pengunjung melakukan refresh halaman dalam satu sesi.
* **Presence Count Deduplication:** Menggunakan localStorage device ID unik untuk memastikan jumlah pengguna online di widget statistik footer tidak tergelembung saat user membuka banyak tab.

#### 3. Visual & Viewport Optimizations (Mobile UX)
* **Instant Mobile Viewport Theming:** Mengamankan pewarnaan status bar dan address bar di browser mobile (Safari/Chrome) agar tetap berwarna gelap pekat (#0a0a0a) di seluruh halaman admin.
* **Zero-Flash SSR Reloads:** Menyuntikkan style CSS dinamis di dalam head blocking script untuk mencegah kedipan baris putih saat halaman login atau admin di-refresh.
* **Instant Admin Loading Screen:** Menampilkan loading screen astronot secara instan di tengah layar pada rute admin tanpa terpengaruh jeda kompilasi Next.js.

---

## Version 0.1.1.0 (Beta) - 2026-07-10

### 📝 Completed Work

#### 1. Footer Stats & Pelacakan Server-Side (Analytics Optimization)
* **REST API Tracking Proxy:** Menggantikan koneksi WebSocket Supabase Realtime di browser publik dengan pemrosesan pelacakan `/api/analytics/track` di sisi server untuk mencatat data pengunjung dan menghitung total kunjungan (`views`) serta pengguna aktif unik (5 menit terakhir) dengan andal, menghindari batas kuota koneksi gratis Supabase.
* **Layout Flat Flex & Responsif:** Mengubah tata letak bertingkat pada widget statistik footer menjadi baris datar (*flat flex row*) dan meningkatkan ukuran font angka (`text-xs` / 12px) dan keterangan (`text-[10px]` / 10px) agar statistik tidak pernah terpotong di browser manapun.

#### 2. Dinamisasi Konten Halaman Publik (Site Settings Integrations)
* **Header Portofolio Dinamis:** Memindahkan teks judul *"Selected Works"* dan deskripsinya dari kode statis ke dalam database sehingga dapat disesuaikan langsung.
* **Informasi Kontak Dinamis:** Menghapus tulisan mati pada detail Lokasi (*"Indonesia"*) dan Waktu Respon (*"Usually within 24 hours"*) di halaman kontak, menggantinya dengan pemuatan dinamis dari basis data.
* **Integrasi Giscus Diskusi Dinamis:** Memindahkan pengaturan komentar diskusi Giscus (`repo`, `repoId`, `categoryId`) dari kode komponen statis ke basis data.

#### 3. Peningkatan Fitur Panel Admin
* **Projects Editor Extension:** Menambahkan kartu input **"Portfolio Section Header Settings"** di halaman daftar proyek untuk mengedit judul dan subjudul portofolio secara dinamis.
* **Footer Editor Extension:** Menambahkan dua kartu pengaturan baru: **"Contact Details"** (mengubah lokasi dan kecepatan respon) dan **"Giscus Comments Configuration"** (mengubah target repositori komentar diskusi publik) pada form Footer.
* **Live Preview Hero Sinkron:** Menyelaraskan Live Preview pada menu edit Hero agar menggunakan animasi nyata **`<TextFlip>`** dengan format teks `"Welcome to [Word]"` dan visual yang sama persis seperti pada halaman utama.

#### 4. Type Safety & Stabilisasi Build
* **Giscus Type Casting:** Menambahkan asersi tipe data pada prop `repo` Giscus (`repo as `${string}/${string}``) untuk memenuhi kecocokan tipe literal TypeScript Next.js terbaru.

---

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
