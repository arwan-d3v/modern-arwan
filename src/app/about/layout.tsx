import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | System Admin Log",
  description: "My journey from heavy equipment mechanics to full-stack development and network engineering.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
