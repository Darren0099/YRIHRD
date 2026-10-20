/** Dibuat ulang tiap pindah halaman, sehingga setiap halaman fade-in-up. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
