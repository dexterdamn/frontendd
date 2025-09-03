// "use client"

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import FadeModal from '@/components/FadeModal';
// import '@/styles/Students.css';
// import { Button } from '@/components/ui/button';
// // import { VideoIcon, VideotapeIcon } from 'lucide-react';
// // import Webcamera from "./Webcamera";
// import Webcam from 'react-webcam';
// import { CameraIcon } from 'lucide-react'

// const Students = () => {
//   const [students, setStudents] = useState([]);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [showWebcam, setShowWebcam] = useState(false);
//   const [capturedImage, setCapturedImage] = useState(null);
//   const webcamRef = useRef(null);
//   const [alert, setAlert] = useState({
//     visible: false,
//     type: '',
//     title: '',
//     text: '',
//     fadeOut: false
//   });

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   const fetchStudents = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/admin/students', {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });
//       setStudents(response.data);
//     } catch (error) {
//       setAlert({
//         visible: true,
//         type: 'error',
//         title: 'Oops!',
//         text: 'Failed to fetch students'
//       });
//     }
//   };

//   const handleCapture = () => {
//     const imageSrc = webcamRef.current.getScreenshot();
//     setCapturedImage(imageSrc);
//     setShowWebcam(false);
//   };

//   const handleRetake = () => {
//     setCapturedImage(null);
//     setShowWebcam(true);
//   };


//   const handleRegisterStudent = async () => {
//     try {
//       await axios.post(
//         'http://localhost:5000/api/admin/students',
//         { username, email, password },
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         }
//       );
//       await fetchStudents();
//       clearForm();
//       setAlert({
//         visible: true,
//         type: 'success',
//         title: 'Success!',
//         text: 'Student registered successfully'
//       });
//     } catch (error) {
//       setAlert({
//         visible: true,
//         type: 'error',
//         title: 'Oops!',
//         text: 'Failed to register student'
//       });
//     }
//   };

//   const handleEditStudent = async () => {
//     try {
//       await axios.put(
//         `http://localhost:5000/api/admin/students/${selectedStudent.id}`,
//         { username, email, password },
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         }
//       );
//       setStudents((prev) =>
//         prev.map((student) =>
//           student.id === selectedStudent.id ? { ...student, username, email } : student
//         )
//       );
//       clearForm();
//       setAlert({
//         visible: true,
//         type: 'success',
//         title: 'Success!',
//         text: 'Student updated successfully'
//       });
//     } catch (error) {
//       setAlert({
//         visible: true,
//         type: 'error',
//         title: 'Oops!',
//         text: 'Failed to update student'
//       });
//     }
//   };

//   const handleDeleteStudent = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/admin/students/${id}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });
//       setStudents((prev) => prev.filter((student) => student.id !== id));
//       setAlert({
//         visible: true,
//         type: 'success',
//         title: 'Success!',
//         text: 'Student deleted successfully'
//       });
//     } catch (error) {
//       setAlert({
//         visible: true,
//         type: 'error',
//         title: 'Oops!',
//         text: 'Failed to delete student'
//       });
//     }
//   };

//   const openModal = (student = null) => {
//     setSelectedStudent(student);
//     setUsername(student ? student.username : '');
//     setEmail(student ? student.email : '');
//     setPassword('');
//     setIsEditing(!!student);
//     setShowModal(true);
//   };

//   const closeModal = () => setShowModal(false);

//   const clearForm = () => {
//     setUsername('');
//     setEmail('');
//     setPassword('');
//     setShowModal(false);
//     setIsEditing(false);
//     setSelectedStudent(null);
//   };

//   useEffect(() => {
//     if (alert.visible) {
//       const timer = setTimeout(() => {
//         setAlert((prev) => ({ ...prev, fadeOut: true }));
//       }, 1800);

//       const hideTimer = setTimeout(() => {
//         setAlert({ visible: false, type: '', title: '', text: '', fadeOut: false });
//        }, 2000);

//       return () => {
//         clearTimeout(timer);
//         clearTimeout(hideTimer);
//       };
//     }
//   }, [alert]);

//   return (
//     <div className="students-container">
//       <h2>STUDENTS</h2>
//       <button onClick={() => openModal()} className="add-student-btn">
//         Register
//       </button>
//       {!showModal && (
//         <div className="table-container">
//           <table className="students-table">
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {students.map((student) => (
//                 <tr key={student.id}>
//                   <td>{student.username}</td>
//                   <td>{student.email}</td>
//                   <td>
//                     <button onClick={() => openModal(student)} className="edit-btn">
//                       <i className="fas fa-edit"></i> Edit
//                     </button>
//                     <button
//                       onClick={() => handleDeleteStudent(student.id)}
//                       className="delete-btn"
//                     >
//                       <i className="fas fa-trash-alt"></i> Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//       <FadeModal
//         show={showModal}
//         onClose={closeModal}
//         className="w-full max-w-sm"
        
//         style={{ width: '80%', maxWidth: '600px', padding: '2rem' }}>
//   <h3 className='' style={{ fontSize: '1.5rem', marginBottom: '1rem', textAlign: 'center' }}>
//     {isEditing ? 'EDIT STUDENT' : 'REGISTER STUDENT'}
//   </h3>
//   <form
//     style={{
//       display: 'flex',
//       flexDirection: 'column',
//       padding: '1rem',
//     }}
//     onSubmit={(e) => {
//       e.preventDefault();
//       isEditing ? handleEditStudent() : handleRegisterStudent();
//     }}
//   >
//     <div style={{ marginBottom: '1rem' }}>
//       <label style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Username</label>
//       <input
//         type="text"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//         required
//         style={{
//           padding: '0.5rem',
//           border: '1px solid #ccc',
//           borderRadius: '4px',
//           width: '100%',
//           boxSizing: 'border-box',
//         }}
//       />
//     </div>
//     <div style={{ marginBottom: '1rem' }}>
//       <label style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Email</label>
//       <input
//         type="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         required
//         style={{
//           padding: '0.5rem',
//           border: '1px solid #ccc',
//           borderRadius: '4px',
//           width: '100%',
//           boxSizing: 'border-box',
//         }}
//       />
//     </div>
//     <div style={{ marginBottom: '1rem' }}>
//       <label style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Password</label>
//       <input
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         required
//         style={{
//           padding: '0.5rem',
//           border: '1px solid #ccc',
//           borderRadius: '4px',
//           width: '100%',
//           boxSizing: 'border-box',
//         }}
//       />
//     </div>

//     <div style={{ marginBottom: '2.9rem',  textAlign: 'center' }}>
//       <Button
//         type="submit"
//         style={{
//           padding: '0.5rem',
//           backgroundColor: 'black',
//           color: 'white',
//           border: 'none',
//           borderRadius: '4px',
//           cursor: 'pointer',
//           fontSize: '1rem',
          
         
         
//         }}
//         onMouseOver={(e) => (e.currentTarget.style.backgroundColor = ' black')}
//         onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'black')}
//       >
//         {isEditing ? 'Update' : 'Register'}
//       </Button>
//     </div>
//   </form>
// </FadeModal>

//       {alert.visible && (
//         <div className={`alert ${alert.type} ${alert.fadeOut ? 'fade-out' : ''}`}>
//           {alert.type === 'success' ? (
//             <>
//               <i className="fas fa-check-circle" style={{ color: 'green', fontSize: '30px' }}></i>
//               <strong style={{ display: 'block' }}>Success!</strong>
//               <span>{alert.text}</span>
//             </>
//           ) : (
//             <>
//               <i className="fas fa-times-circle" style={{ color: 'red', fontSize: '30px' }}></i>
//               <strong style={{ display: 'block', color: 'red' }}>Error!</strong>
//               <span style={{color:'red'}}>{alert.text}</span>
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Students;



// import React, { useState, useEffect } from 'react';
// import styles from '@/styles/StudentExam.module.css';
// import { AlertCircle } from "lucide-react";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner"; // Import toast from sonner

// const StudentExam = () => {
//     const [isExamStarted, setIsExamStarted] = useState(true);
//     const [currentQuestion, setCurrentQuestion] = useState(0);
//     const [selectedOption, setSelectedOption] = useState({});
//     const [questions, setQuestions] = useState([]);
//     const [isExamCompleted, setIsExamCompleted] = useState(false);
//     const [noFaceDetected, setNoFaceDetected] = useState(false);
//     const [eyeDirectionWarning, setEyeDirectionWarning] = useState(false);

//     const initialQuestions = [
//         {
//             id: 1,
//             question: 'Which of the following is a type of software that is being produced for the needs of a wide variety of users?',
//             options: ['A. Custom Software', 'B. Mobile Application', 'C. Retail Software', 'D. Web Application'],
//             answer: 'C',
//         },
//         {
//             id: 2,
//             question: 'What does CSS stand for?',
//             options: ['A. Computer Style Sheets', 'B. Creative Style Sheets', 'C. Cascading Style Sheets', 'D. None of the above'],
//             answer: 'C',
//         },
//     ];

//     useEffect(() => {
//         if (isExamStarted) {
//             setQuestions(initialQuestions);
//         }
//     }, [isExamStarted]);

//     useEffect(() => {
//         const interval = setInterval(async () => {
//             try {
//                 const res = await fetch('http://localhost:5000/face-status');
//                 const data = await res.json();

//                 setNoFaceDetected(!data.face_detected);
//                 setEyeDirectionWarning(
//                     data.face_detected &&
//                     (data.eye_direction === "left" || data.eye_direction === "right" || data.eye_direction === "down")
//                 );
//             } catch (err) {
//                 console.error('Error fetching face status:', err);
//             }
//         }, 1000);

//         return () => clearInterval(interval);
//     }, []);

//     const handleNextQuestion = () => {
//         if (!selectedOption[currentQuestion]) {
//             toast.error('Please select an option before proceeding.'); // Use toast for error
//             return;
//         }
//         if (currentQuestion < questions.length - 1) {
//             setCurrentQuestion(currentQuestion + 1);
//         } else {
//             setIsExamStarted(false);
//             setIsExamCompleted(true);
//             toast.success('Exam submitted successfully!'); // Use toast for success
//         }
//     };

//     const handlePreviousQuestion = () => {
//         if (currentQuestion > 0) {
//             setCurrentQuestion(currentQuestion - 1);
//         }
//     };

//     const handleSubmitExam = () => {
//         setIsExamCompleted(true);
//         toast.success('Exam submitted successfully!'); // Use toast for success
//     };

//     const showWarning = noFaceDetected || eyeDirectionWarning;

//     return (
//         <div className={styles.studentDashboard}>
//             {showWarning && (
//                 <div className={styles.fullscreenWarning} style={{
//                     backgroundColor: 'black',
//                     zIndex: 1000,
//                     position: 'fixed',
//                     top: 0,
//                     left: 0,
//                     right: 0,
//                     bottom: 0,
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                 }}>
//                     <Alert variant="destructive" className="bg-red-900 max-w-md mx-auto px-4 py-2 border border-white rounded-lg text-center text-white text-lg flex items-center justify-center space-x-2">
//                         <AlertCircle className="h-6 w-6" />
//                         <AlertTitle className="text-3xl font-bold text-white">
//                             {noFaceDetected ? 'Face not detected.' : 'Warning!'}
//                         </AlertTitle>
//                         {eyeDirectionWarning && (
//                             <AlertDescription className="text-sm sm:text-base md:text-lg lg:text-2xl text-white text-center px-2">
//                                 Please stay in front of the camera.
//                             </AlertDescription>
//                         )}
//                     </Alert>
//                 </div>
//             )}

//             {!showWarning && (
//                 <div className={styles.examContainer}>
//                     {isExamCompleted ? (
//                         <div className={styles.thankYouMessage}>
//                             <h2>Thank you for completing the exam!</h2>
//                         </div>
//                     ) : (
//                         <>
//                             <div className={`${styles.questionBox} ${styles.noSelect}`}>
//                                 <p>{`${currentQuestion + 1}. ${questions[currentQuestion]?.question || 'Loading question...'}`}</p>
//                             </div>
//                             <div className={`${styles.choicesContainer} ${styles.noSelect}`}>
//                                 {questions[currentQuestion]?.options.map((option, index) => (
//                                     <label key={index} className={styles.optionLabel}>
//                                         <input
//                                             type="radio"
//                                             name="option"
//                                             value={option}
//                                             checked={selectedOption[currentQuestion] === option}
//                                             onChange={() => setSelectedOption(prev => ({ ...prev, [currentQuestion]: option }))}
//                                         />
//                                         <span>{option}</span>
//                                     </label>
//                                 ))}
//                                 <div className={styles.buttonContainer}>
//                                     {currentQuestion > 0 && (
//                                         <Button className={styles.backButton} onClick={handlePreviousQuestion}>Back</Button>
//                                     )}
//                                     {currentQuestion < questions.length - 1 ? (
//                                         <Button className={styles.nextButton} onClick={handleNextQuestion}>Next</Button>
//                                     ) : (
//                                         <Button className={styles.submitButton} onClick={handleSubmitExam}>Submit</Button>
//                                     )}
//                                 </div>
//                             </div>
//                         </>
//                     )}
//                     <div className={styles.webcamContainer}>
//                         <img src={'http://localhost:5000/video'} alt="Webcam Feed" />
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default StudentExam;


import React, { useState, useEffect } from "react";
import axios from "axios";
import FadeModal from "./FadeModal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import PhotoModal from "./PhotoModal"; // Adjust the path as necessary


import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Students = () => {

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isBackendRunning, setIsBackendRunning] = useState(true);
  const [studentToDelete, setStudentToDelete] = useState(null); 
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    fetchStudents();
    checkBackendStatus();
  }, []);

  const fetchStudents = async () => {
  try {
    const response = await axios.get("http://localhost:5000/students");
    setStudents(response.data);
  } catch (error) {
    toast.error("Unable to fetch students. Backend might not be running.", {
      
    });
  }
};

   const handleViewPhoto = (student) => {
    setViewingStudent(student);
    setIsPhotoModalOpen(true);
  };

  const closePhotoModal = () => {
    setIsPhotoModalOpen(false);
    setViewingStudent(null);
  };



const checkBackendStatus = async () => {
  try {
    await axios.get("http://localhost:5000/students");
    setIsBackendRunning(true);
  } catch (error) {
    setIsBackendRunning(false);
    toast.error("Backend is not running. Please check your backend/API.", {
      
    });
  }
};

const handleRegisterStudent = async () => {
  try {
    const response = await axios.post("http://localhost:5000/register", {
      username,
      gender,
      email,
      password,
    });
    toast.success(response.data.message);

    fetchStudents(); // Refresh the student list
    closeModal();
    clearForm();
  } catch (error) {
    toast.error("Username or email already exists.", {
   
    });
  }
};

const handleEditStudent = async () => {
  if (selectedStudent) {
    try {
      const response = await axios.put(`http://localhost:5000/students/${selectedStudent.id}`, {
        username,
        gender,
        email,
      });
      toast.success(response.data.message);
      fetchStudents(); // Refresh the student list
      closeModal();
      clearForm();
    } catch (error) {
      toast.error("Failed to update student. Please try again.", {
        
      });
    }
  }
};

const handleDeleteStudent = async () => {
  if (studentToDelete) {
    try {
      await axios.delete(`http://localhost:5000/students/${studentToDelete}`);
      setStudents((prev) => prev.filter((student) => student.id !== studentToDelete));
      toast.success("Student deleted successfully.");
      setStudentToDelete(null); // Reset after deletion
    } catch (error) {
      toast.error("Failed to delete student. Please try again.", {
      
      });
    }
  }
};

  const openModal = (student = null) => {
  if (student) {
    setUsername(student.username);
    setGender(student.gender);
    setEmail(student.email);
    setPassword(""); // Optionally reset password
    setSelectedStudent(student);
    setIsEditing(true);
  } else {
    clearForm();
    setIsEditing(false);
  }
  setShowModal(true);
};

  const closeModal = () => setShowModal(false);
  
  const clearForm = () => {
  setUsername("");
  setGender("");
  setEmail("");
  setPassword("");
  setSelectedStudent(null);
};



return (

  <div
  style={{ marginTop: "-110px", marginLeft: "-15px", fontFamily: "sans-serif" }}
  className={`sans-serif mx-auto max-w-1xl px-10 w-full transition duration-300 ${isDialogOpen ? "fixed inset-0 bg-black bg-opacity-50 z-40 blur-xl pointer-events-none select-none" : ""}`}
>

    <h2 className="mb-2.5 text-2xl">Students</h2>
    <Button onClick={() => openModal()} className="bg-black text-white dark:bg-gray-800 py-2 px-4 mb-5 cursor-pointer rounded">
      Register
    </Button>

      <div className="overflow-x-auto">
        <table className="min-w-full  table-auto border-collapse border  bg-white dark:bg-gray-800">
          <thead className="bg-gray-100 ">
            <tr>
              <th className="border px-4 py-2 text-gray-800 dark:text-black w-2/20 dark:border-gray-500">STUDENT ID</th>
              <th className="border px-4 py-2 text-gray-800 dark:text-black dark:border-gray-500">Name</th>
              <th className="border px-4 py-2 text-gray-800 dark:text-black dark:border-gray-500">Gender</th>
              <th className="border px-4 py-2 text-gray-800 dark:text-black dark:border-gray-500">Email</th>
              <th className="border px-4 py-2 text-gray-800 dark:text-black dark:border-gray-500">Photo</th>
              <th className="border px-4 py-2 text-gray-800 dark:text-black w-2/16 dark:border-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td className="border text-center px-4 py-2 dark:text-white">{student.id}</td>
                <td className="border text-center px-4 py-2 dark:text-white">{student.username}</td>
                <td className="border text-center px-4 py-2 dark:text-white">{student.gender}</td>
                <td className="border text-center px-4 py-2 dark:text-white">{student.email}</td>
                 <td className="border text-center px-4 py-2 dark:text-white">
                 <Button
                onClick={() => handleViewPhoto(student)}
                className="text-black hover:text-black hover:bg-gray-0 bg-blue-300 border text-center font-bold py-2 px-4 rounded"
              >
                View
              </Button>
              <PhotoModal
        isOpen={isPhotoModalOpen}
        onClose={closePhotoModal}
        student={viewingStudent}
      />


 {/* <img src={student.photo} alt={`${student.username}'s photo`} className="w-16 h-16 rounded-full" /> */}
                </td>
                <td className="border px-4 py-2">
                  <div className="flex justify-center items-center space-x-2">
                    <Button onClick={() => openModal(student)} className="text-black bg-white font-bold py-2 hover:text-black hover:bg-gray-0 px-2 rounded flex items-center">
                      <FaEdit className="text-2xl border-white" />
                    </Button>
                 <AlertDialog open={studentToDelete === student.id} onOpenChange={(open) => {
        if (!open) setStudentToDelete(null);
      }}>
        <AlertDialogTrigger asChild>
          <Button
            onClick={() => setStudentToDelete(student.id)}
            className="text-black bg-white font-bold py-2 px-2 rounded flex items-center  hover:bg-gray-0"
          >
            <FaTrash className="text-2xl " />
          </Button>
        </AlertDialogTrigger>

  {studentToDelete === student.id && (
    <>
      {/* Blur / dim background */}
      <div className="fixed -inset-10 bg-gray-90 bg-opacity-50" />

      {/* Modal content */}
      <AlertDialogContent className=" bg-black  text-white flex flex-col items-center w-full max-w-xs absolute right-1 left-120 mx-auto top-1/2 transform  rounded-lg shadow-lg p-7"> 
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            Are you sure you want to delete?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-between dark:text-white   text-black">
          <AlertDialogCancel onClick={() => setStudentToDelete(null)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction  onClick={handleDeleteStudent}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </>
  )}
</AlertDialog>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      

      <FadeModal
        show={showModal}
        onClose={closeModal}
        className="w-full max-w-sm"
        style={{ width: "80%", maxWidth: "600px", padding: "2rem" }}
      >
        <h3 className="text-2xl font-bold text-center mb-4 dark:text-black">
          {isEditing ? "EDIT STUDENT" : "REGISTER STUDENT"}
        </h3>

        <form
          className="flex flex-col p-4 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            isEditing ? handleEditStudent() : handleRegisterStudent();
          }}
        >
          <label className="font-semibold text-md dark:text-black">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="p-2 border border-gray-500 rounded w-2/5 dark:text-black"
          />

          <div>
            <label className="font-semibold text-md dark:text-black">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
              className="p-2 border flex-col flex border-gray-500 rounded w-2/5 dark:text-black"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              {/* <option value="Other">Other</option> */}
            </select>
          </div>

          <div>
            <label className="font-semibold text-md dark:text-black">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-2 border flex-col flex border-gray-500 rounded w-2/5  dark:text-black"
            />
          </div>
          <div>
            <label className="font-semibold text-md dark:text-black">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="p-2 border border-gray-500 flex-col flex rounded w-2/5  dark:text-black"
            />
          </div>
                 
          <div>    
            <Button
              type="submit"
              style={{ marginLeft: '140px' }}
              className="bg-black  text-white px-4 py-2 rounded hover:bg-gray-800 focus:outline-none"
            >
              {isEditing ? "Update" : "Register"}
            </Button>
          </div>

          {!isEditing && (
            <div className="flex flex-col items-center space-y-4  absolute top-50 right-14">
              {/* {!imageData ? (
                <> */}
                  {/* <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={420}
                    height={240}
                    className="rounded border"
                  /> */}
                  {/* <Button
                    type="button"
                    onClick={handleCapture}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Capture Image
                  </Button> */}
                {/* </>
              ) : (
                <>
                  <img src={imageData} alt="Captured" className="rounded border w-[320px] h-[240px]" />
                  <Button
                    type="button"
                    onClick={() => setImageData(null)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Retake
                  </Button>
                </>
              )} */}
            </div>
          )}
        </form>
      </FadeModal>
    </div>
    
  );
};

export default Students;