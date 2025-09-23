"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function QuestionPageSkeleton() {
  return (
    <div className="px-2 pb-5 flex flex-col">
      {/* Sticky header */}
      <div className="sticky top-13 z-10 bg-white dark:bg-[#0a0a0a] p-2 left-0 border border-gray-700 border-b-0 flex items-center justify-between">
        <Skeleton className="h-6 w-20" /> {/* Back button */}
        <Skeleton className="h-8 w-20 rounded-md" /> {/* Answer button */}
      </div>

      {/* Question box */}
      <div className="border border-gray-700 p-4 rounded-b-none border-y-0">
        {/* Top */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-3 w-20" />
        </div>

        {/* Title + Description */}
        <Skeleton className="h-5 w-2/3 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4 mb-3" />

        {/* Actions */}
        <div className="flex justify-between mt-5 border-t border-gray-700 pt-3">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-6 rounded-md" />
            <Skeleton className="h-6 w-6 rounded-md" />
            <Skeleton className="h-4 w-6" />
          </div>
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>

      {/* Answers */}
      <div className="rounded-t-none border border-gray-700 rounded-md p-3 mt-2">
        <Skeleton className="h-5 w-24 mb-4" /> {/* "Answers" title */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="mb-4 p-3 border border-gray-700 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-3/4 mb-3" />
            <div className="flex justify-between">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
