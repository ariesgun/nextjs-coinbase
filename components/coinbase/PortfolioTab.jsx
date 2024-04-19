"use client";

import { Tab, Tabs } from "@nextui-org/react";
import { PortfolioTable } from "./PortfolioTable";
import { OrderTable } from "./OrderTable";
import { SummaryTable } from "./SummaryTable";

export function PortfolioTab() {
  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Options"
        color="primary"
        variant="underlined"
        classNames={{
          tabList:
            "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-[#22d3ee]",
          tab: "max-w-fit px-10 h-12",
          tabContent: "group-data-[selected=true]:text-[#06b6d4]",
        }}
      >
        <Tab
          key="Summary"
          title={
            <div className="flex items-center space-x-2">
              <span>Summary</span>
            </div>
          }
        >
          <SummaryTable />
        </Tab>
        <Tab
          key="Portfolio"
          title={
            <div className="flex items-center space-x-2">
              <span>Portfolio</span>
            </div>
          }
        >
          <PortfolioTable />
        </Tab>
        <Tab
          key="Orders History"
          title={
            <div className="flex items-center space-x-2">
              <span>Orders</span>
            </div>
          }
        >
          <OrderTable />
        </Tab>
      </Tabs>
    </div>
  );
}
