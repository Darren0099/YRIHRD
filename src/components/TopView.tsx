import { Crown } from "lucide-react";
import { DIVISI_LIST } from "@/config/hrd";
import type { Ranked } from "@/lib/top";

export default function TopView({ rows }: { rows: Ranked[] }) {
  const regionals = [...new Set(rows.map((r) => r.regional))].sort();

  if (rows.length === 0) {
    return (
      <div className="empty card">
        <p>Belum ada data. TOP akan muncul otomatis setelah kandidat dinilai.</p>
      </div>
    );
  }

  return (
    <div className="stack">
      {regionals.map((reg) => {
        const inReg = rows.filter((r) => r.regional === reg);
        const divisis = [...new Set([...DIVISI_LIST.filter((d) => inReg.some((r) => r.divisi === d)), ...inReg.map((r) => r.divisi)])];
        return (
          <section key={reg} className="stack">
            <h2 className="h2">{reg}</h2>
            <div className="cols">
              {divisis.map((d) => {
                const list = inReg.filter((r) => r.divisi === d).sort((a, b) => a.rank - b.rank);
                const quota = list[0]?.quota ?? 0;
                const tops = list.filter((r) => r.isTop);
                return (
                  <article key={d} className="card">
                    <div className="row-between">
                      <h3 className="card__title">
                        <Crown size={18} aria-hidden="true" /> {d}
                      </h3>
                      <span className="tag">
                        {tops.length}/{quota} TOP
                      </span>
                    </div>
                    <ol className="toplist">
                      {tops.map((r) => (
                        <li key={r.id}>
                          <span className={`leaders__pos pos-${Math.min(r.rank, 4)}`}>{r.rank}</span>
                          <span className="toplist__name">{r.nama}</span>
                          <b>{r.total}</b>
                        </li>
                      ))}
                    </ol>
                    {list.length > tops.length && <p className="muted small">+{list.length - tops.length} kandidat belum masuk kuota</p>}
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
