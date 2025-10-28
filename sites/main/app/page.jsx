import { Button } from "@mantine/core";
import {
  IconBolt,
  IconRefresh,
  IconSearch,
  IconWorld,
} from "@tabler/icons-react";
import Link from "next/link";
import { AnimatedCounter } from "./components/animated-counter";

export default async function Home() {
  return (
    <main>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-20 mx-auto checker-background">
          <div className="lg:w-2/3 flex flex-col sm:flex-row sm:items-center items-start mx-auto">
            <div>
              <h1 className="animate-text-glow bg-linear-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent text-3xl font-bold mb-2">
                Tired of reinventing the wheel?
              </h1>
              <h2 className="grow sm:pr-16 text-2xl font-medium title-font text-bright">
                Discover and deploy powerful pre-built Appwrite functionalities
                in minutes, not days or weeks.
              </h2>
            </div>
            <Button
              className="shrink-0 mt-8 sm:mt-0 mx-auto"
              size="lg"
              leftSection={<IconSearch />}
              color="pink"
              component={Link}
              href="/browse"
            >
              Browse
            </Button>
          </div>
        </div>
      </section>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-10 mx-auto">
          <div className="flex flex-wrap -m-4 text-center">
            <div className="p-4 w-1/3">
              <h2>
                <AnimatedCounter
                  className="title-font font-medium sm:text-4xl text-3xl text-bright"
                  suffix="+"
                  value={103}
                />
              </h2>
              <p className="leading-relaxed">Functionalities</p>
            </div>
            <div className="p-4 w-1/3">
              <h2>
                <AnimatedCounter
                  className="title-font font-medium sm:text-4xl text-3xl text-bright"
                  suffix="+"
                  value={874}
                />
              </h2>
              <p className="leading-relaxed">Projects</p>
            </div>
            <div className="p-4 w-1/3">
              <h2>
                <AnimatedCounter
                  className="title-font font-medium sm:text-4xl text-3xl text-bright"
                  suffix="+"
                  value={652}
                />
              </h2>
              <p className="leading-relaxed">Users</p>
            </div>
          </div>
        </div>
      </section>
      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-10 pb-20 mx-auto">
          <h1 className="sm:text-3xl text-2xl font-medium title-font text-center mb-20 text-bright">
            Instant Project Power-Ups
          </h1>
          <div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0 space-y-6">
            <div className="p-4 md:w-1/3 flex">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full text-pink-500 mb-4 shrink-0">
                <IconBolt size={46} />
              </div>
              <div className="grow pl-6">
                <h2 className="text-bright text-lg title-font font-medium mb-2">
                  Zero Setup
                </h2>
                <p className="leading-relaxed text-base">
                  Get started immediately. Drop a pre-built functionality into
                  your Appwrite project and start using it in minutes. No
                  tedious configuration or complex boilerplate needed.
                </p>
              </div>
            </div>
            <div className="p-4 md:w-1/3 flex">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full text-pink-500 mb-4 shrink-0">
                <IconWorld size={46} />
              </div>
              <div className="grow pl-6">
                <h2 className="text-bright text-lg title-font font-medium mb-2">
                  Community Powered
                </h2>
                <p className="leading-relaxed text-base">
                  Discover and contribute functionalities built by a vibrant,
                  global network of developers. Leverage the power of the
                  community to solve common project needs.
                </p>
              </div>
            </div>
            <div className="p-4 md:w-1/3 flex">
              <div className="w-12 h-12 inline-flex items-center justify-center rounded-full text-pink-500 mb-4 shrink-0">
                <IconRefresh size={46} />
              </div>
              <div className="grow pl-6">
                <h2 className="text-bright text-lg title-font font-medium mb-2">
                  Easily Maintained
                </h2>
                <p className="leading-relaxed text-base">
                  Keep your app secure and current with minimal effort.
                  AppwriteHub provides a centralized way to track and apply
                  updates to your deployed functionalities, giving you full
                  control.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
