'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="h-full overflow-y-auto">
      {/* Hero Section */}
      <div className="relative h-[75vh] w-full flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 bg-center bg-[url('/images/front-page.jpg')] bg-cover bg-no-repeat filter brightness-40" />

        {/* Content */}
        <div className="relative flex flex-col items-center justify-center gap-3 sm:gap-4 text-center text-primary-foreground px-3 py-4 sm:px-4 sm:py-6 max-w-5xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.5rem] font-bold italic drop-shadow-[7px_7px_10px_rgba(0,0,0,0.8)] leading-tight">
            SENATE NOMINATIONS & APPLICATIONS
          </h1>
          <h2 className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold drop-shadow-[5px_5px_7px_rgba(0,0,0,0.7)]">
            NORTHEASTERN'S STUDENT GOVERNMENT ASSOCIATION
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 mt-2 sm:mt-4 w-full max-w-md px-2 sm:px-0">
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

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg 
            className="w-8 h-8 text-primary-foreground drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>

      {/* Steps Section */}
      <div className="bg-background py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-foreground">
            How to Become a Candidate
          </h2>
          
          <div className="space-y-6 sm:space-y-8">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg sm:text-xl">
                  1
                </div>
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">
                  Complete Your Application
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Click <Link href="/applications" className="text-primary hover:underline font-medium">Apply</Link> to fill out and submit your application for Senate candidacy.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg sm:text-xl">
                  2
                </div>
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">
                  Gather Nominations
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Share the <Link href="/nominations" className="text-primary hover:underline font-medium">nominations link</Link> with members of your academic and community constituency. Constituents can submit nominations online (one at a time) or you can upload one complete paper nomination form containing all 30 nominations. You must receive at least 30 nominations to proceed. Note: A maximum of 15 signatures can come from a community constituency.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg sm:text-xl">
                  3
                </div>
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">
                  Secure an Endorsement
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Have a person of authority submit the <Link href="/endorsements" className="text-primary hover:underline font-medium">endorsement form</Link> on your behalf using the Endorse button above.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg sm:text-xl">
                  4
                </div>
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">
                  Await Confirmation
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Once you&apos;ve completed these steps, you will be notified whether your application has been accepted and you are an eligible candidate for the Senate Elections.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-10 sm:mt-12 p-6 bg-muted rounded-lg">
            <p className="text-sm sm:text-base text-muted-foreground">
              For more information on the application process, please visit the{' '}
              <a 
                href="https://northeasternsga.com/senate-election" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Student Government Association website
              </a>
              {' '}or contact the{' '}
              <a 
                href="mailto:sgaSenateSpeaker@northeastern.edu"
                className="text-primary hover:underline font-medium"
              >
                Speaker of the Senate
              </a>
              {' '}for any questions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
