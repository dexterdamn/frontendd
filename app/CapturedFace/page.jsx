"use client";

import { useEffect, useState } from "react";

export default function CapturedFace() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchCapturedImage = async () => {
      try {
        const res = await fetch("http://localhost:5000/student/recognize-test");
        const data = await res.json();

        if (!res.ok || !Array.isArray(data)) {
          setError("Invalid response from server.");
          return;
        }

        setStudents(data);
      } catch (error) {
        setError("❌ Server error: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCapturedImage();
  }, []);

  if (loading) return <div className="text-gray-600">Loading captured images...</div>;
  if (error) return <div className="text-red-500">⚠️ {error}</div>;
  if (students.length === 0) return <div className="text-red-500">No student images found.</div>;

  return (
    <div className="p-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {students.map((student, index) => (
        <div
          key={index}
          className="border p-4 rounded-md shadow-md flex flex-col items-center"
        >
          <img
            src={student.image}
            alt={`Captured face of ${student.name}`}
            className="w-70 h-70 object-cover rounded-md border"
          />
          <h2 className="mt-2 text-base font-medium text-gray-800 text-center">
            ✅ {student.name}
          </h2>
        </div>
      ))}
    </div>
  );
}
