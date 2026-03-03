import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Hagzy — Service Provider Dashboard",
  description: "All-in-one salon, spa & beauty management dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <SettingsProvider>
            <AppShell>{children}</AppShell>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
