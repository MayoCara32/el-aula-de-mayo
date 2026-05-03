"use client";

import { useState } from "react";
import { DetailedReviewCard } from "./DetailedReviewCard";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface DetailedReviewCarouselProps {
  reviews: any[];
}

export function DetailedReviewCarousel({ reviews }: DetailedReviewCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!reviews || reviews.length === 0) {
    return null;
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  return (
    <div className="relative max-w-4xl mx-auto px-4 sm:px-12">
      <div className="relative overflow-hidden" style={{ minHeight: '400px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 w-full"
          >
            <div className="h-full transform transition-transform duration-500">
              {/* Wrapped in a div to override max-w of DetailedReviewCard if needed, or we just let it center */}
              <div className="flex justify-center h-full w-full">
                <div className="w-full max-w-2xl h-full">
                  <DetailedReviewCard review={reviews[currentIndex]} />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {reviews.length > 1 && (
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
            <Button variant="outline" size="icon" onClick={handlePrevious} className="rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNext} className="rounded-full">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="flex justify-center gap-2 mt-6">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx 
                    ? "bg-primary w-6" 
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
