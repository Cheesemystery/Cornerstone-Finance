"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Bot,
  ChartNoAxesCombined,
  House,
  Menu,
  Settings,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type Ref } from "react";
import { useDemo } from "./demo-provider";
import { useMvp } from "./mvp-provider";
import { Sheet, SheetTrigger, SheetClose, SheetContent, SheetTitle, SheetDescription } from "./ui/sheet";

const navigation = [
  { href: "/", label: "Home", icon: House },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/portfolio", label: "Portfolio", icon: ChartNoAxesCombined },
  { href: "/assistant", label: "Ask", icon: Bot },
];
function NavigationContent({ onNavigate, closeButtonRef }: {
  onNavigate?: () => void;
  closeButtonRef?: Ref<HTMLButtonElement>;
}) {
  const pathname = usePathname(),
    { preferences } = useDemo();
  return (
    <>
        <div>
          <Link prefetch={false} href="/" className="wordmark" onClick={onNavigate}>
            Cornerstone<span className="brand-dot">.</span>
          </Link>
        </div>
        {onNavigate && (
          <SheetClose asChild>
            <button ref={closeButtonRef} type="button" className="mobile-menu-close" aria-label="Close navigation">
              <X size={20} />
            </button>
          </SheetClose>
        )}
        <nav aria-label="Primary navigation">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link prefetch={false}
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={"nav-item " + (active ? "nav-active" : "")}
                onClick={onNavigate}
              >
                <Icon size={18} aria-hidden="true" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
        <Link prefetch={false}
          href="/settings"
          aria-current={pathname === "/settings" ? "page" : undefined}
          className="account-chip"
          onClick={onNavigate}
        >
          <span>
            {preferences.name === "Alex"
              ? "CS"
              : preferences.name.slice(0, 2).toUpperCase()}
          </span>
          <div>
            <strong>
              {preferences.name === "Alex" ? "Your space" : preferences.name}
            </strong>
            <small>Saved on this browser</small>
          </div>
          <Settings size={15} />
        </Link>
    </>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { preferences } = useDemo(), { learning } = useMvp();
  const [open, setOpen] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  const desktopSidebar = useRef<HTMLElement>(null);
  useEffect(() => {
    const media = matchMedia("(min-width: 761px)");
    const change = () => { if (media.matches) setOpen(false); };
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <div className={"app-frame " + (preferences.compact ? "compact-view" : "")}>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <header className="mobile-header">
          <Link prefetch={false} href="/" className="wordmark">
            Cornerstone<span className="brand-dot">.</span>
          </Link>
          <SheetTrigger asChild>
            <button type="button" className="icon-button" aria-label="Open navigation">
              <Menu />
            </button>
          </SheetTrigger>
        </header>
        <aside ref={desktopSidebar} id="main-sidebar" aria-label="Site sidebar" className="sidebar desktop-sidebar">
          <NavigationContent />
        </aside>
        <main id="main-content" className="main-content" tabIndex={-1}>{children}</main>
      </div>
      <SheetContent
        side="left"
        className="sidebar sidebar-open"
        showCloseButton={false}
        reducedMotion={learning.reducedMotion}
        onOpenAutoFocus={event => {
          event.preventDefault();
          closeButton.current?.focus();
        }}
        onCloseAutoFocus={event => {
          // On desktop the mobile trigger is hidden; focus the active destination.
          if (matchMedia("(min-width: 761px)").matches) {
            event.preventDefault();
            desktopSidebar.current?.querySelector<HTMLElement>('[aria-current="page"]')?.focus();
          }
        }}
      >
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <SheetDescription className="sr-only">Home, Learn, Portfolio, or Ask.</SheetDescription>
        <NavigationContent onNavigate={() => setOpen(false)} closeButtonRef={closeButton} />
      </SheetContent>
    </Sheet>
  );
}
