'use client';

import React, { useState, useEffect, useRef } from 'react';
import Webcam from "react-webcam";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from 'axios';
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

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



  useEffect(() => {
  const interval = setInterval(() => {
    recognizeStudentFace();
  }, 1000); // run every second

  return () => clearInterval(interval);
}, []);

useEffect(() => {
  if (!examId) return;

  const interval = setInterval(() => {
    checkExamLockStatus(examId);
  }, 1000); // poll every second

  return () => clearInterval(interval);
}, [examId]);


const recognizeStudentFace = async () => {
  const videoElement = document.getElementById("video-stream");
  const canvas = document.getElementById("video-canvas");

  if (!videoElement || !canvas) return;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  const imageDataUrl = canvas.toDataURL("image/jpeg");

  try {
    const response = await fetch("http://localhost:5000/student/recognize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageDataUrl }),
    });

    const data = await response.json();
    const newName = data?.name || "No Face Detected";
    const newSimilarity = data?.similarity ?? null;

    setRecognizedName(newName);
    setSimilarity(newSimilarity);

    const notRegistered = newName === "Student Not Registered" || (newSimilarity && newSimilarity < 0.92);
    setIsStudentRegistered(!notRegistered);

  } catch (error) {
    console.error("Recognition failed:", error);
    setRecognizedName("Recognition Failed");
    setSimilarity(null);
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
      score: `${score}/${totalQuestions}`, // ✅ string format "3/4"
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
    <div style={{ backgroundColor: "#CCD9FC" }} className="flex flex-col justify-center min-h-screen p-4 relative">
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
    {eyeDirectionWarning && (
      <Alert
        variant="destructive"
        className="bg-red-900 max-w-md mx-auto px-4 py-5 border border-white rounded-lg text-white text-center"
      >
        <AlertCircle className="h-6 w-6 mx-auto" />
        <AlertTitle className="text-white sm:text-base md:text-lg lg:text-2xl font-bold px-2">
          Please stay in front of the camera.
        </AlertTitle>
      </Alert>
    )}

    {!eyeDirectionWarning && !isStudentRegistered && (
      <Alert
        variant="destructive"
        className="bg-red-900 max-w-md mx-auto px-4 py-5 border border-white rounded-lg text-white text-center"
      >
        <AlertCircle className="h-6 w-6 mx-auto" />
        <AlertTitle className="text-white text-2xl font-bold px-2">
          Student Not Registered
        </AlertTitle>
      </Alert>
    )}
  </>
)}

    </div>
  </div>
)}

{showSuccessAnimation && (
  <div className="fixed inset-0 flex flex-col items-center justify-center z-[9999] bg-transparent">
    <svg
      className="animate-bounce-check"
      width="100"
      height="100"
      viewBox="0 0 52 52"
    >
      <circle
        cx="26"
        cy="26"
        r="25"
        fill="none"
        stroke="#4CAF50"
        strokeWidth="4"
      />
      <path
        className="checkmark-path"
        fill="none"
        stroke="#4CAF50"
        strokeWidth="4"
        d="M14 27l7 7 16-16"
        strokeDasharray="40"
        strokeDashoffset="40"
      />
    </svg>
    <p className="text-green-600 text-2xl mt-4 font-bold">Results submitted successfully!</p>
  </div>
)}


      {!isExamCompleted ? (
        <div className="flex">
          <div className="flex-1 space-y-12">
            <div style={{ width: '170%', height: 250, backgroundColor: "#A3ADC9" }} className="rounded-lg shadow-lg p-20 text-black text-4xl font-bold">
              <h3>{questions[currentQuestion]?.question}</h3>
            </div>

            <div style={{ height: 470, backgroundColor: "#A3ADC9" }} className="rounded-lg shadow-lg p-20 space-y-8">
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
                      className="mr-6 w-4 h-4"
                    />
                    <label className="text-xl">{questions[currentQuestion]?.[optionKey]}</label>
                  </div>
                );
              })}

              <div className="flex justify-between mt-8">
                {currentQuestion > 0 && (
                  <Button onClick={handlePreviousQuestion} className="bg-gray-500 text-white hover:bg-gray-600 cursor-pointer">Back</Button>
                )}
                {currentQuestion === questions.length - 1 ? (
                  <Button onClick={handleSubmitExam} className="bg-green-500 text-white hover:bg-green-600 cursor-pointer">Submit</Button>
                ) : (
                  <Button onClick={handleNextQuestion} className="bg-blue-500 text-white hover:bg-blue-600 cursor-pointer">Next</Button>
                )}
              </div>
            </div>
          </div>

        <div className="flex-col items-center ml-6">
  <div className="mt-80 relative">
    <img
      id="video-stream"
      src="http://localhost:5000/video"
      alt="Webcam Feed"
      className="rounded-lg shadow-lg w-full max-w-[640px] h-[480px]"
      crossOrigin="anonymous"
    />
    <canvas id="video-canvas" width="640" height="480" style={{ display: "none" }} />
    
    {recognizedName &&
      recognizedName !== "Recognition Failed" &&
      recognizedName !== "No Face Detected" && (
        <div
          className={`absolute bottom-4 left-4 px-4 py-2 rounded-md text-lg font-bold shadow-lg ${
            recognizedName === "Student Not Registered" || (similarity && similarity < 0.92)
              ? "bg-red-600 text-white"
              : "bg-green-500 text-white"
          }`}
        >
          <p>{recognizedName}</p>
          {similarity && (
            <p className="text-sm font-light">
              ({(similarity * 100).toFixed(2)}%{" "}
              {recognizedName === "Student Not Registered" ? "unmatch" : "match"})
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
