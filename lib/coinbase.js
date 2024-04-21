"use client";

import React, { useState, useContext, createContext } from "react";

const coinbaseContext = createContext({
  accounts: [],
  portfolios: [],
  orders: [],
  onAccountsFetched: function (values) {},
  onPortfolioFetched: function (values) {},
  onOrdersFetched: function (values) {},
  onRecordsFetched: function (values) {},
});

export function ProvideCoinbase({ children }) {
  const data = useProvideCoinbase();
  return (
    <coinbaseContext.Provider value={data}>{children}</coinbaseContext.Provider>
  );
}

export const useCoinbase = () => {
  return useContext(coinbaseContext);
};

function useProvideCoinbase() {
  const [accounts, setAccounts] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [records, setRecords] = useState([]);

  const onAccountsFetched = (values) => {
    setAccounts(values);
  };

  const onPortfolioFetched = (values) => {
    setPortfolios(values);
  };

  const onOrdersFetched = (values) => {
    setOrders(values);
  };

  const onProductsFetched = (values) => {
    setProducts(values);
  };

  const onRecordsFetched = (values) => {
    setRecords(values);
  };

  return {
    accounts,
    portfolios,
    orders,
    products,
    records,
    onAccountsFetched,
    onPortfolioFetched,
    onOrdersFetched,
    onProductsFetched,
    onRecordsFetched,
  };
}
