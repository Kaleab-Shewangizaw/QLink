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

  return (
    <div className="sm:mx-10 flex justify-center flex-wrap gap-2 my-2">
      {images?.length > 0 &&
        images.map((image, index) => (
          <Dialog key={image}>
            <DialogTrigger asChild>
              <div
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  "relative flex-1 rounded-md overflow-hidden min-w-[40%]  cursor-pointer ",
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
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] md:max-w-[80vw] p-0 bg-transparent border-none shadow-none">
              <Carousel
                opts={{
                  startIndex: selectedIndex,
                }}
                className="w-full max-w-[95vw] md:max-w-[80vw]"
              >
                <CarouselContent>
                  {images.map((img, i) => (
                    <CarouselItem
                      key={i}
                      className="flex justify-center items-center"
                    >
                      <div className="relative w-full h-[60vh] md:h-[80vh] rounded-md ">
                        <Image
                          src={img}
                          fill
                          alt={`full-${i}`}
                          className="object-contain rounded-md "
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Hide arrows on small screens */}
                <div className="hidden md:block">
                  <CarouselPrevious />
                  <CarouselNext />
                </div>
              </Carousel>
            </DialogContent>
          </Dialog>
        ))}
    </div>
  );
}
