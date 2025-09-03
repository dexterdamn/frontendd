// "use client";

// import Exams from "./components/Exams";

// export default function Page() {
//   return <Exams />;
// }

import Exams from './components/Exams';
import { Toaster } from 'sonner';
export default function ExamPage() {
    return (
        <div>
            <Exams />
            <Toaster position="bottom-right" richColor />
        </div>
    );
}