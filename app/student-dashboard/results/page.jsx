'use client';

import { useEffect, useState } from "react";
import axios from "axios";

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

const fetchResults = async () => {
  const token = localStorage.getItem("student_token");

  if (!token || token === "undefined") {
    console.warn("Missing or invalid student token");
    setLoading(false);
    return;
  }

  try {
    const response = await axios.get("http://localhost:5000/results/student-summary", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

      const data = response.data;
      if (!Array.isArray(data)) {
        console.warn("Unexpected response format");
        setLoading(false);
        return;
      }

      setResults(data.map((result) => ({
        title: result.title?.trim() || "Untitled",
        description: result.description || "No description",
        date_taken: result.date_taken || "N/A",
        score: result.score === null ? "Pending" : result.score,
        total_questions: result.total_questions ?? "N/A"
      })));
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults(); // initial fetch
    const interval = setInterval(fetchResults, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">EXAM RESULTS</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading results...</p>
      ) : results.length === 0 ? (
        <p className="text-center text-gray-500">No results yet. Please wait for your admin to send them.</p>
      ) : (
        <div className="overflow-x-auto ">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden ">
            <thead className="bg-indigo-100 text-indigo-800 ">
              <tr>
                <th className="text-left py-3 px-4 ">Exam Taken</th>
                {/* <th className="text-left py-3 px-4"></th> */}
                <th className="text-left py-3 px-4">Date Taken</th>
                <th className="text-left py-3 px-4">Score</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index} className="border-t hover:bg-indigo-60">
                  <td className="py-5 px-4 font-semibold text-indigo-800">  <div className="flex flex-col">
                      <span>{result.title}</span>
                      <span>{result.description}</span>
                    </div>
                  </td>
                  {/* <td className="py-3 px-4 text-gray-600">{result.description}</td> */}
                  <td className="py-3 px-4 text-gray-600">
                    {result.date_taken !== "N/A"
                      ? new Date(result.date_taken).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="py-3 px-4">
                    <span className={
                      result.score === "Pending"
                        ? "text-gray-400 italic"
                        : "font-semibold text-green-700"
                    }>
                      {result.score === "Pending"
                        ? "Pending"
                        : `${result.score} / ${result.total_questions}`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Results;
