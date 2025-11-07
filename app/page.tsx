'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/front-page.jpg)' }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 -z-10 bg-black/44" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-3 text-center text-white p-3">
          <h1 className="text-[1.75rem] md:text-[3.5rem] font-bold italic drop-shadow-[7px_7px_10px_rgba(0,0,0,0.8)]">
            SENATE NOMINATIONS & APPLICATIONS
          </h1>
          <h2 className="text-base md:text-2xl font-bold drop-shadow-[5px_5px_7px_rgba(0,0,0,0.7)]">
            NORTHEASTERN'S STUDENT GOVERNMENT ASSOCIATION
          </h2>

          <div className="flex gap-2 mt-2">
            <Button
              asChild
              size="lg"
              className="font-bold min-w-[150px] min-h-[56px] bg-primary hover:bg-primary/90"
            >
              <Link href="/applications">Apply</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="font-bold min-w-[150px] min-h-[56px] bg-primary hover:bg-primary/90"
            >
              <Link href="/nominations">Nominate</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
