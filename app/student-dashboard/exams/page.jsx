"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [token, setToken] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchExamsForStudent = async () => {
      const studentId = localStorage.getItem("studentId");
      const storedToken = localStorage.getItem("student_token");
      setToken(storedToken);

      if (!studentId) return;

      try {
        const res = await axios.get(`http://localhost:5000/student/${studentId}/exams`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        const examsWithDetails = await Promise.all(
          res.data.map(async (exam) => {
            let total_questions = 0;
            let score = null;

            try {
              const countRes = await axios.get(
                `http://localhost:5000/exams/${exam.id}/questions/count`,
                {
                  headers: {
                    Authorization: `Bearer ${storedToken}`,
                  },
                }
              );
              total_questions = countRes.data.total_questions;
            } catch (err) {
              console.warn(`No questions for exam ${exam.id}`);
            }

            if (exam.taken) {
              try {
                const resultRes = await axios.get(
                  `http://localhost:5000/student/${studentId}/results`,
                  {
                    headers: {
                      Authorization: `Bearer ${storedToken}`,
                    },
                  }
                );
                const result = resultRes.data.find(r => r.exam_id === exam.id);
                score = result?.score || null;
              } catch (err) {
                console.warn(`No result found for exam ${exam.id}`);
              }
            }

            return {
              ...exam,
              total_questions,
              score
            };
          })
        );

        setExams(examsWithDetails);
      } catch (err) {
        console.error("Error fetching exams for student:", err);
      }
    };

    fetchExamsForStudent();
  }, []);

  const handleJoinCode = async () => {
    if (!joinCode.trim()) {
      toast.error("Please enter a code.");
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/exams/code/${joinCode}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const exam = res.data;
      if (exam?.id) {
        router.push(`/start?exam_id=${exam.id}`);
      } else {
        toast.error("Invalid code.");
      }
    } catch (err) {
      toast.error("Invalid or expired join code.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-1 rounded-lg">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 px-4">
        <h1 className="text-2xl font-bold text-indigo-800 mb-4 md:mb-0">ASSESSMENTS</h1>
  
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            placeholder="Enter Code"
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleJoinCode}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-all"
          >
            Join
          </button>
        </div>
      </div>
  
      {exams.filter(exam => exam.taken).length === 0 ? (
        <p className="text-center text-gray-600 mt-10">No exams have been taken yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
          {exams.filter(exam => exam.taken).map((exam, index) => (
            <div
              key={exam.id || index}
              className="bg-white p-6 flex flex-col justify-between cursor-pointer rounded-lg shadow hover:shadow-lg transition-shadow duration-200 border border-blue-300 min-h-[230px] min-w-[250px]"
              onClick={() => {
                if (exam.taken) {
                  toast.error("You already took this exam.");
                } else {
                  router.push(`/start?exam_id=${exam.id}`);
                }
              }}
            >
              <div>
                <h2 className="text-xl font-semibold text-indigo-700 text-center mb-10">
                  {exam.title}
                </h2>
                <p className="text-gray-600 text-sm text-center mb-2">
                  {exam.description}
                </p>
              </div>
  
              <div className="flex justify-between text-sm text-gray-700 mt-4">
                <span>
                  Status:{" "}
                  <span className={exam.taken ? "text-green-600" : "text-red-500"}>
                    {exam.taken ? "Taken" : "Not Taken"}
                  </span>
                </span>
                <span>{exam.total_questions} Questions</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
};

export default Exams;
