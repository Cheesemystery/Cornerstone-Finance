import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { DemoProvider } from "@/components/demo-provider";
import { MvpProvider } from "@/components/mvp-provider";
import "./mvp.css";
import "./research-home.css";
import "./portfolio-polish.css";
import "./shared-controls.css";
import "./grant-cleanup.css";

const inter = localFont({ src: "./fonts/inter-latin.woff2", weight: "100 900", display: "optional", variable: "--font-sans" });
const newsreader = localFont({ src: "./fonts/newsreader-latin.woff2", weight: "200 800", display: "optional", variable: "--font-serif" });

export const metadata: Metadata = {
  title: "Cornerstone | A little wiser with money",
  description: "Learn investing one small idea at a time, then practice with fictional money. No account needed."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${newsreader.variable}`}><DemoProvider><MvpProvider>{children}</MvpProvider></DemoProvider></body>
    </html>
  );
}
