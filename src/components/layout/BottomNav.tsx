"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ScanLine, History, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Scan', icon: ScanLine },
  { href: '/history', label: 'History', icon: History },
  { href: '/preferences', label: 'Preferences', icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t z-40 md:max-w-2xl md:mx-auto md:left-auto md:right-auto md:w-full">
      <div className="container mx-auto px-0 h-16 flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={cn(
              "flex flex-col items-center justify-center text-muted-foreground w-full h-full transition-colors duration-200 hover:text-primary",
              isActive ? "text-primary" : "text-foreground/60"
            )}>
              <item.icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
