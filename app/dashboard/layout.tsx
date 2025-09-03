"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "./globals.css"; // Adjust this if needed

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
// import { ModeToggle } from "./components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <html lang="en" suppressHydrationWarning>
    //   <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <SidebarProvider>
            {/* <div className="flex h-screen"> */}
              <AppSidebar />
              <SidebarInset className="flex-1">
                <header className="flex h-16 items-center gap-2 z-50">
                  <div className="flex items-center gap-2 px-4 ">
                    <SidebarTrigger className="-ml-1" />
                    {/* <ModeToggle /> */}
                    
                    <Separator
                      orientation="vertical"
                      className="mr-2 data-[orientation=vertical]:h-10"
                    />
                  </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 pt-0 overflow-y-auto">
                  {children}
                  
                </main>
              </SidebarInset>
            {/* </div> */}
          </SidebarProvider>
        </ThemeProvider>
    //   </body>
    // </html>
  );
}