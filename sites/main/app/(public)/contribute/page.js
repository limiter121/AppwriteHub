import { Alert, Code } from '@mantine/core';
import { IconCloudUp, IconCode, IconFileTypeZip } from '@tabler/icons-react';

export const metadata = {
  title: "Contribute · " + process.env.NEXT_PUBLIC_APP_NAME,
}

export default async function ContributePage() {
  return (
    <main className="container mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold mb-4">Contribute</h1>

      <section class="text-gray-600 body-font">
        <div class="container px-5 py-10 mx-auto flex flex-wrap">
          <div class="flex relative pt-10 pb-20 sm:items-center md:w-2/3 mx-auto">
            <div class="h-full w-10 absolute inset-0 flex items-center justify-center">
              <div class="h-full w-1 bg-gray-200 pointer-events-none"></div>
            </div>
            <div class="flex-shrink-0 w-10 h-10 rounded-full mt-10 sm:mt-0 inline-flex items-center justify-center bg-pink-500 text-white relative z-10 title-font font-medium text-lg">
              1
            </div>
            <div class="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
              <div class="flex-shrink-0 w-24 h-24 bg-pink-100 text-pink-500 rounded-full inline-flex items-center justify-center">
                <IconCode size={48} />
              </div>
              <div class="flex-grow sm:pl-6 mt-6 sm:mt-0">
                <h2 class="font-medium title-font text-gray-900 mb-1 text-xl">
                  Build an Appwrite project
                </h2>
                <p class="leading-relaxed">
                  <b>Create a new Appwrite project</b> and implement all the features you want. You can use any Appwrite services, including <b>Databases</b>, <b>Functions</b>, <b>Sites</b>, and more.
                </p>
              </div>
            </div>
          </div>
          <div class="flex relative pb-20 sm:items-center md:w-2/3 mx-auto">
            <div class="h-full w-10 absolute inset-0 flex items-center justify-center">
              <div class="h-full w-1 bg-gray-200 pointer-events-none"></div>
            </div>
            <div class="flex-shrink-0 w-10 h-10 rounded-full mt-10 sm:mt-0 inline-flex items-center justify-center bg-pink-500 text-white relative z-10 title-font font-medium text-lg">
              2
            </div>
            <div class="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
              <div class="flex-shrink-0 w-24 h-24 bg-pink-100 text-pink-500 rounded-full inline-flex items-center justify-center">
                <IconFileTypeZip size={48} />
              </div>
              <div class="flex-grow sm:pl-6 mt-6 sm:mt-0">
                <h2 class="font-medium title-font text-gray-900 mb-1 text-xl">
                  Export your project
                </h2>
                <p class="leading-relaxed">
                  Because <b>every functionality is just an Appwrite project</b> - archive it and you're done.
                </p>
                <Alert c="info" mt="sm">
                  <p>Make sure the archive contains:
                    <ul>
                      <li><Code>appwrite.config.json</Code></li>
                      <li><Code>.appwritehub</Code> folder (<i>optional, created manually</i>)</li>
                    </ul>
                  </p>
                  <p className='mt-2'>Run <Code>appwrite pull all</Code> to make sure.</p>  
                </Alert>
              </div>
            </div>
          </div>
          <div class="flex relative pb-20 sm:items-center md:w-2/3 mx-auto">
            <div class="h-full w-10 absolute inset-0 flex items-center justify-center">
              <div class="h-full w-1 bg-gray-200 pointer-events-none"></div>
            </div>
            <div class="flex-shrink-0 w-10 h-10 rounded-full mt-10 sm:mt-0 inline-flex items-center justify-center bg-pink-500 text-white relative z-10 title-font font-medium text-lg">
              3
            </div>
            <div class="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
              <div class="flex-shrink-0 w-24 h-24 bg-pink-100 text-pink-500 rounded-full inline-flex items-center justify-center">
                <IconCloudUp size={48} />
              </div>
              <div class="flex-grow sm:pl-6 mt-6 sm:mt-0">
                <h2 class="font-medium title-font text-gray-900 mb-1 text-xl">
                  Upload to AppwriteHub
                </h2>
                <p class="leading-relaxed">
                  Create an account (if you don't have one), and upload your functionality to AppwriteHub - <b>share it with the community</b>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
