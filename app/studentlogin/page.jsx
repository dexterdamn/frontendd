'use client';


import { StudentLoginForm } from "./components/studentlogin";
import { Toaster } from "sonner";
export default function Page() {
  return (
    
      <div className="w-full max-w-sm">
        <StudentLoginForm />
        <Toaster position="bottom-right" richColor />
      </div>

  );
}

