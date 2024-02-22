import { cn } from "@/lib/utils";

export function Dashboard({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return <div className={cn("py-2", className)}>Hey</div>;
}
