import Link from "next/link";
import { Award, Check, Crown, Flame, Lock, Medal, Plus, Star, Target, Users } from "lucide-react";
import CandidateCard from "@/components/CandidateCard";
import { computeBadges, computeLeaderboard, computeLevel, computeMissions } from "@/lib/gamification";
import type { Ranked } from "@/lib/top";

export default function DashboardView({ rows }: { rows: Ranked[] }) {
  const level = computeLevel(rows);
  const missions = computeMissions(rows);
  const badges = computeBadges(rows);
  const leaders = computeLeaderboard(rows);

  const total = rows.length;
  const topCount = rows.filter((r) => r.isTop).length;
  const regionals = new Set(rows.map((r) => r.regional)).size;
  const avg = total ? Math.round(rows.reduce((s, r) => s + r.total, 0) / total) : 0;

  return (
    <div className="stack">
      <section className="hero card">
        <div className="hero__level">
          <span className="hero__badge" aria-hidden="true">
            {level.level}
          </span>
          <div>
            <p className="eyebrow">Level {level.level}</p>
            <h1>{level.title}</h1>
          </div>
        </div>
        <div className="xp" role="progressbar" aria-valuenow={level.xpInLevel} aria-valuemin={0} aria-valuemax={level.xpPerLevel} aria-label="Progres XP">
          <span style={{ width: `${Math.max(level.pct, 4)}%` }} />
        </div>
        <p className="hero__xp">
          {level.xpInLevel}/{level.xpPerLevel} XP menuju level berikutnya · total {level.xp} XP
        </p>
        <Link href="/kandidat/baru" className="btn btn--sun btn--lg">
          <Plus size={18} aria-hidden="true" /> Nilai kandidat baru
        </Link>
      </section>

      <section className="stats" aria-label="Ringkasan">
        <div className="stat">
          <Users size={20} aria-hidden="true" />
          <strong>{total}</strong>
          <span>Kandidat</span>
        </div>
        <div className="stat stat--top">
          <Crown size={20} aria-hidden="true" />
          <strong>{topCount}</strong>
          <span>Masuk TOP</span>
        </div>
        <div className="stat">
          <Star size={20} aria-hidden="true" />
          <strong>{avg}</strong>
          <span>Rata-rata skor</span>
        </div>
        <div className="stat">
          <Flame size={20} aria-hidden="true" />
          <strong>{regionals}</strong>
          <span>Regional</span>
        </div>
      </section>

      <div className="cols">
        <section className="card">
          <h2 className="card__title">
            <Target size={20} aria-hidden="true" /> Misi
          </h2>
          <ul className="missions">
            {missions.map((m) => {
              const done = m.current >= m.target;
              const pct = Math.min(100, Math.round((m.current / m.target) * 100));
              return (
                <li key={m.id} className={done ? "done" : ""}>
                  <div className="missions__row">
                    <span>{m.title}</span>
                    <b>
                      {done ? <Check size={16} aria-label="Selesai" /> : `${Math.min(m.current, m.target)}/${m.target}`}
                    </b>
                  </div>
                  <div className="bar">
                    <span style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="card">
          <h2 className="card__title">
            <Medal size={20} aria-hidden="true" /> Leaderboard HRD
          </h2>
          {leaders.length === 0 ? (
            <p className="muted">Isi kolom pewawancara saat menilai untuk melihat peringkat HRD.</p>
          ) : (
            <ol className="leaders">
              {leaders.map((l, i) => (
                <li key={l.name}>
                  <span className={`leaders__pos pos-${i + 1}`}>{i + 1}</span>
                  <span className="leaders__name">{l.name}</span>
                  <span className="leaders__meta">
                    {l.count} kandidat · rata-rata {l.avg}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      <section className="card">
        <h2 className="card__title">
          <Award size={20} aria-hidden="true" /> Badge
        </h2>
        <ul className="badges">
          {badges.map((b) => (
            <li key={b.id} className={b.earned ? "on" : ""}>
              <span className="badges__icon" aria-hidden="true">
                {b.earned ? <Award size={22} /> : <Lock size={20} />}
              </span>
              <strong>{b.name}</strong>
              <small>{b.desc}</small>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="row-between">
          <h2 className="h2">Terbaru</h2>
          <Link href="/kandidat" className="link">
            Lihat semua
          </Link>
        </div>
        {rows.length === 0 ? (
          <div className="empty card">
            <p>Belum ada kandidat. Mulai dengan menilai kandidat pertama untuk membuka badge pertama.</p>
          </div>
        ) : (
          <div className="list">
            {rows.slice(0, 4).map((r) => (
              <CandidateCard key={r.id} r={r} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
