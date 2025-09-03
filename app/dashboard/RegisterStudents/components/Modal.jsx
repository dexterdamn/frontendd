import { useRef, useState } from 'react';
import Webcam from 'react-webcam';

const Modal = ({ onClose }) => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic here
    console.log(formData);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Register Student</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Student Name:
            <input type="text" name="name" onChange={handleChange} required />
          </label>
          <label>
            Email:
            <input type="email" name="email" onChange={handleChange} required />
          </label>
          <label>
            Password:
            <input type="password" name="password" onChange={handleChange} required />
          </label>
          <div className="webcam-container">
            <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
            {capturedImage && <img src={capturedImage} alt="Captured" />}
            <button type="button" onClick={capture}>
              Capture
            </button>
            {capturedImage && <button type="button" onClick={() => setCapturedImage(null)}>Retake</button>}
          </div>
          <button type="submit">Register</button>
        </form>
        <button onClick={onClose}>Close</button>
      </div>
      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal {
          background: white;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .webcam-container {
          margin: 20px 0;
        }
      `}</style>
    </div>
  );
};

export default Modal;