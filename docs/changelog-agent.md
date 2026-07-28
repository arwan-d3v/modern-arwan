# CHANGELOG - SYSTEM METRICS & AGENT UPDATES

**Generated on:** 2026-07-28T08:22:00Z (UTC)

---

## PART 1: Antigravity Agent Update Log

### ✅ Completed Changes (Deployments & Fixes)

| File / Component | Change Summary | Timestamp (UTC) |
|------|----------------|-----------------|
| `.env.local` | Added Firebase configuration keys (`NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_DATABASE_URL`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`). | 2026-06-07T20:10:01Z |
| `src/lib/firebaseAdmin.ts` | Updated initialization to use `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` with a non-blocking `fs` dynamic check for local fallback. | 2026-06-07T23:36:32Z |
| `src/components/HeroSlider.tsx` | Replaced text placeholders with a generated modern SaaS UI image. Applied dynamic CSS filters (grayscale, blur vs saturate, high contrast) and fixed a visual text overlap bug during sliding by using dynamic `clip-path` for the standard layer. | 2026-06-08T11:29:00Z |
| `Vercel Deployment` | Identified build error related to `firebase-admin` missing credentials. Guided user to successfully add `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` into Vercel Environment Variables. | 2026-06-08T11:45:00Z |
| `src/components/Navbar.tsx` | Implemented public-friendly UI: Grouped Dashboard/Admin menus into a hover dropdown ('CONSOLE'), replaced Lock icon with Google Auth Profile picture upon login, and added Profile dropdown menu. | 2026-06-12T08:29:00Z |
| `Sprint 1 - 3` | Seeded real user data to Experience & Skills. Finalized html2pdf.js integration with Smart Page Break A4 preview in CV Builder. Added Pro Quota limits via Firestore. | 2026-07-28T06:00:00Z |
| `Sprint 4` | Built Advanced Theme Engine for CV & Cover Letter (Minimalist, Executive Blue, Emerald Tech, Cyber Purple). Added Cover Letter ATS & Modern variants (EN/ID). Implemented Autosave with LocalStorage & Cloud Vault sync. Added Honeypot Anti-Spam in Contact API. Optimized Next.js Images. | 2026-07-28T08:22:00Z |
| `UI/UX Audit Implementation` | Executed end-to-end workflow fixes: Added `StatusOverlay` for logout transition in `Navbar.tsx`, implemented toast deduplication logic in `ToastContext.tsx`, added global network `offline/online` event listeners, and added explicit `toast.info` for Dev-Mode RBAC bypassing in `RoleGuard.tsx`. | 2026-07-28T14:56:00Z |
| `Cross-Device UI/UX Fix` | Implemented Sticky Mobile Action Bar for `CV Builder`. Navigation and export buttons now persist at the bottom of the viewport on mobile devices (`< 1024px`), eliminating scroll fatigue. | 2026-07-28T15:02:00Z |
| `VM Boot Sequence` | Engineered a cinematic "VM Booting Up" loading sequence on the root Landing Page (`VMBootScreen.tsx`) utilizing `framer-motion`. Includes simulated terminal boot logs, a 2.5s progress bar, and a 1-hour `localStorage` cooldown mechanism. | 2026-07-28T15:10:00Z |
| `Hotfix: Toast Infinite Loop` | Resolved a duplicate notification bug where `SYSTEM_READY` and `OFFLINE` toasts spammed the UI. Fixed the `useEffect` dependency array in `DashboardPage.tsx` and `Navbar.tsx` by destructuring stable functions (`info`, `warning`, `success`) instead of tracking the volatile `toast` Context object. Implemented `useRef` for strict single-fire execution. | 2026-07-28T15:16:00Z |
| `SaaS Dashboard Redesign` | Redesigned the `DashboardPage.tsx` telemetry panels to align with the core SaaS features. Replaced dummy IT infrastructure metrics (MT5, VPS) with Role-Based dynamic metrics. Regular users now see *Profile Analytics*, *Docs Generated*, and *ATS Scores*. Super Admins see *Global Infrastructure*, *Invoicing*, and dynamic terminal logs populated with actual real-time user data from Firestore. | 2026-07-28T15:34:00Z |


### 📦 System State

- **Branch:** `feature/new-saas-pivot` is fully synced with remote and all recent commits have been pushed.
- **Production:** The application builds and deploys successfully on Vercel without `app/no-app` Firebase errors.

### 🚀 Pending Enterprise‑Level Tasks & Improvements

1. **Vercel Image Optimization:** Addressed in Sprint 4 via `next.config.mjs` updates.
2. **Deprecation Warnings Cleanup:** The build log shows several deprecated packages (`rimraf`, `glob`, `uuid`, `eslint` versions). A dependency audit (`npm audit fix` or manual upgrades) is recommended.

---

## PART 2: Jules Agent Updates & System Architecture V2.1

**Last Updated:** 2026-06-08T11:53:00Z (UTC)

### 1. OVERVIEW & PHILOSOPHY
Dashboard SaaS "Personal Command Center" dirancang sebagai manifestasi digital dari seorang Senior Infrastructure Engineer. Fokus utama adalah **"Deep Tech Minimalism"**—estetika yang menggabungkan efisiensi Jarvis-like dengan fungsionalitas profesional tingkat tinggi.

### 2. COMPLETED DEPLOYMENTS (Vercel & Git)
- [x] **Core UI/UX Framework:** Implementasi Tailwind config & strict design system.
- [x] **Authentication Base:** Google Auth integration via Firebase.
- [x] **RBAC Engine:** Logika `SUPER_USER`, `FAMILY`, `GUEST` active.
- [x] **Dynamic Landing Page:** Data experience & projects ditarik dari Firestore.
- [x] **Command Center UI:** Metrics cards, progress bars, dan streaming terminal. Termasuk `HeroSlider` interaktif dengan dynamic `clip-path` fixing.
- [x] **CV Constructor:** Multi-step form dengan 2 template (ATS & Modern) + Print support.
- [x] **Super User CMS:** Interface CRUD untuk mengelola konten portfolio.
- [x] **Vercel Production Fix:** Firebase Admin Service Account terintegrasi secara aman melalui Vercel Environment Variables (`FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`), mengizinkan build dan rendering server-side tanpa error `no-app`.

### 3. REKOMENDASI IMPROVEMENT (EFFICIENCY & FUNCTIONAL)
1.  **Optimization (Vercel Build Warnings):** Migrasi seluruh image handling ke `Next.js Image` component untuk menghilangkan warning LCP pada saat build di Vercel.
2.  **Dependency Audit:** Memperbarui dependencies lama (`glob`, `uuid`, `rimraf`) yang memicu warning *deprecated* saat fase instalasi npm di Vercel.
3.  **Performance:** Implementasi SWR atau React Query untuk caching data Firestore agar navigasi antar halaman terasa instan (0ms latency).
4.  **Security:** Menambahkan Cloud Functions untuk validasi data CMS di sisi server agar tidak hanya bergantung pada client-side logic.
5.  **UX Detail:** Menambahkan "Dark/Light" mode toggle yang khusus didesain untuk CV Builder agar user bisa mengedit di mode terang tanpa merusak estetika dashboard gelap.

### 4. ENVIRONMENT SETUP
Semua environment setup telah dipindahkan ke Vercel secara utuh, termasuk `NEXT_PUBLIC_FIREBASE_*` untuk frontend dan `FIREBASE_*` untuk backend admin.

*Note for Agents: Use this document to understand the application logic, roles, and the next steps for system evolution.*

### 5. RECENT UPDATES (Role-Based Access Control Workflow)
**Modified On:** 2026-06-08T20:00:00+08:00 (WITA)

#### Role Workflow Enhancements
Diimplementasikan pembatasan akses UI end-to-end sesuai dengan standar yang ditentukan:
1. **Public:** Dapat mengakses landing page dan `/login` tanpa terautentikasi. RoleGuard memastikan routing internal dicegah bagi user yang belum login.
2. **Guest:** Dapat login dan melihat dashboard. Modul fungsional spesifik seperti **Network Scanner** dan **Threat Defense** disembunyikan dibalik overlay merah bertuliskan "LOCKED - GUEST RESTRICTED". Role baru default bagi akun tanpa privileges.
3. **Family:** Hak akses Read-Only. Di dashboard, role Family dapat melihat UI animasi *simulated data* untuk "Scanning..." dan "Monitoring...", tetapi tidak diberikan akses modifikasi.
4. **Super Admin:** Akses penuh untuk melihat data dan mengubah konfigurasi CMS maupun role pengguna.

#### Perubahan File Codebase:
- `src/types/index.ts`: Menyesuaikan type definition menjadi `'public' | 'guest' | 'family' | 'super_admin'`.
- `src/context/AuthContext.tsx`: Mengubah logic default sign up menjadi `'guest'` (dari sebelumnya `'user'`).
- `src/components/RoleGuard.tsx` & `src/components/Navbar.tsx`: Penyesuaian pengecekan level role agar sesuai type baru.
- `src/app/dashboard/page.tsx`: Penambahan *conditional rendering* uppercase label role pada UI dan implementasi *interactive simulated module* bagi Family/Super Admin serta overlay restricted untuk Guest.
- `src/app/dashboard/users/page.tsx` & `src/app/login/page.tsx`: Penyesuaian nama select dropdown menu dan route guard dari `'user'` ke `'family'`.

Semua perubahan sudah ditest untuk proses build tanpa error `app/no-app` terkait inisialisasi Firebase fallback lokal.

### 6. Audit Orientasi Lintas Perangkat
- **Desktop Dual-Pane**: Layar terbagi optimal untuk interaksi form di sisi kiri dan Live Preview A4 di sisi kanan. Cocok untuk lingkungan kerja workstation/resulusi tinggi.
- **Mobile Stacked/Vertikal**: Diperlukan pendekatan stacked. Form input ditempatkan di atas, sedangkan Live Preview disesuaikan (scale-down) di bagian bawah. Layar peringatan awal ("Desktop Recommended") memberikan opsi bypass bagi power-users (via `localStorage`), dengan tetap memperingatkan bahwa experience terbaik adalah menggunakan layar Desktop.

### 7. Analisis End-to-End Workflow & Error Handling per Role (POV)
Sistem ini menggunakan Role-Based Access Control (RBAC) yang ketat untuk mengatur pengalaman fungsional lintas perangkat (Desktop/Mobile):

#### A. Point of View (POV): Public (Unauthenticated)
- **Workflow**: Dapat melihat Landing Page dan Login. Mencoba mengakses `/tools/cv-builder` akan langsung di-redirect oleh `ProtectedRoute` ke `/login`.
- **Error Handling**: Pencegahan akses di tingkat routing (middleware/client-guard). Tidak ada error yang membingungkan; user diarahkan dengan aman.
- **Notified**: Toast "Please login to continue" saat ter-redirect.

#### B. Point of View (POV): Free / Guest User
- **Workflow**:
  - Dapat mengakses Dashboard dan `CV Builder`.
  - Diberikan batas 2 kali export PDF (kuota per minggu).
  - Ketika mencoba melakukan "Export DOCX", sistem akan menolak dan membuka **Pricing Modal**.
- **Error Handling & Quota Protection**:
  - Jika form/CV di-export ke PDF dan terjadi kegagalan sistem rendering (`html2pdf` error), *kuota pengguna tidak akan terpotong*. Pengurangan kuota hanya terjadi setelah proses eksekusi PDF sukses sepenuhnya (try-catch safety).
  - Jika kuota PDF mencapai limit (>= 2), trigger UI memblokir ekskusi PDF dan mengarahkan ke Modal Pricing dengan Toast error elegan: "QUOTA_EXCEEDED: You have reached the maximum PDF exports. Upgrade your plan."

#### C. Point of View (POV): Student User (Planned Integration)
- **Workflow**: Mirip dengan Guest, namun memiliki kuota 10 kali PDF per bulan. Bebas watermark.
- **Error Handling**: Tetap terlindungi oleh try-catch decrement quota.

#### D. Point of View (POV): Pro & Super Admin / Family
- **Workflow**: Memiliki akses tak terbatas (Unlimited PDF) dan hak penuh mengekstrak ke DOCX. Tidak akan terganggu oleh Pricing Modal.
- **Notified**: Menerima Toast "PROCESSING: Generating DOCX..." atau "SUCCESS: PDF Downloaded" secara langsung tanpa friksi pengecekan DB kuota (Bypassed untuk efisiensi kecepatan).

### 8. Strategi Pricing 3 Tier (Free, Student, Pro)
Platform ini mengadopsi model SaaS Freemium:
- **Free Tier**: Maks 2 PDF per minggu, Basic Templates, Watermarked.
- **Student Tier**: Rp 49.000/bulan (10 PDF/mo), All Templates, No Watermark.
- **Pro Tier**: Rp 99.000/bulan, Unlimited PDF, DOCX/Word Export, Custom Theming, Priority Support.

### 9. Rencana Alur Integrasi Pembayaran (Midtrans & QRIS)
1. **Initiation**: User memilih tier melalui "Pricing Modal" di dalam aplikasi.
2. **Checkout & Snap**: Backend API routes (Next.js serverless) akan membuat *charge* dan mengembalikan token Snap Midtrans.
3. **Payment**: User menyelesaikan pembayaran melalui pop-up/iframe Snap (QRIS, VA, dll).
4. **Webhook & Provisioning**: Midtrans menembakkan webhook ke sistem. Cloud Functions kemudian memperbarui document di Firestore (mengubah role menjadi tipe langganan berbayar).

### 10. Audit Execution Summary (33 Issues Fixed)
* **RBAC & Security**: Memperbaiki kerentanan pada `AuthContext` (sekarang men-support 2 email super admin: `admin@krx.com` & `arwan.d3v@gmail.com`), memperkuat `/api/auth/register` dengan token JWT, serta mengunci UI `Profile` menjadi Read-Only. Role `student` telah diintegrasikan sepenuhnya.
* **Pricing & Logic**: Mengimplementasi auto-reset kuota mingguan (7 hari) untuk akun Free, memperbaiki pengecekan `isPro` agar menyertakan akun `pro`, serta memperbaiki integrasi tier otomatis pada Pricing Modal.
* **UI/UX & Responsiveness**: Memperbaiki 14 bug cross-device overflow. Ini mencakup *bypassing screen* mobile untuk Cover Letter Builder yang dilengkapi scaling canvas, perbaikan grid dan button wrapping pada CV Builder, penyesuaian gap pada Navbar & Footer, serta terminal Dashboard yang dinamis agar tidak memenuhi layar kecil. 
* **Next.js Router Fix**: Menyelesaikan error prerender statis `src/pages/profile.tsx` dengan memigrasikannya ke arsitektur App Router terbaru (`src/app/profile/page.tsx`). Semua kode lolos TypeScript compile dan build dengan `Exit Code 0`.
