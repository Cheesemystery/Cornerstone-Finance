"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Bot, ChartNoAxesCombined, Compass, House, Menu, Settings, ShieldCheck, X } from "lucide-react";
import { useState } from "react";

const navigation = [
  { href: "/", label: "Home", icon: House },
  { href: "/portfolio", label: "Portfolio", icon: ChartNoAxesCombined },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/assistant", label: "Assistant", icon: Bot },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="app-frame">
      <header className="mobile-header">
        <Link href="/" className="wordmark">Cornerstone</Link>
        <button className="icon-button" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </header>
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div>
          <Link href="/" className="wordmark" onClick={() => setOpen(false)}>Cornerstone</Link>
          <p className="sidebar-kicker">Portfolio intelligence</p>
        </div>
        <nav aria-label="Primary navigation">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={`nav-item ${active ? "nav-active" : ""}`} onClick={() => setOpen(false)}>
                <Icon size={18} aria-hidden="true" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="trust-note">
          <ShieldCheck size={18} aria-hidden="true" />
          <div><strong>Read-only access</strong><span>Cornerstone cannot move money or place trades.</span></div>
        </div>
        <div className="account-chip"><span>AJ</span><div><strong>Alex Johnson</strong><small>Sample workspace</small></div></div>
      </aside>
      {open && <button className="scrim" aria-label="Close navigation" onClick={() => setOpen(false)} />}
      <main className="main-content">{children}</main>
    </div>
  );
}
