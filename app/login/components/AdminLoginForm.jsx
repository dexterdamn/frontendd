"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

export default function AdminLoginForm({ className, ...props }) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 

  useEffect(() => {
    setIsMounted(true);
// localStorage.removeItem("admin_token");
// localStorage.removeItem("username");
// localStorage.removeItem("email");
// localStorage.removeItem("gender");
  const token = localStorage.getItem("token");
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

      // Save admin info to localStorage
      localStorage.setItem("admin_id", data.id);
      // localStorage.setItem("token", data.token);
      // localStorage.setItem("admin_token", data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", `${data.first_name} ${data.last_name}`);
      localStorage.setItem("email", data.email);
      localStorage.setItem("gender", data.gender);
      localStorage.setItem("role", "admin");
      if (navigator?.credentials?.preventSilentAccess) {
        await navigator.credentials.preventSilentAccess();
      }

      toast.success("Login successful!");
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
    <div className={cn("w-screen bg-blue-100 h-screen", className)} {...props}>
      <div className="flex">
        <img
          src="/sim.avif"
          className="mt-49 ml-40 object-contain rounded-lg shadow-lg"
          alt="FaceTracker Exam"
        />
        <h1
          className="font-bold absolute text-4xl md:text-5xl text-left w-3/4 h-auto mb-4 text-black"
          style={{
            fontSize: "50px",
            left: "300px",
            top: "77%",
            transform: "translateY(-50%)",
          }}
        >
          FaceTracker <span className="text-blue-700 font-bold">Exam</span>
        </h1>
      </div>

      <div
        className="bg-white text-black rounded-md p-10"
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
        <div className="w-full max-w-md text-center rounded-lg">
          <div className="mb-6">
            <h1 className="text-4xl font-bold mt-4">
              ADMIN <span className="text-blue-700">LOGIN</span>
            </h1>
          </div>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-1">
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
                className="bg-black text-white py-2 rounded-md text-center w- cursor-pointer"
              >
                Login
              </Button>

              {/* <Button
              type="button"
              onClick={handleGoogleLogin}
              className="bg-white hover:bg-white border border-gray-400 text-black w-full flex items-center justify-center gap-2 cursor-pointer"
            >
              <FcGoogle size={20} />
              Log in with Google
            </Button>

              <div className="text-center mt-2">
                <a href="/login/forgotpassword" className="text-blue-500">
                  Forgot Password?
                </a> */}
                <div className="flex mt-2 flex-col items-center text-black text-base">
                  <span>Don't have an account?</span>
                  <a href="/login/createaccount" className="text-blue-500">
                    Signup here
                  </a>
                {/* </div> */}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
