import { Card, CardContent } from "@/components/ui/card";

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex min-h-40 flex-col justify-center gap-2 py-8">
        <p className="text-base font-semibold text-foreground">{title}</p>
        <p className="max-w-2xl text-sm text-muted">{description}</p>
      </CardContent>
    </Card>
  );
}
