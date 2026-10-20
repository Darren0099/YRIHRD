"use client";

import type { ReactNode } from "react";

/** Tombol submit yang meminta konfirmasi dulu (untuk hapus). */
export default function ConfirmButton({
  message,
  className,
  children,
  label,
}: {
  message: string;
  className?: string;
  children: ReactNode;
  label?: string;
}) {
  return (
    <button
      type="submit"
      className={className}
      aria-label={label}
      title={label}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
