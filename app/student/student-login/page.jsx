"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { toast } from "sonner";
import Webcam from "react-webcam";

export default function StudentLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [recognizedName, setRecognizedName] = useState("Waiting for face...");
  const [hasRecognized, setHasRecognized] = useState(false);
  const [similarity, setSimilarity] = useState(null);
  const [recognizedEmail, setRecognizedEmail] = useState("");
  const [loginStage, setLoginStage] = useState("idle"); // idle | loading | matchCheck | checkShow | done
  const webcamRef = useRef(null);
  const router = useRouter();
  const [liveKeypoints, setLiveKeypoints] = useState(null);
const [dbKeypoints, setDbKeypoints] = useState(null);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  // 👁 Capture face and send to backend for recognition
 const recognizeLiveFace = async () => {
  if (!webcamRef.current) return;
  const imageSrc = webcamRef.current.getScreenshot();
  if (!imageSrc) {
    setRecognizedName("No Face Detected");
    setSimilarity(null);
    setHasRecognized(false);
    return;
  }
  try {
    const response = await fetch("http://localhost:5000/student/recognize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageSrc }),
    });
    const data = await response.json();

    const newName = data?.name || "No Face Detected";
    const newSimilarity = data?.similarity ?? null;
    setRecognizedName(newName);
    setRecognizedEmail(data?.email || "");
    setSimilarity(newSimilarity);

    // 👇 Save keypoints automatically
    setLiveKeypoints(data?.live_keypoints || null);
    setDbKeypoints(data?.db_keypoints || null);

    const recognized = !["Student Not Registered", "No Face Detected", "Recognition Failed"].includes(newName);
    setHasRecognized(recognized);
  } catch (error) {
    console.error("Recognition failed:", error);
    setRecognizedName("Recognition Failed");
    setSimilarity(null);
    setHasRecognized(false);
  }
};

  useEffect(() => {
    const interval = setInterval(() => {
      recognizeLiveFace();
    }, 1000); // Every 1 second
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsMounted(true);
    localStorage.removeItem("student_token");
    localStorage.removeItem("student_id");

    const handlePopState = () => window.history.go(1);
    window.history.pushState(null, null, window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  if (!isMounted) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and password are required!");
      return;
    }


    // 🚫 Kapag walang face (No Face Detected)
  if (recognizedName === "No Face Detected") {
    toast.error("Face required for login. Please position your face in front of the camera.");
    return;
  }
  
    if (!hasRecognized || !similarity || similarity < 0.95) {
      toast.error("Student not registered.");
      return;
    }

    if (
      recognizedName &&
      !["No Face Detected", "Student Not Registered", "Recognition Failed"].includes(recognizedName)
    ) {
      if (recognizedEmail && recognizedEmail.toLowerCase().trim() !== email.toLowerCase().trim()) {
        toast.error("Email does not match recognized face student.");
        return;
      }
    }

    setLoginStage("loading");
    try {
      const response = await fetch("http://localhost:5000/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("studentEmail", data.email);
        localStorage.setItem("studentId", data.student_id);
        localStorage.setItem("firstName", data.first_name);
        localStorage.setItem("lastName", data.last_name);
        localStorage.setItem("student_token", data.token);

        setTimeout(() => {
          setLoginStage("matchCheck");
          setTimeout(() => {
            setLoginStage("checkShow");
            setTimeout(() => {
              setLoginStage("done");
              router.push("/student-dashboard");
            }, 1000); // Show check for 1 second
          }, 1000); // Show match percentage for 1 second
        }, 2000); // Initial loading delay
      } else {
        toast.error(data.error || "Student not registered.");
        setLoginStage("idle");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Server error. Please try again later.");
      setLoginStage("idle");
    }
  };

  return (
    <>
      {/* 🔄 Loading overlay */}
      {loginStage !== "idle" && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 z-50 transition-all">
          {/* Step 1: Loading Spinner */}
          {loginStage === "loading" && (
            <>
              <div className="animate-spin rounded-full h-24 w-24 border-8 border-blue-500 border-t-transparent mb-4"></div>
              <p className="text-xl font-semibold text-black">Analyzing face...</p>
              {recognizedName && similarity !== null && (
                <p
                  className={`mt-2 text-lg font-medium ${
                    similarity < 0.95 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {(similarity * 100).toFixed(2)}%{" "}
                  {similarity < 0.95 ? "Unmatch" : "Match"}
                </p>
              )}
            </>
          )}

          {/* Step 2: Match Summary Only */}
          {loginStage === "matchCheck" && (
            <p
              className={`text-xl font-semibold mt-4 ${
                similarity < 0.95 ? "text-red-600" : "text-green-600"
              }`}
            >
              {recognizedName} — {(similarity * 100).toFixed(2)}%{" "}
              {similarity < 0.96 ? "Unmatch" : "Match"}
            </p>
          )}

          {/* Step 3: Animated Check Icon */}
          {loginStage === "checkShow" && (
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full border-4 border-green-500 flex items-center justify-center shadow-lg">
                <svg
                  className="w-16 h-16 text-green-500"
                  viewBox="0 0 52 52"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14 27L22 35L38 19"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="100"
                    strokeDashoffset="100"
                    className="checkmark-path"
                  />
                </svg>
              </div>
              <p className="text-green-700 font-bold text-lg mt-4">
                Access Granted
              </p>
            </div>
          )}
        </div>
      )}

      <div className="w-screen bg-blue-100 h-screen">
        <div className="flex">
          {/* 📝 Login Form */}
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
                  STUDENT <span className="text-blue-700">LOGIN</span>
                </h1>
              </div>
              <form onSubmit={handleSubmit}>
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
                    className="bg-black text-white py-2 rounded-md text-center w-full cursor-pointer"
                  >
                    Login
                  </Button>
                  <div className="flex mt-2 flex-col items-center text-black text-base">
                    <span>Don't have an account?</span>
                    <a href="/student/create-account" className="text-blue-500">
                      Signup here
                    </a>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* 📸 Webcam + Overlay */}
          <div className="mt-40 ml-32">
            <div className="relative">
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="rounded-md border shadow-lg w-full max-w-[640px] h-[480px]"
              />
              {recognizedName && (
                <div
                  className={`absolute bottom-4 left-4 px-4 py-2 rounded-md text-lg font-bold shadow-lg ${
                    recognizedName === "Student Not Registered" ||
                    (similarity && similarity < 0.95)
                      ? "bg-red-600 text-white"
                      : recognizedName === "No Face Detected"
                      ? "bg-yellow-400 text-black"
                      : recognizedName === "Recognition Failed"
                      ? "bg-gray-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
{recognizedName === "No Face Detected" ? (
  <p>{recognizedName}</p>
) : (
  <div>
    <p>{recognizedName}</p>
    {similarity !== null && (
      <p className="text-sm font-light">
        ({(similarity * 100).toFixed(2)}%{" "}
        {recognizedName === "Student Not Registered" ||
        similarity < 0.95
          ? "Unmatch"
          : "Match"}
        )
      </p>
    )}
  </div>
)}

                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
