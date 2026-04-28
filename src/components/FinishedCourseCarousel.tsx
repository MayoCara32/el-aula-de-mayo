"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Users, Archive } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

interface FinishedCourseCarouselProps {
  courses: any[];
}

export function FinishedCourseCarousel({ courses }: FinishedCourseCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!courses || courses.length === 0) {
    return null;
  }

  // Calculate how many courses to show per page based on a static 3 for desktop logic
  // (In a real responsive framer slider we might track window width, but we can also just slide 1 by 1 or page by page.
  // Sliding 1 by 1 is smoother and easier to make responsive).
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + courses.length) % courses.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % courses.length);
  };

  // Get visible courses (handling wrap-around for infinite carousel feel)
  const getVisibleCourses = () => {
    if (courses.length <= 3) return courses;
    const items = [];
    for (let i = 0; i < 3; i++) {
      items.push(courses[(currentIndex + i) % courses.length]);
    }
    return items;
  };

  const visibleCourses = getVisibleCourses();

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-12">
      <div className="relative overflow-hidden py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {visibleCourses.map((course, idx) => (
              <motion.div
                key={`${course.id}-${currentIndex}-${idx}`} // Force re-render for animation
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: -20 }}
                transition={{ duration: 0.4 }}
                className="h-full"
              >
                <div className="flex flex-col h-full p-6 bg-card border border-border/50 rounded-xl relative overflow-hidden group hover:border-primary/50 transition-colors shadow-sm">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Archive className="w-24 h-24" />
                  </div>
                  
                  <div className="flex-1 relative z-10">
                    <h3 className="text-xl font-bold mb-3 line-clamp-2">{course.name}</h3>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-semibold text-foreground">{course.stats?.average?.toFixed(1) || "0.0"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span>{course.stats?.total || 0} alumnos</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto relative z-10 pt-4 border-t border-border/50">
                    <Button asChild className="w-full" variant="secondary">
                      <Link href={`/courses/finished/${course.slug}`}>Ver Reporte Final</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {courses.length > 3 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-background/80 backdrop-blur hover:bg-accent border border-border/50 transition-all z-10 hidden sm:flex"
            onClick={handlePrevious}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-background/80 backdrop-blur hover:bg-accent border border-border/50 transition-all z-10 hidden sm:flex"
            onClick={handleNext}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
          
          {/* Mobile controls */}
          <div className="flex justify-center gap-4 mt-6 sm:hidden">
            <Button variant="outline" size="icon" onClick={handlePrevious} className="rounded-full"><ChevronLeft className="w-5 h-5" /></Button>
            <Button variant="outline" size="icon" onClick={handleNext} className="rounded-full"><ChevronRight className="w-5 h-5" /></Button>
          </div>
        </>
      )}
    </div>
  );
}
