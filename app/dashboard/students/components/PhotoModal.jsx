import React from 'react';
import FadeModal from "../components/FadeModal"; // Import the FadeModal component
import { Button } from "@/components/ui/button";
const PhotoModal = ({ isOpen, onClose, student, onRetake }) => {
  if (!student) return null;

  return (
    <FadeModal show={isOpen} onClose={onClose} className="w-full max-w-lg p-4 flex flex-col justify-between">
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold text-center dark:text-black">{student.username}</h2>
        <img
          src={student.photo || "https://via.placeholder.com/150"}
          
          className="w-full h-auto object-cover rounded-md my-4 cursor-pointer"
        />
      </div>
      <div className="flex justify-center space-x-4 mt-auto">
        
        <Button onClick={onRetake} className="dark:bg-gray-800 bg-black text-white px-4 py-2 rounded">
          Retake
        </Button>
      </div>
    </FadeModal>
  );
};

export default PhotoModal;