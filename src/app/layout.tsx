import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import PageTransition from "@/components/PageTransition";
import { ThemeProvider } from "next-themes";
import { GoogleAnalytics } from '@next/third-parties/google';

export const metadata: Metadata = {
  title: {
    default: "Is Arwan DEV | Full-Stack Engineer",
    template: "%s | Is Arwan DEV",
  },
  description: "Personal Portfolio & System Command Center of Is Arwan. Crafting robust, scalable, and visually captivating digital experiences.",
  keywords: ["Arwan", "Full-Stack Developer", "Next.js", "React", "Portfolio", "UI/UX", "Engineer"],
  authors: [{ name: "Is Arwan" }],
  creator: "Is Arwan",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://isarwan.dev", // Update with actual domain
    title: "Is Arwan DEV | Full-Stack Engineer",
    description: "Personal Portfolio & System Command Center of Is Arwan.",
    siteName: "Is Arwan DEV",
    images: [{
      url: "/api/og?title=CV%20and%20portfolio%20showcase%20management",
      width: 1200,
      height: 630,
      alt: "Is Arwan DEV Logo",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Is Arwan DEV | Full-Stack Engineer",
    description: "Personal Portfolio & System Command Center of Is Arwan.",
    images: ["/api/og?title=CV%20and%20portfolio%20showcase%20management"],
  },
  icons: {
    icon: "/images/web icon/igris.png",
    shortcut: "/images/web icon/igris.png",
    apple: "/images/web icon/igris.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans bg-background text-text-primary antialiased flex flex-col min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider>
            <ToastProvider>
              <Navbar />
              <main className="flex-1 pt-16">
                <PageTransition>
                  {children}
                </PageTransition>
              </main>
              <Footer />
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
