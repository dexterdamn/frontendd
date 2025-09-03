"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FaEnvelope } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [mounted, setMounted] = useState(false);


  useEffect(() => {
      setMounted(true);
    }, []);
  
    if (!mounted) return null;
    
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Reset instructions sent to your email.");
        router.push("/login");
      } else {
        toast.error(data.error || "Email not found.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Server error. Please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100">
      <div className="bg-white p-10 rounded-md shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Forgot Password
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border border-gray-900 rounded-md p-3">
            <FaEnvelope className="text-black-500 mr-2" />
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full bg-black text-white">
            Send Reset Link
          </Button>

          <div className="text-center mt-4">
            <a href="/login" className="text-blue-500">
              Back to Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
