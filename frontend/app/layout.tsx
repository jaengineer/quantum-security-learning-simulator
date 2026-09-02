import type { Metadata } from "next";

import { PlatformShell } from "@/components/layout/PlatformShell";

import "katex/dist/katex.min.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quantum Security Learning Simulator",
  description:
    "Interactive educational platform for learning quantum computing through theory, simulation and visualization.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <PlatformShell>{children}</PlatformShell>
      </body>
    </html>
  );
}
