"use client";

import  Results  from "./components/Results"
import { Toaster } from "sonner";

export default function Page() {
  return (
    <div className="">
      <div className="">
        <Results />
        <Toaster position="bottom-right" richColor />
      </div>
    </div>
  )
}