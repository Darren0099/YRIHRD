"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { savePenilaian, type FormState } from "@/app/actions";
import { DIVISI_LIST, SCORE_FIELDS, SCORE_MAX } from "@/config/hrd";
import { totalFromScores } from "@/lib/validate";

interface Initial {
  id?: number;
  nama?: string;
  regional?: string;
  divisi?: string;
  pewawancara?: string | null;
  skor?: Record<string, number>;
  catatan?: string | null;
}

function Submit({ edit }: { edit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn--primary btn--lg" disabled={pending}>
      {pending ? "Menyimpan..." : edit ? "Simpan perubahan" : "Simpan penilaian"}
    </button>
  );
}

export default function PenilaianForm({ initial, regionals }: { initial?: Initial; regionals: string[] }) {
  const [state, action] = useActionState<FormState, FormData>(savePenilaian, { error: null });
  const [skor, setSkor] = useState<Record<string, number>>(() =>
    Object.fromEntries(SCORE_FIELDS.map((f) => [f.key, initial?.skor?.[f.key] ?? Math.ceil(SCORE_MAX / 2)])),
  );
  const total = totalFromScores(skor);
  const divisiOptions = initial?.divisi && !DIVISI_LIST.includes(initial.divisi) ? [initial.divisi, ...DIVISI_LIST] : DIVISI_LIST;

  return (
    <form action={action} className="form card">
      {initial?.id && <input type="hidden" name="id" value={initial.id} />}

      <div className="form__grid">
        <label className="field">
          <span>Nama kandidat</span>
          <input name="nama" defaultValue={initial?.nama} required minLength={2} maxLength={150} autoComplete="off" placeholder="Nama lengkap" />
        </label>

        <label className="field">
          <span>Regional</span>
          <input name="regional" list="regional-list" defaultValue={initial?.regional} required maxLength={100} placeholder="Mis. Sumatera Selatan" />
          <datalist id="regional-list">
            {regionals.map((r) => (
              <option key={r} value={r} />
            ))}
          </datalist>
        </label>

        <label className="field">
          <span>Divisi yang dilamar</span>
          <select name="divisi" defaultValue={initial?.divisi ?? ""} required>
            <option value="" disabled>
              Pilih divisi
            </option>
            {divisiOptions.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Pewawancara (opsional)</span>
          <input name="pewawancara" defaultValue={initial?.pewawancara ?? ""} maxLength={100} placeholder="Nama HRD" />
        </label>
      </div>

      <fieldset className="scores">
        <legend>Penilaian</legend>
        {SCORE_FIELDS.map((f) => (
          <label key={f.key} className="slider">
            <span className="slider__head">
              <span>{f.label}</span>
              <b>
                {skor[f.key]}
                <small>/{SCORE_MAX}</small>
              </b>
            </span>
            <input
              type="range"
              name={`skor_${f.key}`}
              min={1}
              max={SCORE_MAX}
              step={1}
              value={skor[f.key]}
              onChange={(e) => setSkor((s) => ({ ...s, [f.key]: Number(e.target.value) }))}
              style={{ ["--pct" as string]: `${((skor[f.key] - 1) / (SCORE_MAX - 1)) * 100}%` }}
            />
          </label>
        ))}
        <div className="total" aria-live="polite">
          <span>Skor total</span>
          <strong>{total}</strong>
        </div>
      </fieldset>

      <label className="field">
        <span>Catatan (opsional, +XP bonus)</span>
        <textarea name="catatan" defaultValue={initial?.catatan ?? ""} rows={4} maxLength={2000} placeholder="Kesan, kekuatan, hal yang perlu didalami..." />
      </label>

      {state.error && (
        <p className="alert" role="alert">
          {state.error}
        </p>
      )}

      <Submit edit={!!initial?.id} />
    </form>
  );
}
