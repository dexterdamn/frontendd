import { useState } from 'react';
import Modal from './Modal';

const Layout = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  return (
    <div className="flex">
      <aside className="sidebar">
        <button onClick={toggleModal} className="register-button">
          Register Students
        </button>
      </aside>
      <main className="main-content">
        <h1>FaceTracker Exam</h1>
      </main>
      {isModalOpen && <Modal onClose={toggleModal} />}
      <style jsx>{`
        .flex {
          display: flex;
        }

        .sidebar {
          width: 200px;
          background-color: #0070f3;
          color: white;
          padding: 20px;
        }

        .main-content {
          flex: 1;
          padding: 20px;
        }

        .register-button {
          background-color: #fff;
          color: #0070f3;
          border: none;
          padding: 10px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Layout;