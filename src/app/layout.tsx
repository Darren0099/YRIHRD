import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "@/app/globals.css";

const font = Nunito({ subsets: ["latin"], variable: "--font", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Interview HRD | YRI", template: "%s | Interview HRD" },
  description: "Penilaian kandidat Youth Ranger Indonesia: TOP per divisi, gamifikasi, export Excel dan PDF.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#6d3fd0" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={font.variable}>
      <body>{children}</body>
    </html>
  );
}
