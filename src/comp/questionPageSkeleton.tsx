"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function QuestionPageSkeleton() {
  return (
    <div className="px-2 pb-5 flex flex-col">
      {/* Header */}
      <div className="sticky top-13 z-10 bg-white dark:bg-[#0a0a0a] p-2 left-0 border border-gray-700 border-b-0 flex items-center justify-between">
        <Skeleton className="h-6 w-20" /> 
        <Skeleton className="h-8 w-24" /> 
      </div>

      {/* Question Card */}
      <div className="border border-gray-700 p-4 rounded-b-none border-y-0">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-8 w-8 rounded-full" /> {/* Avatar */}
          <Skeleton className="h-4 w-28" /> {/* Username */}
        </div>
        <Skeleton className="h-6 w-3/4 mb-2" /> {/* Title */}
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6 mb-1" />
        <Skeleton className="h-4 w-4/6" /> {/* Description */}
        <div className="py-2 border-t border-gray-700 mt-5">
          <Skeleton className="h-5 w-24" /> {/* Actions */}
        </div>
      </div>

      {/* Answers Section */}
      <div className="rounded-t-none border border-gray-700 rounded-md p-3 mt-4">
        <Skeleton className="h-6 w-32 mb-4" /> {/* "Answers" header */}
        {/* Answer skeletons */}
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-3 border dark:border-gray-800 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-8 w-8 rounded-full" /> {/* Avatar */}
                <Skeleton className="h-4 w-24" /> {/* Username */}
              </div>
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-5/6 mb-1" />
              <Skeleton className="h-4 w-4/6" /> {/* Answer text */}
              <div className="mt-3 flex gap-3">
                <Skeleton className="h-5 w-12" /> {/* Like */}
                <Skeleton className="h-5 w-12" /> {/* Reply */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
