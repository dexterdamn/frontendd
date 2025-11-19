// import { LoginForm } from "@/components/AdminLoginForm";

// export default function LoginPage() {
//   return (
//     <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
//       <div className="w-full max-w-sm">
//         <LoginForm />
//       </div>
//     </div>
//   );
// }

// import AdminLoginForm from "@/app/login/components/AdminLoginForm";

// import { Toaster } from "sonner";
// export default function AdminLoginPage() {
//   return (
//     <>
 
//       <AdminLoginForm />
//       <Toaster position="bottom-right" richColor />
//     </>
//   );
// }
import AdminLoginForm from "@/app/login/components/AdminLoginForm";
import { Toaster } from "sonner";

export default function AdminLoginPage() {
  return (
      <div >
        {/* Logo */}
       <div className="fixed top-0 left-0 flex justify-center bg-blue-100 py-4 z-50">
    <img src="/bg-ad.png" alt="Admin Logo" className="h-16 bg-transparent" />
  </div>
    <div className="bg-blue-100 flex min-h-screen items-center justify-center p-6 md:p-10">
  
      {/* Left Side: Welcome Message */}
      <div className="flex-1 text-black p-10 flex-col">
      
        <h1 className="text-4xl font-bold mx-45">Welcome!</h1>
        <p className="text-lg mt-3 opacity-90 font-sans mx-30">
          Please login to Admin Dashboard.
        </p>
      </div>

      {/* Small Vertical Divider */}
      <div className="border-l border-gray-400 h-150 w-px mx-2" />

      {/* Right Side: Login Form */}
      <div className="flex-1 flex justify-center items-center p-10">
        <div className="w-full max-w-sm">
          <AdminLoginForm />
        </div>
      </div>

      <Toaster position="bottom-right" richColors />
    </div>
    </div>
  );
}