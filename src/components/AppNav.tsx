"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Download, LayoutDashboard, LogOut, Plus, Trophy, Users } from "lucide-react";
import { logoutAction } from "@/app/actions";

const ITEMS = [
  { href: "/", label: "Beranda", Icon: LayoutDashboard },
  { href: "/kandidat", label: "Kandidat", Icon: Users },
  { href: "/top", label: "TOP", Icon: Trophy },
  { href: "/export", label: "Export", Icon: Download },
];

export default function AppNav({ showLogout }: { showLogout: boolean }) {
  const path = usePathname();
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <>
      <header className="topbar">
        <Link href="/" className="brand">
          <span className="brand__mark" aria-hidden="true">
            HR
          </span>
          <span>Interview HRD</span>
        </Link>

        <nav className="topnav" aria-label="Navigasi utama">
          {ITEMS.map(({ href, label }) => (
            <Link key={href} href={href} aria-current={active(href) ? "page" : undefined}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="topbar__right">
          <Link href="/kandidat/baru" className="btn btn--primary btn--sm">
            <Plus size={16} aria-hidden="true" /> Nilai kandidat
          </Link>
          {showLogout && (
            <form action={logoutAction}>
              <button className="iconbtn" aria-label="Keluar" title="Keluar">
                <LogOut size={18} />
              </button>
            </form>
          )}
        </div>
      </header>

      <nav className="bottomnav" aria-label="Navigasi bawah">
        {ITEMS.slice(0, 2).map(({ href, label, Icon }) => (
          <Link key={href} href={href} aria-current={active(href) ? "page" : undefined}>
            <Icon size={22} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ))}
        <Link href="/kandidat/baru" className="bottomnav__fab" aria-label="Nilai kandidat baru">
          <Plus size={28} aria-hidden="true" />
        </Link>
        {ITEMS.slice(2).map(({ href, label, Icon }) => (
          <Link key={href} href={href} aria-current={active(href) ? "page" : undefined}>
            <Icon size={22} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
