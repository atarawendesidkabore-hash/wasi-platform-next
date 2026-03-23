import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type CreditScoreProps = {
  score: number | null;
  decision: string;
  rationale: string;
};

export function CreditScore({ score, decision, rationale }: CreditScoreProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Credit engine WASI</CardTitle>
        <CardDescription>Decision calculee depuis vos soldes et l'indice pays courant, pas depuis un score factice.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="font-mono text-4xl font-bold text-foreground">{score === null ? "n/a" : `${score}/850`}</div>
        <div className="text-sm font-semibold text-foreground">{decision}</div>
        <div className="text-sm text-muted">{rationale}</div>
      </CardContent>
    </Card>
  );
}
