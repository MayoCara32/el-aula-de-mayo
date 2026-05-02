"use client";

import { useState, useEffect } from "react";
import { ReviewCard } from "./ReviewCard";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface ReviewCarouselProps {
  reviews: any[];
}

export function ReviewCarousel({ reviews }: ReviewCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-cycle every 5 seconds if not hovered
  useEffect(() => {
    if (reviews.length <= 1 || isHovered) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [reviews.length, isHovered]);

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50">
        <p className="text-muted-foreground">Aún no hay opiniones publicadas.</p>
      </div>
    );
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  return (
    <div 
      className="relative max-w-4xl mx-auto px-12"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* BUG-09 fix: min-h en vez de h fija para que comentarios largos no se corten */}
      <div className="relative min-h-[220px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div className="h-full transform transition-transform duration-500 hover:scale-[1.02]">
              <ReviewCard review={reviews[currentIndex]} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {reviews.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-background/50 backdrop-blur hover:bg-accent/80 border border-border/50 transition-all z-10"
            onClick={handlePrevious}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-background/50 backdrop-blur hover:bg-accent/80 border border-border/50 transition-all z-10"
            onClick={handleNext}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
          
          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx 
                    ? "bg-primary w-8" 
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
                }`}
                aria-label={`Ir a reseña ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
