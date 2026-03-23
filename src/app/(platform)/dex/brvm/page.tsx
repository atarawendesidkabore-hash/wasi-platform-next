import { BRVMTable } from "@/components/dex/BRVMTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser, loadUserDexOrders } from "@/lib/platform-data";

export default async function DexBrvmPage() {
  const user = await getCurrentUser();
  const orders = await loadUserDexOrders(user?.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>BRVM</CardTitle>
        <CardDescription>Vue production des ordres utilisateur en base. Le feed temps reel BRVM doit etre raccorde a votre source de marche.</CardDescription>
      </CardHeader>
      <CardContent>
        <BRVMTable orders={orders as never[]} />
      </CardContent>
    </Card>
  );
}
