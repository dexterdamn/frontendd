"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  LogOut,
} from "lucide-react"
import { useRouter } from 'next/navigation' 
import { ModeToggle } from '@/components/theme-provider';
import { ThemeProvider } from "next-themes";
import { useState, useEffect } from 'react'; 
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

interface User {
  username: string;
  email: string;
  avatar?: string;
}

export function NavUser({ user }: { user: User }) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

//   const handleLogout = () => {
//     localStorage.clear(); 
//   // localStorage.removeItem("token");
//   // localStorage.removeItem("username");
//   // localStorage.removeItem("email");
//   // localStorage.removeItem("gender");
// // Clear local storage

//     // Optionally clear credentials if supported
//     if (navigator.credentials) {
//       navigator.credentials.preventSilentAccess().catch(err => {
//         console.error("Error clearing credentials:", err);
//       });
//     }

//     router.replace("/student"); 
//   };

// const handleLogout = () => {
//   localStorage.removeItem("token"); // clears all items

//   if (navigator.credentials) {
//     navigator.credentials.preventSilentAccess().catch(err => {
//       console.error("Error clearing credentials:", err);
//     });
//   }

//   router.replace("/student");
// };

const handleLogout = () => {
  localStorage.removeItem("studentFirstName");
  localStorage.removeItem("studentLastName");
  localStorage.removeItem("studentEmail");
  localStorage.removeItem("studentToken");

  if (navigator.credentials) {
    navigator.credentials.preventSilentAccess().catch(console.error);
  }

  router.replace("/student");
};



  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar || "/image.png"} alt={user.username} />
                <AvatarFallback className="rounded-lg"></AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-lg leading-tight">
                <span className="truncate font-semibold">{user.username}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar || "/image.png"} alt={user.username} />
                  <AvatarFallback className="rounded-lg"></AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.username}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <ModeToggle/>Theme
             
            </ThemeProvider>
            <DropdownMenuGroup>
              {/* <DropdownMenuItem>
                <BadgeCheck />
                Accounts
              </DropdownMenuItem> */}
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="cursor-pointer"/>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}