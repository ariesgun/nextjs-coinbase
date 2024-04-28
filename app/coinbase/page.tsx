import React from "react";
import { Divider } from "@nextui-org/react";

import { AccountsList } from "@/components/coinbase/AccountsList.jsx";
import { PortfolioTab } from "@/components/coinbase/PortfolioTab.jsx";
import { CoinbaseTabs } from "@/components/coinbase/CoinbaseTabs.jsx";
import { CoinbaseNavbar } from "@/components/coinbase/Navbar.jsx";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  let authenticated = false;

  if (error || !data?.user) {
    authenticated = false;
  } else {
    authenticated = true;
  }

  return (
    <>
      <div className="max-w-6xl my-4 mx-4 xl:mx-auto">
        <CoinbaseNavbar />

        <Divider className="my-4" />
        <div className="space-y-1 mb-4">
          <h4 className="text-medium font-medium">Coinbase Dashboard</h4>
          <p className="text-small text-default-400">
            Easily track your crypto portfolio. 🚀🌕
          </p>
        </div>
        <Divider className="mb-4" />

        {authenticated ? (
          <>
            <AccountsList />
            <CoinbaseTabs />
          </>
        ) : (
          <>
            <div className="bg-gray-100 py-16 px-4 sm:px-6 lg:px-8 lg:py-48">
              <div className="relative max-w-lg mx-auto lg:max-w-7xl">
                <div className="text-center">
                  <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                    Welcome to Coinbase Dashboard
                  </h2>
                  <p className="mt-4 text-lg text-gray-500">
                    Please login first.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
