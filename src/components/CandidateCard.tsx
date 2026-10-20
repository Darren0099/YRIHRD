import Link from "next/link";
import { Crown, Pencil, Trash2 } from "lucide-react";
import { deletePenilaianAction } from "@/app/actions";
import ConfirmButton from "@/components/ConfirmButton";
import { formatWaktu } from "@/lib/time";
import type { Ranked } from "@/lib/top";

export default function CandidateCard({ r, highlight }: { r: Ranked; highlight?: boolean }) {
  return (
    <article className={`cand${r.isTop ? " cand--top" : ""}${highlight ? " cand--hl" : ""}`}>
      <div className="cand__score" aria-label={`Skor total ${r.total}`}>
        <strong>{r.total}</strong>
        <span>skor</span>
      </div>

      <div className="cand__main">
        <h3>
          {r.nama}
          {r.isTop && (
            <span className="tag tag--top">
              <Crown size={12} aria-hidden="true" /> TOP
            </span>
          )}
        </h3>
        <p className="cand__meta">
          {r.divisi} · {r.regional}
        </p>
        <p className="cand__sub">
          Peringkat {r.rank} dari kuota {r.quota} · {formatWaktu(r.createdAt)}
        </p>
      </div>

      <div className="cand__actions">
        <Link href={`/kandidat/${r.id}/edit`} className="iconbtn" aria-label={`Ubah ${r.nama}`} title="Ubah">
          <Pencil size={16} />
        </Link>
        <form action={deletePenilaianAction}>
          <input type="hidden" name="id" value={r.id} />
          <ConfirmButton message={`Hapus penilaian ${r.nama}?`} className="iconbtn iconbtn--danger" label={`Hapus ${r.nama}`}>
            <Trash2 size={16} />
          </ConfirmButton>
        </form>
      </div>
    </article>
  );
}
