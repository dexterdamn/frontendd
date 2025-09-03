"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { toast } from "sonner";
import Webcam from "react-webcam";

export default function CreateAccountPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const webcamRef = useRef(null);
  const router = useRouter();

  const videoConstraints = { width: 640, height: 480, facingMode: "user" };

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const capturePhoto = () => {
    const imageSrc = webcamRef.current?.getScreenshot?.();
    if (!imageSrc) {
      toast.error("Failed to capture image.");
      return;
    }
    setCapturedImage(imageSrc); // data:image/jpeg;base64,....
    setImageError(false);
    toast.success("Photo captured!");
  };

  const retakePhoto = () => setCapturedImage(null);

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const f = firstName.trim();
    const l = lastName.trim();
    const g = gender.trim();
    const em = email.trim().toLowerCase();

    if (!f || !l || !g || !em || !password || !confirmPassword) {
      toast.error("All fields are required!");
      return;
    }
    if (!capturedImage) {
      setImageError(true);
      toast.error("Please capture your photo!");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch("http://localhost:5000/student/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: f,
          last_name: l,
          gender: g,
          email: em,
          password,
          confirm_password: confirmPassword,
          image: capturedImage, // backend extracts landmarks from this
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Account created successfully!");
        router.push("/student");
      } else {
        toast.error(data.error || "Registration failed.");
      }
    } catch (err) {
      console.error("Register error:", err);
      toast.error("Server error. Try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-blue-100 flex items-center justify-center px-4 py-10">
      <div className="flex flex-col md:flex-row gap-10 w-full max-w-7xl">
        {/* LEFT: FORM */}
        <form
          onSubmit={handleCreateAccount}
          className="w-full md:w-[40%] flex flex-col gap-3 bg-white p-6 rounded-lg shadow-lg"
        >
          <h1 className="text-4xl font-bold text-center mb-2">
            Create <span className="text-blue-700">Account</span>
          </h1>

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

          <div className="border border-gray-900 rounded-md p-3">
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

          {!capturedImage && imageError && (
            <p className="text-red-500 mt-1 text-sm">
              Please capture your photo before creating an account.
            </p>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="bg-black text-white w-full cursor-pointer disabled:opacity-60"
          >
            {submitting ? "Creating..." : "Create Account"}
          </Button>

          <div className="text-center mt-3 text-sm text-gray-700">
            Already have an account?{" "}
            <a href="/student" className="text-blue-600">
              Login here
            </a>
          </div>
        </form>

        {/* RIGHT: WEBCAM PREVIEW */}
        <div className="w-full md:w-[60%] flex flex-col items-center justify-center">
          {!capturedImage ? (
            <>
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="rounded-md w-full h-[600px] object-cover shadow-md"
              />
              <Button
                type="button"
                onClick={capturePhoto}
                className="mt-4 bg-black hover:bg-black border border-gray-400 text-white cursor-pointer"
              >
                Take Photo
              </Button>
            </>
          ) : (
            <>
              <img
                src={capturedImage}
                alt="Captured"
                className="rounded-md w-full h-[600px] object-cover shadow-md"
              />
              <Button
                type="button"
                onClick={retakePhoto}
                className="mt-4 bg-red-600 hover:bg-red border border-gray-400 text-white cursor-pointer"
              >
                Retake Photo
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
