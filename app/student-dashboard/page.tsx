// 'use client';
// import Exams from "./exams/page";
// import { useEffect, useState } from 'react';
// import { ThemeProvider } from "next-themes";
// import { SideBar } from "./components/app-sidebar";
// import { Toaster } from "sonner";
// import {
//   SidebarInset,
// } from "@/components/ui/sidebar";
// import { Separator } from "@/components/ui/separator";
// import { NavUser } from "@/components/nav-user"; 
// export default function Page() {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [hasData, setHasData] = useState(false);
//   const [showLogin, setShowLogin] = useState(true); // ✅ Added this line

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
//     const firstName = localStorage.getItem("firstName");
//     const lastName = localStorage.getItem("lastName");
//     const email = localStorage.getItem("studentEmail");

//     setUsername(`${firstName} ${lastName}`);
//     setEmail(email);
//   }, []);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) return;
//         const response = await fetch("http://localhost:5000/student/login", {
//           headers: {
//             "Authorization": `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch user data");
//         }

//         const data = await response.json();
//         setUsername(data.username || `${data.first_name} ${data.last_name}`);
//         setEmail(data.email);
//       } catch (error) {
//         console.error("Error fetching student data:", error);
//       }
//     };

//     fetchUserData();
//   }, []);

//   return (
//     <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
//       <SideBar username={username} email={email} />
//       <Exams/>
      
//       <Toaster />
//     </ThemeProvider>
//   );
// }



// 'use client';
// import Exams from "./exams/page";
// import { useEffect, useState } from 'react';
// import { ThemeProvider } from "next-themes";
// import { AppSidebar} from "@/components/app-sidebar";
// import { Toaster } from "sonner";

// export default function Page() {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");

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
//     const firstName = localStorage.getItem("firstName");
//     const lastName = localStorage.getItem("lastName");
//     const email = localStorage.getItem("studentEmail");

//     setUsername(`${firstName} ${lastName}`);
//     setEmail(email);
//   }, []);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) return;
//         const response = await fetch("http://localhost:5000/student/login", {
//           headers: {
//             "Authorization": `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch user data");
//         }

//         const data = await response.json();
//         setUsername(data.username || `${data.first_name} ${data.last_name}`);
//         setEmail(data.email);
//       } catch (error) {
//         console.error("Error fetching student data:", error);
//       }
//     };

//     fetchUserData();
//   }, []);

//   return (
//     <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
//       <AppSidebar username={username} email={email} />
//       <Exams />
//       <Toaster />
//     </ThemeProvider>
//   );
// }


'use client';
import Exams from "./exams/page";
import { useEffect, useState } from 'react';
import { ThemeProvider } from "next-themes";
import { SideBar } from "./components/student/app-sidebar";
import { Toaster } from "sonner";

export default function Page() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => window.history.go(1);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

useEffect(() => {
  const firstName = localStorage.getItem("studentFirstName") || "";
  const lastName = localStorage.getItem("studentLastName") || "";
  const email = localStorage.getItem("studentEmail") || "";
  setUsername(`${firstName} ${lastName}`);
  setEmail(email);
}, []);


  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <SideBar username={username} email={email} />
      <Exams />
      <Toaster />
    </ThemeProvider>
  );
}