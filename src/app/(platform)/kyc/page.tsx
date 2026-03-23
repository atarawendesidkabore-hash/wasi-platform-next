import { KycApplicationForm } from "@/components/kyc/KycApplicationForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ensureUserWorkspace, getCurrentUser, loadUserKycApplications } from "@/lib/platform-data";

export default async function KycPage() {
  const user = await getCurrentUser();
  await ensureUserWorkspace(user);
  const applications = await loadUserKycApplications(user?.id);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <KycApplicationForm />
      <Card>
        <CardHeader>
          <CardTitle>KYC BCEAO</CardTitle>
          <CardDescription>Suivi des dossiers soumis, revue analyste et preparation au stockage documentaire.</CardDescription>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <EmptyState title="Aucune demande KYC" description="Soumettez votre premier dossier pour lancer la verification BCEAO." />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tier demande</TableHead>
                    <TableHead>Tier accorde</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>AML</TableHead>
                    <TableHead>PPE</TableHead>
                    <TableHead>Soumis le</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell>{application.tier_requested}</TableCell>
                      <TableCell>{application.tier_granted ?? "-"}</TableCell>
                      <TableCell>{application.status}</TableCell>
                      <TableCell>{application.aml_cleared ? "OK" : "A revoir"}</TableCell>
                      <TableCell>{application.ppe_declared ? "Declare" : "Non declare"}</TableCell>
                      <TableCell>{new Date(application.submitted_at).toLocaleString("fr-FR")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
