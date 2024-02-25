import { cn } from "@/lib/utils";
import D3Map from "./d3-map";

export function Dashboard({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <div className={cn("py-2", className)}>
      <div className="mx-auto">
        <D3Map width={1444} height={640} />
      </div>
    </div>
  );
}
