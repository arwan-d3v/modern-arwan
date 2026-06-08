# JULES_AGENT_UPDATE // SYSTEM_ARCHITECTURE_V2.1

**Last Updated:** 2026-06-08T11:53:00Z (UTC)

## 1. OVERVIEW & PHILOSOPHY
Dashboard SaaS "Personal Command Center" dirancang sebagai manifestasi digital dari seorang Senior Infrastructure Engineer. Fokus utama adalah **"Deep Tech Minimalism"**—estetika yang menggabungkan efisiensi Jarvis-like dengan fungsionalitas profesional tingkat tinggi.

## 2. COMPLETED DEPLOYMENTS (Vercel & Git)
- [x] **Core UI/UX Framework:** Implementasi Tailwind config & strict design system.
- [x] **Authentication Base:** Google Auth integration via Firebase.
- [x] **RBAC Engine:** Logika `SUPER_USER`, `FAMILY`, `GUEST` active.
- [x] **Dynamic Landing Page:** Data experience & projects ditarik dari Firestore.
- [x] **Command Center UI:** Metrics cards, progress bars, dan streaming terminal. Termasuk `HeroSlider` interaktif dengan dynamic `clip-path` fixing.
- [x] **CV Constructor:** Multi-step form dengan 2 template (ATS & Modern) + Print support.
- [x] **Super User CMS:** Interface CRUD untuk mengelola konten portfolio.
- [x] **Vercel Production Fix:** Firebase Admin Service Account terintegrasi secara aman melalui Vercel Environment Variables (`FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`), mengizinkan build dan rendering server-side tanpa error `no-app`.

## 3. REKOMENDASI IMPROVEMENT (EFFICIENCY & FUNCTIONAL)
1.  **Optimization (Vercel Build Warnings):** Migrasi seluruh image handling ke `Next.js Image` component untuk menghilangkan warning LCP pada saat build di Vercel.
2.  **Dependency Audit:** Memperbarui dependencies lama (`glob`, `uuid`, `rimraf`) yang memicu warning *deprecated* saat fase instalasi npm di Vercel.
3.  **Performance:** Implementasi SWR atau React Query untuk caching data Firestore agar navigasi antar halaman terasa instan (0ms latency).
4.  **Security:** Menambahkan Cloud Functions untuk validasi data CMS di sisi server agar tidak hanya bergantung pada client-side logic.
5.  **UX Detail:** Menambahkan "Dark/Light" mode toggle yang khusus didesain untuk CV Builder agar user bisa mengedit di mode terang tanpa merusak estetika dashboard gelap.

## 4. ENVIRONMENT SETUP
Semua environment setup telah dipindahkan ke Vercel secara utuh, termasuk `NEXT_PUBLIC_FIREBASE_*` untuk frontend dan `FIREBASE_*` untuk backend admin.

*Note for Agents: Use this document to understand the application logic, roles, and the next steps for system evolution.*

## 5. RECENT UPDATES (Role-Based Access Control Workflow)
**Modified On:** 2026-06-08T20:00:00+08:00 (WITA)

### Role Workflow Enhancements
Diimplementasikan pembatasan akses UI end-to-end sesuai dengan standar yang ditentukan:
1. **Public:** Dapat mengakses landing page dan `/login` tanpa terautentikasi. RoleGuard memastikan routing internal dicegah bagi user yang belum login.
2. **Guest:** Dapat login dan melihat dashboard. Modul fungsional spesifik seperti **Network Scanner** dan **Threat Defense** disembunyikan dibalik overlay merah bertuliskan "LOCKED - GUEST RESTRICTED". Role baru default bagi akun tanpa privileges.
3. **Family:** Hak akses Read-Only. Di dashboard, role Family dapat melihat UI animasi *simulated data* untuk "Scanning..." dan "Monitoring...", tetapi tidak diberikan akses modifikasi.
4. **Super Admin:** Akses penuh untuk melihat data dan mengubah konfigurasi CMS maupun role pengguna.

### Perubahan File Codebase:
- `src/types/index.ts`: Menyesuaikan type definition menjadi `'public' | 'guest' | 'family' | 'super_admin'`.
- `src/context/AuthContext.tsx`: Mengubah logic default sign up menjadi `'guest'` (dari sebelumnya `'user'`).
- `src/components/RoleGuard.tsx` & `src/components/Navbar.tsx`: Penyesuaian pengecekan level role agar sesuai type baru.
- `src/app/dashboard/page.tsx`: Penambahan *conditional rendering* uppercase label role pada UI dan implementasi *interactive simulated module* bagi Family/Super Admin serta overlay restricted untuk Guest.
- `src/app/dashboard/users/page.tsx` & `src/app/login/page.tsx`: Penyesuaian nama select dropdown menu dan route guard dari `'user'` ke `'family'`.

Semua perubahan sudah ditest untuk proses build tanpa error `app/no-app` terkait inisialisasi Firebase fallback lokal.
