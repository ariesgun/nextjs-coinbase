import { Tab, Tabs } from "@nextui-org/react";
import { PortfolioTable } from "./PortfolioTable";
import { OrderTable } from "./OrderTable";
import { SummaryTable } from "./SummaryTable";
import { RecordTable } from "./RecordTable";
import getAccounts from "@/utils/coinbase/accounts";
import getPortfolios from "@/utils/coinbase/portfolios";
import getOrders from "@/utils/coinbase/orders";
import getProducts from "@/utils/coinbase/products";
import getRecords from "@/utils/coinbase/records";
import { PortfolioTab } from "./PortfolioTab";

export async function CoinbaseTabs() {
  const accounts = await getAccounts();
  const portfolios = await getPortfolios();
  const orders = await getOrders();
  const products = await getProducts();
  const records = await getRecords();

  return (
    <div className="flex w-full flex-col">
      <PortfolioTab
        accounts={accounts.portfolios}
        portfolios={portfolios.spot_positions}
        orders={orders}
        products={products.products}
        records={records}
      />
    </div>
  );
}
