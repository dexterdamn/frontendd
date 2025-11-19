import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import axios from 'axios';

const ExamFormModal = ({ onClose, onCreate, exam }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
    if (exam) {
        setTitle(exam.title);
        setDescription(exam.description || ''); // Pre-fill description if available
    } else {
        setTitle('');
        setDescription('');
    }
}, [exam]);


    useEffect(() => {
        if (exam) {
            setTitle(exam.title); // Pre-fill title for editing
        } else {
            setTitle(''); // Reset title if creating a new exam
        }
    }, [exam]);

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            onClose(); // Close modal on Esc key
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
const handleSubmit = async (event) => {
  event.preventDefault();

  if (title.trim() === '') {
    toast.error('Title is required!');
    return;
  }

  const examData = { title, description };

  onCreate(examData); // Just pass data up
  onClose(); // Close modal
};



    return (
        <div className="modal-overlay font-sans">
            <div className="fade-modal dark:bg-gray-800">
                <span className="close-button " onClick={onClose}>&times;</span>
                <h2 className="text-2xl font-semibold mb-4 text-center dark:text-black ">{exam ? 'Edit Exam' : 'Create Exam'}</h2>
              <form onSubmit={handleSubmit}>
    <label className="block mb-4 ">
        <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter exam title"
            required
            className="border border-gray-300 rounded-md w-full p-2 dark:text-black"
        />
    </label>
    <label className="block mb-4">
        <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter exam description"
            rows={4}
            className="border border-gray-300 rounded-md w-full p-2 dark:text-black"
        />
    </label>
<div className="flex justify-end gap-2 mt-4">
  <Button
    type="button"
    onClick={onClose}
    className="border border-gray-300 text-gray-800 cursor-pointer bg-white hover:bg-gray-100 rounded-md px-5 py-2 font-medium transition-colors dark:text-black dark:border-gray-600 dark:bg-transparent dark:hover:bg-gray-300"
  >
    Cancel
  </Button>

  <Button
    type="submit"
    className="bg-black text-white rounded-md px-5 py-2 cursor-pointer font-medium hover:bg-gray-800  transition-colors"
  >
    Continue
  </Button>
</div>

</form>

            </div>
            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }

                .fade-modal {
                    background: white;
                    border-radius: 12px;
                    padding: 10px;
                    max-width: 80%;
                    width: 420px;
                    height: 300px;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
                    transition: all 0.3s ease;
                }

                .close-button {
                    font-size: 24px;
                    cursor: pointer;
                    position: absolute;
                    top: 10px;
                    right: 15px;
                    color: gray;
                }

                @media (max-width: 600px) {
                    .fade-modal {
                        width: 95%;
                    }

                    .close-button {
                        font-size: 40px;
                    }
                }
            `}</style>
        </div>
    );
};

export default ExamFormModal;