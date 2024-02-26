import { Dashboard } from "@/components/dashboard";
import { MainNav } from "@/components/main-nav";
import { Button, Divider } from "@nextui-org/react";
import { Image } from "@nextui-org/react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col px-32 py-10 xl:px-64 max-w-screen-2xl mx-auto">
      <div className="h-4 items-center space-x-4">
        <MainNav className="mx-1" />
      </div>
      <Divider className="my-4 max-w-8xl" />

      <div className="flex-1">
        <div className="flex flex-row items-center space-x-4">
          <Image
            className=""
            src="/pemilu.svg"
            alt="Pemilu 2024 Logo"
            width={80}
            height={80}
          />
          <h1 className=" text-3xl font-extrabold leading-tight tracking-tighter my-4">
            Hasil Hitung Suara Pemilu Presiden & Wakil Presiden 2024
          </h1>
        </div>

        <Dashboard className="mx-auto py-8 text-center" />
      </div>

      <Divider className="my-4 max-w-8xl" />
      <div className="text-sm font-medium transition-colors">
        Copyright © 2024
      </div>

      {/* <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">app/page.tsx</code>
        </p>
        <div className="bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority="true"
            />
          </a>
        </div>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority="true"
        />
      </div>

      <div>
        <Button color="primary">Click Me</Button>
      </div> */}
    </main>
  );
}
