// app/layout.tsx
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";

import { Toaster } from "sonner";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
         <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}


// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
  // return (
//     <html lang="en" suppressHydrationWarning>
//       <body className={`${geistSans.variable} ${geistMono.variable}`}>
//         <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
//           <SidebarProvider>
//             <AppSidebar />
//             <SidebarInset>
//               <header className="flex h-16 shrink-0 items-center gap-2 z-50">
//                 <div className="flex items-center gap-2 px-4">
//                   <SidebarTrigger className="-ml-1" />
//                   {/* <ModeToggle /> */}
//                   <Toaster richColors position="bottom-right" />
//                   <Separator
//                     orientation="vertical"
//                     className="mr-2 data-[orientation=vertical]:h-4"
//                   />
//                 </div>
//               </header>
//               <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
//                 {children}
//               </main>
//             </SidebarInset>
//           </SidebarProvider>
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }







// import '@/styles/global.css'

// import { Toaster } from "@/components/ui/sonner";

// import { ReactNode } from "react";

// export default function RootLayout({ children }: { children: ReactNode }) {
//   return (
//     <html lang="en">
//       <head />
//       <body>
//         <main>{children}</main>
//         <Toaster />
//       </body>
//     </html>
//   );
// }