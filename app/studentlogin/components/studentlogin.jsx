// "use client";


// import { useState } from "react";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { CardContent } from "@/components/ui/card";
// import { FaEnvelope, FaLock } from "react-icons/fa";
// import Webcam from "react-webcam";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";

// export function StudentLoginForm({ className, ...props }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (email === "" || password === "") {
//       toast.error("Email and password are required!", {
       
//       });
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:5000/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Save necessary student data
//         localStorage.setItem("studentEmail", email);
//         localStorage.setItem("studentId", data.id);
//         localStorage.setItem("username", data.username);
//         localStorage.setItem("studentName", data.username);

//         toast.success("Login successful!", {
          
//         });

//         // Redirect to student exam page
//         console.log("Redirecting to /start");
//         router.push("/start");
//       } else {
//         // Show error message from the server
//         toast.error(data.error || "Student not registered.", {
     
//         });
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       toast.error("Server error. Please try again later.", {
       
//       });
//     }
//   };

//   return (
//     <div className={cn("w-screen flex bg-blue-200", className)} {...props}>
//       {/* Left Section */}
//       <div className="flex items-center justify-center h-screen w-1/2 ">
//         <div className="bg-white text-black rounded-md p-20 bg-blue-200 shadow-2xl w-[90%] max-w-[480px] border-2 border-gray-390">
//           <div className="header-box text-center mb-6 ">
//             <h1 className="text-4xl font-bold mt-1 ">
//               STUDENT <span className="text-blue-700">LOGIN</span>
//             </h1>
//           </div>
//           <CardContent>
//             <form onSubmit={handleSubmit}>
//               <div className="flex flex-col gap-2">
//                 <div className="flex items-center border border-gray-900 rounded-md p-2">
//                   <FaEnvelope className="text-black-500 mr-2" />
//                   <input
//                     type="email"
//                     placeholder="Email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                     className="flex-1 outline-none"
//                   />
//                 </div>
//                 <div className="flex items-center border border-gray-900 rounded-md p-2">
//                   <FaLock className="text-black-500 mr-2" />
//                   <input
//                     type="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     className="flex-1 outline-none"
//                   />
//                 </div>
//                 <Button
//                   type="submit"
//                   className="bg-black text-white py-2 rounded-md cursor-pointer text-center w-full flex items-center justify-center hover:bg-black transition-colors duration-200"
//                 >
//                   Login
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </div>
//       </div>

//       {/* Right Section */}
//       {/* <div className="flex items-center justify-center h-screen w-1/2">
//         <div className="mt-20">
         
//           <div className="flex justify-center mb-4">
//             <Webcam
//               audio={false}
//               height={100}
//               width={540}
//               screenshotFormat="image/jpeg"
//               className="rounded  shadow"
//             />
//           </div> */}
//           <h1 className="font-bold text-4xl md:text-5xl text-left mb-1 ml-20 text-black">
//             FaceTracker <span className="text-blue-700 font-bold">Exam</span>
//           </h1>
//         </div>
//     //   </div>
//     // </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import CreateAccount from "./CreateAccount"; 

export function StudentLoginForm({ className, ...props }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isLoginActive, setIsLoginActive] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    localStorage.clear();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email === "" || password === "") {
      toast.error("Email and password are required!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("studentEmail", email);
        localStorage.setItem("studentId", data.id);
        localStorage.setItem("username", data.username);
        localStorage.setItem("studentName", data.username);

        toast.success("Login successful!");
        router.push("/start");
      } else {
        toast.error(data.error || "Student not registered.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Server error. Please try again later.");
    }
  };

  return (
    <div className={cn("w-screen bg-blue-100 h-screen", className)} {...props}>
      {/* Left: image and title */}
      <div className="flex">
        <img
          src="/sim.avif"
          className="mt-40 ml-40 object-contain rounded-lg shadow-lg"
          alt="FaceTracker Exam"
        />

        <h1
          className="font-bold absolute text-4xl md:text-5xl text-left w-3/4 h-auto mb-4 text-black"
          style={{
            fontSize: "50px",
            left: "300px",
            top: "75%",
            transform: "translateY(-50%)",
          }}
        >
          FaceTracker <span className="text-blue-700 font-bold">Exam</span>
        </h1>
      </div>

      {/* Right: login or signup form */}
      <div
        className="bg-white text-black rounded-md p-20"
        style={{
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
          width: "90%",
          maxWidth: "480px",
          position: "absolute",
          right: "150px",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        {isLoginActive ? (
          <div className="w-full max-w-md text-center rounded-lg">
            <div className="mb-6">
              <h1 className="text-4xl font-bold mt-4">
                STUDENT <span className="text-blue-700">LOGIN</span>
              </h1>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <div className="flex items-center border border-gray-900 rounded-md p-3">
                  <FaEnvelope className="text-black-500 mr-2" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 outline-none"
                  />
                </div>
                <div className="flex items-center border border-gray-900 rounded-md p-3">
                  <FaLock className="text-black-500 mr-2" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="flex-1 outline-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-black text-white py-2 rounded-md text-center w-full dark:bg-black"
                >
                  Login
                </Button>

                <Button
                  type="button"
                  onClick={() => alert("Google login not implemented")}
                  className="bg-black text-white py-2 rounded-md w-full border border-gray-300 dark:bg-black"
                >
                  <FcGoogle className="text-2xl mr-2" />
                  Login with Google
                </Button>

             <div className="text-center mt-2">
          <a href="/forgot-password" className="text-blue-500 ">
            Forgot Password?
          </a>
          <div className="flex mt-2 flex-col items-center text-black text-base">
            <span>Don't have an account?</span>
            <a
              href="/Create Account"
              onClick={(e) => {
                e.preventDefault();
                setIsLoginActive(false);
              }}
              className="text-blue-500  mt-1"
            >
              Signup here
            </a>
          </div>
        </div>
              </div>
            </form>
          </div>
        ) : (
          <CreateAccount onBack={() => setIsLoginActive(true)} />
        )}
      </div>
    </div>
  );
}
