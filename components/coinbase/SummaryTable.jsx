"use client";

import { useCoinbase } from "@/lib/coinbase";
import { Accordion, AccordionItem, Checkbox, Image } from "@nextui-org/react";
import React from "react";

export function SummaryTable() {
  const { portfolios } = useCoinbase();

  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "asset",
    direction: "ascending",
  });

  const [filterValue, setFilterValue] = React.useState("");

  const hasSearchFilter = Boolean(filterValue);

  const [showSmallBalances, setShowSmallBalances] = React.useState(false);

  const aggregatedItems = React.useMemo(() => {
    const aggregatedData = portfolios.reduce((acc, curr) => {
      // Check if the id already exists in the accumulator
      if (acc[curr.asset]) {
        // If the id exists, push the current item to the array
        // acc[curr.asset].push(curr);
        let item = acc[curr.asset];
        item.allocation += curr.allocation;
        item.total_balance_crypto += curr.total_balance_crypto;
        item.total_balance_fiat += curr.total_balance_fiat;
        item.cost_basis.value = String(
          Number(item.cost_basis.value) + Number(item.cost_basis.value),
        );
        acc[curr.asset] = item;
      } else {
        // If the id doesn't exist, create a new array with the current item
        acc[curr.asset] = curr;
      }
      return acc;
    }, {});

    return Object.values(aggregatedData);
  }, [sortDescriptor, portfolios]);

  const sortedItems = React.useMemo(() => {
    return [...aggregatedItems].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, aggregatedItems]);

  const filteredItems = React.useMemo(() => {
    let filteredPortfolios = [...sortedItems];

    if (hasSearchFilter) {
      filteredPortfolios = filteredPortfolios.filter((portfolio) =>
        portfolio.asset.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    if (!showSmallBalances) {
      filteredPortfolios = filteredPortfolios.filter(
        (portfolio) => portfolio.total_balance_fiat > 0.01,
      );
    }

    return filteredPortfolios;
  }, [sortedItems, showSmallBalances, filterValue]);

  const renderRow = (data) => {
    return (
      <div className="flex flex-row w-full items-center gap-x-4 my-2 mx-auto">
        <div className="grow max-w-80 flex flex-row items-center gap-x-3">
          <Image width={30} alt={data.asset} src={data.asset_img_url} />
          <p className="text-base">{data.asset}</p>
        </div>
        <div className="grow max-w-60 flex flex-col items-start">
          <div>
            <p className="text-bold text-base capitalize font-medium">
              Balance
            </p>
          </div>
          <div>
            <p className="text-bold text-base capitalize text-default-500">
              {data.total_balance_crypto}
            </p>
          </div>
        </div>
        <div className="grow max-w-60 flex flex-col gap-x-2 items-start">
          <div>
            <p className="text-bold text-base capitalize font-medium">
              Average Price
            </p>
          </div>
          <div className="flex flex-row gap-x-2">
            <p className="text-bold text-base capitalize text-default-500">
              {(Math.round(data.total_balance_fiat * 10000) / 10000).toFixed(4)}
            </p>
            <p className="text-bold text-base capitalize text-default-500">
              {data.cost_basis.currency}
            </p>
          </div>
        </div>
        <div className="grow max-w-60 flex flex-col gap-x-2 items-start">
          <div>
            <p className="text-bold text-base capitalize font-medium">
              Profit/Loss
            </p>
          </div>
          <div className="flex flex-row gap-x-2">
            <p className="text-bold text-base capitalize text-default-500">
              {(Math.round(data.total_balance_fiat * 10000) / 10000).toFixed(4)}
            </p>
            <p className="text-bold text-base capitalize text-default-500">
              {data.cost_basis.currency}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderAccordianBody = (data) => {
    return <div>Hello {data.asset}</div>;
  };

  return (
    <>
      <div className="flex gap-5 items-center justify-end my-4">
        <Checkbox
          size="sm"
          isSelected={showSmallBalances}
          onValueChange={setShowSmallBalances}
        >
          {"Show small balances (< $0.01)"}
        </Checkbox>
      </div>
      <Accordion showDivider={false} selectionMode="multiple">
        {filteredItems.map((item) => (
          <AccordionItem
            key={item.account_uuid}
            aria-label={item.asset}
            title={renderRow(item)}
          >
            {renderAccordianBody(item)}
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}