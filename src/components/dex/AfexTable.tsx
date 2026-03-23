"use client";

import { useState, Fragment } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { AfexInstrument } from "@/lib/afex-instruments";
import { AFEX_SUBFAMILIES, MODEL_LABELS } from "@/lib/afex-instruments";

type AfexTableProps = {
  instruments: AfexInstrument[];
};

type ViewMode = "table" | "grid" | "compare";

function formatRole(role: string) {
  return role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function getSfColor(subfamily: string) {
  return AFEX_SUBFAMILIES.find((s) => s.code === subfamily);
}

/* ─── Instrument Card (Grid view) ─── */
function InstrumentCard({ i, onClick }: { i: AfexInstrument; onClick: () => void }) {
  const sf = getSfColor(i.subfamily);
  return (
    <article
      className={`cursor-pointer rounded-xl border p-4 transition hover:border-accent/50 hover:bg-[#122033] ${
        i.detail === "detailed_prototype_ready" ? "border-emerald-800/40 bg-[#081a12]" : "border-border bg-[#081220]"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm font-bold" style={{ color: sf?.color }}>{i.code}</span>
        <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ background: `${sf?.color}22`, color: sf?.color }}>
          {i.subfamily}
        </span>
      </div>
      <div className="mt-1 text-sm font-semibold">{i.country}</div>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted">
        <span>{i.currency}</span>
        <span className="text-border">|</span>
        <span>{MODEL_LABELS[i.model]}</span>
        <span className="text-border">|</span>
        <Badge variant={i.detail === "detailed_prototype_ready" ? "success" : "warning"} className="text-[10px]">
          {i.detail === "detailed_prototype_ready" ? "Detaille" : "Starter"}
        </Badge>
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {i.commodities.slice(0, 3).map((c) => (
          <span key={c} className="rounded-full bg-[#1a2d45] px-2 py-0.5 text-[10px] font-medium">{c}</span>
        ))}
        {i.commodities.length > 3 && (
          <span className="rounded-full bg-[#1a2d45] px-2 py-0.5 text-[10px] font-medium text-muted">+{i.commodities.length - 3}</span>
        )}
      </div>
    </article>
  );
}

/* ─── Compare Panel ─── */
function ComparePanel({ instruments }: { instruments: AfexInstrument[] }) {
  const [codeA, setCodeA] = useState("");
  const [codeB, setCodeB] = useState("");
  const a = instruments.find((x) => x.code === codeA);
  const b = instruments.find((x) => x.code === codeB);

  const sharedCom = a && b ? a.commodities.filter((c) => b.commodities.includes(c)) : [];
  const onlyA = a && b ? a.commodities.filter((c) => !b.commodities.includes(c)) : [];
  const onlyB = a && b ? b.commodities.filter((c) => !a.commodities.includes(c)) : [];

  const fields: { label: string; getA: (i: AfexInstrument) => string; getB: (i: AfexInstrument) => string }[] = [
    { label: "Pays", getA: (i) => i.country, getB: (i) => i.country },
    { label: "ISO3", getA: (i) => i.iso3, getB: (i) => i.iso3 },
    { label: "Region", getA: (i) => `${i.subfamilyName} (${i.subfamily})`, getB: (i) => `${i.subfamilyName} (${i.subfamily})` },
    { label: "Devise", getA: (i) => i.currency, getB: (i) => i.currency },
    { label: "Modele", getA: (i) => MODEL_LABELS[i.model], getB: (i) => MODEL_LABELS[i.model] },
    { label: "Role", getA: (i) => formatRole(i.role), getB: (i) => formatRole(i.role) },
    { label: "Profil", getA: (i) => i.detail === "detailed_prototype_ready" ? "Detaille" : "Starter", getB: (i) => i.detail === "detailed_prototype_ready" ? "Detaille" : "Starter" },
    { label: "Matieres", getA: (i) => String(i.commodities.length), getB: (i) => String(i.commodities.length) },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Instrument A</label>
          <select
            className="w-full rounded-lg border border-border bg-[#081220] px-3 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none"
            value={codeA}
            onChange={(e) => setCodeA(e.target.value)}
          >
            <option value="">Selectionner...</option>
            {instruments.map((i) => <option key={i.code} value={i.code}>{i.code} — {i.country}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Instrument B</label>
          <select
            className="w-full rounded-lg border border-border bg-[#081220] px-3 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none"
            value={codeB}
            onChange={(e) => setCodeB(e.target.value)}
          >
            <option value="">Selectionner...</option>
            {instruments.map((i) => <option key={i.code} value={i.code}>{i.code} — {i.country}</option>)}
          </select>
        </div>
      </div>

      {a && b && (
        <div className="space-y-4">
          {/* Comparison table */}
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-[#0a1628]">
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Champ</th>
                  <th className="px-4 py-3 text-left font-mono text-xs font-bold" style={{ color: getSfColor(a.subfamily)?.color }}>{a.code}</th>
                  <th className="px-4 py-3 text-left font-mono text-xs font-bold" style={{ color: getSfColor(b.subfamily)?.color }}>{b.code}</th>
                </tr>
              </thead>
              <tbody>
                {fields.map(({ label, getA, getB }) => {
                  const valA = getA(a);
                  const valB = getB(b);
                  const match = valA === valB;
                  return (
                    <tr key={label} className="border-b border-border/50">
                      <td className="px-4 py-2 text-muted">{label}</td>
                      <td className={`px-4 py-2 ${match ? "text-muted" : "font-semibold text-foreground"}`}>{valA}</td>
                      <td className={`px-4 py-2 ${match ? "text-muted" : "font-semibold text-foreground"}`}>{valB}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Commodity comparison */}
          <div className="grid gap-4 md:grid-cols-3">
            {sharedCom.length > 0 && (
              <div className="rounded-xl border border-emerald-800/40 bg-[#081a12] p-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-400">En commun ({sharedCom.length})</div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {sharedCom.map((c) => <span key={c} className="rounded-full bg-emerald-900/30 px-2.5 py-1 text-xs text-emerald-300">{c}</span>)}
                </div>
              </div>
            )}
            {onlyA.length > 0 && (
              <div className="rounded-xl border border-border bg-[#081220] p-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: getSfColor(a.subfamily)?.color }}>
                  Uniquement {a.code} ({onlyA.length})
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {onlyA.map((c) => <span key={c} className="rounded-full bg-[#1a2d45] px-2.5 py-1 text-xs">{c}</span>)}
                </div>
              </div>
            )}
            {onlyB.length > 0 && (
              <div className="rounded-xl border border-border bg-[#081220] p-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: getSfColor(b.subfamily)?.color }}>
                  Uniquement {b.code} ({onlyB.length})
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {onlyB.map((c) => <span key={c} className="rounded-full bg-[#1a2d45] px-2.5 py-1 text-xs">{c}</span>)}
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-[#081220] p-3">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Note {a.code}</div>
              <p className="mt-1 text-xs leading-relaxed text-muted">{a.note}</p>
            </div>
            <div className="rounded-lg bg-[#081220] p-3">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Note {b.code}</div>
              <p className="mt-1 text-xs leading-relaxed text-muted">{b.note}</p>
            </div>
          </div>
        </div>
      )}

      {(!a || !b) && (
        <div className="rounded-xl border border-dashed border-border bg-[#081220] px-8 py-16 text-center text-sm text-muted">
          Selectionnez deux instruments pour les comparer cote a cote.
        </div>
      )}
    </div>
  );
}

/* ─── Detail Drawer ─── */
function DetailDrawer({ i, onClose }: { i: AfexInstrument; onClose: () => void }) {
  const sf = getSfColor(i.subfamily);
  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="relative h-full w-full max-w-lg overflow-y-auto border-l border-border bg-[#0a1628] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-lg font-bold" style={{ color: sf?.color }}>{i.code} — {i.country}</h2>
          <button className="rounded-lg p-2 text-muted transition hover:bg-[#122033] hover:text-foreground" onClick={onClose}>&times;</button>
        </div>

        <div className="mt-6 space-y-5">
          <Section title="Identite">
            <Field label="Nom complet" value={`${i.country} Raw Export Index Fund`} />
            <Field label="Benchmark" value={`${i.country} Raw Export Index`} />
            <Field label="ISO3" value={i.iso3} mono />
            <Field label="Devise" value={i.currency} mono />
            <Field label="Comparaison" value="USD" mono />
          </Section>

          <Section title="Classification">
            <Field label="Famille" value="AFEX — Africa Export Index Family" />
            <Field label="Sous-famille" value={`${i.subfamily} — ${i.subfamilyName}`} color={sf?.color} />
            <Field label="Role" value={formatRole(i.role)} />
            <Field label="Profil" value={i.detail === "detailed_prototype_ready" ? "Prototype detaille" : "Profil starter"} />
          </Section>

          <Section title="Methodologie">
            <Field label="Modele" value={MODEL_LABELS[i.model]} />
            <Field label="Ponderation" value="Moyenne 20 ans tonnage export" />
            <Field label="Reconstitution" value="Annuelle" />
            <Field label="Reequilibrage" value="Trimestriel" />
          </Section>

          <Section title={`Matieres premieres (${i.commodities.length})`}>
            <div className="flex flex-wrap gap-1.5">
              {i.commodities.map((c) => (
                <span key={c} className="rounded-full bg-[#1a2d45] px-2.5 py-1 text-xs font-medium">{c}</span>
              ))}
            </div>
          </Section>

          <Section title="Note">
            <p className="text-sm leading-relaxed text-muted">{i.note}</p>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">{title}</div>
      <div className="mt-2 space-y-1">{children}</div>
    </div>
  );
}

function Field({ label, value, mono, color }: { label: string; value: string; mono?: boolean; color?: string }) {
  return (
    <div className="flex justify-between rounded bg-[#081220] px-3 py-1.5 text-sm">
      <span className="text-muted">{label}</span>
      <span className={`font-medium ${mono ? "font-mono" : ""}`} style={color ? { color } : undefined}>{value}</span>
    </div>
  );
}

/* ─── Main Component ─── */
export function AfexTable({ instruments }: AfexTableProps) {
  const [search, setSearch] = useState("");
  const [filterSubfamily, setFilterSubfamily] = useState<string | null>(null);
  const [filterModel, setFilterModel] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>("table");
  const [drawerCode, setDrawerCode] = useState<string | null>(null);

  const filtered = instruments.filter((i) => {
    if (filterSubfamily && i.subfamily !== filterSubfamily) return false;
    if (filterModel && i.model !== filterModel) return false;
    if (search) {
      const q = search.toLowerCase();
      const hay = [i.code, i.country, i.currency, i.subfamily, i.role, ...i.commodities].join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const subfamilyCounts: Record<string, number> = {};
  instruments.forEach((i) => {
    subfamilyCounts[i.subfamily] = (subfamilyCounts[i.subfamily] || 0) + 1;
  });

  const drawerInstrument = drawerCode ? instruments.find((x) => x.code === drawerCode) : null;

  return (
    <div className="space-y-4">
      {/* View tabs + Search + Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* View switcher */}
        <div className="flex rounded-lg border border-border">
          {(["table", "grid", "compare"] as const).map((v) => (
            <button
              key={v}
              className={`px-3 py-1.5 text-xs font-semibold capitalize transition ${view === v ? "bg-accent text-white" : "text-muted hover:text-foreground"}`}
              onClick={() => setView(v)}
            >
              {v === "table" ? "Tableau" : v === "grid" ? "Grille" : "Comparer"}
            </button>
          ))}
        </div>

        {view !== "compare" && (
          <>
            <input
              className="rounded-lg border border-border bg-[#081220] px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
              placeholder="Rechercher pays, code, matiere..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="flex flex-wrap gap-1.5">
              <button
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${!filterSubfamily ? "bg-accent text-white" : "border border-border text-muted hover:text-foreground"}`}
                onClick={() => setFilterSubfamily(null)}
              >
                All ({instruments.length})
              </button>
              {AFEX_SUBFAMILIES.map((sf) => (
                <button
                  key={sf.code}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${filterSubfamily === sf.code ? "text-white" : "border border-border text-muted hover:text-foreground"}`}
                  style={filterSubfamily === sf.code ? { background: sf.color } : {}}
                  onClick={() => setFilterSubfamily(filterSubfamily === sf.code ? null : sf.code)}
                >
                  {sf.code} ({subfamilyCounts[sf.code] || 0})
                </button>
              ))}
            </div>

            <div className="flex gap-1.5">
              {(["coastal_export_model", "landlocked_corridor_model", "island_export_model"] as const).map((m) => (
                <button
                  key={m}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${filterModel === m ? "bg-accent text-white" : "border border-border text-muted hover:text-foreground"}`}
                  onClick={() => setFilterModel(filterModel === m ? null : m)}
                >
                  {MODEL_LABELS[m]}
                </button>
              ))}
            </div>

            <div className="ml-auto font-mono text-xs text-muted">
              {filtered.length} / {instruments.length} instruments
            </div>
          </>
        )}
      </div>

      {/* ─── TABLE VIEW ─── */}
      {view === "table" && (
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Ticker</TableHead>
                <TableHead>Pays</TableHead>
                <TableHead className="w-16">Region</TableHead>
                <TableHead className="w-12">CCY</TableHead>
                <TableHead className="w-24">Modele</TableHead>
                <TableHead className="w-20">Profil</TableHead>
                <TableHead className="w-12">Com.</TableHead>
                <TableHead>Matieres premieres</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((i) => {
                const sf = getSfColor(i.subfamily);
                const isExpanded = expanded === i.code;

                return (
                  <Fragment key={i.code}>
                    <TableRow
                      className="cursor-pointer transition hover:bg-[#122033]"
                      onClick={() => setExpanded(isExpanded ? null : i.code)}
                    >
                      <TableCell className="font-mono font-bold" style={{ color: sf?.color }}>
                        {i.code}
                      </TableCell>
                      <TableCell className="font-medium">{i.country}</TableCell>
                      <TableCell>
                        <span className="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ background: `${sf?.color}22`, color: sf?.color }}>
                          {i.subfamily}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{i.currency}</TableCell>
                      <TableCell className="text-xs">{MODEL_LABELS[i.model]}</TableCell>
                      <TableCell>
                        <Badge variant={i.detail === "detailed_prototype_ready" ? "success" : "warning"}>
                          {i.detail === "detailed_prototype_ready" ? "Detaille" : "Starter"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-mono text-xs">{i.commodities.length}</TableCell>
                      <TableCell className="text-xs text-muted">
                        {i.commodities.slice(0, 3).join(", ")}
                        {i.commodities.length > 3 ? ` +${i.commodities.length - 3}` : ""}
                      </TableCell>
                    </TableRow>

                    {isExpanded && (
                      <TableRow>
                        <TableCell colSpan={8} className="bg-[#0d1a2d] px-6 py-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Identite</div>
                              <div className="grid gap-1 text-sm">
                                <div className="flex justify-between rounded bg-[#081220] px-3 py-1.5">
                                  <span className="text-muted">Nom complet</span>
                                  <span className="font-medium">{i.country} Raw Export Index Fund</span>
                                </div>
                                <div className="flex justify-between rounded bg-[#081220] px-3 py-1.5">
                                  <span className="text-muted">ISO3</span>
                                  <span className="font-mono font-medium">{i.iso3}</span>
                                </div>
                                <div className="flex justify-between rounded bg-[#081220] px-3 py-1.5">
                                  <span className="text-muted">Role</span>
                                  <span className="font-medium">{formatRole(i.role)}</span>
                                </div>
                                <div className="flex justify-between rounded bg-[#081220] px-3 py-1.5">
                                  <span className="text-muted">Sous-famille</span>
                                  <span className="font-medium" style={{ color: sf?.color }}>{i.subfamilyName}</span>
                                </div>
                                <div className="flex justify-between rounded bg-[#081220] px-3 py-1.5">
                                  <span className="text-muted">Comparaison</span>
                                  <span className="font-mono font-medium">USD</span>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Matieres premieres ({i.commodities.length})</div>
                              <div className="flex flex-wrap gap-1.5">
                                {i.commodities.map((c) => (
                                  <span key={c} className="rounded-full bg-[#1a2d45] px-2.5 py-1 text-xs font-medium text-foreground">{c}</span>
                                ))}
                              </div>
                              <div className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Note</div>
                              <p className="text-xs leading-relaxed text-muted">{i.note}</p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* ─── GRID VIEW ─── */}
      {view === "grid" && (
        <div>
          {AFEX_SUBFAMILIES.filter((sf) => !filterSubfamily || sf.code === filterSubfamily).map((sf) => {
            const members = filtered.filter((i) => i.subfamily === sf.code);
            if (members.length === 0) return null;
            return (
              <div key={sf.code} className="mb-6">
                <div className="mb-3 flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: sf.color }} />
                  <span className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: sf.color }}>{sf.name}</span>
                  <span className="h-px flex-1 bg-border" />
                  <span className="font-mono text-xs text-muted">{members.length}</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                  {members.map((i) => (
                    <InstrumentCard key={i.code} i={i} onClick={() => setDrawerCode(i.code)} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── COMPARE VIEW ─── */}
      {view === "compare" && <ComparePanel instruments={instruments} />}

      {/* Detail drawer */}
      {drawerInstrument && <DetailDrawer i={drawerInstrument} onClose={() => setDrawerCode(null)} />}
    </div>
  );
}
