// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { FaEnvelope, FaLock } from "react-icons/fa";
// import { FcGoogle } from "react-icons/fc";
// import { toast } from "sonner";

// export default function AdminLoginForm({ className, ...props }) {
//   const router = useRouter();
//   const [isMounted, setIsMounted] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   useEffect(() => {
//     setIsMounted(true);

//     setEmail("");
//     setPassword("");

//     const handlePopState = () => {
//       window.history.go(1);
//     };

//     window.history.pushState(null, null, window.location.href);
//     window.addEventListener("popstate", handlePopState);

//     return () => {
//       window.removeEventListener("popstate", handlePopState);
//     };
//   }, []);

//   if (!isMounted) return null;

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch("http://localhost:5000/admin/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         const errorMsg =
//           data.error === "Email not found"
//             ? "Email not found"
//             : data.error === "Wrong password"
//             ? "Wrong password"
//             : "Login failed";

//         toast.error(errorMsg);
//         return;
//       }

//       // ✅ Extra validation: Only allow admin accounts
//       if (!data.token || !data.id) {
//         toast.error("This account is not allowed to log in here. Admins only!");
//         return;
//       }

//       // Save admin info to localStorage
//       localStorage.setItem("admin_id", data.id);
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("username", `${data.first_name} ${data.last_name}`);
//       localStorage.setItem("email", data.email);
//       localStorage.setItem("gender", data.gender);
//       localStorage.setItem("role", "admin");

//       if (navigator?.credentials?.preventSilentAccess) {
//         await navigator.credentials.preventSilentAccess();
//       }

//       toast.success("Admin login successful!");
//       router.push("/dashboard");
//     } catch (error) {
//       console.error("Login error:", error);
//       toast.error("An error occurred. Please try again.");
//     }
//   };

//   const handleGoogleLogin = () => {
//     window.location.href = "http://localhost:5000/auth/google";
//   };

//   return (
//     <div className={cn("w-screen bg-blue-100 h-screen", className)} {...props}>
//       <div className="flex">
//         <img
//           src="/sim.avif"
//           className="mt-49 ml-40 object-contain rounded-lg shadow-lg"
//           alt="FaceTracker Exam"
//         />
//         <h1
//           className="font-bold absolute text-4xl md:text-5xl text-left w-3/4 h-auto mb-4 text-black"
//           style={{
//             fontSize: "50px",
//             left: "300px",
//             top: "77%",
//             transform: "translateY(-50%)",
//           }}
//         >
//           FaceTracker <span className="text-blue-700 font-bold">Exam</span>
//         </h1>
//       </div>

//       <div
//         className="bg-white text-black rounded-md p-10"
//         style={{
//           boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
//           width: "90%",
//           maxWidth: "480px",
//           position: "absolute",
//           right: "150px",
//           top: "50%",
//           transform: "translateY(-50%)",
//         }}
//       >
//         <div className="w-full max-w-md text-center rounded-lg">
//           <div className="mb-6">
//             <h1 className="text-4xl font-bold mt-4">
//               ADMIN <span className="text-blue-700">LOGIN</span>
//             </h1>
//           </div>
//           <form onSubmit={handleLogin}>
//             <div className="flex flex-col gap-1">
//               <div className="flex items-center border border-gray-900 rounded-md p-3">
//                 <FaEnvelope className="text-black-500 mr-2" />
//                 <input
//                   type="email"
//                   placeholder="Email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   className="flex-1 outline-none"
//                 />
//               </div>
//               <div className="flex items-center border border-gray-900 rounded-md p-3">
//                 <FaLock className="text-black-500 mr-2" />
//                 <input
//                   type="password"
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="flex-1 outline-none"
//                 />
//               </div>

//               <Button
//                 type="submit"
//                 className="bg-black text-white py-2 rounded-md text-center w- cursor-pointer"
//               >
//                 Login
//               </Button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }




"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AdminLoginForm({ className, ...props }) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setIsMounted(true);

    setEmail("");
    setPassword("");

    const handlePopState = () => {
      window.history.go(1);
    };

    window.history.pushState(null, null, window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  if (!isMounted) return null;

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg =
          data.error === "Email not found"
            ? "Email not found"
            : data.error === "Wrong password"
            ? "Wrong password"
            : "Login failed";

        toast.error(errorMsg);
        return;
      }

      // ✅ Only allow admin accounts
      if (!data.token || !data.id) {
        toast.error("This account is not allowed to log in here. Admins only!");
        return;
      }

      // Save admin info
      localStorage.setItem("admin_id", data.id);
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", `${data.first_name} ${data.last_name}`);
      localStorage.setItem("email", data.email);
      localStorage.setItem("gender", data.gender);
      localStorage.setItem("role", "admin");

      if (navigator?.credentials?.preventSilentAccess) {
        await navigator.credentials.preventSilentAccess();
      }

      toast.success("Admin login successful!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (

    <div className={cn("flex flex-col gap-6  ", className)} {...props}>
    
      <Card className="w-[400px] h-[350px] p-6 align-center">
        <CardHeader className="text-center border-blue-500">
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          {/* <CardDescription>
            Login with your Google account or continue with email
          </CardDescription> */}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-6">
              {/* <div className="flex flex-col gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleLogin}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
              </div> */}

              {/* <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div> */}

              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    {/* <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a> */}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full cursor-pointer">
                  Login
                </Button>
              </div>
            </div>
            
          </form>
        </CardContent>
        
      </Card>
      
      {/* <div className="text-muted-foreground text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary">
        By clicking continue, you agree to our{" "}
        <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </div> */}
    
    </div>
  );
}
