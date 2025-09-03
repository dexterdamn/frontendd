


'use client';
import React, { useState, useEffect } from 'react';
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
import { FaPlus } from "react-icons/fa6";

export default function Exams() {
  const [isLocked, setIsLocked] = useState(false);
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
      setIsLocked(res.data.locked);
    } catch (error) {
      toast.error("Failed to get exam lock status");
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
      if (isLocked) {
        await unlockExam(examId);
        localStorage.setItem(`examLocked_${examId}`, "false");
        localStorage.setItem(`examReady_${examId}`, "true");
        toast.success("Exam unlocked");
      } else {
        await lockExam(examId);
        localStorage.setItem(`examLocked_${examId}`, "true");
        localStorage.setItem(`examReady_${examId}`, "false");
        toast.success("Exam locked");
      }
      setIsLocked(!isLocked);
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      toast.error("Error toggling lock: " + error.message);
    }
  };
  

  return (
    <div className="container mx-auto p-4 dark:text-white">
      <div className="mb-4 flex items-center gap-2">
        {/* <Button onClick={() => router.push('/dashboard/examform')} className="text-blue bg-white dark:bg-white">
          <FaClipboardList className="text-8xl text-gray-800" />
        </Button> */}
        <h1 className="text-2xl mb-0 font-semibold">Manage Questions</h1>
      </div>

      <div className="mb-4 flex gap-2">
        <Button onClick={() => setIsModalOpen(true)} className="bg-black text-white p-2 dark:bg-black cursor-pointer"><FaPlus /></Button>
        {/* <Button onClick={handleSetExam} className="bg-black text-white p-2 dark:bg-black cursor-pointer">Set Exam</Button> */}
        <Button
          className={`w-10 h-9 flex items-center justify-center cursor-pointer dark:bg-black ${isLocked ? 'bg-red-600 hover:bg-red-700' : 'bg-black'} text-white`}
          onClick={handleLockToggle}
        >
          {isLocked ? <FaUnlock className="text-lg" /> : <FaLock className="text-lg" />}
        </Button>
      </div>

      <FadeModal isOpen={isModalOpen} onClose={resetForm} className=" bg-blue-100">
        <form onSubmit={handleSubmit} className="space-y-4 ">
          <textarea
            placeholder="Type question here"
            value={newQuestion.question}
            onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
            required
            className="w-full h-24 px-2 py-3 border-b border-gray-300 focus:outline-none focus:border-black bg-transparent placeholder-gray-500"
          />

          {['A', 'B', 'C', 'D'].map((label) => {
            const key = `choice${label}`;
            return (
              <input
                key={key}
                type="text"
                placeholder={`Choice ${label}`}
                value={newQuestion[key]}
                onChange={(e) => setNewQuestion({ ...newQuestion, [key]: e.target.value })}
                required
                className="w-full px-2 py-3 border-b border-gray-300 focus:outline-none focus:border-black bg-transparent placeholder-gray-500"
              />
            );
          })}

          <input
            type="text"
            placeholder="Enter Answer"
            value={newQuestion.answer}
            onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
            required
            className="w-full px-2 py-3 border-b border-gray-300 focus:outline-none focus:border-black bg-transparent placeholder-gray-500"
          />

          <div className="flex justify-center">
            <Button type="submit" className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition cursor-pointer">
              {isEditing ? 'Update' : 'Add'}
            </Button>
          </div>
        </form>
      </FadeModal>

      <table className="min-w-full border-collapse border border-gray-400 mt-6">
        <thead>
          <tr>
            <th className="border border-gray-400 p-2">#</th>
            <th className="border border-gray-400 p-2">Question</th>
            <th className="border border-gray-400 p-2 w-80">Choices</th>
            <th className="border border-gray-400 p-2">Answer</th>
            <th className="border border-gray-400 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q, index) => (
            <tr key={q.id}>
              <td className="border border-gray-400 p-2 text-center">{index + 1}</td>
              <td className="border border-gray-400 p-2 text-center">{q.question}</td>
              <td className="border border-gray-400 p-2 text-center">
                <div className="flex flex-col items-start">
                  {q.choices.map((choice, i) => (
                    <div key={i}><strong>{String.fromCharCode(65 + i)}.</strong> {choice}</div>
                  ))}
                </div>
              </td>
              <td className="border border-gray-400 p-2 text-center align-middle">{q.answer}</td>
              <td className="border border-gray-400 p-2 text-center align-middle">
                <div className="flex justify-center gap-2">
                  <Button className='bg-white text-black hover:bg-gray-0 cursor-pointer' onClick={() => handleEdit(q)}>
                    <FaEdit className="text-2xl" />
                  </Button>
                  <Button className='bg-white text-black hover:bg-gray-0 cursor-pointer' onClick={() => handleDelete(q.id)}>
                    <FaTrash className="text-2xl" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
