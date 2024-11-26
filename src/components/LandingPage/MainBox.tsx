import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Boxes } from "../ui/background-boxes";

export default function MainBox() {
  return (
    <div className="w-screen min-h-screen h-96 relative bg-slate-900 flex flex-col items-center justify-center rounded-lg overflow-hidden">
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />

      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative z-20 flex-grow">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <Boxes />
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl relative z-20 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent animate-gradient-shine">
                Plan Your Event, Pay with Solana
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl relative z-20">
                Seamlessly organize and attend events with blockchain-powered ticketing and payments.
              </p>
            </div>
            <div className="space-x-4 relative z-20">
              <Button asChild>
                <Link href="/signin">Login</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
