"use client"

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
const RegisterStudents = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [studentName, setStudentName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const videoRef = useRef(null);
    const [isWebcamActive, setIsWebcamActive] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const startWebcam = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                videoRef.current.srcObject = stream;
                setIsWebcamActive(true);
            })
            .catch(err => console.error("Error accessing webcam: ", err));
    };

    const stopWebcam = () => {
        const stream = videoRef.current.srcObject;
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
        }
        videoRef.current.srcObject = null;
        setIsWebcamActive(false);
    };

    return (
        <div>
            <Button
        style={{ 
            backgroundColor: 'black', 
            color: 'white', 
            padding: '10px 20px', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer',
            marginTop: '20px',    // Adjust top margin
            marginLeft: 'auto',    // Center horizontally if in a flex container
            marginRight: 'auto',   // Center horizontally if in a flex container
            display: 'block',      // Ensure it takes full width for auto margins
        }}
        onClick={openModal}
        >
        Register Students
        </Button>
            
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Register Student</h2>
                        <label>
                            Student Name:
                            <input type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
                        </label>
                        <label>
                            Email:
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </label>
                        <label>
                            Password:
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </label>
                        
                        <div className="webcam-container">
                            {isWebcamActive ? (
                                <video ref={videoRef} autoPlay />
                            ) : (
                                <button className="capture-button" onClick={startWebcam}>Capture</button>
                            )}
                            {isWebcamActive && (
                                <button className="retake-button" onClick={stopWebcam}>Retake</button>
                            )}
                        </div>

                        <button className="submit-button" onClick={closeModal}>Register</button>
                        <button className="close-button" onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}

            <style jsx>{`
               .register-button {
                display: inline-block; /* Ensure the button is treated as a block element */
                padding: 10px 20px;
                background-color: #007BFF;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                }
                .modal {
                    display: flex;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    justify-content: center;
                    align-items: center;
                }
                .modal-content {
                    background-color: white;
                    padding: 20px;
                    border-radius: 5px;
                    width: 400px;
                    text-align: center;
                }
                .webcam-container {
                    margin-top: 10px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                video {
                    width: 100%;
                    border: 1px solid #ccc;
                }
                .capture-button, .retake-button, .submit-button, .close-button {
                    margin-top: 10px;
                    padding: 5px 10px;
                    background-color: #28a745;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }
                .close-button {
                    background-color:rgb(211, 19, 38);
                }
            `}</style>
        </div>
    );
};

export default RegisterStudents;