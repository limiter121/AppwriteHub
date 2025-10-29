import { Alert, Button, Code } from "@mantine/core";
import { IconCloudUp, IconCode, IconFileTypeZip } from "@tabler/icons-react";
import Link from "next/link";

export const metadata = {
  title: "Contribute · " + process.env.NEXT_PUBLIC_APP_NAME,
};

export default async function ContributePage() {
  return (
    <main className="container mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold mb-4 px-4 text-center">
        It's as easy as...
      </h1>

      <section className="text-gray-600 body-font">
        <div className="container px-5 py-10 mx-auto flex flex-wrap">
          <div className="flex relative pt-10 pb-10 sm:pb-20 sm:items-start md:w-2/3 mx-auto">
            <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
              <div className="h-full w-1 bg-gray-200 dark:bg-gray-600 pointer-events-none"></div>
            </div>
            <div className="flex-shrink-0 w-10 h-10 rounded-full mt-7 sm:mt-1 inline-flex items-center justify-center bg-pink-500 text-white dark:text-body relative z-10 title-font font-bold text-lg">
              1
            </div>
            <div className="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
              <div className="flex-grow sm:pl-6 mt-6 sm:mt-0">
                <h2 className="font-bold title-font mb-1 text-2xl flex items-center gap-4 text-pink-500">
                  <IconCode size={48} />
                  Build
                </h2>
                <p className="leading-relaxed">
                  <b>Create a new Appwrite project</b> and implement all the
                  features you want. You can use any Appwrite services,
                  including <b>Databases</b>, <b>Functions</b>, <b>Sites</b>,
                  and more.
                </p>
              </div>
            </div>
          </div>
          <div className="flex relative pb-10 sm:pb-20 sm:items-start md:w-2/3 mx-auto">
            <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
              <div className="h-full w-1 bg-gray-200 dark:bg-gray-600 pointer-events-none"></div>
            </div>
            <div className="flex-shrink-0 w-10 h-10 rounded-full mt-7 sm:mt-1 inline-flex items-center justify-center bg-pink-500 text-white dark:text-body relative z-10 title-font font-bold text-lg">
              2
            </div>
            <div className="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
              <div className="flex-grow sm:pl-6 mt-6 sm:mt-0">
                <h2 className="font-bold title-font text-bright mb-1 text-2xl flex items-center gap-4 text-pink-500">
                  <IconFileTypeZip size={48} />
                  Archive
                </h2>
                <p className="leading-relaxed">
                  Because <b>every functionality is just an Appwrite project</b>{" "}
                  - archive it and you're done.
                </p>
                <Alert c="info" mt="sm">
                  <p>Make sure the archive contains:</p>
                  <ul>
                    <li>
                      <Code>appwrite.config.json</Code>
                    </li>
                    <li>
                      <Code>.appwritehub</Code> folder (
                      <i>optional, created manually</i>)
                    </li>
                  </ul>
                  <p className="mt-2">
                    Run <Code>appwrite pull all</Code> to make sure.
                  </p>
                </Alert>
              </div>
            </div>
          </div>
          <div className="flex relative pb-10 sm:pb-20 sm:items-start md:w-2/3 mx-auto">
            <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
              <div className="h-full w-1 bg-gray-200 dark:bg-gray-600 pointer-events-none"></div>
            </div>
            <div className="flex-shrink-0 w-10 h-10 rounded-full mt-7 sm:mt-1 inline-flex items-center justify-center bg-pink-500 text-white dark:text-body relative z-10 title-font font-bold text-lg">
              3
            </div>
            <div className="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
              <div className="flex-grow sm:pl-6 mt-6 sm:mt-0">
                <h2 className="font-bold title-font text-bright mb-1 text-2xl flex items-center gap-4 text-pink-500">
                  <IconCloudUp size={48} />
                  Upload
                </h2>
                <p className="leading-relaxed">
                  Create an account (if you don't have one), and upload your
                  functionality to AppwriteHub -{" "}
                  <b>share it with the community</b>.
                </p>
                <Button
                  className="shrink-0 mt-8 sm:mt-0 mx-auto"
                  leftSection={<IconCloudUp size={22} />}
                  color="pink"
                  size="md"
                  mt="md"
                  component={Link}
                  href="/functionality/publish"
                >
                  Publish your functionality now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
