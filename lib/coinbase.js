"use client";

import React, { useState, useContext, createContext } from "react";

const coinbaseContext = createContext({
  portfolios: [],
  orders: [],
  onPortfolioFetched: function (values) {},
  onOrdersFetched: function (values) {},
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
  const [portfolios, setPortfolios] = useState([]);
  const [orders, setOrders] = useState([]);

  const onPortfolioFetched = (values) => {
    setPortfolios(values);
  };

  const onOrdersFetched = (values) => {
    setOrders(values);
  };

  return {
    portfolios,
    orders,
    onPortfolioFetched,
    onOrdersFetched,
  };
}
