# JULES_AGENT_UPDATE // SYSTEM_ARCHITECTURE_V2.1

## 1. OVERVIEW & PHILOSOPHY
Dashboard SaaS "Personal Command Center" dirancang sebagai manifestasi digital dari seorang Senior Infrastructure Engineer. Fokus utama adalah **"Deep Tech Minimalism"**—estetika yang menggabungkan efisiensi Jarvis-like dengan fungsionalitas profesional tingkat tinggi.

### UI/UX Design System
*   **Theme:** Void-to-Signal (Background `#0A0A0A`, Surface `#161618`).
*   **Accents:** Cyan Signal (`#00F2FF`) untuk navigasi dan metrics utama; Purple Pulse (`#8A2BE2`) untuk modul sekunder dan CMS.
*   **Geometry:** Sharp corners (0px border-radius) untuk memberikan kesan industrial dan teknis.
*   **Interaction:** Glassmorphism intens dengan backdrop blur 12px dan hover glow efek iridescent untuk feedback visual yang responsif.
*   **Typography:** Hierarchy tegas menggunakan *Inter* (UI/Content) dan *JetBrains Mono* (Data/Logs/Terminal).

---

## 2. SYSTEM LOGIC & DATA ARCHITECTURE

### Firebase Integration & Logic
*   **Real-time Synchronization:** Menggunakan `onSnapshot` untuk dashboard metrics agar perubahan data di server (seperti uptime/ping) langsung tercermin tanpa reload.
*   **CRUD Operations:** Modular CMS yang memisahkan logika penulisan data (`addDoc`, `updateDoc`) dari logika rendering UI.
*   **Security Rules (Drafted):** Implementasi Role-Based Access Control (RBAC) pada level aplikasi dan Firestore Rules untuk memastikan integritas data.

### Workflow Dashboard
1.  **Authentication:** User masuk melalui Google Auth.
2.  **Role Verification:** `AuthContext` mencocokkan UID dengan koleksi `users` untuk menentukan Role.
3.  **Dynamic Rendering:** Komponen seperti `RoleGuard` dan `ProtectedRoute` menyaring modul mana yang aktif berdasarkan hak akses.
4.  **Data Streaming:** `LiveTerminalLog` menerima stream data simulasi maupun real dari Firestore untuk log aktivitas sistem.

---

## 3. ROLE-BASED POINT OF VIEW (POV)

| Role | Access Level | UI Experience |
| :--- | :--- | :--- |
| **Public View** | Landing Page Only | Melihat Portfolio, Experience, dan Showcase. Animasi halus via Framer Motion. |
| **GUEST** | Dashboard (Read-Only) | Bisa melihat metrics infrastruktur, tapi tombol CRUD/CMS di-lock dengan peringatan "Access Restricted". |
| **FAMILY** | Dashboard + Tools | Akses ke metrics dan CV Builder, namun tidak bisa mengubah konten portfolio utama di CMS. |
| **SUPER_ADMIN** | Total Control | Akses penuh ke CMS (CRUD Experience/Project), CV Builder, dan Dashboard Metrics Management. |

---

## 4. MASTER PLAN & PROGRESS TRACKER

### COMPLETED (Actual Current)
- [x] **Core UI/UX Framework:** Implementasi Tailwind config & strict design system.
- [x] **Authentication Base:** Google Auth integration via Firebase.
- [x] **RBAC Engine:** Logika `SUPER_USER`, `FAMILY`, `GUEST` active.
- [x] **Dynamic Landing Page:** Data experience & projects ditarik dari Firestore.
- [x] **Command Center UI:** Metrics cards, progress bars, dan streaming terminal.
- [x] **CV Constructor:** Multi-step form dengan 2 template (ATS & Modern) + Print support.
- [x] **Super User CMS:** Interface CRUD untuk mengelola konten portfolio.

### IN PROGRESS / UPCOMING
- [ ] **Live Infrastructure Hooks:** Integrasi API nyata untuk monitoring VPS (bukan mock data).
- [ ] **Advanced CV Features:** Export ke PDF via server-side library (untuk kompatibilitas lebih luas).
- [ ] **Multi-Language Support:** Localisation ID/EN untuk Portfolio.
- [ ] **Notification Engine:** Alert via Telegram/WhatsApp jika MT5 Bot status ERROR.

---

## 5. REKOMENDASI IMPROVEMENT (EFFICIENCY & FUNCTIONAL)
1.  **Optimization:** Migrasi image handling ke `Next.js Image` component (Sudah dimulai) untuk menekan LCP dan menghemat bandwidth.
2.  **Performance:** Implementasi SWR atau React Query untuk caching data Firestore agar navigasi antar halaman terasa instan (0ms latency).
3.  **Security:** Menambahkan Cloud Functions untuk validasi data CMS di sisi server agar tidak hanya bergantung pada client-side logic.
4.  **UX Detail:** Menambahkan "Dark/Light" mode toggle yang khusus didesain untuk CV Builder agar user bisa mengedit di mode terang tanpa merusak estetika dashboard gelap.

**STATUS: READY_FOR_DEPLOYMENT_V1.0**
