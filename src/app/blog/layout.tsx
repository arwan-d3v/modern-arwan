import { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Logs | Blog & Technical Articles",
  description: "Technical articles, guides, and insights on network engineering, fleet management systems, and full-stack development.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
