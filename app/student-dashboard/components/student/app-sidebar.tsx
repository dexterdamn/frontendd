"use client"
import Link from "next/link";
import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  CameraIcon,
  User,
  User2Icon,
  LayoutDashboard,
  CalculatorIcon,
  InspectionPanelIcon,
  FileBarChartIcon
 
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import  { useEffect, useState } from "react"; 
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "../../components/student/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"


const StudentIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 64 64" 
    fill="currentColor" 
    className="h-6 w-6"
  >
    <path d="M32 0L0 16l32 16 32-16L32 0zM0 32v16l32 16 32-16V32l-32 16L0 32zm32 16c-8.84 0-16 7.16-16 16h32c0-8.84-7.16-16-16-16z" />
  </svg>
);


const sampleData = {
  user: {
    username: "",
    email: "",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    // {
    //   title: "Dashboard",
    //   url: "/dashboard",
    //   icon: LayoutDashboard,
    //   isActive: false,
    //   items: [], 
    // },
    // {
    //   title: "Students",
    //   url: "#",
    //   icon: User2Icon,
    //   isActive: true,
    //   items: [
    //     // {
    //     //   title: "Register Students",
    //     //   url: "/dashboard/students",
    //     // },
    //     {
    //       title: "History",
    //       url: "#",
    //     },
        
    //   ],
    // },
    {
      title: "Exam",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Take Exam",
          url: "/student-dashboard/exams",
        },
        // {
        //   title: "Results",
        //   url: "/student-dashboard/results",
        // },
        // {
        //   title: "Exam Schedule",
        //   url: "#",
        // },
    //   ],
    // },
    // {
    //   title: "",
    //   url: "#",
    //   icon: CameraIcon,
    //   items: [
    //     {
    //       title: "Photo",
    //       url: "/dashboard/face",
    //     },
        // {
        //   title: "Get Started",
        //   url: "#",
        // },
        // {
        //   title: "Tutorials",
        //   url: "#",
        // },
        // {
        //   title: "Changelog",
        //   url: "#",
        // },
      ],
    },
    {
      title: "Results",
      url: "#",
      icon: FileBarChartIcon ,
      items: [
        {
          title: "My Results",
          url: "/student-dashboard/results",
        },
      //   {
      //     title: "Face Registration",
      //     url: "#",
      //   },
      //   {
      //     title: "Security & Privacy",
      //     url: "#",
      //   },
       
      ],
    },
  // ],
  // navSecondary: [
  //   {
  //     title: "Support",
  //     url: "#",
  //     icon: LifeBuoy,
  //   },
  //   {
  //     title: "Feedback",
  //     url: "#",
  //     icon: Send,
  //   },
  // ],
  // projects: [
  //   {
  //     name: "Design Engineering",
  //     url: "#",
  //     icon: Frame,
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: PieChart,
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: Map,
  //   },
  ],
}

export function SideBar({ ...props }: React.ComponentProps<typeof Sidebar>) {

   const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");


 useEffect(() => {
    if (typeof window !== "undefined") {
      const firstName = localStorage.getItem("firstName") || "";
      const lastName = localStorage.getItem("lastName") || "";
      const storedEmail = localStorage.getItem("studentEmail") || "";

      const full = `${firstName} ${lastName}`.trim();
      setFullName(full);
      setEmail(storedEmail);
    }
  }, []);
  
const handleNavClick = (title: string) => {
  // You can handle navigation logic here if needed
};

  return (
    <Sidebar collapsible='icon' variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/student-dashboard" className="flex items-center space-x-2">
                <div className="bg-sidebar-black text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-8 text-black bg-gray-200 rounded-lg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.121 17.804A10.969 10.969 0 0112 15c2.485 0 4.768.88 6.879 2.354M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Student</span>
                  <span className="truncate text-xs"></span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain items={data.navMain} /> */}
         <NavMain
        items={sampleData.navMain.map(item => ({
          ...item,
          onClick: () => handleNavClick(item.title),
        }))}
      />
        {/* <NavProjects projects={data.projects} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
       <NavUser user={{ username: fullName, email }} />

      </SidebarFooter>
    </Sidebar>
  )
}
