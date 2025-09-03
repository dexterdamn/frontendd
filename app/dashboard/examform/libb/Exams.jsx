// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'next/navigation';
// import { createQuestion, getQuestionsByExam, deleteQuestion, updateQuestion } from '@/libb/api';
// import FadeModal from '@/components/FadeModal';
// import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';
// import { FaEdit, FaTrash } from "react-icons/fa";

// export default function ExamPage() {
//   const { id: examId } = useParams(); // gets exam id from route
//   const [questions, setQuestions] = useState([]);
//   const [newQuestion, setNewQuestion] = useState({
//     id: null,
//     question: '',
//     choiceA: '',
//     choiceB: '',
//     choiceC: '',
//     choiceD: '',
//     answer: ''
//   });
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);

//   useEffect(() => {
//     if (examId) {
//       fetchQuestions(examId);
//     }
//   }, [examId]);

//   const fetchQuestions = async (examId) => {
//     try {
//       const response = await getQuestionsByExam(examId);
//       setQuestions(response.data);
//     } catch (error) {
//       toast.error("Error fetching questions: " + error.message);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (isEditing) {
//         await updateQuestion(newQuestion.id, { ...newQuestion, exam_id: examId });
//         toast.success("Question updated successfully!");
//       } else {
//         await createQuestion({ exam_id: examId, ...newQuestion });
//         toast.success("Question created successfully!");
//       }
//       await fetchQuestions(examId);
//       resetForm();
//     } catch (error) {
//       toast.error("Error: " + error.message);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await deleteQuestion(id);
//       toast.success("Question deleted successfully!");
//       await fetchQuestions(examId);
//     } catch (error) {
//       toast.error("Error: " + error.message);
//     }
//   };

//   const handleEdit = (question) => {
//     setNewQuestion(question);
//     setIsEditing(true);
//     setIsModalOpen(true);
//   };

//   const resetForm = () => {
//     setNewQuestion({
//       id: null,
//       question: '',
//       choiceA: '',
//       choiceB: '',
//       choiceC: '',
//       choiceD: '',
//       answer: ''
//     });
//     setIsEditing(false);
//     setIsModalOpen(false);
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-2xl mb-4 font-semibold">Manage Questions for Exam ID: {examId}</h1>
//       <div className="mb-4">
//         <Button 
//           onClick={() => setIsModalOpen(true)}
//           className="bg-blue-500 text-white"
//         >
//           Create Question
//         </Button>
//       </div>

//       <FadeModal isOpen={isModalOpen} onClose={resetForm}>
//         <form onSubmit={handleSubmit} className="text-center">
//           {['question', 'choiceA', 'choiceB', 'choiceC', 'choiceD', 'answer'].map((field) => (
//             <input
//               key={field}
//               type="text"
//               placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
//               value={newQuestion[field]}
//               onChange={(e) => setNewQuestion({ ...newQuestion, [field]: e.target.value })}
//               required
//               className="border p-2 mb-2 w-full"
//             />
//           ))}
//           <Button type="submit" className="bg-blue-500 text-white p-2 rounded">
//             {isEditing ? 'Update' : 'Add'}
//           </Button>
//         </form>
//       </FadeModal>

//       <table className="min-w-full border-collapse border border-gray-300">
//         <thead>
//           <tr>
//             <th className="border border-gray-300 p-2">Question</th>
//             <th className="border border-gray-300 p-2">Choices</th>
//             <th className="border border-gray-300 p-2 w-40">Answer</th>
//             <th className="border border-gray-300 p-2 w-40">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {questions.map((q) => (
//             <tr key={q.id}>
//               <td className="border border-gray-300 p-2 text-center">{q.question}</td>
//               <td className="border border-gray-300 p-2 text-center">
//                 <div className="flex flex-col items-center">
//                   <div><strong>A.</strong> {q.choiceA}</div>
//                   <div><strong>B.</strong> {q.choiceB}</div>
//                   <div><strong>C.</strong> {q.choiceC}</div>
//                   <div><strong>D.</strong> {q.choiceD}</div>
//                 </div>
//               </td>
//               <td className="border border-gray-300 p-2 text-center">{q.answer}</td>
//               <td className="border border-gray-300 p-2 text-center flex gap-2 justify-center">
//                 <Button onClick={() => handleEdit(q)}><FaEdit className="text-xl" /></Button>
//                 <Button onClick={() => handleDelete(q.id)}><FaTrash className="text-xl" /></Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
