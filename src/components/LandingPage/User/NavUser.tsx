"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { CircleUser, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import CitySelect from '@/components/CitySelect';
import CommandDemo from "@/components/LandingPage/Search";

export default function NavUser() {
  const {isAuthenticated, logout, verifyToken } = useAuth();
  const [authStatus, setAuthStatus] = useState(false);
  const [isCommandVisible, setIsCommandVisible] = useState(false);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const { success } = await verifyToken();
      if(!success) {
        setAuthStatus(false);
        return;
      }
      setAuthStatus(true);
    } else {
      setAuthStatus(false);
    }
  };

  // Check auth status when component mounts
  useEffect(() => {
    isAuthenticated == true;
    checkAuthStatus();
  }, []);

  // Add event listener for storage changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "accessToken") {
        checkAuthStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Custom event listener for auth changes
    window.addEventListener("authStateChanged", checkAuthStatus);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authStateChanged", checkAuthStatus);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setAuthStatus(false);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("authStateChanged"));
  };

  return (
    <header className="sticky top-2 flex h-20 items-center gap-4 border-b bg-background px-4 md:px-6">
      {/* Logo and navigation */}
      <nav className="hidden md:flex flex-col md:flex-row items-center gap-6 text-lg font-medium">
        <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
          <Image
            src="https://see.fontimg.com/api/rf5/p7GaR/YjJlMWIwZTY4OGUzNDkwOGFhYTE0Nzk0MDkzYTM1YWMub3Rm/WW9qYW4/angel-demo-regular.png?r=fs&h=98&w=1500&fg=000000&bg=FFFFFF&s=65"
            alt="Yojan"
            height={60}
            width={80}
          />
          <span className="sr-only">Yojan</span>
        </Link>
        <Link href="/events" className="text-muted-foreground transition-colors hover:text-foreground">
          Events
        </Link>
      </nav>

      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
              <Image
                src="https://see.fontimg.com/api/rf5/p7GaR/YjJlMWIwZTY4OGUzNDkwOGFhYTE0Nzk0MDkzYTM1YWMub3Rm/WW9qYW4/angel-demo-regular.png?r=fs&h=98&w=1500&fg=000000&bg=FFFFFF&s=65"
                alt="Yojan"
                height={200}
                width={350}
              />
              <span className="sr-only">Yojan</span>
            </Link>
            <Link href="/events" className="text-muted-foreground hover:text-foreground">
              Events
            </Link>
            <Link href="/market" className="text-muted-foreground hover:text-foreground">
              MarketPlace
            </Link>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Search and City selection */}
      <div className="ml-auto flex items-center gap-4">
        <CitySelect />
        <form className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search Events..."
            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            onFocus={() => setIsCommandVisible(true)}
            onBlur={() => setIsCommandVisible(false)}
          />
        </form>

        {/* User authentication */}
        {true ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Link href="/signin">
              <Button>Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </>
        )}
      </div>

      {/* Command demo */}
      {isCommandVisible && (
        <div className="absolute w-full bg-black/50">
          <CommandDemo onClose={() => setIsCommandVisible(false)} />
        </div>
      )}
    </header>
  );
}

