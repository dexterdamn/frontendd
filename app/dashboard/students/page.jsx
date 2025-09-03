

// import { Students } from './components/Students'

// export default function Page() {
//   return (
//     <div className="flex min-h-svh  w-full items-center justify-center p-6 md:p-10">
//       <div className="w-full max-w-sm">
//         <Students />
//       </div>
//     </div>
//   )
// }\\ bg-gradient-to-r from-blue-500 to-purple-500


'use client';

import Students from './components/Students';
import PhotoModal from './components/PhotoModal';
import FadeModal from './components/FadeModal';
import { Toaster } from 'sonner';
const StudentsPage = () => {
  return (
    <>
      <div style={{marginTop:'-50px'}} className=" font-serif py-40">
        <Students />
        <PhotoModal />
        <FadeModal />
     
      
      <Toaster position="bottom-right" richColor />
      </div>
    </>
  );
};

export default StudentsPage;