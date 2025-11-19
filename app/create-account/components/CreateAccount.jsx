// "use client";

// import { useState } from "react";
// import { FaUser, FaEnvelope, FaLock, FaBirthdayCake, FaGraduationCap } from "react-icons/fa";
// import { FcGoogle } from "react-icons/fc";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";

// export default function CreateAccount({ onBack }) {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [gender, setGender] = useState("");
//   const [birthday, setBirthday] = useState("");
//   const [yearLevel, setYearLevel] = useState(""); // ✅ Year Level
//   const [program, setProgram] = useState("");     // ✅ Program

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       toast.error("Passwords do not match.");
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:5000/admin/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           username,
//           email,
//           password,
//           confirm_password: confirmPassword,
//           gender,
//           birthday,
//           yearLevel,
//           program,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         let errorMessage = data.error || "Registration failed.";
//         if (data.error.includes("Username or email already exists")) {
//           errorMessage = "This email is already registered.";
//         }
//         toast.error(errorMessage);
//         return;
//       }

//       toast.success("Account created successfully! A confirmation email has been sent.");
//       setTimeout(() => {
//         onBack(); // Redirect to login
//       }, 2000);
//     } catch (error) {
//       console.error("Registration error:", error);
//       let errorMessage = "An error occurred. Please try again.";
//       if (error instanceof TypeError && error.message === "Failed to fetch") {
//         errorMessage = "Failed to connect to the backend.";
//       } else if (error.message?.includes("CORS")) {
//         errorMessage = "CORS error: Check server's CORS settings.";
//       } else if (error instanceof SyntaxError && error.message.includes("JSON")) {
//         errorMessage = "Invalid JSON response from the server.";
//       } else if (String(error).includes("NetworkError")) {
//         errorMessage = "A network error occurred. Please try again.";
//       }
//       toast.error(errorMessage);
//     }
//   };

//   return (
//     <div className="bg-white text-black rounded-md max-w-md mx-auto p-4">
//       <h2 className="font-bold text-center text-2xl py-3">Create New Account</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="flex items-center border border-black rounded-md p-2 mb-3">
//           <FaUser className="text-black mr-2" />
//           <input
//             type="text"
//             placeholder="Username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//             className="flex-1 outline-none"
//           />
//         </div>
//         <div className="flex items-center border border-black rounded-md p-2 mb-3">
//           <FaEnvelope className="text-black mr-2" />
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="flex-1 outline-none"
//           />
//         </div>
//         <div className="flex items-center border border-black rounded-md p-2 mb-3">
//           <FaLock className="text-black mr-2" />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="flex-1 outline-none"
//           />
//         </div>
//         <div className="flex items-center border border-black rounded-md p-2 mb-3">
//           <FaLock className="text-black mr-2" />
//           <input
//             type="password"
//             placeholder="Confirm Password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//             className="flex-1 outline-none"
//           />
//         </div>

//         {/* Gender */}
//         <div className="flex items-center border border-black rounded-md p-2 mb-3">
//           <select
//             value={gender}
//             onChange={(e) => setGender(e.target.value)}
//             required
//             className="flex-1 outline-none bg-white text-black"
//           >
//             <option value="" disabled>
//               Select Gender
//             </option>
//             <option value="Male">Male</option>
//             <option value="Female">Female</option>
           
//           </select>
//         </div>

//         {/* Birthday */}
//         {/* <div className="flex items-center border border-black rounded-md p-2 mb-3">
//           <FaBirthdayCake className="text-black mr-2" />
//           <input
//             type="date"
//             value={birthday}
//             onChange={(e) => setBirthday(e.target.value)}
//             required
//             className="flex-1 outline-none text-black"
//           />
//         </div> */}

//         {/* Year Level */}
//         {/* <div className="flex items-center border border-black rounded-md p-2 mb-3">
//           <select
//             value={yearLevel}
//             onChange={(e) => setYearLevel(e.target.value)}
//             required
//             className="flex-1 outline-none bg-white text-black"
//           >
//             <option value="" disabled>
//               Select Year Level
//             </option>
//             <option value="1st Year">1st Year</option>
//             <option value="2nd Year">2nd Year</option>
//             <option value="3rd Year">3rd Year</option>
//             <option value="4th Year">4th Year</option>
//           </select>
//         </div> */}

//         {/* Program */}
//         {/* <div className="flex items-center border border-black rounded-md p-2 mb-3">
//           <FaGraduationCap className="text-black mr-2" />
//           <input
//             type="text"
//             placeholder="Program (BSCS)"
//             value={program}
//             onChange={(e) => setProgram(e.target.value)}
//             required
//             className="flex-1 outline-none"
//           />
//         </div> */}

//         <Button type="submit" className="bg-black text-white w-full mb-2 dark:bg-black">
//           Create Account
//         </Button>

//         <Button
//           type="button"
//           onClick={() => toast.error("Google login not implemented")}
//           className="bg-black border text-white w-full flex items-center justify-center dark:bg-black"
//         >
//           <FcGoogle className="text-xl mr-2" />
//           Login with Google
//         </Button>
//       </form>

//       <div className="text-black mt-4 text-center">
//         <p>
//           Already have an account?{" "}
//           <span
//             onClick={onBack}
//             className="text-blue-600 cursor-pointer hover:text-blue-800"
//           >
//             Login here
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// }
