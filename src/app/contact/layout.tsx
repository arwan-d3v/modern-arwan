import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Comm | Contact",
  description: "Establish a direct connection. Get in touch for project inquiries, technical discussions, or collaboration.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
