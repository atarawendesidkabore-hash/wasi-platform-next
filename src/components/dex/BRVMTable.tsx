import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type OrderRow = {
  id: string;
  ticker: string;
  side: string;
  order_type: string;
  quantity: number | null;
  price: number | null;
  status: string | null;
  filled_qty: number | null;
  commission: number | null;
  created_at: string;
};

type BRVMTableProps = {
  orders: OrderRow[];
};

export function BRVMTable({ orders }: BRVMTableProps) {
  if (orders.length === 0) {
    return <EmptyState title="Aucun ordre DEX" description="Les ordres BRVM/ETF saisis via Supabase apparaitront ici. Aucun jeu de test n'est injecte." />;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticker</TableHead>
            <TableHead>Side</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Quantite</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Filled</TableHead>
            <TableHead>Commission</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono font-semibold">{order.ticker}</TableCell>
              <TableCell>{order.side}</TableCell>
              <TableCell>{order.order_type}</TableCell>
              <TableCell>{order.quantity ?? "—"}</TableCell>
              <TableCell>{order.price ?? "—"}</TableCell>
              <TableCell>{order.filled_qty ?? "—"}</TableCell>
              <TableCell>{order.commission ?? "—"}</TableCell>
              <TableCell>{order.status ?? "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
