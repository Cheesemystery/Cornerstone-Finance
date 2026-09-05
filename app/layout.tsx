import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { DemoProvider } from "@/components/demo-provider";

const inter = localFont({ src: "./fonts/inter-latin.woff2", weight: "100 900", display: "swap", variable: "--font-sans" });
const newsreader = localFont({ src: "./fonts/newsreader-latin.woff2", weight: "200 800", display: "swap", variable: "--font-serif" });

export const metadata: Metadata = {
  title: "Cornerstone | Understand your portfolio",
  description: "A sourced portfolio briefing and research workspace for emerging investors."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${newsreader.variable}`}><DemoProvider>{children}</DemoProvider></body>
    </html>
  );
}
