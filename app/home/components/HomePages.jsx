"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils"; 
import styles from '@/styles/global.module.css';


export default function HomePage() {
  const router = useRouter();

  const handleStudentLogin = () => {
    router.push("/studentlogin");
  };
``
  const handleAdminLogin = () => {
    router.push("/adminlogin");
  };

  return (
    <div className={cn("flex flex-col gap-6", styles.container)}>
      {/* Navigation Bar */}
      <nav className={cn("flex items-center justify-between p-4")}>
        <div className={styles.logo}>
          <Image
            src="/logo.jfif"
            alt="Logo"
            width={90}
            height={80}
          />
        </div>

        <div className={styles.section}>
          <h1 className={styles.section}>
            FaceTracker <span className={styles.highlight}>Exam</span>
          </h1>
        </div>

        <ul className={styles.navLinks}>
          <li><a href="/">Home</a></li>
          <li><a href="/help">Help</a></li>
          <li><a href="/studentlogin">Student</a></li>
          <li><a href="/login">Admin</a></li>
        </ul>
      </nav>

      <div className={styles.contentWrapper}>
        {/* Left Section */}
        <div className={styles.leftSection}>
          <h1 className={styles.title}>
            FaceTracker <span className={styles.highlight}>Exam</span>
          </h1>
          <p className={styles.description}>
            Seamlessly conduct exams with facial recognition technology. Ensure integrity and efficiency with real-time monitoring.
          </p>
          <p className={styles.description}>
            Facial recognition technology helps make school tests fairer by making sure the right students are taking the exam. Verifying each student's identity before they start.

            The system also includes eye-tracking, which monitors where students are looking during the test. If a student looks away from the screen, they get a warning alert. This feature helps keep everyone focused and honest during exams.
          </p>
        </div>

        {/* Right Section */}
        <div className={styles.rightSection}>
          <Image
            src="/two.avif"
            alt="FaceTracker"
            width={500}
            height={400}
            className={styles.img}
          />
        </div>
      </div>
    </div>
  );
}
