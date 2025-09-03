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

import AdminLoginForm from "@/app/login/components/AdminLoginForm";

import { Toaster } from "sonner";
export default function AdminLoginPage() {
  return (
    <>
 
      <AdminLoginForm />
      <Toaster position="bottom-right" richColor />
    </>
  );
}
 