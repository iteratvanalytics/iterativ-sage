import { Skeleton, Shimmer } from "@/components/ui/skeleton";

export function HomeSkeleton() {
  return (
    <div className="px-5 pt-14 pb-8 space-y-5">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Shimmer className="h-3 w-24 rounded-full" />
          <Shimmer className="h-8 w-48 rounded-lg" />
        </div>
        <Shimmer className="w-10 h-10 rounded-full" />
      </div>
      <Shimmer className="h-36 rounded-3xl" />
      <Shimmer className="h-14 rounded-2xl" />
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Shimmer key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
      <div className="space-y-2">
        <Shimmer className="h-14 rounded-2xl" />
        <Shimmer className="h-14 rounded-2xl" />
      </div>
      <div className="space-y-2">
        <Shimmer className="h-10 rounded-2xl" />
        <Shimmer className="h-14 rounded-2xl" />
        <Shimmer className="h-14 rounded-2xl" />
      </div>
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 h-12 px-4 flex items-center gap-3 border-b border-white/5">
        <Shimmer className="w-8 h-8 rounded-full" />
        <Shimmer className="h-4 w-40 rounded-full" />
      </div>
      <div className="flex-1 px-4 py-4 space-y-4">
        <Shimmer className="h-16 w-3/4 rounded-2xl" />
        <Shimmer className="h-12 w-1/2 rounded-2xl ml-auto" />
        <Shimmer className="h-20 w-3/4 rounded-2xl" />
        <Shimmer className="h-12 w-1/2 rounded-2xl ml-auto" />
      </div>
      <div className="shrink-0 h-16 px-4 flex items-center gap-2">
        <Shimmer className="h-10 flex-1 rounded-2xl" />
        <Shimmer className="w-10 h-10 rounded-full" />
      </div>
    </div>
  );
}

export function MemorySkeleton() {
  return (
    <div className="px-5 pt-14 pb-8 space-y-5">
      <div className="space-y-2">
        <Shimmer className="h-3 w-32 rounded-full" />
        <Shimmer className="h-8 w-24 rounded-lg" />
        <Shimmer className="h-3 w-64 rounded-full" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Shimmer className="h-16 rounded-2xl" />
        <Shimmer className="h-16 rounded-2xl" />
        <Shimmer className="h-16 rounded-2xl" />
      </div>
      <Shimmer className="h-10 rounded-2xl" />
      <div className="space-y-2">
        <Shimmer className="h-12 rounded-2xl" />
        <Shimmer className="h-12 rounded-2xl" />
        <Shimmer className="h-12 rounded-2xl" />
      </div>
    </div>
  );
}

export function SkillsSkeleton() {
  return (
    <div className="px-5 pt-14 pb-8 space-y-5">
      <div className="space-y-2">
        <Shimmer className="h-3 w-24 rounded-full" />
        <Shimmer className="h-8 w-36 rounded-lg" />
        <Shimmer className="h-3 w-56 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Shimmer key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export function AgentsSkeleton() {
  return (
    <div className="px-5 pt-14 pb-8 space-y-5">
      <div className="space-y-2">
        <Shimmer className="h-3 w-32 rounded-full" />
        <Shimmer className="h-8 w-40 rounded-lg" />
        <Shimmer className="h-3 w-56 rounded-full" />
      </div>
      <Shimmer className="h-16 rounded-2xl" />
      <Shimmer className="h-36 rounded-2xl" />
      <div className="space-y-2">
        <Shimmer className="h-12 rounded-2xl" />
        <Shimmer className="h-12 rounded-2xl" />
        <Shimmer className="h-12 rounded-2xl" />
      </div>
    </div>
  );
}
