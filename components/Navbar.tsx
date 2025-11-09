'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const baseNavLinks = [
    { href: '/', label: 'Home' },
    { href: '/applications', label: 'Apply' },
    { href: '/nominations', label: 'Nominate' },
    { href: '/endorsements', label: 'Endorse' },
    { href: '/dashboard', label: 'Dashboard' },
  ];

  const navLinks = [
    ...baseNavLinks,
    ...(user ? [{ href: '/admin', label: 'Admin' }] : []),
    ...(!user ? [{ href: '/login', label: 'Login' }] : []),
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <nav className="bg-white border-b border-primary sticky top-0 z-50 shadow-sm h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center">
            <Image 
              src="/images/senate-logo.png" 
              alt="SGA Senate Logo" 
              width={120} 
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-foreground hover:text-primary hover:border-b-2 hover:border-primary/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary hover:bg-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-primary">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.href)
                    ? 'bg-primary text-white'
                    : 'text-foreground hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
