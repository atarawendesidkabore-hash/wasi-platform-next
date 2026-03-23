import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type CompositeGaugeProps = {
  composite: number;
  source: string;
  updatedAt?: string | null;
};

export function CompositeGauge({ composite, source, updatedAt }: CompositeGaugeProps) {
  const status = composite >= 65 ? "Expansion" : composite >= 50 ? "Stable" : "Contraction";
  const color = composite >= 65 ? "text-success" : composite >= 50 ? "text-warning" : "text-danger";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Composite WASI</CardTitle>
        <CardDescription>Indice regional calcule depuis les sources live connectees</CardDescription>
      </CardHeader>
      <CardContent className="flex items-end justify-between gap-4">
        <div>
          <div className={`font-mono text-5xl font-bold ${color}`}>{Math.round(composite)}</div>
          <div className="mt-2 text-sm uppercase tracking-[0.22em] text-muted">{status}</div>
        </div>
        <div className="text-right text-sm text-muted">
          <div>Source: {source}</div>
          <div>{updatedAt ? `Maj: ${new Date(updatedAt).toLocaleString("fr-FR")}` : "Maj: en attente"}</div>
        </div>
      </CardContent>
    </Card>
  );
}
