"use client";
import Link from "next/link";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Menu, Search, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import em from "../../public/pic.png";
import CitySelect from "./CitySelect";
import CommandDemo from "@/components/LandingPage/Search";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function NavbarAdmin() {
  const [isCommandVisible, setIsCommandVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Assuming user is logged in

  return (
    <div>
      <header className="sticky top-2 flex h-20 items-center gap-4 border-b bg-white px-4 md:px-6  relative z-20 ">
        <nav className="hidden md:flex flex-col md:flex-row items-center gap-6 text-lg font-medium md:text-sm lg:gap-6">
          <Link href="#" className="items-center gap-8 text-lg font-semibold md:text-base full">
            <Image src={em} alt="yojan" width={250} height={100} />
            <span className="sr-only">Yojan</span>
          </Link>
          <Link href="/events" className="text-muted-foreground transition-colors hover:text-foreground">
            Events
          </Link>
          <Button className="border border-blue-500 text-blue-500 bg-transparent hover:bg-blue-50">
            <Link href="/listevent">List Your Event</Link>
          </Button>
        </nav>

        {/* Mobile Menu */}
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
              <Link href="/listevent" className="text-muted-foreground hover:text-foreground">
                List Your Event
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

        {/* Search and City Select */}
        <div className="items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <CitySelect />
        </div>

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

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/your-events">Your Events</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/transactions">Transactions</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    // Logic to handle logout
                    setIsLoggedIn(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
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

      {/* Search Command Palette */}
      {isCommandVisible && (
        <div className="flex items-center justify-center bg-black/50">
          <CommandDemo onClose={() => setIsCommandVisible(false)} />
        </div>
      )}
    </div>
  );
}
