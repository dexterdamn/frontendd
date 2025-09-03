"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";

export default function CreateAccount({ onBack }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleCreateAccount = async (e) => {
  e.preventDefault();

  if (!firstName || !lastName || !gender || !email || !password || !confirmPassword) {
    toast.error("All fields are required!");
    return;
  }

  if (password !== confirmPassword) {
    toast.error("Passwords do not match!");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/admin/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        gender,
        email,
        password,
        confirm_password: confirmPassword,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success("Admin account created successfully!");
      router.push("/login"); // Redirect to admin dashboard
    } else {
      toast.error(data.error || "Failed to create admin account.");
    }
  } catch (err) {
    console.error(err);
    toast.error("Server error. Please try again later.");
  }
};


   const handleGoogleLogin = () => {
    // Update this URL to match your actual Google OAuth route
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white rounded-md shadow-xl p-10 w-[90%] max-w-[480px]">
        <h1 className="text-4xl font-bold text-center mb-6">
          Create <span className="text-blue-700">Account</span>
        </h1>
        <form onSubmit={handleCreateAccount}>
          <div className="flex flex-col gap-2">
            <div className="flex items-center border border-gray-900 rounded-md p-3">
              <FaUser className="mr-2" />
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="flex-1 outline-none"
              />
            </div>

            <div className="flex items-center border border-gray-900 rounded-md p-3">
              <FaUser className="mr-2" />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="flex-1 outline-none"
              />
            </div>

            <div className="border border-gray-900 rounded-md p-3 ">
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full outline-none bg-transparent cursor-pointer"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
               
              </select>
            </div>

            <div className="flex items-center border border-gray-900 rounded-md p-3">
              <FaEnvelope className="mr-2" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 outline-none"
              />
            </div>

            <div className="flex items-center border border-gray-900 rounded-md p-3">
              <FaLock className="mr-2" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 outline-none"
              />
            </div>

            <div className="flex items-center border border-gray-900 rounded-md p-3">
              <FaLock className="mr-2" />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="flex-1 outline-none"
              />
            </div>

            <Button type="submit" className="bg-black text-white w-full cursor-pointer">
              Create Account
            </Button>

           {/* Google login button */}
             {/* <Button
              type="button"
              onClick={handleGoogleLogin}
              className="bg-white hover:bg-white border border-gray-400 text-black w-full flex items-center justify-center gap-2 cursor-pointer"
            >
              <FcGoogle size={20} />
             Continue with Google
            </Button> */}


            <div className="flex mt-2 flex-col items-center text-black text-base">
              <span>Already have an account?</span>{" "}
              
                <a href="/login" className="text-blue-500">
                  Login here
                </a>
              
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
