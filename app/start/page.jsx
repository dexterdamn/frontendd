"use client";
import StartButton from "./components/startbutton"; // Update the import path
import { Toaster } from "sonner";
export default function Page() {
  return (
    <>
      <Toaster position="bottom-right" richColor />
      <StartButton />
    </>
  );
}