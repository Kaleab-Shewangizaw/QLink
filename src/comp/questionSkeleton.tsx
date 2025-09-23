"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function QuestionSkeleton() {
  return (
    <div className="w-full p-2 shadow-md/10 dark:border rounded-md dark:border-gray-900">
      {/* Top Section */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-full" /> {/* Avatar */}
          <Skeleton className="h-4 w-24" /> {/* Username */}
        </div>
        <Skeleton className="h-3 w-20" /> {/* Date */}
      </div>

      {/* Question Title */}
      <div className="space-y-2 mb-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-6 rounded-md" />
          <Skeleton className="h-6 w-6 rounded-md" />
          <Skeleton className="h-4 w-6" /> {/* Count */}
        </div>
        <Skeleton className="h-8 w-24 rounded-md" /> {/* Answer/read button */}
      </div>
    </div>
  );
}
