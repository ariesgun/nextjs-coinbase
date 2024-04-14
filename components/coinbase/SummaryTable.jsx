import { useCoinbase } from "@/lib/coinbase";
import {
  Accordion,
  AccordionItem,
  Checkbox,
  Image,
  Skeleton,
} from "@nextui-org/react";
import React from "react";

export function SummaryTable() {
  const { orders, portfolios, products } = useCoinbase();

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

  const filteredOrders = React.useMemo(() => {
    let portfoliosOrdersDict = {};

    sortedItems.map((item) => {
      let filteredOrders = orders.filter((order) => {
        return order.product_id.includes(item.asset);
      });

      portfoliosOrdersDict[item.asset] = filteredOrders;
    });

    return portfoliosOrdersDict;
  }, [sortedItems, orders]);

  const filteredProducts = React.useMemo(() => {
    let portfoliosOrdersDict = {};

    sortedItems.map((item) => {
      let filteredProducts = products.filter((prod) => {
        return (
          prod.product_id.includes(item.asset) &&
          prod.product_id.substring(0, item.asset.length) == item.asset
        );
      });

      let USDCFilteredProducts = filteredProducts.filter((prod) => {
        return prod.product_id.includes("USDC");
      });

      portfoliosOrdersDict[item.asset] = USDCFilteredProducts;
    });

    console.log("Hey", portfoliosOrdersDict);

    return portfoliosOrdersDict;
  }, [sortedItems, products]);

  const summaryInfo = React.useMemo(() => {
    let summaryDict = {};

    sortedItems.map((item) => {
      let sumCosts = 0;

      if (filteredOrders[item.asset]) {
        sumCosts = filteredOrders[item.asset].reduce(
          (acc, curValue) =>
            acc +
            curValue.price *
              curValue.size *
              (curValue.side === "SELL" ? -1 : 1),
          0,
        );

        summaryDict[item.asset] = {
          sum: sumCosts,
          num: filteredOrders[item.asset].length,
          average: sumCosts / filteredOrders[item.asset].length,
        };
      }
    });

    console.log("Sum", summaryDict);

    return summaryDict;
  }, [sortedItems, filteredOrders]);

  const renderRow = (data) => {
    return (
      <div className="flex flex-row w-full items-center gap-x-4 my-2 mx-auto">
        <div className="grow max-w-80 flex flex-row items-center gap-x-3">
          <Image width={30} alt={data.asset} src={data.asset_img_url} />
          <p className="text-base">{data.asset}</p>
        </div>
        <div className="grow max-w-60 flex flex-col items-start">
          <div>
            <p className="text-bold text-base capitalize font-medium">Amount</p>
          </div>
          <div>
            <p className="text-bold text-base capitalize text-default-500">
              {(Math.round(data.total_balance_crypto * 10000) / 10000).toFixed(
                4,
              )}
            </p>
          </div>
        </div>
        <div className="grow max-w-60 flex flex-col gap-x-2 items-start">
          <div>
            <p className="text-bold text-base capitalize font-medium">
              Balance
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
              {(
                Math.round(
                  (data.total_balance_fiat - summaryInfo[data.asset].sum) *
                    10000,
                ) / 10000
              ).toFixed(4)}
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
    return (
      <div className="bg-cover bg-center bg-slate-100 rounded-lg w-full py-5 px-8">
        {filteredProducts[data.asset] ? (
          filteredProducts[data.asset].map((item) => (
            <div>
              <div>Price: {item.price}</div>
              <div>Increment: {item.price_increment}</div>
              <div>% Change 24h: {item.price_percentage_change_24h}%</div>
              <div>Total {summaryInfo[data.asset].sum}</div>
            </div>
          ))
        ) : (
          <></>
        )}

        {filteredOrders[data.asset].length > 0 ? (
          <>
            <div className="flex flex-row w-full items-center gap-5">
              <div className="flex-[1_1_0%] py-1">
                <p className="font-bold">Timestamp</p>
              </div>
              <div className="flex-none w-40">
                <p className="font-bold">Type</p>
              </div>
              <div className="flex-none w-20">
                <p className="font-bold">Size</p>
              </div>
              <div className="flex-none w-40">
                <p className="font-bold">Price</p>
              </div>
              <div className="flex-1">
                <p className="font-bold">Total</p>
              </div>
            </div>
            {filteredOrders[data.asset].map((item) => (
              <div className="flex flex-row w-full items-center gap-5">
                <div className="flex-[1_1_0%] py-1">{item.trade_time}</div>
                <div className="flex-none w-40">
                  {item.product_id} {item.side}
                </div>
                <div className="flex-none w-20">
                  {(Math.round(item.size * 10000) / 10000).toFixed(2)}
                </div>
                <div className="flex-none w-40">
                  {item.price} {data.cost_basis.currency}
                </div>
                <div className="flex-1">
                  {(Math.round(item.price * item.size * 10000) / 10000).toFixed(
                    2,
                  )}{" "}
                  {data.cost_basis.currency}
                </div>
              </div>
            ))}
          </>
        ) : (
          <p>No order history</p>
        )}
      </div>
    );
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
      {portfolios.length > 0 ? (
        <>
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
      ) : (
        <div className="my-4 ">
          {Array.from({ length: 8 }, (_, index) => (
            <div className="w-full flex items-center gap-5 my-5">
              <div>
                <Skeleton className="flex rounded-full w-20 h-20" />
              </div>
              <div className="w-full flex flex-col gap-4">
                <Skeleton className="h-4 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
