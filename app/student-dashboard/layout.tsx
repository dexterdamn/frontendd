// "use client";

// import { Geist, Geist_Mono } from "next/font/google";
// import { ThemeProvider } from "next-themes";
// import { Toaster } from "sonner";
// import "./globals.css"; // Adjust this if needed

// import { SideBar } from "./components/app-sidebar"; 
// import { NavUser } from "./components/nav-user";

// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
// } from "@/components/ui/sidebar";
// import { Separator } from "@/components/ui/separator";
// // import { ModeToggle } from "./components/theme-provider";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });
// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export default function StudentDashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     // <html lang="en" suppressHydrationWarning>
//     //   <body className={`${geistSans.variable} ${geistMono.variable}`}>
//         <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
//           <SidebarProvider>
//             {/* <div className="flex h-screen"> */}
//               < SideBar />
//               <SidebarInset className="flex-1">
//                 <header className="flex h-16 items-center gap-2 z-50">
//                   <div className="flex items-center gap-2 px-4 ">
//                     <SidebarTrigger className="-ml-1" />
//                     {/* <ModeToggle /> */}
                    
//                     <Separator
//                       orientation="vertical"
//                       className="mr-2 data-[orientation=vertical]:h-10"
//                     />
                      
//                   </div>
                  
//                 </header>
//                 <main className="flex flex-1 flex-col gap-4 p-4 pt-0 overflow-y-auto">
//                   {children}
                  
//                 </main>
//               </SidebarInset>
//             {/* </div> */}
//           </SidebarProvider>
//         </ThemeProvider>
//     //   </body>
//     // </html>
//   );
// }


// "use client";

// import { Geist, Geist_Mono } from "next/font/google";
// import { ThemeProvider } from "next-themes";
// import { Toaster } from "sonner";
// import "./globals.css";

// import { useEffect, useState } from "react";
// import { SideBar } from "./components/student/app-sidebar";
// import { NavUser } from "./components/student/nav-user";

// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
// } from "@/components/ui/sidebar";
// import { Separator } from "@/components/ui/separator";

// const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
// const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState({ name: "", email: "" });

//   useEffect(() => {
//     const firstName = localStorage.getItem("firstName") || "";
//     const lastName = localStorage.getItem("lastName") || "";
//     const email = localStorage.getItem("studentEmail") || "";

//     setUser({
//       name: `${firstName} ${lastName}`,
//       email,
//     });
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear();
//     window.location.href = "/adminlogin"; // or your login route
//   };

//   return (
//     <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
//       <SidebarProvider>
//         <SideBar />
//         <SidebarInset className="flex-1">
//           <header className="flex h-16 items-center gap-2 z-50 justify-between px-4">
//             <div className="flex items-center gap-2 px-1">
//               <SidebarTrigger className="-ml-1" />
//               <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-10" />
//             </div>
        
//           </header>
//           <main className="flex-1 p-4 overflow-y-auto">{children}</main>
//         </SidebarInset>
//         <Toaster />
//       </SidebarProvider>
//     </ThemeProvider>
//   );
// }

"use client";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "./globals.css";
import { useEffect, useState } from "react";
import { SideBar } from "./components/student/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState({ name: "", email: "" });

  useEffect(() => {
    const firstName = localStorage.getItem("firstName") || "";
    const lastName = localStorage.getItem("lastName") || "";
    const email = localStorage.getItem("studentEmail") || "";
    setUser({ name: `${firstName} ${lastName}`.trim(), email });
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <SidebarProvider>
        <SideBar />
        <SidebarInset className="flex-1 ">
          <header className="flex h-16 items-center gap-2 z-50 justify-between px-4 ">
            <div className="flex items-center gap-2 px-1 ">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-10" />
            </div>
          </header>
          <main className="flex-1 p-4 overflow-y-auto ">{children}</main>
        </SidebarInset>
        <Toaster />
      </SidebarProvider>
    </ThemeProvider>
  );
}
