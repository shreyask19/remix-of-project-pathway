import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// Card skeleton for dashboard cards
export const CardSkeleton = ({ className }: { className?: string }) => (
  <div className={cn("dashboard-card p-6", className)}>
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="w-10 h-10 rounded-xl" />
    </div>
    <Skeleton className="h-5 w-3/4 mb-2" />
    <Skeleton className="h-4 w-full mb-4" />
    <div className="flex gap-2 mb-4">
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-6 w-14 rounded-full" />
    </div>
    <div className="flex items-center justify-between pt-4 border-t border-border">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-8 w-24 rounded-lg" />
    </div>
  </div>
);

// Table row skeleton
export const TableRowSkeleton = ({ columns = 5 }: { columns?: number }) => (
  <tr>
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="p-4">
        <Skeleton className="h-4 w-full max-w-[120px]" />
      </td>
    ))}
  </tr>
);

// Stats card skeleton
export const StatCardSkeleton = () => (
  <div className="dashboard-card p-6">
    <div className="flex items-start justify-between mb-2">
      <Skeleton className="h-10 w-10 rounded-xl" />
    </div>
    <Skeleton className="h-8 w-16 mb-1" />
    <Skeleton className="h-4 w-24" />
  </div>
);

// List item skeleton
export const ListItemSkeleton = () => (
  <div className="flex items-center gap-4 p-4 border-b border-border last:border-0">
    <Skeleton className="w-10 h-10 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-1/2" />
    </div>
    <Skeleton className="h-8 w-20 rounded-lg" />
  </div>
);

// Project marketplace skeleton
export const MarketplaceGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

// Submission card skeleton
export const SubmissionSkeleton = () => (
  <div className="dashboard-card p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-2/3 mb-4" />
    <div className="flex gap-2">
      <Skeleton className="h-9 w-24 rounded-lg" />
      <Skeleton className="h-9 w-24 rounded-lg" />
    </div>
  </div>
);

// Talent pool card skeleton
export const TalentCardSkeleton = () => (
  <div className="dashboard-card p-6">
    <div className="flex items-center gap-4 mb-4">
      <Skeleton className="w-14 h-14 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-12" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-8" />
      </div>
    </div>
    <div className="flex gap-2 mt-4 pt-4 border-t border-border">
      <Skeleton className="h-9 flex-1 rounded-lg" />
      <Skeleton className="h-9 flex-1 rounded-lg" />
    </div>
  </div>
);

// Full page loading skeleton
export const PageSkeleton = () => (
  <div className="space-y-6 p-6">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-10 w-32 rounded-xl" />
    </div>
    
    <div className="grid grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
    
    <MarketplaceGridSkeleton count={6} />
  </div>
);
