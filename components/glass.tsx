import { cn } from "@/lib/cn";

export function GlassCard({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={cn("track-glass-card rounded-xl p-5", className)}>{children}</section>;
}

export function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-lg", className)} />;
}
