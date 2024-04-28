"use client";

import { Tab, Tabs } from "@nextui-org/react";
import { PortfolioTable } from "./PortfolioTable";
import { OrderTable } from "./OrderTable";
import { SummaryTable } from "./SummaryTable";
import { RecordTable } from "./RecordTable";
import { useCoinbase } from "@/lib/coinbase";
import { useEffect } from "react";

export function PortfolioTab({
  accounts,
  portfolios,
  orders,
  products,
  records,
}) {
  const {
    onAccountsFetched,
    onPortfolioFetched,
    onOrdersFetched,
    onProductsFetched,
    onRecordsFetched,
  } = useCoinbase();

  useEffect(() => {
    onAccountsFetched(accounts);
    onPortfolioFetched(portfolios);
    onOrdersFetched(orders);
    onProductsFetched(products);
    onRecordsFetched(records);
  }, []);

  return (
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
        <SummaryTable
          orders={orders}
          portfolios={portfolios}
          products={products}
        />
      </Tab>
      <Tab
        key="Portfolio"
        title={
          <div className="flex items-center space-x-2">
            <span>Portfolio</span>
          </div>
        }
      >
        <PortfolioTable portfolios={portfolios} />
      </Tab>
      <Tab
        key="Orders History"
        title={
          <div className="flex items-center space-x-2">
            <span>Orders</span>
          </div>
        }
      >
        <OrderTable orders={orders} />
      </Tab>
      <Tab
        key="Records"
        title={
          <div className="flex items-center space-x-2">
            <span>Records</span>
          </div>
        }
      >
        <RecordTable records={records} />
      </Tab>
    </Tabs>
  );
}
