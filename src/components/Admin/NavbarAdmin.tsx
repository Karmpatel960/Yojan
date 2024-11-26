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
import em from "../../../public/pic.png";
import { useAuth } from "@/hooks/useAuth";
import CommandDemo from "@/components/LandingPage/Search"

export default function NavbarAdmin() {
  const { isAuthenticated, logout, verifyToken } = useAuth();
  const [authStatus, setAuthStatus] = useState(false);
  const [isCommandVisible, setIsCommandVisible] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const { success } = await verifyToken();
        setAuthStatus(success);
      } else {
        setAuthStatus(false);
      }
    };

    checkAuthStatus();
  }, [verifyToken]);

  const handleLogout = async () => {
    await logout();
    setAuthStatus(false);
  };

  return (
    <div>
    <header className="sticky top-2 flex h-20 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden md:flex flex-col md:flex-row items-center gap-6 text-lg font-medium md:text-sm lg:gap-6">
        <Link href="#" className="flex items-center gap-8 text-lg font-semibold md:text-base full">
          <Image src={em} alt="yojan" width={150} height={100} />
          <span className="sr-only">Yojan</span>
        </Link>
        <Link href="/events" className="text-muted-foreground transition-colors hover:text-foreground">
          Events
        </Link>
        <Button className="border border-blue-500 text-blue-500 bg-transparent hover:bg-blue-50">
          <Link href="/listevent">List Your Event</Link>
        </Button>
      </nav>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
              <Image src="https://see.fontimg.com/api/rf5/p7GaR/YjJlMWIwZTY4OGUzNDkwOGFhYTE0Nzk0MDkzYTM1YWMub3Rm/WW9qYW4/angel-demo-regular.png?r=fs&h=98&w=1500&fg=000000&bg=FFFFFF&s=65" alt="Description"/>
              <span className="sr-only">Yojan</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              Search
            </Link>
            <Link href="/events" className="text-muted-foreground hover:text-foreground">
              Events
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              Your Events
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              Transactions
            </Link>
          </nav>
        </SheetContent>
      </Sheet>

      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search Events..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              onFocus={() => setIsCommandVisible(true)} 
            />
          </div>
        </form>

        {authStatus ? (
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
              <DropdownMenuItem onClick={() => alert('Settings')}>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert('Support')}>Support</DropdownMenuItem>
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
    </header>

    {isCommandVisible && (
        <div className="flex items-center justify-center bg-black/50">
            <CommandDemo onClose={() => setIsCommandVisible(false)}/>
        </div>
      )}
    </div>
  );
}