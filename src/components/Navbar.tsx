

"use client";
import Link from 'next/link'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { CircleUser, Menu, Package2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import CitySelect from './CitySelect'
import img from '../../public/pic.png'

//https://see.fontimg.com/api/rf5/p7GaR/YjJlMWIwZTY4OGUzNDkwOGFhYTE0Nzk0MDkzYTM1YWMub3Rm/WW9qYW4/angel-demo-regular.png?r=fs&h=98&w=1500&fg=000000&bg=FFFFFF&s=65

export default function Navbar(){
  
    return(
        <header className="sticky top-2 flex h-20 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden md:flex flex-col md:flex-row items-center gap-6 text-lg font-medium md:text-sm lg:gap-6">
            <Link
                href="#"
                className="flex items-center gap-8 text-lg font-semibold md:text-base full "
            >
                <Image src={img} alt="yojan" width={150}
height={100}/>
                <span className="sr-only">Yojan</span>
            </Link>
            <Link
                href="/events"
                className="text-muted-foreground transition-colors hover:text-foreground"
            >
                Events
            </Link>
            <Button className="border border-blue-500 text-blue-500 bg-transparent hover:bg-blue-50"><Link href="/listevent">List Your Event</Link></Button>
            </nav>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <img src='https://see.fontimg.com/api/rf5/p7GaR/YjJlMWIwZTY4OGUzNDkwOGFhYTE0Nzk0MDkzYTM1YWMub3Rm/WW9qYW4/angel-demo-regular.png?r=fs&h=98&w=1500&fg=000000&bg=FFFFFF&s=65'></img>
                <span className="sr-only">Yojan</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Search
              </Link>
              <Link
                href="/events"
                className="text-muted-foreground hover:text-foreground"
              >
                Events
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Today's Events
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <CitySelect />
          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search Events..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </form>
          <Link href='./signin'>
            <Button className=''>Login</Button>
          </Link>
          <Link href='./signup'>
            <Button>Sign Up</Button>
          </Link>
          {/* <DropdownMenu>
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
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </header>
    )
}