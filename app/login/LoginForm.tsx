"use client";

import { Button, Input } from "@nextui-org/react";
import { LockIcon, MailIcon } from "lucide-react";
import { login } from "./actions";

export default function LoginForm() {
  return (
    <form action={login} className="space-y-10 w-full sm:w-[400px]">
      <div className="grid w-full items-center gap-1.5">
        <Input
          id="email"
          name="email"
          key={"outside"}
          type="email"
          label="Email"
          size="lg"
          labelPlacement={"outside"}
          placeholder="Enter your email"
          startContent={
            <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Input
          id="password"
          name="password"
          key={"outside"}
          type="password"
          label="Password"
          size="lg"
          labelPlacement={"outside"}
          placeholder="Enter your password"
          startContent={
            <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
        />
      </div>
      {/* {error && <Alert>{error}</Alert>} */}
      <div className="w-full">
        <Button className="w-full" size="lg" type="submit">
          Login
        </Button>
      </div>
    </form>
  );
}
