'use client';

import React, { useState, useEffect, useRef } from 'react';
import Webcam from "react-webcam";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from 'axios';
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";


const StudentExam = () => {

 
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState({});
  const [questions, setQuestions] = useState([]);
  const [isExamCompleted, setIsExamCompleted] = useState(false);
  const [examId, setExamId] = useState(null);
  const [noFaceDetected, setNoFaceDetected] = useState(false);
  const [eyeDirectionWarning, setEyeDirectionWarning] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [eyeData, setEyeData] = useState({});
  const router = useRouter();
  const [studentInfo, setStudentInfo] = useState({ firstName: '', lastName: '' });
  const webcamRef = useRef(null);
  const [recognizedName, setRecognizedName] = useState("Waiting for face...");
  const [similarity, setSimilarity] = useState(null);
  const [isStudentRegistered, setIsStudentRegistered] = useState(true);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [isAllowedStudent, setIsAllowedStudent] = useState(true);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const isRecognizingRef = useRef(false);
  
   const videoConstraints = {
    width: 320,
    height: 240,
    facingMode: "user", // use "environment" if gusto mo back cam
  };

function ConfettiAnimation() {
  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);
  return null;
}
//   useEffect(() => {
//   const interval = setInterval(() => {
//     recognizeStudentFace();
//   }, 1000); // run every second

//   return () => clearInterval(interval);
// }, []);


useEffect(() => {
  const video = videoRef.current;
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  // Load MJPEG stream from Flask
  const mjpegUrl = "http://localhost:5000/video";
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = mjpegUrl;

  img.onload = function draw() {
    const drawFrame = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      requestAnimationFrame(drawFrame);
    };
    drawFrame();
  };
}, []);


useEffect(() => {
  if (!examId) return;

  const interval = setInterval(() => {
    checkExamLockStatus(examId);
  }, 1000); // poll every second

  return () => clearInterval(interval);
}, [examId]);


useEffect(() => {
  const interval = setInterval(() => {
    recognizeStudentFace();
  }, 500); // faster response
  return () => clearInterval(interval);
}, []);

const recognizeStudentFace = async () => {
  if (isRecognizingRef.current) return;
  isRecognizingRef.current = true;

  try {
    const videoElement = document.getElementById("video-stream");
    const canvas = document.getElementById("video-canvas");
    if (!videoElement || !canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL("image/jpeg");

    const response = await fetch("http://localhost:5000/student/recognize/live", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageDataUrl }),
    });

    const data = await response.json();
    const recognized = data?.name || "No Face Detected";
    const similarity = data?.similarity ?? 0;
    const currentStudent = localStorage.getItem("student_name");

    setRecognizedName(recognized);
    setSimilarity(similarity);

    if (recognized === "Student Not Registered") {
      // ❌ Block immediately if not in DB
      setIsStudentRegistered(false);
      setIsAllowedStudent(false);
      setNoFaceDetected(false);
      return;
    }

    if (recognized === "No Face Detected") {
      setNoFaceDetected(true);
      setIsAllowedStudent(false);
      return;
    }

    if (recognized === currentStudent && similarity >= 0.93) {
      setIsStudentRegistered(true);
      setIsAllowedStudent(true);
      setNoFaceDetected(false);
      return;
    }

    // ❌ Any other recognized face (different student) = block
    setIsStudentRegistered(true);
    setIsAllowedStudent(false);
    setNoFaceDetected(false);

  } catch (error) {
    console.error("Recognition failed:", error);
    setRecognizedName("Recognition Failed");
    setSimilarity(null);
  } finally {
    isRecognizingRef.current = false;
  }
};


  useEffect(() => {
    const handlePopState = () => window.history.go(1);
    window.history.pushState(null, null, window.location.href);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

 useEffect(() => {
  const savedExamId = localStorage.getItem('examId');
  const id = localStorage.getItem('studentId');
  const firstName = localStorage.getItem('firstName');
  const lastName = localStorage.getItem('lastName');
  const storedLocked = localStorage.getItem(`examLocked_${savedExamId}`);

  if (id) {
    setStudentId(Number(id));
    setStudentInfo({ firstName, lastName });
    checkRegistration(Number(id));
  }

  if (savedExamId) {
    const numericExamId = Number(savedExamId);
    setExamId(numericExamId);
    fetchQuestions(numericExamId);
    checkExamLockStatus(numericExamId);
  }

  if (storedLocked === 'true') {
    setIsLocked(true);
  }
}, []);


  useEffect(() => {
    const handleStorageChange = () => {
      const locked = localStorage.getItem('examLocked') === 'true';
      setIsLocked(locked);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const checkRegistration = async (studentId) => {
    try {
      const response = await axios.get(`http://localhost:5000/student/register/${studentId}`);
      if (!response.data) {
        toast.error("You are not registered.");
        router.push("/login");
      }
    } catch {
      toast.error("Error checking registration.");
    }
  };

const checkExamLockStatus = async (examId) => {
  try {
    const response = await axios.get(`http://localhost:5000/exams/${examId}`);
    setIsLocked(response.data.locked);
    localStorage.setItem(`examLocked_${examId}`, response.data.locked ? 'true' : 'false');
  } catch (error) {
    console.error("Error checking lock status:", error);
  }
};


  const fetchQuestions = async (examId) => {
    try {
      const response = await axios.get(`http://localhost:5000/questions/exam/${examId}`);
      setQuestions(response.data);
      if (response.data.length > 0) setCurrentQuestion(0);
    } catch {
      toast.error("Error fetching exam questions.");
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isLocked) return; // ❌ Don't fetch if exam is locked
      try {
        const res = await fetch('http://localhost:5000/face-status');
        const data = await res.json();
        setNoFaceDetected(!data.face_detected);
        setEyeDirectionWarning(data.face_detected && ['left', 'right', "down"].includes(data.eye_direction));
        setEyeData(data);
      } catch (err) {
        console.error('Error fetching face status:', err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLocked]);

  const handleOptionSelect = (option) => {
    setSelectedOption(prev => {
      const updated = { ...prev, [currentQuestion]: option };
      localStorage.setItem('selectedOption', JSON.stringify(updated));
      return updated;
    });
  };

  const handleNextQuestion = () => {
    if (!selectedOption[currentQuestion]) {
      toast.error("Please select an option before proceeding.");
      return;
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsExamCompleted(true);
      handleSubmitExam();
    }
    localStorage.setItem('currentQuestion', currentQuestion + 1);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      localStorage.setItem('currentQuestion', currentQuestion - 1);
    }
  };
const handleSubmitExam = async () => {
  // check kung lahat ng tanong may sagot
  if (Object.keys(selectedOption).length < questions.length) {
    toast.error("Please answer all questions before submitting.");
    return;
  }

  const score = calculateScore();
  const totalQuestions = questions.length;
  const eyeMovements = JSON.stringify(eyeData);

  if (studentId === null) {
    toast.error("Student ID is not set.");
    return;
  }

  try {
    const res = await axios.post('http://localhost:5000/results/student', {
      student_id: studentId,
      exam_id: examId,
      score: `${score}/${totalQuestions}`, 
      eye_movements: eyeMovements,
      first_name: studentInfo.firstName,
      last_name: studentInfo.lastName
    });

    const result = res.data;

    localStorage.setItem('firstName', result.first_name || studentInfo.firstName);
    localStorage.setItem('lastName', result.last_name || studentInfo.lastName);

    setShowSuccessAnimation(true);
    setTimeout(() => {
      router.push("/thank-you");
    }, 3000);
  } catch (error) {
    toast.error('Error submitting results: ' + (error.response?.data.error || error.message));
  }
};



const calculateScore = () => {
  return questions.reduce((score, question, index) => {
    return selectedOption[index] === question.answer ? score + 1 : score;
  }, 0);
};


// useEffect(() => {
//   if (!examId) return;

//   const fetchQuestions = async () => {
//     const res = await axios.get(`http://localhost:5000/exams/${examId}/questions`);
//     setQuestions(res.data);
//   };

//   fetchQuestions();
// }, []);




  return (
    <div style={{ backgroundColor: "#CCD9FC" }} className="flex flex-col justify-center min-h-screen p-4 relative font-sans">
     {(isLocked || noFaceDetected || eyeDirectionWarning || !isStudentRegistered) && (
  <div
    style={{
      backgroundColor: 'black',
      zIndex: 1000,
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <div className="space-y-4">
      {isLocked && (
        <Alert variant="destructive" className="bg-red-900 max-w-md mx-auto px-4 py-2 border border-white rounded-lg text-white text-center">
          <AlertCircle className="h-6 w-6 mx-auto" />
          <AlertTitle className="text-3xl font-bold">Exam locked by admin</AlertTitle>
        </Alert>
      )}

      {!isLocked && noFaceDetected && (
        <Alert variant="destructive" className="bg-red-900 max-w-md mx-auto px-4 py-2 border border-white rounded-lg text-white text-center">
          <AlertCircle className="h-6 w-6 mx-auto" />
          <AlertTitle className="text-3xl font-bold">Face not detected.</AlertTitle>
        </Alert>
      )}

      {!isLocked && (
  <>
    {eyeDirectionWarning ? (
      <Alert
        variant="destructive"
        className="bg-red-900 max-w-2xl mx-auto px-8 py-10 border border-white rounded-2xl text-white text-center shadow-xl"
      >
        <AlertCircle className="h-6 w-6 mx-auto mb-4" />
        <AlertTitle className="text-white text-xl md:text-3xl font-bold px-4 leading-snug">
          Please stay in front of the camera.
        </AlertTitle>
      </Alert>
    ) : (
      !isLocked && !noFaceDetected && !isAllowedStudent && (
        <Alert
        variant="destructive"
        className="bg-red-900 max-w-2xl mx-auto px-8 py-10 border border-white rounded-2xl text-white text-center shadow-xl"
      >
        <AlertCircle className="h-12 w-12 mx-auto mb-4" />
        <AlertTitle className="text-white text-xl md:text-3xl font-bold px-4 leading-snug">
          You are not allowed to take this exam
        </AlertTitle>
      </Alert>
      
      )
    )}


  </>
)}

    </div>
  </div>
)}

{/* --- Quizizz style success screen --- */}
{showSuccessAnimation && (
  <div className="fixed inset-0 flex flex-col items-center justify-center z-[9999] bg-white">
    {/* Animated checkmark + text */}
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 10 }}
      className="flex flex-col items-center"
    >
      {/* <div className="w-24 h-24 flex items-center justify-center rounded-full bg-green-500 text-white shadow-lg">
        <AlertCircle className="w-12 h-12" />
      </div> */}
      <h1 className="mt-6 text-6xl font-bold text-green-600">ALL DONE!</h1>
      {/* <p className="text-gray-600 mt-2 text-lg">Results submitted successfully 🎉</p> */}
    </motion.div>

    {/* Trigger confetti on mount */}
    <ConfettiAnimation />
  </div>
)}


      {!isExamCompleted ? (
      <div className="flex flex-col w-full h-full space-y-6">
  {/* Questions (top, full width) */}
<div className="rounded-lg shadow-lg p-6 bg-[#f5f5f5] text-black text-4xl font-bold h-[400px]">
    <h3 className="text-5xl font-bold mt-40">{questions[currentQuestion]?.question}</h3>
  </div>

  {/* Bottom section: Choices (left) + Webcam (right) */}
  <div className="flex flex-row justify-between w-full space-x-6">
    {/* Choices (left side) */}
<div className="flex-1 rounded-lg shadow-lg p-6 bg-[#f5f5f5] space-y-4 h-[300px]">
      {['A', 'B', 'C', 'D'].map((letter) => {
        const optionKey = `choice${letter}`;
        return (
          <div key={letter} className="flex items-center">
            <input
              type="radio"
              name={`question-${currentQuestion}`}
              value={questions[currentQuestion]?.[optionKey]}
              checked={selectedOption[currentQuestion] === letter}
              onChange={() => handleOptionSelect(letter)}
              className="mr-3 w-4 h-4"
            />
            <label className="text-lg font-semibold">
              {questions[currentQuestion]?.[optionKey]}
            </label>
          </div>
        );
      })}

      {/* Buttons */}
      <div className="flex justify-between mt-6 cursor-pointer">
        {currentQuestion > 0 && (
          <Button
            onClick={handlePreviousQuestion}
            className="bg-gray-300 text-black hover:bg-gray-400 cursor-pointer"
          >
            Back
          </Button>
        )}
        {currentQuestion === questions.length - 1 ? (
          <Button
            onClick={handleSubmitExam}
            className="bg-green-500 text-white hover:bg-green-600 cursor-pointer"
          >
            Submit
          </Button>
        ) : (
          <Button
            onClick={handleNextQuestion}
            className="bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
          >
            Next
          </Button>
        )}
      </div>
    </div>

    {/* Webcam (right side) */}
    <div className="w-[320px] h-[250px] rounded-lg shadow-lg bg-[#f5f5f5] relative overflow-hidden">
  <video
    id="video-stream"
    ref={videoRef}
    autoPlay
    playsInline
    muted
    className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
  />
  <canvas
    id="video-canvas"
    ref={canvasRef}
    width="320"
    height="240"
    className="absolute top-0 left-0 w-full h-full rounded-lg"
  />

      {recognizedName &&
        recognizedName !== "Recognition Failed" &&
        recognizedName !== "No Face Detected" && (
          <div
            className={`absolute bottom-2 left-2 px-3 py-1 rounded-md text-sm font-bold shadow-lg ${
              recognizedName === "Student Not Registered" ||
              (similarity && similarity < 0.92)
                ? "bg-red-600 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            <p>{recognizedName}</p>
            {similarity && (
              <p className="text-xs font-light">
                ({(similarity * 100).toFixed(2)}%{" "}
                {recognizedName === "Student Not Registered"
                  ? "unmatch"
                  : "match"}
                )
              </p>
            )}
          </div>
        )}
    </div>
  </div>
</div>




        
      ) : (
        <div>{/* Thank you or summary page */}</div>
      )}
    </div>
  );
};

export default StudentExam;
