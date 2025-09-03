// // 'use client';

// // import { useEffect, useState } from 'react';
// // import { ThemeProvider } from "next-themes";
// // import { AppSidebar } from "@/components/app-sidebar";
// // import {
// //   Breadcrumb,
// //   BreadcrumbItem,
// //   BreadcrumbLink,
// //   BreadcrumbList,
// //   BreadcrumbPage,
// //   BreadcrumbSeparator,
// // } from "@/components/ui/breadcrumb";
// // import { Separator } from "@/components/ui/separator";
// // // import { ModeToggle } from "./components/theme-provider";
// // import { Toaster } from "sonner";
// // import {
// //   SidebarInset,
// //   SidebarProvider,
// //   SidebarTrigger,
// // } from "@/components/ui/sidebar";

// // export default function Page() {
// //   const [isMounted, setIsMounted] = useState(false);
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [username, setUsername] = useState("");

// //  // ...existing code...
// //   useEffect(() => {
// //     setIsMounted(true);
// //     localStorage.clear();
// //     setEmail("");
// //     setPassword("");

// //     const handlePopState = () => {
// //       window.history.go(1);
// //     };

// //     // Fix: The second argument (title) must be a string, not null
// //     window.history.pushState(null, "", window.location.href);
// //     window.addEventListener("popstate", handlePopState);

// //     return () => {
// //       window.removeEventListener("popstate", handlePopState);
// //     };
// //   }, []);
// // // ...existing

// // //   return (
// // //     <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
// // //       {/* <SidebarProvider> */}
// // //         <AppSidebar />
// // //         {/* <SidebarInset> */}
// // //           <header className="flex h-16 shrink-0 items-center gap-1">
// // //             <div className="flex items-center gap-2 px-4">
// // //               {/* <SidebarTrigger className="-ml-1" /> */}
// // //               {/* <ModeToggle /> */}
// // //                <Toaster richColors position="bottom-right" />
// // //               {/* <Separator
// // //                 orientation="vertical"
// // //                 className="mr-2 data-[orientation=vertical]:h-4"
// // //               /> */}
// // //             </div>
// // //           </header>
// // //           <div className="flex flex-1 flex-col gap-2 p-4 pt-0 mt-[-70px]">
// // //             <div className="grid auto-rows-min gap-4 md:grid-cols-3 text-center">
// // //              <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center text-center">1</div>
// // //               <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center text-center">2</div>
// // //               <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center text-center">3</div>
// // //             </div>
// // //             <div className="bg-muted/50 min-h-[10vh] flex-1 rounded-xl md:min-h-min flex items-center justify-center text-center">4</div>
// // //           </div>
// // //         {/* </SidebarInset> */}
// // //       {/* </SidebarProvider> */}
// // //     </ThemeProvider>
// // //   );
// // // }
// //  useEffect(() => {
// //     const fetchUserData = async () => {
// //       try {
// //         const token = localStorage.getItem("token");
// //         if (!token) return;
// //         const response = await fetch("http://localhost:5000/admin", {
// //           headers: {
// //             "Authorization": `Bearer ${token}`,
// //           },
// //         });

// //         if (!response.ok) {
// //           throw new Error("Failed to fetch user data");
// //         }

// //         const data = await response.json();
// //         setUsername(data.username);
// //         setEmail(data.email);
// //       } catch (error) {
// //         console.error("Error fetching user data:", error);
// //       }
// //     };

// //     fetchUserData();
// //   }, []);
// return (
//     <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
//       <AppSidebar username={username} email={email}/>
//       <header className="flex -h-20 shrink-0 items-center gap-1">
//         <div className="flex items-center gap-2 px-4">
//           <Toaster richColors position="bottom-right" />
//         </div>
//       </header>
//       <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
//           <div className="grid auto-rows-min gap-4 md:grid-cols-3">
//             <div className="bg-muted/50 aspect-video rounded-xl"/>
//             <div className="bg-muted/50 aspect-video rounded-xl" />
//             <div className="bg-muted/50 aspect-video rounded-xl" />
//           </div>
//           <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
//         </div>
//     </ThemeProvider>
// );

// }

// 'use client';
// import ExamForm from "./examform/components/ExamPage";
// const [exams, setExams] = useState([]);
// import { useEffect, useState } from 'react';
// import { ThemeProvider } from "next-themes";
// import { AppSidebar } from "@/components/app-sidebar";
// import { Toaster } from "sonner";
// import {
//   SidebarInset,
// } from "@/components/ui/sidebar";
// import { Separator } from "@/components/ui/separator";

// export default function Page() {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [hasData, setHasData] = useState(false);

//   useEffect(() => {
//     const handlePopState = () => {
//       window.history.go(1);
//     };

//     window.history.pushState(null, "", window.location.href);
//     window.addEventListener("popstate", handlePopState);

//     return () => {
//       window.removeEventListener("popstate", handlePopState);
//     };
//   }, []);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) return;
//         const response = await fetch("http://localhost:5000/admin", {
//           headers: {
//             "Authorization": `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch user data");
//         }

//         const data = await response.json();
//         setUsername(data.username);
//         setEmail(data.email);
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     };

    


//     fetchUserData();
//   }, []);

// useEffect(() => {
//   const token = localStorage.getItem("token");
//   if (!token) return;

//   fetch("http://localhost:5000/exams", {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   })
//     .then((res) => res.json())
//     .then((data) => {
//       console.log("Fetched exams:", data);
//       setExams(data); // ← You still need to define this state
//     })
//     .catch((err) => console.error("Error fetching exams:", err));
// }, []);

// return (
//     <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
//       <AppSidebar username={username} email={email}/>
//       <ExamForm />

//       {/* <header className="flex -h-20 shrink-0 items-center gap-1">
//         <div className="flex items-center gap-2 px-4">
//           <Toaster richColors position="bottom-right" />
//         </div>
//       </header> */}
//       {/* <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
//           <div className="grid auto-rows-min gap-4 md:grid-cols-3">
//             <div className="bg-muted/50 aspect-video rounded-xl"/>
//             <div className="bg-muted/50 aspect-video rounded-xl" />
//             <div className="bg-muted/50 aspect-video rounded-xl" />
//           </div>
//           <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
//         </div> */}
//     </ThemeProvider>
// );

// }

'use client';

import { useEffect, useState } from 'react';
import { ThemeProvider } from "next-themes";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "sonner";
import ExamForm from "./examform/components/ExamPage";

export default function Page() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [exams, setExams] = useState([]); 
    const [token, setToken] = useState(null);
// ← Moved here (CORRECT)

  // Prevent back navigation
  useEffect(() => {
    const handlePopState = () => {
      window.history.go(1);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Fetch admin user data
 useEffect(() => {
  const token = localStorage.getItem("adminToken");
  if (!token) return;

  fetch("http://localhost:5000/admin", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      setUsername(data.username);
      setEmail(data.email);
    })
    .catch((err) => console.error("Error fetching user data:", err));
}, []);



  // Fetch exam data
 useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/exams", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setExams(data);
      })
      .catch((err) => console.error("Error fetching exams:", err));
  }, [token]);

  if (!token) {
    return <div>Loading dashboard...</div>; // or redirect to login
  }




  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AppSidebar username={username} email={email} />
      <Toaster richColors position="bottom-right" />
      <ExamForm exams={exams} />
    </ThemeProvider>
  );
}
