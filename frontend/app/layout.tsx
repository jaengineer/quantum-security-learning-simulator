import type { Metadata } from "next";

import "katex/dist/katex.min.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quantum Security Learning Simulator",
  description:
    "Interactive MVP for visualizing basic quantum computing concepts applied to information security.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
