import React from "react";
import { Divider, useDisclosure } from "@nextui-org/react";
import { Input, Link, Button } from "@nextui-org/react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Checkbox,
} from "@nextui-org/react";

import { AccountsList } from "@/components/coinbase/AccountsList.jsx";
import { PortfolioTab } from "@/components/coinbase/PortfolioTab.jsx";
import { CoinbaseNavbar } from "@/components/coinbase/Navbar.jsx";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  // const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  let authenticated = false;

  if (error || !data?.user) {
    authenticated = false;
  } else {
    authenticated = true;
  }

  if (authenticated) {
    console.log("Authenticated");
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
            <PortfolioTab />
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
      {/* <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  endContent={
                    <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Email"
                  placeholder="Enter your email"
                  variant="bordered"
                />
                <Input
                  endContent={
                    <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  variant="bordered"
                />
                <div className="flex py-2 px-1 justify-between">
                  <Checkbox
                    classNames={{
                      label: "text-small",
                    }}
                  >
                    Remember me
                  </Checkbox>
                  <Link color="primary" href="#" size="sm">
                    Forgot password?
                  </Link>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Sign in
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal> */}
    </>
  );
}
