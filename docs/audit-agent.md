# UI/UX & Workflow Audit Report (End-to-End)
**Target:** Error Handling, Loading States, Auth Workflows, and User State Management.
**Context:** Role-Based Access Control (RBAC) POV for Public, Guest, Family/Student, and Super Admin.
**Date:** 2026-07-28

---

## 1. Audit: Loading & Wait State Handling
Sistem manajemen status *loading* sudah diimplementasikan dengan sangat kuat dan mengadopsi tema *Command Center / Sci-Fi*.

- **`useAsyncState` Hook:** Sangat efisien dalam membungkus *Promise* (seperti proses login) menjadi state `isBusy`, `isSuccess`, dan `isError`. Ini mencegah *multiple submissions* pada form login dan memberikan transisi visual yang baik.
- **`StatusOverlay.tsx`:** Bertindak sebagai pemblokir layar (screen blocker) elegan saat sistem memverifikasi kredensial.
  - Saat `loading` AuthContext berjalan, `RoleGuard` akan memunculkan layar `VERIFYING_CLEARANCE_LEVEL`.
  - Animasi *Liquid Glass Backdrop* dan indikator *Scanning line* memberikan umpan balik visual bahwa sistem aktif bekerja (bukan *hang*).

**Kekurangan / Potensi Masalah:**
- **Logout Transition:** Fungsi `logout()` di `Navbar.tsx` dieksekusi secara instan (`onClick={() => logout()}`). Tidak ada *loading state* atau konfirmasi visual "Logging out..." sebelum user dikembalikan ke mode *Public*.

---

## 2. Audit: Error, Fail Warning, & Success Handling
Sistem ini menggunakan `ToastContext` kustom yang sangat mendetail (`success`, `warning`, `error`, `info`), yang lebih interaktif daripada sekadar `alert()`.

- **Form Handling (Login):** Jika kredensial salah, error tidak menyebabkan *crash*, tetapi memicu pesan animasi *shake* dan `toast.error("AUTH_FAILED")`.
- **CV Builder & Quota (Guest POV):** 
  - Jika Guest memaksa mengekspor DOCX, mereka tidak melihat halaman *crash*, tetapi menerima peringatan `AUTH_REQUIRED` atau dialihkan ke *Pricing*.
  - *Try-Catch Safety:* Jika eksekusi PDF gagal di sisi *client* (karena canvas tidak terbaca), toast memunculkan `ERROR: Canvas container not found`. Kuota *tidak* terpotong.
- **Data Sync:** *Autosave* ke *Cloud Vault* pada CV Builder memicu `toast.success('CLOUD_SYNC')` tanpa mengganggu input form (non-blocking).

**Kekurangan / Potensi Masalah:**
- **Toast Spamming:** Fungsi filter pada `ToastContext` hanya membatasi total toast di layar menjadi maksimal 5. Jika user melakukan *spam click* pada tombol ekspor saat belum login, layar akan dipenuhi pesan `AUTH_REQUIRED` yang bertumpuk.

---

## 3. Audit: Login & Access Control (End-to-End POV)

### A. Public (Unauthenticated)
- **Workflow:** Dapat melihat halaman publik, namun akses ke route terproteksi seperti `/dashboard` langsung di-handle oleh `RoleGuard`.
- **Handling:** Layar memunculkan overlay `ACCESS_CLEARANCE_DENIED` dan akan *auto-redirect* ke `/login` dalam waktu 800ms. Ini memberikan *feedback* elegan dibanding *redirect* instan yang terasa "kasar".

### B. Guest & Family
- **Workflow:** Login (termasuk *Google Auth*) langsung memberikan *clearance*.
- **Dashboard:** Komponen `Navbar` secara dinamis akan menciutkan menu-menu sensitif (seperti `/dashboard/users` dan `/dashboard/cms`).

### C. Super Admin
- **Workflow:** Bypass semua *restriction*. Menu *Console* di Navbar mengekspos tautan ke CRUD Users dan CMS secara otomatis berkat pengecekan `isSuperUser`.
- **Fail-Safe:** Jika ada *delay* pada *database*, `RoleGuard` memiliki tombol manual *Return to Dashboard* atau *Retry* (khusus saat `mode="error"`).

---

## 4. Audit: Cross-Device UI/UX & Orientation

### A. Mobile Devices (Viewport < 768px)
- **Dashboard:** Grid layout berfungsi sangat baik dengan transisi ke `grid-cols-1`. Navigasi (hamburger menu) berjalan mulus dengan animasi *off-canvas drawer* dari Framer Motion.
- **CV Builder:** Terdapat sistem perlindungan *Desktop First*. Saat dibuka di mobile (`isMobile = window.innerWidth < 1024`), sistem memblokir akses dan menyarankan membuka di Desktop.
  - *Fallback:* Jika *Warning* di-bypass, form dan *preview* akan berubah dari posisi bersebelahan (`lg:flex-row`) menjadi atas-bawah (`flex-col`). 
  - *Scaling Canvas:* Kertas A4 dirender menggunakan teknik manipulasi `scale-[0.35]` dipadukan dengan *negative margin* (`-mb-[180mm]`) untuk menanggulangi isu di mana CSS `transform: scale` tidak mempengaruhi ukuran elemen pada *document flow*. Ini adalah solusi tingkat tinggi yang sangat optimal.

### B. Tablet & Desktop (Viewport >= 768px)
- **Orientation:** Mendukung *portrait* dan *landscape* tanpa masalah *overflow* berkat penggunaan `custom-scrollbar` dan pembatasan `max-w-7xl` (Dashboard) serta `lg:h-screen` (CV Builder).
- **Interactions:** Hover efek (`group-hover`, transisi glow) terlihat sangat tajam dan responsif di layar lebar.

**Kekurangan / Potensi Masalah:**
- **Mobile Action Bar (CV Builder):** Pada mode *mobile bypass* (form dan *preview* memanjang ke bawah), tombol navigasi penting (`NEXT_MODULE` dan `EXPORT PDF`) berada jauh di bawah layar. User harus men-scroll sangat panjang ke bawah halaman form untuk menemukan tombol ekspor.

---

## 🚀 Plan Perbaikan (Action Items)

Berdasarkan hasil audit di atas, berikut adalah perbaikan teknis yang harus dieksekusi untuk mencapai standar *Enterprise*:

1. **Implementasi Logout Overlay (UX Enhancement)** [SELESAI]
   - *Status:* Telah ditambahkan `StatusOverlay` mode `waiting` pada `Navbar.tsx`.

2. **Proteksi Toast Spamming & Infinite Loop Dependency** [SELESAI]
   - *Analisa Bug:* Toast deduplikasi sempat bocor karena adanya *Infinite Render Loop* pada `DashboardPage.tsx` dan `Navbar.tsx`. Keduanya memasukkan seluruh objek `toast` dari `useToast()` ke dalam *dependency array* `useEffect`. Karena objek `toast` ini selalu di-*recreate* setiap kali isi pesan berubah, hal ini menyebabkan *timeout* direset terus-menerus sehingga pesan muncul berkali-kali menembus proteksi.
   - *Status:* Logika deduplikasi telah diamankan. Komponen sekarang hanya mengambil fungsi spesifik (`info`, `warning`, dll) yang memiliki *reference* stabil, serta dilengkapi dengan `hasShownSystemReady` (*useRef*) agar tidak *spamming*.

3. **Global Network Error Handling** [SELESAI]
   - *Status:* Deteksi `online`/`offline` sudah berjalan dan men-trigger `toast`.

4. **Perhalus Transisi Dev-Bypass di RoleGuard** [SELESAI]
   - *Status:* Notifikasi `toast.info('DEV_MODE')` kini tampil saat *auth bypass* berjalan.

5. **Sticky Mobile Action Bar di CV Builder (NEW)**
   - **Tindakan:** Memodifikasi `page.tsx` pada *CV Builder* agar pada ukuran layar kecil (`< 1024px`), bagian *container* tombol navigasi (`BACK_SEQUENCE`, `NEXT_MODULE`, `EXPORT PDF`) diberikan `class` seperti `sticky bottom-0 z-50 bg-background/90 backdrop-blur`.
   - **Tujuan:** Menghindari kelelahan men-scroll (*scroll fatigue*) pada orientasi portrait vertikal ponsel saat user ingin menavigasi form atau mengekspor CV.

---

## 5. Audit: Dashboard SaaS Telemetry

### Temuan:
Dashboard sebelumnya menampilkan *dummy data* (seperti VPS Uptime, MikroTik, MT5 Enigma, dll) yang diperuntukkan bagi *Developer Portfolio*. Hal ini berpotensi membingungkan pengguna (Guest/Family) yang menggunakan layanan SaaS (CV & Cover Letter).

### Eksekusi Redesign (Role-Based Telemetry):
- **User Dashboard (Guest/Family/Pro):** Menampilkan metrik *Profile Completion*, *Docs Generated*, dan *Pro Quota Status*. Infrastruktur diubah menjadi *Resume ATS Match*, *CL Quality Score*, dan *Vault Capacity*. Menu menampilkan *CV Constructor*, *CL Constructor*, *Document Vault*, dan *Account Quota*.
- **Admin Dashboard (Super Admin):** Menampilkan *Total Users*, *Active Subs*, *Monthly Revenue*. Terminal log menarik secara dinamis **data pengguna nyata dari Firestore** (menggabungkan *real-time email/role* dengan simulasi sistem). Menu admin dilengkapi *System CMS* dan *Billing Gateway*.

