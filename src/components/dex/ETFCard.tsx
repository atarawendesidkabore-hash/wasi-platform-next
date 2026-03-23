import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ETFCardProps = {
  title: string;
  description: string;
  status: string;
};

export function ETFCard({ title, description, status }: ETFCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border bg-[#081220] px-3 py-2 text-sm text-muted">{status}</div>
      </CardContent>
    </Card>
  );
}
