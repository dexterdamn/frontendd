"use client";

import { useState } from "react";
import StudentLoginForm from "./student-login/page";
import CreateAccount from "./create-account/page";

export default function StudentPage() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="h-screen w-screen bg-blue-100 flex items-center justify-center">
      {showLogin ? (
        <StudentLoginForm onSignupClick={() => setShowLogin(false)} />
      ) : (
        <CreateAccount onBack={() => setShowLogin(true)} />
      )}
    </div>
  );
}
