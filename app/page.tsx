'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="h-full overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-full w-full flex items-center justify-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/front-page.jpg)' }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 -z-10 bg-black/44" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-3 sm:gap-4 text-center text-white px-4 py-6 max-w-5xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.5rem] font-bold italic drop-shadow-[7px_7px_10px_rgba(0,0,0,0.8)] leading-tight">
            SENATE NOMINATIONS & APPLICATIONS
          </h1>
          <h2 className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold drop-shadow-[5px_5px_7px_rgba(0,0,0,0.7)]">
            NORTHEASTERN'S STUDENT GOVERNMENT ASSOCIATION
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full max-w-md px-4 sm:px-0">
            <Button
              asChild
              size="lg"
              className="font-bold w-full sm:min-w-[150px] h-12 sm:h-14 text-base sm:text-lg bg-primary hover:bg-primary/90"
            >
              <Link href="/applications">Apply</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="font-bold w-full sm:min-w-[150px] h-12 sm:h-14 text-base sm:text-lg bg-primary hover:bg-primary/90"
            >
              <Link href="/nominations">Nominate</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="font-bold w-full sm:min-w-[150px] h-12 sm:h-14 text-base sm:text-lg bg-primary hover:bg-primary/90"
            >
              <Link href="/endorsements">Endorse</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
