// // // components/FaceCapture.jsx
// // "use client";

// // import { useEffect, useState } from 'react';
// // import axios from 'axios';
// // import { Button } from "@/components/ui/button";
// // import { useRouter } from 'next/navigation';
// // import { toast } from "sonner";
// // import PhotoModal from "./PhotoModal";


// // const FaceCapture = () => {
// //   const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
// //   const [viewingStudent, setViewingStudent] = useState(null);
  
// //   const [students, setStudents] = useState([]);
// //   const router = useRouter();


// //   const handleViewPhoto = (student) => {
// //   setViewingStudent(student);
// //   setIsPhotoModalOpen(true);
// // };

// // useEffect(() => {
// //   const fetchStudents = async () => {
// //     try {
// //       const response = await axios.get("http://localhost:5000/students");
// //       setStudents(response.data);
// //     } catch (error) {
// //       console.error("Axios error:", error);

// //       if (error.message === "Network Error") {
// //         toast.error("Unable to connect to the student API. Please ensure the backend server is running.", {
          
// //         });
// //       } else {
// //         toast.error("An error occurred while fetching student data.", {
        
// //         });
// //       }
// //     }
// //   };

// //   fetchStudents();
// // }, []);

// //   return (
// //   <div className="w-full h-screen flex flex-col sans-serif">
// //   {/* Fixed Header */}
// //    <div onClick={() => router.push('/dashboard')} className="cursor-pointer">
// //         <img src="/face-scan.png" alt="Face Scan" className="w-16 h-16" />
// //       </div>
// //       <h1 className="text-2xl font-bold text-black dark:text-white ml-18 -mt-12">
// //         Face Capture Application
// //       </h1>
// //   <div className="fixed top-0 left-0 right-0 px-10 py-4 ml-65">
// //     <div className="flex items-center gap-4">
     
// //     </div>
// //   </div>

// //   {/* Scrollable Content */}
// //   <div className="flex-1 pt-18 px-4 top-20">
// //     <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
// //       {students.map((student, index) => (
// //         <div
// //           key={index}
// //           className="w-full h-80 border border-gray-300 shadow-lg rounded-xl p-6 bg-white flex flex-col items-center justify-center"
// //         >
// //           <img
// //             src={student.photo || "https://via.placeholder.com/150"}
// //             className="w-40 h-40 object-cover rounded-md mb-2 cursor-pointer"
// //           />
// //           <p className="text-lg font-medium text-black">{student.username}</p>
// //         </div>
// //       ))}
// //     </div>
// //   </div>
// // </div>

// //   );
// // };

// // export default FaceCapture;


// "use client";

// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import { toast } from "sonner";

// const FaceCapture = () => {
//   const [students, setStudents] = useState([]);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchStudent = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/student/recognize-test");

//         if (response.data && response.data.image) {
//           // Convert single student object into an array to work with `.map()`
//           setStudents([response.data]);
//         } else {
//           toast.error("No student image found.");
//         }
//       } catch (error) {
//         console.error("Axios error:", error);
//         if (error.message === "Network Error") {
//           toast.error("Unable to connect to the student API. Please ensure the backend server is running.");
//         } else {
//           toast.error("An error occurred while fetching student data.");
//         }
//       }
//     };

//     fetchStudent();
//   }, []);

//   return (
//     <div className="w-full min-h-screen flex flex-col bg-gray-10  py-8">
//       {/* Header */}
//       <div className="flex px-3 mb-6 ml-3">
//         <div onClick={() => router.push('/dashboard')} className="cursor-pointer">
//           <img src="/face-scan.png" alt="Face Scan" className="w-16 h-16" />
//         </div>
//         <h1 className="text-2xl font-bold text-black dark:text-white mt-4">
//           Face Capture Application
//         </h1>
//         <div className="w-16 h-16" /> {/* Spacer */}
//       </div>

//       {/* Grid of student photo */}
//       <div className="px-6">
//         <div className="grid grid-cols-4 gap-6">
//          {students.map((student) => (
//   <div
//     key={student.id}
//     className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col items-center"
//   >
//     <img
//       src={student.image || "https://via.placeholder.com/150"}
//       alt={student.name}
//       className="w-32 h-32 object-cover rounded-md mb-3"
//     />
//     <p className="text-center font-medium text-black dark:text-white">
//       {student.name}
//     </p>
//     <p className="text-sm text-gray-700 dark:text-gray-300">Gender: {student.gender}</p>
//     <p className="text-sm text-gray-700 dark:text-gray-300">Email: {student.email}</p>
//   </div>
// ))}

//         </div>
//       </div>
//     </div>
//   );
// };

// export default FaceCapture;


"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

const FaceCapture = () => {
  const [students, setStudents] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get("http://localhost:5000/student/recognize-test");

        if (response.data) {
          // Provide default image if image is missing
          const studentData = {
            ...response.data,
            image: response.data.image || "https://via.placeholder.com/150",
          };

          setStudents([studentData]);
        } else {
          toast.warning("No student data found.");
        }
      } catch (error) {
        console.error("Axios error:", error);
        if (error.response && error.response.status === 404) {
          // Still show placeholder even if no image is found in backend
          setStudents([
            {
              id: 0,
              name: "No Registered Student Yet",
              gender: "-",
              email: "-",
              image: "https://via.placeholder.com/150",
            },
          ]);
        } else {
          toast.error("An error occurred while fetching student data.");
        }
      }
    };

    fetchStudent();
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-10 py-8">
      {/* Header */}
      <div className="flex px-3 mb-6 ml-3">
        <div onClick={() => router.push('/dashboard')} className="cursor-pointer">
          <img src="/face-scan.png" alt="Face Scan" className="w-16 h-16" />
        </div>
        <h1 className="text-2xl font-bold text-black dark:text-white mt-4">
          Face Capture Application
        </h1>
        <div className="w-16 h-16" /> {/* Spacer */}
      </div>

      {/* Grid of student photo */}
      <div className="px-6">
        <div className="grid grid-cols-4 gap-6">
          {students.length === 1 && students[0].id === 0 ? (
            <div className="col-span-4 text-center text-gray-500 dark:text-gray-300">
              No registered student with an image found yet.
            </div>
          ) : (
            students.map((student) => (
              <div
                key={student.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col items-center"
              >
                <img
                  src={student.image}
                  alt={student.name}
                  className="w-32 h-32 object-cover rounded-md mb-3"
                />
                <p className="text-center font-medium text-black dark:text-white">
                  {student.name}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Gender: {student.gender}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Email: {student.email}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FaceCapture;
