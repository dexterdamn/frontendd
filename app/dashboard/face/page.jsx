"use client"; 


import FaceCapture from './components/FaceCapture'; // Import the FaceCapture component
import PhotoModal from "./components/PhotoModal";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
export default function Page() {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem> </ThemeProvider>
        <FaceCapture />
        <PhotoModal />
        <Toaster position="bottom-right" richColor /> {/* Render the FaceCapture component */}
     

    </>
  );
}