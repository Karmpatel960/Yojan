"use client";
import { useState } from 'react';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Wallet, Globe,Search } from "lucide-react"
import CommandDemo from "@/components/LandingPage/Search";
import MainBox from "./MainBox"
import EventPage from "@/components/LandingPage/EventBox"


export default function LandingPage() {
  const [isCommandVisible, setIsCommandVisible] = useState(false);
  return (
    <div className="flex flex-col min-h-screen  relative z-20">
      <main className="flex-1">
        <MainBox/>
        
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Why Choose Yojan?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <Wallet className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Solana Payments</h3>
                <p className="text-gray-500">Fast and secure transactions with low fees using Solana blockchain.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Globe className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Global Events</h3>
                <p className="text-gray-500">Discover and attend events from around the world.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Calendar className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Easy Planning</h3>
                <p className="text-gray-500">Intuitive tools for organizers to create and manage events effortlessly.</p>
              </div>
            </div>
          </div>
        </section>
        <section id="events" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Upcoming Events
            </h2>
            <div className="flex justify-center mb-8">
              <div className="flex w-full max-w-sm items-center space-x-2">
              <form className="flex relative flex-1space-x-2 ">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search Events..."
                    className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                    onFocus={() => setIsCommandVisible(true)}
                    onBlur={() => setIsCommandVisible(false)}
                  />
                  <Button>Search</Button>
              </form>
              </div>
            </div>
            <div>
              <EventPage/>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to revolutionize your event experience?
                </h2>
                <p className="mx-auto max-w-[600px] text-primary-foreground/90 md:text-xl">
                  Join EventChain today and start planning or attending events with the power of blockchain.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild variant="secondary">
                  <Link href="/signup">Get Started</Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2023 Yojan. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>

      {isCommandVisible && (
  <div className="absolute w-full bg-black/50">
    <CommandDemo onClose={() => setIsCommandVisible(false)} />
  </div>
)}
    </div>


  )
}