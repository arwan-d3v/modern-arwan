# JULES AGENT - SYSTEM METRICS & STRATEGY

## 1. Audit Orientasi Lintas Perangkat
- **Desktop Dual-Pane**: Layar terbagi optimal untuk interaksi form di sisi kiri dan Live Preview A4 di sisi kanan. Cocok untuk lingkungan kerja workstation/resulusi tinggi.
- **Mobile Stacked/Vertikal**: Diperlukan pendekatan stacked. Form input ditempatkan di atas, sedangkan Live Preview disesuaikan (scale-down) di bagian bawah. Layar peringatan awal ("Desktop Recommended") memberikan opsi bypass bagi power-users (via `localStorage`), dengan tetap memperingatkan bahwa experience terbaik adalah menggunakan layar Desktop.

## 2. Analisis End-to-End Workflow & Error Handling per Role (POV)
Sistem ini menggunakan Role-Based Access Control (RBAC) yang ketat untuk mengatur pengalaman fungsional lintas perangkat (Desktop/Mobile):

### A. Point of View (POV): Public (Unauthenticated)
- **Workflow**: Dapat melihat Landing Page dan Login. Mencoba mengakses `/tools/cv-builder` akan langsung di-redirect oleh `ProtectedRoute` ke `/login`.
- **Error Handling**: Pencegahan akses di tingkat routing (middleware/client-guard). Tidak ada error yang membingungkan; user diarahkan dengan aman.
- **Notified**: Toast "Please login to continue" saat ter-redirect.

### B. Point of View (POV): Free / Guest User
- **Workflow**:
  - Dapat mengakses Dashboard dan `CV Builder`.
  - Diberikan batas 2 kali export PDF (kuota per minggu).
  - Ketika mencoba melakukan "Export DOCX", sistem akan menolak dan membuka **Pricing Modal**.
- **Error Handling & Quota Protection**:
  - Jika form/CV di-export ke PDF dan terjadi kegagalan sistem rendering (`html2pdf` error), *kuota pengguna tidak akan terpotong*. Pengurangan kuota hanya terjadi setelah proses eksekusi PDF sukses sepenuhnya (try-catch safety).
  - Jika kuota PDF mencapai limit (>= 2), trigger UI memblokir ekskusi PDF dan mengarahkan ke Modal Pricing dengan Toast error elegan: "QUOTA_EXCEEDED: You have reached the maximum PDF exports. Upgrade your plan."

### C. Point of View (POV): Student User (Planned Integration)
- **Workflow**: Mirip dengan Guest, namun memiliki kuota 10 kali PDF per bulan. Bebas watermark.
- **Error Handling**: Tetap terlindungi oleh try-catch decrement quota.

### D. Point of View (POV): Pro & Super Admin / Family
- **Workflow**: Memiliki akses tak terbatas (Unlimited PDF) dan hak penuh mengekstrak ke DOCX. Tidak akan terganggu oleh Pricing Modal.
- **Notified**: Menerima Toast "PROCESSING: Generating DOCX..." atau "SUCCESS: PDF Downloaded" secara langsung tanpa friksi pengecekan DB kuota (Bypassed untuk efisiensi kecepatan).

## 3. Strategi Pricing 3 Tier (Free, Student, Pro)
Platform ini mengadopsi model SaaS Freemium:
- **Free Tier**: Maks 2 PDF per minggu, Basic Templates, Watermarked.
- **Student Tier**: Rp 49.000/bulan (10 PDF/mo), All Templates, No Watermark.
- **Pro Tier**: Rp 99.000/bulan, Unlimited PDF, DOCX/Word Export, Custom Theming, Priority Support.

## 4. Rencana Alur Integrasi Pembayaran (Midtrans & QRIS)
1. **Initiation**: User memilih tier melalui "Pricing Modal" di dalam aplikasi.
2. **Checkout & Snap**: Backend API routes (Next.js serverless) akan membuat *charge* dan mengembalikan token Snap Midtrans.
3. **Payment**: User menyelesaikan pembayaran melalui pop-up/iframe Snap (QRIS, VA, dll).
4. **Webhook & Provisioning**: Midtrans menembakkan webhook ke sistem. Cloud Functions kemudian memperbarui document di Firestore (mengubah role menjadi tipe langganan berbayar).
