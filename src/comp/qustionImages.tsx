"use client";

import * as React from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export default function QuestionImages({ images }: { images: string[] }) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  // refs for history / popstate handling
  const pushedRef = React.useRef(false);
  const ignoreNextPopRef = React.useRef(false);

  // Touch/swipe handling refs
  const touchStartYRef = React.useRef<number | null>(null);
  const touchCurrentYRef = React.useRef<number | null>(null);

  // Push a dummy history state when dialog opens so back button will close it
  React.useEffect(() => {
    if (!open) return;

    // push a new history entry; use a unique key so it doesn't collide
    const stateObj = { dialogOpen: true, ts: Date.now() };
    window.history.pushState(stateObj, "");

    pushedRef.current = true;

    const onPopState = () => {
      // If dialog is open and a pop happens, close it instead of navigating away
      if (open) {
        // set a flag so subsequent history.back() triggered by our cleanup doesn't re-trigger logic
        ignoreNextPopRef.current = true;
        setOpen(false);
      }
    };

    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
    };
    // we intentionally depend on `open` so handler registers only while open
  }, [open]);

  // When dialog closes normally (user presses X or swipes), we should remove the pushed history entry.
  // We do this by calling history.back() — but that will trigger popstate; we use ignoreNextPopRef to ignore it.
  React.useEffect(() => {
    if (open) return; // only run when closing
    if (pushedRef.current) {
      // If we recently set ignoreNextPopRef (because popstate closed it), we should clear flags and avoid another back()
      if (ignoreNextPopRef.current) {
        // Popstate already handled removing the history entry (user pressed back).
        pushedRef.current = false;
        ignoreNextPopRef.current = false;
        return;
      }

      // Otherwise, programmatically go back to remove our pushed state
      // set ignoreNextPop so the popstate event caused by history.back() doesn't re-close or reopen
      ignoreNextPopRef.current = true;
      try {
        window.history.back();
      } catch (error) {
        console.error("Error going back in history:", error);
        // fail silently if history.back isn't available
      } finally {
        pushedRef.current = false;
      }
    }
  }, [open]);

  // Touch handlers for swipe up/down to close
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartYRef.current = e.touches[0].clientY;
      touchCurrentYRef.current = e.touches[0].clientY;
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && touchStartYRef.current != null) {
      touchCurrentYRef.current = e.touches[0].clientY;
      // optional: you could add visual feedback (translateY) if you want
    }
  };

  const onTouchEnd = () => {
    const start = touchStartYRef.current;
    const end = touchCurrentYRef.current;
    touchStartYRef.current = null;
    touchCurrentYRef.current = null;

    if (start == null || end == null) return;

    const deltaY = end - start;
    const threshold = 100; // px required to trigger close

    if (Math.abs(deltaY) > threshold) {
      // Significant swipe up or down -> close dialog
      setOpen(false);
    }
  };

  // Small helper to open dialog for a given index
  const openAt = (index: number) => {
    setSelectedIndex(index);
    setOpen(true);
  };

  // Render
  return (
    <div className="sm:mx-10 flex justify-center flex-wrap gap-2 my-2">
      {/* Thumbnails */}
      {images?.length > 0 &&
        images.map((image, index) => (
          <div
            key={image}
            onClick={() => openAt(index)}
            className={cn(
              "relative flex-1 rounded-md overflow-hidden min-w-[40%] cursor-pointer",
              images.length === 1
                ? "h-[400px] md:h-[500px] !md:w-[50%]"
                : "h-[250px]"
            )}
          >
            <Image
              src={image}
              fill
              className="object-cover"
              alt={`image-${index}`}
            />
          </div>
        ))}

      {/* Single Dialog that shows the carousel */}
      <Dialog open={open} onOpenChange={setOpen}>
        {/* Invisible trigger so DialogContent can be used programmatically (DialogTrigger not required here). */}
        <DialogTrigger asChild>
          {/* empty button because thumbnails open dialog manually */}
          <button className="hidden" aria-hidden />
        </DialogTrigger>

        <DialogContent className="max-w-[95vw] md:max-w-[80vw] p-0 bg-transparent border-none shadow-none">
          {/* Close button (X) - placed top-right and responsive for small screens */}
          <button
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute z-50 right-4 top-4 md:right-6 md:top-6 bg-black/40 backdrop-blur-sm p-2 rounded-full hover:bg-black/50 focus:outline-none"
            style={
              {
                // ensure it's visible on dark translucent background; tweak size on small screens
              }
            }
          >
            {/* Simple X mark -- you can replace with an icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 8.586L15.293 3.293a1 1 0 011.414 1.414L11.414 10l5.293 5.293a1 1 0 01-1.414 1.414L10 11.414l-5.293 5.293a1 1 0 01-1.414-1.414L8.586 10 3.293 4.707A1 1 0 014.707 3.293L10 8.586z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <div
            // touch handlers attached to the area containing the carousel
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className="w-full max-w-[95vw] md:max-w-[80vw] h-[100vh] flex items-center justify-center"
          >
            <Carousel
              // force remount when selectedIndex changes so carousel starts at right index
              key={selectedIndex}
              opts={{
                startIndex: selectedIndex,
              }}
              className="w-full h-full backdrop-blur-2xl bg-gray-800/30"
            >
              <CarouselContent>
                {images.map((img, i) => (
                  <CarouselItem
                    key={i}
                    className="flex justify-center items-center h-full"
                  >
                    <div className="relative w-full h-[60vh] md:h-[80vh] rounded-md flex items-center justify-center">
                      <Image
                        src={img}
                        fill
                        alt={`full-${i}`}
                        className="object-contain rounded-md"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Arrows (hidden on small screens) */}
              <div className="hidden md:block">
                <CarouselPrevious />
                <CarouselNext />
              </div>
            </Carousel>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
