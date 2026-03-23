import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type CountryPillProps = {
  code: string;
  composite: number;
  isCoup: boolean;
  political: number | null;
  shipping: number | null;
};

export function CountryPill({ code, composite, isCoup, political, shipping }: CountryPillProps) {
  return (
    <div className="rounded-lg border border-border bg-[#091321] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-mono text-sm font-semibold text-foreground">{code}</div>
          <div className="mt-1 text-xs text-muted">Politique {political ?? "n/a"} · Shipping {shipping ?? "n/a"}</div>
        </div>
        <div className={cn("font-mono text-2xl font-bold", composite >= 65 ? "text-success" : composite >= 50 ? "text-warning" : "text-danger")}>
          {composite}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Badge variant={isCoup ? "danger" : "success"}>{isCoup ? "Transition" : "Credit OK"}</Badge>
      </div>
    </div>
  );
}
