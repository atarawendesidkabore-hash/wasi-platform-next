import Link from "next/link";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { Badge } from "@/components/ui/badge";
import { hasEnv } from "@/lib/env";
import { ensureUserWorkspace, getCurrentUser } from "@/lib/platform-data";

const navItems = [
  { href: "/intelligence", label: "Intelligence" },
  { href: "/dex", label: "DEX" },
  { href: "/bourse", label: "Bourse" },
  { href: "/banking", label: "Banking" },
  { href: "/comptabilite", label: "Comptabilite" },
  { href: "/billing", label: "Billing" },
  { href: "/kyc", label: "KYC" },
  { href: "/admin", label: "Admin" }
];

export default async function PlatformLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const workspace = await ensureUserWorkspace(user);
  const liveReady = hasEnv("ANTHROPIC_API_KEY") && hasEnv("NEXT_PUBLIC_SUPABASE_URL") && hasEnv("SUPABASE_SERVICE_ROLE_KEY");

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border bg-[#07101c]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-6 py-4">
          <div>
            <div className="font-mono text-xl font-bold tracking-[0.3em] text-accent">WASI</div>
            <div className="text-[11px] uppercase tracking-[0.24em] text-muted">Production Stack</div>
          </div>
          <nav className="flex flex-1 flex-wrap items-center gap-2">
            {navItems.map((item) => (
              <Link className="rounded-md px-3 py-2 text-sm text-muted transition hover:bg-[#122033] hover:text-foreground" href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Badge variant={liveReady ? "success" : "warning"}>{liveReady ? "Stack branchee" : "Config partielle"}</Badge>
            <div className="text-right text-sm text-muted">
              <div>{user?.email ?? "Aucun utilisateur connecte"}</div>
              <div className="font-mono text-xs uppercase tracking-[0.18em]">
                {user ? `${workspace.organizationName ?? "Tenant actif"} - ${workspace.plan ?? "free"}` : "Mode plateforme"}
              </div>
            </div>
            {user ? <LogoutButton /> : null}
          </div>
        </div>
      </header>
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8">{children}</main>
    </div>
  );
}
