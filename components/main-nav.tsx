import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn("flex items-center space-x-6", className)} {...props}>
      <Link
        href="/"
        className="text-md font-medium transition-colors hover:text-primary"
      >
        Home
      </Link>
      <Link
        href="/"
        className="text-md font-medium transition-colors hover:text-primary"
      >
        About
      </Link>
    </nav>
  );
}
