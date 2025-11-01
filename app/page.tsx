'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const handleScrollToSGA = () => {
    const sgaSection = document.getElementById('sga-section');
    if (sgaSection) {
      sgaSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[90vh] sm:h-[70vh] w-full overflow-hidden flex items-center justify-center">
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

        {/* Arrow */}
        <div
          className="absolute bottom-5 left-1/2 -translate-x-1/2 cursor-pointer z-10 transition-transform hover:translate-y-1"
          onClick={handleScrollToSGA}
        >
          <ChevronDown size={30} className="text-white" />
        </div>
      </div>

      {/* Info Section */}
      <div id="sga-section" className="bg-gray-50 min-h-[90vh] px-4 sm:px-8 py-8 sm:py-16">
        <div className="max-w-7xl mx-auto">
          {/* What's SGA Section */}
          <div className="flex items-center mb-3">
            <h3 className="text-3xl font-bold italic">
              WHAT IS SGA?
            </h3>
            <div className="hidden sm:block flex-1 h-1 bg-black rounded-full ml-2 mt-4" />
          </div>
          
          <p className="text-base leading-relaxed mb-3">
            The Northeastern University Student Government Association (or SGA for
            short) is the representative body serving over 15,000 undergraduate
            students and to change our Boston campus for the better. We take on
            different projects and initiatives, write legislation, and advocate to
            members of the University administration to improve student life,
            classroom programs, and the overall Northeastern Boston campus
            undergraduate experience.
          </p>
          
          <Button
            asChild
            className="font-bold mb-6 bg-primary hover:bg-primary/90"
          >
            <a
              href="https://www.northeasternsga.com/senate"
              target="_blank"
              rel="noopener noreferrer"
            >
              About the Senate
            </a>
          </Button>

          {/* Why Senator Section */}
          <div className="flex items-center justify-start md:justify-end mb-3">
            <div className="hidden sm:block flex-1 h-1 bg-black rounded-full mr-2 mt-4" />
            <h3 className="text-3xl font-bold italic">
              WHY BE A SENATOR?
            </h3>
          </div>
          
          <p className="text-base leading-relaxed mb-3">
            Becoming a senator offers the chance to represent the student body,
            advocate for their concerns, and shape the future of campus life.
            Senators propose legislation, approve budgets, and influence
            university policies. They work collaboratively to address critical
            issues and implement meaningful, lasting changes. If you're passionate
            about leadership, representation, and driving impactful change, this
            role is for you.
          </p>
          
          <Button
            asChild
            className="font-bold bg-primary hover:bg-primary/90"
          >
            <a
              href="https://www.northeasternsga.com/become-a-senator"
              target="_blank"
              rel="noopener noreferrer"
            >
              Requirements & Responsibilities
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
