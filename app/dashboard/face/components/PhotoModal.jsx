// // components/FadeModal.js
// 'use client';

// import React from 'react';

// const FadeModal = ({ isOpen, onClose, children }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="relative bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
//         <button
//           onClick={onClose}
//           className="absolute top-2 right-2 text-gray-500 text-xl"
//         >
//           &times;
//         </button>
//         {children}
//       </div>
//     </div>
//   );
// };

// export default FadeModal;
