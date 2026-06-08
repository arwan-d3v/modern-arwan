# DESIGN.md - UI/UX Architecture

**Generated on:** 2026-06-08T11:53:00Z (UTC)
*For consumption by Google Stitch UI/UX Builder or other design agents.*

## Core Philosophy
**"Deep Tech Minimalism"**: A futuristic, Jarvis-like efficiency combined with high-end professional functionality.

## 1. Color Palette (Void-to-Signal)
- **Background (Void):** `#0A0A0A` (Deepest Dark)
- **Surface/Cards:** `#161618` (Slightly elevated dark gray)
- **Primary Accent (Cyan Signal):** `#00F2FF` (Used for navigation, active states, key metrics, and glowing effects)
- **Secondary Accent (Purple Pulse):** `#8A2BE2` (Used for CMS modules, secondary interactions, and contrast)

## 2. Geometry & Shapes
- **Corners:** Sharp, 0px border-radius for an industrial and highly technical feel. (Exception: specific components where glassmorphism naturally calls for rounded edges like `rounded-xl` in specific card overlays, but the default philosophy favors sharp).
- **Borders:** Thin, subtle borders (e.g., `border-white/10` or `border-accent-cyan/50`).

## 3. Materials & Interaction
- **Glassmorphism:** Heavy use of backdrop filters (`backdrop-blur-md` or 12px blur), semi-transparent overlays (`bg-slate-900/40`, `bg-white/5`).
- **Glow Effects:** Critical components utilize drop-shadows with neon colors: `shadow-[0_0_15px_rgba(0,242,255,0.8)]` for active states or premium elements.
- **Micro-animations:** Smooth transitions, iridescent hover glows, and Framer Motion for structural animations (e.g., the interactive `HeroSlider` with dynamic `clip-path`).

## 4. Typography
- **UI & Content:** `Inter` (Clean, legible, modern).
- **Data, Logs, Terminal:** `JetBrains Mono` or similar monospace fonts to reinforce the "Command Center" feel.
- **Hierarchy:** Strong contrast between headings (Bright White or Cyan) and body text (Gray/Muted White).

## 5. Key Components Overview
- **Command Center Dashboard:** Data-dense but clean, using glass cards and glowing progress indicators.
- **Live Terminal Log:** Monospace streaming data simulation.
- **Hero Slider:** A dual-state comparison slider utilizing CSS filters (grayscale/blur for basic state vs saturate/high-contrast for premium state).

*Stitch Instruction:* When generating variants or generating screens from text, strictly adhere to the color codes, typography, and glassmorphism settings defined above. Avoid adding unnecessary padding that breaks the dense "Command Center" layout.
