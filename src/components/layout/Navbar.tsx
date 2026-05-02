"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function Navbar() {
  const pathname = usePathname();
  
  const navItems = [
    { name: "Inicio", path: "/" },
    { name: "Cursos", path: "/courses" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105">
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/20 shadow-lg shadow-white/5">
                <Image 
                  src="/logo.jpg" 
                  alt="Logo El aula de Mayo" 
                  fill 
                  className="object-cover"
                  onError={(e) => {
                    // Fallback to text if image not found
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <span className="text-lg font-bold tracking-tight">El aula de Mayo</span>
            </Link>
          </div>
          
          <div className="flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground/80",
                  pathname === item.path ? "text-foreground" : "text-foreground/60"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
