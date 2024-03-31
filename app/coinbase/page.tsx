"use client";

import React, { useEffect } from "react";
import { Divider } from "@nextui-org/react";
import { Input, Link, Button } from "@nextui-org/react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Checkbox,
} from "@nextui-org/react";

import { MailIcon } from "./MailIcon.jsx";
import { LockIcon } from "./LockIcon.jsx";

// import {AcmeLogo} from "./AcmeLogo.jsx";

import { PortfolioTab } from "@/components/coinbase/PortfolioTab.jsx";
import { useCoinbase } from "@/lib/coinbase.js";

export default function Home() {
  const { onPortfolioFetched, onOrdersFetched } = useCoinbase();

  useEffect(() => {
    // fetch("/api/accounts")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setData(data);
    //     console.log("Data: ", data);
    //   });
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((data) => {
        onPortfolioFetched(data.result.spot_positions);
      });
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        onOrdersFetched(data.result);
        console.log("Orders: ", data.result);
      });
  }, []);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div className="max-w-6xl mx-auto my-4">
        <div className="flex place-content-between items-center">
          <div className="flex h-5 items-center space-x-4 text-small">
            <Link className="text-small" color="foreground" href="#">
              Home
            </Link>
            <Divider orientation="vertical" />
            <Link className="text-small" href="#">
              Coinbase
            </Link>
            <Divider orientation="vertical" />
            <Link className="text-small" color="foreground" href="#">
              About
            </Link>
          </div>
          <div className="space-x-6">
            <Link className="text-small" href="#">
              Login
            </Link>
            <Button
              className="text-small"
              as={Link}
              color="primary"
              href="#"
              variant="flat"
            >
              Sign Up
            </Button>
          </div>
        </div>

        <Divider className="my-4" />

        <div className="space-y-1 mb-8">
          <h4 className="text-medium font-medium">Coinbase Dashboard</h4>
          <p className="text-small text-default-400">
            Easily track your crypto portfolio. 🚀🌕
          </p>
        </div>

        <PortfolioTab />
      </div>
      <Modal
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
      </Modal>
    </>
  );
}
