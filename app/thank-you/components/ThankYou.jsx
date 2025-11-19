"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

export default function ThankYou() {
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const router = useRouter();
  
    useEffect(() => {
    // Safely try playing the success sound
    const audio = new Audio("/success-tone.mp3");

    audio
      .play()
      .catch((err) => {
        console.warn("Audio failed to play. Check file or browser autoplay policy:", err);
      });
  }, []);


  useEffect(() => {
    // Wait for client-side rendering
    if (typeof window !== 'undefined') {
      const fName = localStorage.getItem('firstName');
      const lName = localStorage.getItem('lastName');

      setFirstName(fName || '');
      setLastName(lName || '');

      const handlePopState = () => {
        window.history.go(1);
      };

      window.history.pushState(null, null, window.location.href);
      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, []);

  const handleGoToDashboard = () => {
    router.push('/student-dashboard');
  };

  return (
    <div className="min-h-screen bg-blue-200 relative">
      {/* Top right dashboard button */}
      <div className="w-full flex justify-end p-4">
        <Button
          onClick={handleGoToDashboard}
          className="bg-gray-200 text-blue-800 font-semibold py-5 px-6 md:py-6 md:px-10  rounded-xl shadow-md hover:shadow-lg hover:bg- cursor-white cursor-pointer transition-all duration-200 transform hover:scale-105 text-base md:text-sm max-w-full md:max-w-md w-full md:w-auto text-center"
        >
          {firstName && lastName
            ? `${firstName.toUpperCase()}'S DASHBOARD`
            : 'Go to Dashboard'}
        </Button>
      </div>

      {/* Centered Thank You content */}
      <div className="flex items-center justify-center h-[calc(100vh-100px)] px-4 text-center">
        <div className="bg-blue-300 px-10 py-10 rounded-lg shadow-md space-y-6">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900">
            THANK <span className="text-blue-700">YOU!</span>
          </h1>
        </div>
      </div>
    </div>
  );
}
