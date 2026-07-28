# Jules Agent - Audit & Strategy Documentation

## 1. Cross-Device Orientation & UI/UX Audit
- **Desktop (1024px and above):** Provides the optimal environment for the CV Builder. Dual-pane view (form on left, live preview on right) works perfectly for real-time visual feedback.
- **Tablet (768px - 1023px):** Portrait orientation might feel cramped for dual-pane. Recommended to switch to a stacked view (form on top, preview on bottom) or hide the preview behind a toggle button. Landscape mode can retain a compressed dual-pane view.
- **Mobile (below 768px):**
  - **Portrait:** Previously locked out. Now updated to show a warning that desktop is recommended, but allows "Continue Anyway". Layout is strictly vertical (stacked). The A4 preview needs to be scaled down significantly (e.g., scale(0.3) or wrapped in an overflow container) to fit without breaking the viewport width.
  - **Landscape:** Highly restricted vertical space. Form inputs might take up the whole screen when keyboard is open. Preview should definitely be at the bottom or accessible via a floating action button.

## 2. Pricing Strategy & Subscription Tiers
The platform utilizes a freemium model to attract users, with paid tiers unlocking premium features and removing limitations.

### Free Tier
- **Target Audience:** Casual users, recent graduates trying out the platform.
- **Features:**
  - Access to basic ATS and Modern templates.
  - Standard PDF export.
  - **Quota:** 2 PDF exports per week.
  - Watermark on generated CVs (optional, but good for growth).
- **Limitations:**
  - No Export to Word (.docx) option.
  - Cannot save multiple CV versions (vault limited to 1).
- **Price:** $0 / Rp 0

### Student Tier
- **Target Audience:** Active students needing premium tools at an affordable rate. (Verification via .edu email or student ID upload).
- **Features:**
  - All Free Tier features.
  - **Export to Word (.docx)** enabled for easy manual tweaking.
  - Access to all templates including Indonesian Standard and Pro templates.
  - **Quota:** 10 PDF/Word exports per week.
  - No watermarks.
  - Save up to 5 CV versions in the vault.
- **Price:** Rp 15.000 - Rp 25.000 / month (or equivalent one-time fee per semester)

### Pro Tier
- **Target Audience:** Seasoned professionals, job seekers actively applying to multiple roles.
- **Features:**
  - Unlimited PDF and Word (.docx) exports.
  - Advanced AI-assisted content suggestions (future roadmap).
  - Custom color palettes and typography options.
  - Unlimited CV versions in the vault.
  - Analytics (if hosted online) on who viewed their CV link.
  - Priority support.
- **Price:** Rp 49.000 - Rp 99.000 / month (or discounted annual plan)

## 3. Payment Integration Plan (Midtrans & QRIS)
To facilitate seamless transactions for Indonesian users, Midtrans will be used as the primary payment gateway.

- **QRIS:** The primary and most prominent payment method, as it has zero friction for mobile banking and e-wallet users (GoPay, OVO, Dana, ShopeePay, BCA Mobile, etc.).
- **Virtual Accounts (VA):** BCA, Mandiri, BNI, BRI for users who prefer bank transfers.
- **Flow:**
  1. User triggers an action that requires a premium tier (e.g., clicking "Export to Word" as a Free user, or exceeding the weekly PDF quota).
  2. The Pricing Modal appears, showing the tiers and benefits.
  3. User selects "Upgrade to Pro" or "Student Plan".
  4. Application calls backend endpoint to create a Midtrans Snap transaction.
  5. Backend returns a Snap Token.
  6. Frontend opens the Midtrans Snap modal (which includes QRIS generation).
  7. User scans QRIS and completes payment.
  8. Midtrans sends a webhook to the backend confirming payment.
  9. Backend updates user's role/quota in Firestore.
  10. Frontend polls or receives real-time update to unlock the requested feature.
