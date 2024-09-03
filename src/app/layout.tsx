import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientSideNavbar from "@/components/ClientSideNavbar";
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
        <ClientSideNavbar />
        {children}
      </body>
    </html>
  );
}