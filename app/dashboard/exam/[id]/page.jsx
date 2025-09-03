'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { toast, Toaster } from 'sonner';
import Exams from '../components/Exams'; // adjust path based on your structure

const ExamDetailPage = () => {
  const { id } = useParams(); // dynamic route param
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/exams/${id}`);
        setExam(response.data);

        // Save examId to localStorage for use in exams.jsx
        localStorage.setItem('examId', response.data.id);
      } catch (error) {
        toast.error('Error fetching exam details!');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchExam();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;

  if (!exam) return <div className="p-6 text-red-600">Exam not found.</div>;

  return (
    <div className="p-6">
      {/* Exam Details
      <h1 className="text-3xl font-bold mb-2">{exam.title}</h1>
      <p className="text-gray-700 mb-6">
        Description: {exam.description || 'No description available.'}
      </p> */}

      {/* Render Exams component to manage questions */}
         <Toaster position="bottom-right" richColor />
      <Exams />
    </div>
  );
};

export default ExamDetailPage;
