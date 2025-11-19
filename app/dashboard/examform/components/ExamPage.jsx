"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ExamFormModal from "./ExamFormModal";
import { Button } from "@/components/ui/button";
import { FaExternalLinkAlt, FaEdit, FaTrash, FaEllipsisV } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ExamPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [exams, setExams] = useState([]);
  const [editingExam, setEditingExam] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [hoveredExamId, setHoveredExamId] = useState(null);
  const router = useRouter();
  const menuRef = useRef();

  // ✅ FETCH EXAMS
const fetchExams = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found. Please login again.");
      return;
    }

    const response = await axios.get("http://localhost:5000/exams", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const examsWithCounts = await Promise.all(
      response.data.map(async (exam) => {
        let total_questions = 0;
        try {
          const countRes = await axios.get(
            `http://localhost:5000/exams/${exam.id}/questions/count`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          total_questions = countRes.data.total_questions;
        } catch (err) {
          console.warn(`Error fetching question count for exam ${exam.id}`);
        }

        return {
          ...exam,
          total_questions,
        };
      })
    );

    setExams(examsWithCounts);
  } catch (error) {
    console.error("Error fetching exams:", error);
    toast.error("Error fetching exams!");
  }
};

  

  useEffect(() => {
    fetchExams();
  }, []);

  // ✅ CREATE OR EDIT EXAM
const handleCreateExam = async (newExam) => {
  const isDuplicate = exams.some(
    (exam) => exam.title === newExam.title && exam.id !== editingExam?.id
  );
  if (isDuplicate) {
    toast.error("Exam title must be unique!");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    if (editingExam) {
      const updated = {
        ...editingExam,
        title: newExam.title,
        description: newExam.description,
      };

      await axios.put(
        `http://localhost:5000/admin/exams/${editingExam.id}`,
        updated,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setExams((prev) =>
        prev.map((exam) =>
          exam.id === editingExam.id ? { ...exam, ...updated } : exam
        )
      );

      toast.success("Exam updated successfully!");
    } else {
      const response = await axios.post(
        "http://localhost:5000/exams",
        newExam,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await fetchExams();

      toast.success("Exam created successfully!");
    }
  } catch (error) {
    toast.error("Error saving exam. Check your backend or network.");
  } finally {
    setModalOpen(false);
    setEditingExam(null);
  }
};



  // ✅ DELETE EXAM
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
await axios.delete(`http://localhost:5000/admin/exams/${id}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

      toast.success("Exam deleted successfully!");

      // ✅ Refresh list after deletion
      await fetchExams();

      // ✅ Stay on same page, no redirect needed
    } catch (error) {
      toast.error("Error deleting exam!");
    }
  };

  const handleEditExam = (exam) => {
    setEditingExam(exam);
    setModalOpen(true);
    setMenuOpen(null);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") setMenuOpen(null);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const handleExamClick = async (exam, event) => {
    if (event?.defaultPrevented) return; // block if child button already used event

    try {
      const currentDate = new Date().toISOString();
     const token = localStorage.getItem("token");
await axios.put(`http://localhost:5000/admin/exams/${exam.id}`, {
  ...exam,
  lastOpened: currentDate,
}, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

      await fetchExams();
      router.push(`/dashboard/exam/${exam.id}`);
    } catch (error) {
      toast.error("Error opening exam.");
    }
  };

  return (
    <div className="p-6 font-sans">
          <h1 className="text-xl self-center font-bold text-black dark:text-white mb-4">
        Exam
      </h1>
   
      
      <div className="flex mb-4 ">
        <div className="  ">
          <Button
            onClick={() => {
              setEditingExam(null);
              setModalOpen(true);
            }}
              className=" bg-black text-white rounded-md py-2 px-4 hover:bg-gray-900 cursor-pointer dark:bg-gray-900"

          >
           Create Exam
          </Button>
        </div>
      </div>
      
      {isModalOpen && (
        <ExamFormModal
          exam={editingExam}
          onCreate={handleCreateExam}
          onClose={() => setModalOpen(false)}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

        {exams.map((exam) => (
         <div
         key={exam.id}
         className={`border ${
           hoveredExamId === exam.id ? "border-blue-500" : "border-gray-300"
         } p-4 w-72 h-48 text-center space-y-3 text-xl rounded-md shadow-md cursor-pointer`}
         onClick={(e) => handleExamClick(exam, e)}
         onMouseEnter={() => setHoveredExamId(exam.id)}
         onMouseLeave={() => setHoveredExamId(null)}
       >
         <h3 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
           {exam.title}
         </h3>
         <p className="text-base text-gray-700 dark:text-gray-500 truncate">
           {exam.description}
         </p>
         <p className="text-lg">
           {exam.lastOpened
             ? new Date(exam.lastOpened).toLocaleDateString()
             : new Date().toLocaleDateString()}
         </p>
        


            <div className="relative flex justify-end ">
            <p className="text-sm text-blue-500 mr-30">
            Questions: {exam.total_questions}
         </p>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMenuOpen(menuOpen === exam.id ? null : exam.id);
                }}
                className="p-2 cursor-pointer"
              >
                <FaEllipsisV />
              </button>

              {menuOpen === exam.id && (
                <div
                  ref={menuRef}
                  className="absolute right-1 mt-2 bg-white border rounded shadow-lg z-10 "
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link href={`/dashboard/exam/${exam.id}`}>
                    <Button className="flex items-center p-2 border bg-white text-black rounded w-full gap-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-400">
                      <FaExternalLinkAlt className=" mr-1" /> View
                    </Button>
                  </Link>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      handleEditExam(exam);
                    }}
                    className="flex items-center p-2 border bg-white text-black rounded w-full gap-2 cursor-pointer ml-0 hover:bg-gray-300 dark:hover:bg-gray-400"
                  >
                    <FaEdit className="-ml-3"/>  Edit
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(exam.id);
                    }}
                    className="flex items-center p-2 border bg-white text-black rounded w-full gap-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-400"
                  >
                    <FaTrash /> Delete
                  </Button>
        <p onClick={() => {
    navigator.clipboard.writeText(exam.join_code);
    toast.success("Copied!");
  }}  className="text-black font-mono mt-2 font-bold bg-white text-black hover:bg-gray-300 dark:hover:bg-gray-400">
   
 code:<strong>{exam.join_code}</strong>
</p>

                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamPage;
