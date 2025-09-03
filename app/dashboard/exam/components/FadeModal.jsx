// // components/FadeModal.js
// import React from 'react';

// const FadeModal = ({ isOpen, onClose, children }) => {
//   if (!isOpen) return null;

//   const handleKeyDown = (event) => {
//         if (event.key === 'Escape') {
//             onClose(); // Close modal on Esc key
//         }
//     };
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-40 bg-opacity-10 bg-black/10 backdrop-blur-">
//   <div className="relative bg-white rounded-xl p-6 shadow-lg w-[870px] h-[510px] max-w-[80%] transition-all duration-300">
//     <button
//       onClick={onClose}
//       className="absolute top-2 right-2 text-gray-500 text-xl "
//     >
//       &times;
//     </button>
//     {children}
//   </div>
// </div>

//   );
// };

// export default FadeModal;




// import React, { useEffect } from 'react';

// const FadeModal = ({ isOpen, onClose, children }) => {
//   if (!isOpen) return null;





//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-40 backdrop-blur-10">
//       <div className="relative bg-white rounded-xl p-6 shadow-lg w-[870px] h-[510px] max-w-[80%] transition-all duration-300 border">
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-4 text-gray-600 text-3xl font-bold hover:text-gray-800 transition cursor-pointer"
//         >
//           &times;
//         </button>
//         {children}
//       </div>
//     </div>
//   );
// };

// export default FadeModal;


import React, { useEffect } from 'react';

const FadeModal = ({ isOpen, onClose, children }) => {
  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      <div className="relative dark:bg-black bg-white  rounded-xl p-6 shadow-lg w-[870px] h-[510px] max-w-[80%] transition-all duration-300 border">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-600 text-3xl font-bold hover:text-gray-800 transition cursor-pointer"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default FadeModal;
