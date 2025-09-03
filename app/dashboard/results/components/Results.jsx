'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

const Results = () => {
  const router = useRouter();
  const [results, setResults] = useState([]);
  const [examOptions, setExamOptions] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [examTitle, setExamTitle] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchExamTitle = async (id) => {
    if (!id || isNaN(id)) return;
    try {
      const res = await fetch(`http://localhost:5000/exams/${id}`);
      const data = await res.json();
      setExamTitle(data.title);
    } catch (err) {
      console.error("Failed to fetch exam title", err);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedExamId = localStorage.getItem('examId');
      if (savedExamId) {
        setSelectedExamId(savedExamId);
        fetchExamTitle(savedExamId);
      }
      setIsLoaded(true);
    }
  }, []);

  const fetchExams = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("No token found. Please login again.");
        return;
      }

      const response = await fetch('http://localhost:5000/exams', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setExamOptions(data);
    } catch (error) {
      toast.error('Failed to fetch exam titles');
      console.error("Error fetching exams:", error);
    }
  };

  const fetchResults = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authorization token is missing.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/results", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        toast.error(`Error ${response.status}: ${errorText}`);
        return;
      }

      const rawResults = await response.json();

      if (!Array.isArray(rawResults)) {
        toast.error("Invalid results format from server.");
        return;
      }

      const resultsWithQuestions = await Promise.all(
        rawResults.map(async (result) => {
          let parsedMovements = {};
          try {
            parsedMovements = result.eye_movements
              ? JSON.parse(result.eye_movements)
              : {};
          } catch {
            console.warn("Invalid eye_movements JSON");
          }

          let totalQuestions = 0;
          try {
            if (result.exam_id) {
              const examRes = await fetch(
                `http://localhost:5000/exams/${result.exam_id}/questions/count`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (examRes.ok) {
                const examData = await examRes.json();
                totalQuestions = examData.total_questions || 0;
              }
            }
          } catch (err) {
            console.error(`Failed to fetch questions for exam ${result.exam_id}`, err);
          }

          let numericScore = result.score;

// If result.score is a string like '2/4', extract the numeric part
if (typeof result.score === 'string' && result.score.includes('/')) {
  const [scored] = result.score.split('/');
  numericScore = parseInt(scored);
}

return {
  ...result,
  score: numericScore,
  total_questions: totalQuestions,
  eye_movements: parsedMovements,
};
        })
      );

      setResults(resultsWithQuestions);
    } catch (error) {
      console.error("Error fetching results:", error.message);
      toast.error("Unexpected error while fetching results.");
    }
  };

  useEffect(() => {
    fetchExams();
    fetchResults();
  }, []);

  const filteredResults = selectedExamId
    ? results.filter((r) => r.exam_id === parseInt(selectedExamId))
    : results;

  const numberOfStudents = filteredResults.length;
  const averageScore =
    numberOfStudents > 0
      ? (
          filteredResults.reduce((sum, result) => sum + result.score, 0) / numberOfStudents
        ).toFixed(2)
      : '0.00';

  const cheatingCount = filteredResults.filter(
    (r) =>
      r.eye_movements?.percentages?.left > 20 ||
      r.eye_movements?.percentages?.right > 20 ||
      r.eye_movements?.percentages?.down > 15
  ).length;

  return (
    <div className="p-4 sm:p-6 lg:p-3">
      <h1 className="text-2xl font-semibold text-black dark:text-white mb-4">
        RESULTS
      </h1>

      {/* ✅ Dropdown Filter */}
      <div className="mb-6 px-4">
        <label className="mr-2 font-semibold text-black dark:text-white">
          Select Exam:
        </label>
        <select
          value={selectedExamId}
          onChange={(e) => {
            const examId = e.target.value;
            setSelectedExamId(examId);
            localStorage.setItem('examId', examId);
            if (examId) fetchExamTitle(examId);
          }}
          className="border rounded p-1 cursor-pointer"
        >
          
          <option className="dark:text-black cursor-pointer" value="">
            -- Exam Summary --
          </option>
          {examOptions.map((exam) => (
            <option key={exam.id} value={exam.id}>
              {exam.title}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ Summary Cards */}
      {isLoaded && !selectedExamId && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 mb-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl p-20 text-center shadow-lg">
            <h2 className="text-xl font-bold text-black dark:text-white">👩‍🎓 Students Taken</h2>
            <p className="text-2xl font-semibold">{numberOfStudents}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl p-20 text-center shadow-lg">
            <h2 className="text-xl font-bold text-black dark:text-white">📈 Avg. Score</h2>
            <p className="text-2xl font-semibold">{averageScore}</p>
          </div>
          {/* <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl p-20 text-center shadow-lg">
            <h2 className="text-xl font-bold text-black dark:text-white">⚠️ Cheating Count</h2>
            <p className="text-2xl text-red-600 font-semibold">{cheatingCount}</p>
          </div> */}
        </div>
      )}

      {/* ✅ Results Table and Send Button */}
      {selectedExamId && (
        <>
          <div className="flex items-center justify-between px-2 ml-75 -mt-15 mb-6 ">
          <Button
  className="cursor-pointer"
  onClick={async () => {
    try {
      const token = localStorage.getItem("token");
      if (!selectedExamId || !token) {
        toast.error("Exam not selected or token missing.");
        return;
      }

      if (filteredResults.length === 0) {
        toast.error("No student results available to send.");
        return;
      }

      const response = await fetch("http://localhost:5000/results/send-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ exam_id: selectedExamId }),
      });
      
      const data = await response.json();
      
      if (response.status === 409) {
        toast.error(data.message || "No new results to send.");
        return;
      }
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to send result.");
      }
      
      toast.success(`Results sent to ${data.total_students} students for "${data.exam_title}"`);      
    } catch (error) {
      console.error("Send summary error:", error);
      toast.error("Error sending result.");
    }
  }}
>
  Send Result
</Button>



          </div>

          <div className="px-4 overflow-auto">
            <table className="min-w-full border-collapse border border-gray-600 bg-white dark:bg-gray-800">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="border border-gray-600 px-4 py-2">Student ID</th>
                  <th className="border border-gray-600 px-4 py-2">Name</th>
                  <th className="border border-gray-600 px-4 py-2">Score</th>
                  <th className="border border-gray-600 px-4 py-2">Eye Movement</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((result) => (
                  <tr key={result.result_id}>
                    <td className="border px-4 py-2 text-center">{result.student_id}</td>
                    <td className="border px-4 py-2 text-center">
                      {result.first_name} {result.last_name}
                    </td>
                    <td className="border px-4 py-2 text-center">
                    {result.score} / {result.total_questions}

                    </td>
                    <td className="border px-4 py-2 text-center">
                      <p><strong>Center:</strong> {result.eye_movements?.percentages?.center?.toFixed(2) || 0}%</p>
                      <p><strong>Left:</strong> {result.eye_movements?.percentages?.left?.toFixed(2) || 0}%</p>
                      <p><strong>Right:</strong> {result.eye_movements?.percentages?.right?.toFixed(2) || 0}%</p>
                      <p><strong>Down:</strong> {result.eye_movements?.percentages?.down?.toFixed(2) || 0}%</p>
                      <div className="mt-2 text-sm">
                        {(() => {
                          const { center = 0, left = 0, right = 0, down = 0 } =
                            result.eye_movements?.percentages || {};
                          const isCheating =
                            (left > 20 || right > 20 || down > 15) && center < 75;

                          return isCheating ? ( <>
                            <span className="text-red-600 font-semibold">
                              ⚠️ Cheating Behavior Detected
                            </span>
                            <div className="text-xs text-gray-700 mt-1 italic">
                              Center below 75% or too much movement
                            </div>
                          </> 
                          ) : (
                            <span className="text-green-600 font-semibold">
                              ✔️ Normal Behavior
                            </span>
                          );
                        })()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Results;


