import { TransferForm } from "@/components/banking/TransferForm";
import { ensureUserWorkspace, getCurrentUser, loadUserBankAccounts } from "@/lib/platform-data";

export default async function BankingTransferPage() {
  const user = await getCurrentUser();
  await ensureUserWorkspace(user);
  const accounts = await loadUserBankAccounts(user?.id);

  return <TransferForm accounts={accounts} />;
}
