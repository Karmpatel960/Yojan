import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientSideNavbar from "@/components/ClientSideNavbar";
import { SolanaWalletProvider } from '@/components/SolanaWalletProvider';
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Yojan",
  description: "An Event Planner Web3 App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SolanaWalletProvider>
          <ClientSideNavbar />
          {children}
        </SolanaWalletProvider>
      </body>
    </html>
  );
}