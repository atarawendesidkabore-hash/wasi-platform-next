# WASI Platform Production Scaffold

Migration production du prototype HTML vers `Next.js 14 + Supabase + Stripe + PayDunya + Vercel`.

## Ce qui est inclus

- App Router Next.js avec layout plateforme
- Supabase SSR (`@supabase/ssr`) pour auth/session
- Routes API pour WASI Intelligence, indices, rates, crypto, banking, webhooks et cron
- Schéma Supabase prêt à exécuter
- Shell de pages pour `intelligence`, `dex`, `banking`, `kyc`, `admin`
- UI Tailwind sombre alignée sur la direction visuelle WASI

## Démarrage local

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

## Provisioning

1. Créer le projet Supabase et exécuter [`supabase/schema.sql`](C:\Users\eu\OneDrive\Desktop\WASI\wasi-platform\supabase\schema.sql)
2. Renseigner `.env.local`
3. Brancher les webhooks Stripe et PayDunya
4. Déployer sur Vercel avec [`vercel.json`](C:\Users\eu\OneDrive\Desktop\WASI\wasi-platform\vercel.json)

## Notes

- Les pages évitent toute donnée simulée. Si Supabase ou les APIs ne sont pas configurés, elles affichent des états vides ou des erreurs de configuration.
- La couche auth utilise le pattern SSR Supabase actuel, plus adapté à Next.js App Router que `@supabase/auth-helpers-nextjs`.
