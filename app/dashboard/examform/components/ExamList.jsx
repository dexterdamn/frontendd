// import React, { useEffect, useState } from 'react';
// import ExamFormModal from './ExamFormModal';
// import { Button } from "@/components/ui/button";
// import { FaEdit, FaTrash } from "react-icons/fa";

// const ExamList = () => {
//     const [exams, setExams] = useState([]);
//     const [selectedExam, setSelectedExam] = useState(null);
//     const [modalOpen, setModalOpen] = useState(false);

//     const fetchExams = async () => {
//         try {
//             const response = await fetch('http://localhost:5000/exams');
//             if (response.ok) {
//                 const data = await response.json();
//                 setExams(data);
//             } else {
//                 console.error('Failed to fetch exams');
//             }
//         } catch (err) {
//             console.error('Error fetching exams:', err);
//         }
//     };

//     useEffect(() => {
//         fetchExams();
//     }, []);

//     const openModal = (exam = null) => {
//         setSelectedExam(exam);
//         setModalOpen(true);
//     };

//     const handleDelete = async (id) => {
//         try {
//             const response = await fetch(`http://localhost:5000/exams/${id}`, {
//                 method: 'DELETE',
//             });

//             if (!response.ok) throw new Error('Failed to delete exam');

//             await fetchExams();
//         } catch (err) {
//             console.error(err.message);
//         }
//     };

//     return (
//         <div>
//             <div className="flex justify-between items-center mb-4">
//                 <h1 className="text-2xl font-bold">Exam List</h1>
//                 <Button onClick={() => openModal()} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
//                     + New Exam
//                 </Button>
//             </div>
//             <ul>
//                 {exams.map((exam) => (
//                     <li key={exam.id} className="flex justify-between items-center border-b py-2">
//                         <span>{exam.title}</span>
//                         <div className="flex space-x-2">
//                             <Button onClick={() => openModal(exam)} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">
//                                 <FaEdit />
//                             </Button>
//                             <Button onClick={() => handleDelete(exam.id)} className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">
//                                 <FaTrash />
//                             </Button>
//                         </div>
//                     </li>
//                 ))}
//             </ul>
//             {modalOpen && (
//                 <ExamFormModal
//                     exam={selectedExam}
//                     onClose={() => setModalOpen(false)}
//                     onFetchExams={fetchExams}
//                 />
//             )}
//         </div>
//     );
// };

// export default ExamList;


import Link from 'next/link';

const ExamsList = ({ exams }) => {
    return (
        <ul>
            {exams.map((exam) => (
                <li key={exam.id}>
                    <Link href={`/${exam.id}`}>
                        {exam.title}
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default ExamsList;