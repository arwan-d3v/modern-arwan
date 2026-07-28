# JULES AGENT - SYSTEM METRICS & STRATEGY

## 1. Audit Orientasi Lintas Perangkat
- **Desktop Dual-Pane**: Layar terbagi optimal untuk interaksi form di sisi kiri dan Live Preview A4 di sisi kanan. Cocok untuk lingkungan kerja workstation/resulusi tinggi.
- **Mobile Stacked/Vertikal**: Diperlukan pendekatan stacked. Form input ditempatkan di atas, sedangkan Live Preview disesuaikan (scale-down) di bagian bawah. Layar peringatan awal ("Desktop Recommended") memberikan opsi bypass bagi power-users, dengan tetap memperingatkan bahwa experience terbaik adalah menggunakan layar yang lebih besar.

## 2. Strategi Pricing 3 Tier (Free, Student, Pro)
Platform ini mengadopsi model SaaS Freemium:
- **Free Tier**:
  - Batasan kuota export (Maks 2 PDF per minggu).
  - Akses fitur dasar CV Builder.
  - Watermark atau branding export aktif.
- **Student Tier**:
  - Harga terjangkau untuk akademisi/pelajar.
  - Kuota export ditingkatkan (hingga 10 PDF per bulan).
  - Akses ke template modern & ATS lanjutan.
- **Pro Tier**:
  - Akses tak terbatas (Unlimited Export PDF).
  - Ekstraksi langsung ke DOCX (Word Export).
  - Priority support & Custom Templates.

## 3. Rencana Alur Integrasi Pembayaran (Midtrans & QRIS)
1. **Initiation**: User memilih tier melalui "Pricing Modal" dari dalam aplikasi (terutama saat mencoba mengakses fitur Pro seperti DOCX Export atau saat limit PDF habis).
2. **Checkout & Snap**: Backend/API routes (Next.js serverless) akan membuat pesanan dan mengembalikan token ke frontend (Midtrans Snap).
3. **Payment**: User menyelesaikan pembayaran melalui QRIS atau metode pembayaran lain di dalam pop-up/iframe Snap.
4. **Webhook & Provisioning**: Midtrans menembakkan webhook ke sistem (Cloud Functions / API route) untuk memverifikasi pembayaran, kemudian Firestore user document di-update untuk mengubah role menjadi `super_admin` atau tipe langganan berbayar lainnya.
