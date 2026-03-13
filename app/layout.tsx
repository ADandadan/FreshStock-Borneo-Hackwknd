import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { Box } from "@mui/material";
import { DemoDataButton } from "@/components/DemoDataButton";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FreshStock",
  description: "The site that helps you avoid food wastage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppRouterCacheProvider>
          <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, minWidth: 0 }}>
              {children}
            </Box>
            <DemoDataButton></DemoDataButton>
          </Box>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
