


'use client';
import React, { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react"; 

import { ArrowRightIcon } from "lucide-react";

import {
  createQuestion,
  getQuestionsByExam,
  deleteQuestion,
  updateQuestion,
  lockExam,
  unlockExam,
  getExamById
} from '../libb/api';
import FadeModal from './FadeModal';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { FaEdit, FaTrash, FaLock, FaUnlock, FaClipboardList } from "react-icons/fa";
import { useRouter } from 'next/navigation';

import { IoArrowBackSharp } from "react-icons/io5";

import { TbGitBranch } from "react-icons/tb";

export default function Exams() {
  const [isLocked, setIsLocked] = useState(true);
  const [examId, setExamId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    id: null,
    question: '',
    choiceA: '',
    choiceB: '',
    choiceC: '',
    choiceD: '',
    answer: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();



  
  useEffect(() => {
    const savedExamId = localStorage.getItem('examId');
    if (savedExamId) {
      setExamId(savedExamId);
      fetchQuestions(savedExamId);
      fetchExamLockStatus(savedExamId);
    }
  }, []);

  const fetchQuestions = async (examId) => {
    try {
      const res = await getQuestionsByExam(examId);
      const formatted = res.data.map(q => ({
        ...q,
        choices: [q.choiceA, q.choiceB, q.choiceC, q.choiceD]
      }));
      setQuestions(formatted);
    } catch (error) {
      toast.error("Error fetching questions: " + error.message);
    }
  };

const fetchExamLockStatus = async (id) => {
  try {
    const res = await getExamById(id);
    const backendLocked = res?.data?.locked ?? false;

    // Fallback: use localStorage if backend has no lock field yet
    const storedLock = localStorage.getItem(`examLocked_${id}`);
    const isActuallyLocked =
      storedLock === "true" ? true : storedLock === "false" ? false : backendLocked;

    setIsLocked(isActuallyLocked);

    // Keep localStorage consistent
    localStorage.setItem(`examLocked_${id}`, isActuallyLocked ? "true" : "false");
    localStorage.setItem(`examReady_${id}`, isActuallyLocked ? "false" : "true");
  } catch (error) {
    console.error("Failed to fetch lock status:", error);
    // fallback if backend fails
    const storedLock = localStorage.getItem(`examLocked_${id}`);
    setIsLocked(storedLock === "true");
  }
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      exam_id: examId,
      question: newQuestion.question,
      choiceA: newQuestion.choiceA,
      choiceB: newQuestion.choiceB,
      choiceC: newQuestion.choiceC,
      choiceD: newQuestion.choiceD,
      answer: newQuestion.answer
    };

    try {
      if (isEditing) {
        await updateQuestion(newQuestion.id, payload);
        toast.success("Question updated successfully!");
      } else {
        await createQuestion(payload);
        toast.success("Question created successfully!");
      }
      await fetchQuestions(examId);
      resetForm();
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const resetForm = () => {
    setNewQuestion({
      id: null,
      question: '',
      choiceA: '',
      choiceB: '',
      choiceC: '',
      choiceD: '',
      answer: ''
    });
    setIsEditing(false);
    setIsModalOpen(false);
  };

  const handleEdit = (q) => {
    setNewQuestion({
      id: q.id,
      question: q.question,
      choiceA: q.choiceA || q.choices[0],
      choiceB: q.choiceB || q.choices[1],
      choiceC: q.choiceC || q.choices[2],
      choiceD: q.choiceD || q.choices[3],
      answer: q.answer
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteQuestion(id);
      toast.success("Question deleted successfully!");
      await fetchQuestions(examId);
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

const handleSetExam = async () => {
  try {
    await fetchQuestions(examId);
    localStorage.setItem("examId", examId);
    localStorage.setItem(`examReady_${examId}`, "true"); // correct key
    localStorage.setItem(`examLocked_${examId}`, "false"); // correct key
    toast.success("Exam questions set successfully!");
    window.dispatchEvent(new Event("storage"));
  } catch (error) {
    toast.error("Error setting exam: " + error.message);
  }
};


const handleLockToggle = async () => {
  try {
    if (!examId) {
      toast.error("Exam ID not found");
      return;
    }

    if (isLocked) {
      // Currently locked → UNLOCK exam (students can start)
      await unlockExam(examId);
      localStorage.setItem(`examLocked_${examId}`, "false");
      localStorage.setItem(`examReady_${examId}`, "true");
      toast.success("Exam unlocked – students can start now");
      setIsLocked(false);
    } else {
      // Currently unlocked → LOCK exam (students cannot start)
      await lockExam(examId);
      localStorage.setItem(`examLocked_${examId}`, "true");
      localStorage.setItem(`examReady_${examId}`, "false");
      toast.success("Exam locked – students cannot start");
      setIsLocked(true);
    }

    window.dispatchEvent(new Event("storage")); // notify student side
  } catch (error) {
    toast.error("Error toggling lock: " + error.message);
  }
};


  

  return (
    <div className="container mx-auto p-4 dark:text-white font-sans">
      <div className="mb-4 flex items-center gap-2 ">
<Button
  onClick={() => router.push('/dashboard/examform')}
  className="cursor-pointer text-blue bg-white hover:bg-white dark:bg-transparent dark:hover:bg-transparent "
>
  
  <IoArrowBackSharp className="text-lg " />
</Button>

 

        <h1 className="text-2xl mb-0 font-semibold">Manage Questions</h1>
      </div>

      <div className="mb-4 flex gap-2">
<Button 
  onClick={() => setIsModalOpen(true)}
  className=" bg-gray-800 text-white rounded-md py-2 px-4 hover:bg-gray-700 cursor-pointer"
>
  Add Questions
</Button>

        {/* <Button onClick={handleSetExam} className="bg-black text-white p-2 dark:bg-black cursor-pointer">Set Exam</Button> */}
<Button
  onClick={handleLockToggle}
  className={`flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium transition cursor-pointer
    ${isLocked 
      ? 'border-gray-400 text-gray-900 bg-white hover:bg-gray-100 dark:bg-transparent dark:text-white dark:border-gray-600' 
      : 'border-red-500 text-red-600 bg-white hover:bg-red-50 dark:bg-transparent dark:text-red-400 dark:border-red-400'}
  `}
>
  {isLocked ? (
    <>
      <TbGitBranch className="text-base" />
      <span>Unlock Exam</span>
    </>
  ) : (
    <>
      <TbGitBranch className="text-base" />
      <span>Lock Exam</span>
    </>
  )}
</Button>




      </div>

     <FadeModal
  isOpen={isModalOpen}
  onClose={resetForm}
  className="bg-blue-100 dark:bg-gray-900 p-6 rounded-2xl shadow-lg max-w-lg w-full mx-auto"
>
  <form onSubmit={handleSubmit} className="space-y-4">
    <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-100">
      {isEditing ? 'Edit Question' : 'Add New Question'}
    </h2>

    {/* Question */}
    <textarea
      placeholder="Type your question here..."
      value={newQuestion.question}
      onChange={(e) =>
        setNewQuestion({ ...newQuestion, question: e.target.value })
      }
      required
      className="w-full h-28 px-3 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-500 resize-none"
    />

    {/* Choices */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {['A', 'B', 'C', 'D'].map((label) => {
        const key = `choice${label}`;
        return (
          <input
            key={key}
            type="text"
            placeholder={`Option ${label}`}
            value={newQuestion[key]}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, [key]: e.target.value })
            }
            required
            className="w-full px-3 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-500"
          />
        );
      })}
    </div>

    {/* Correct Answer (Single Letter Only) */}
    <input
      type="text"
      placeholder="Correct Answer (A, B, C, or D)"
      value={newQuestion.answer}
      onChange={(e) => {
        const val = e.target.value.toUpperCase();
        if (/^[ABCD]?$/.test(val)) {
          setNewQuestion({ ...newQuestion, answer: val });
        }
      }}
      required
      maxLength={1}
      className="w-80 mx-63 px-3 py-6 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-500 text-center uppercase"
    />

    {/* Buttons */}
    <div className="flex justify-center pt-2 gap-3">
      {/* <Button
        type="button"
        onClick={resetForm}
        className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-6 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
      >
        Cancel
      </Button> */}
      <Button
        type="submit"
        className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors dark:bg-blue-600 dark:hover:bg-blue-700"
      >
        {isEditing ? 'Update Question' : 'Add Question'}
      </Button>
    </div>
  </form>
</FadeModal>


<div className="border-b border-gray-300 rounded-xl overflow-hidden dark:border-gray-400 ">
  <table className="min-w-full border bg-white dark:bg-gray-800 ">
    <thead className="bg-gray-400 dark:bg-gray-700 ">
      <tr className="border dark:border-gray-400 text-center">
        <th className="border-b border-gray-300 p-2 w-10 text-center">#</th>
        <th className="border-b border-gray-300 p-2 text-left">Question</th>
        <th className="border-b border-gray-300 p-2 w-90 text-left">Choices</th>
        <th className="border-b border-gray-300 p-2 w-20">Answer</th>
        <th className="border-b border-gray-300 p-2 w-20 text-center">Actions</th>
      </tr>
    </thead>
    <tbody>
      {questions.map((q, index) => (
        <tr className="last:border-b-10 border-gray-400 border"  key={q.id}>
          {/* Left border only on first cell */}
          <td className="border-t border-l border-gray-300 p-2 text-center">
            {index + 1}
          </td>

          <td className="border-t border-gray-300 p-2">{q.question}</td>

          <td className="border-t border-gray-300 p-2 ">
            <div className="flex flex-col items-start pl-2 space-y-1 ">
              {q.choices.map((choice, i) => (
                <div key={i}>
                  <strong>{String.fromCharCode(65 + i)}.</strong> {choice}
                </div>
              ))}
            </div>
          </td>

          <td className="border-t border-gray-300 p-2 text-center ">{q.answer}</td>

          {/* Right border only on last cell */}
          <td className="border-t border-r border-gray-300 p-2 text-center dark:border-gray-400">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem
                  onClick={() => handleEdit(q)}
                  className="flex items-center border-none cursor-pointer"
                >
                  <FaEdit className="mr-2 text-blue-600" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDelete(q.id)}
                  className="flex items-center text-red-600 cursor-pointer dark:text-red-600"
                >
                  <FaTrash className="mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


    </div>
  );
}
