'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { APP_VERSION } from '@/lib/version';
import { ThemeToggle } from './ThemeToggle';
import { Settings } from '@/lib/data/settings';

interface NavbarClientProps {
  settings: Settings;
}

export function NavbarClient({ settings }: NavbarClientProps) {
  const pathname = usePathname();
  const router = useRouter();
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
    ...(settings.applicationsOpen ? [{ href: '/applications', label: 'Apply' }] : []),
    ...(settings.nominationsOpen ? [{ href: '/nominations', label: 'Nominate' }] : []),
    ...(settings.endorsementRequired && !settings.endorsementsClosed ? [{ href: '/endorsements', label: 'Endorse' }] : []),
    { href: '/dashboard', label: 'Dashboard' },
  ];

  const navLinks = [
    ...baseNavLinks,
    ...(user ? [{ href: '/admin', label: 'Admin' }] : []),
    ...(user ? [{ href: '/users', label: 'Users' }] : []),
    ...(!user ? [{ href: '/login', label: 'Login' }] : []),
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 shadow-sm h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/senate-logo.png"
              alt="SGA Senate Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
              priority
            />
            <span className="text-lg font-semibold text-foreground">
              SenatePath
            </span>
            <span className="mt-1.5 text-xs text-muted-foreground font-medium">
              v{APP_VERSION}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-8 items-center">
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
            {user && (
              <Button onClick={handleLogout} variant="destructive" size="sm">
                Logout
              </Button>
            )}
            <ThemeToggle />
          </div>

          {/* Mobile menu button and theme toggle */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center rounded-md text-foreground hover:text-primary hover:bg-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
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
        <div className="md:hidden border-t border-border bg-background shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.href)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Button
                onClick={handleLogout}
                variant="destructive"
                size="sm"
                className="w-full"
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
