import { cn } from "@/lib/utils";
import D3Map from "./d3-map";
import { RadialProgress } from "./RadialProgress";
import { Progress } from "@nextui-org/react";

export function Dashboard({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <div className={cn("py-3", className)}>
      <div className="flex flex-col mx-auto mb-8 pb-8 items-start space-y-2 justify-between">
        <div className="self-end mb-4">
          <p className="text-sm">Data terakhir: 26 Februari 2024, 00:00 WIB</p>
        </div>
        <div className="flex flex-row max-w-md w-full items-center justify-between">
          <div>
            <h1 className="text-lg font-extrabold">Progres</h1>
          </div>
          <div>
            <p>77.04%</p>
          </div>
        </div>
        <Progress
          isStriped
          aria-label="Loading..."
          value={77.04}
          color="primary"
          className="max-w-md"
        />
        <p className="text-sm">634.198 dari 823.236 TPS</p>
      </div>
      <div className="flex flex-row my-8 mx-auto items-center justify-between">
        <RadialProgress
          headerText="01. Anies - Muhaimin"
          centerImg="/anies.png"
          value={31}
        />
        <RadialProgress
          headerText="02. Prabowo - Gibran"
          centerImg="/prabowo.png"
          value={54}
        />
        <RadialProgress
          headerText="03. Ganjar - Mahmud"
          centerImg="/ganjar.png"
          value={15}
        />
      </div>

      <div className="mx-auto py-4">
        <D3Map width={1444} height={640} />
      </div>
    </div>
  );
}
