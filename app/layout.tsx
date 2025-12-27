import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Assistant Email Professionnel",
  description: "Gestionnaire intelligent d'emails avec rédaction assistée",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
