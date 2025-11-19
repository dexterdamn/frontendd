"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";

export default function StartButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const examId = searchParams.get("exam_id");

  const [examReady, setExamReady] = useState(false);

  const handleStart = () => {
    if (!examReady) {
      toast.error("The exam is locked. Please wait for the admin to unlock it.");
      return;
    }
    router.push("/student-exam");
  };

  const handleBack = () => {
    router.push("/student-dashboard"); // Go directly to student dashboard
  };

  const checkExamReady = () => {
    if (!examId) return;

    const locked = localStorage.getItem(`examLocked_${examId}`) === "true";
    const ready = localStorage.getItem(`examReady_${examId}`) === "true";

    // START button only enabled if exam is ready and not locked
    setExamReady(ready && !locked);
  };

  useEffect(() => {
    if (examId) {
      localStorage.setItem("examId", examId);
    }

    checkExamReady();

    const handleStorageChange = () => checkExamReady();
    const handleVisibilityChange = () => {
      if (!document.hidden) checkExamReady();
    };

    window.addEventListener("storage", handleStorageChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [examId]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-100 p-4 font-sans relative">
      {/* Back Button */}
      <div className="absolute top-6 left-6">
        <Button
          onClick={handleBack}
          className="bg-white cursor-pointer text-blue-600 border border-blue-600 
                   hover:bg-white hover:text-blue transition-all duration-300 ease-in-out 
                   rounded-2 px-5 py-5 shadow-md transform hover:-translate-x-1"
        >
          <span className="text-2xl mr-1">←</span>
          <span className="text-base sm:text-lg">Back</span>
        </Button>
      </div>

      {/* Start Button */}
      <div className="flex flex-col items-center space-y-4">
        <Button
          onClick={handleStart}
          disabled={!examReady}
          className={`text-4xl py-9 px-6 rounded-lg transition-all duration-200 cursor-pointer ${
            examReady
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-400 text-white cursor-not-allowed"
          }`}
        >
          START
        </Button>
      </div>

      <Toaster />
    </div>
  );
}
