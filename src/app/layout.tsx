import type { Metadata } from "next";
import { IBM_Plex_Mono, Sora } from "next/font/google";
import "@/app/globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sans"
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  title: "WASI Platform Production",
  description: "Migration production Next.js 14 + Supabase du prototype WASI Ecosystem."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${sora.variable} ${plexMono.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
