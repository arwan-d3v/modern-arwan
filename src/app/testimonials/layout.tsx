import { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Feedback | Testimonials",
  description: "Telemetry from clients, collaborators, and operatives who have worked directly with Arwan's systems.",
};

export default function TestimonialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
