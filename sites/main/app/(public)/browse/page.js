import FunctionalityGrid from "@/components/functionality/grid";
import RotatingText from "@/components/rotating-text";
import { createAdminClient } from "@/lib/server/appwrite";

export const metadata = {
  title: "Browse · " + process.env.NEXT_PUBLIC_APP_NAME,
  description:
    "Browse a centralized, community-powered collection of pre-built Appwrite functionalities. Get instant power-ups for your project with one-click install.",
};

export default async function Browse() {
  const { tablesDB, Query } = await createAdminClient();
  const { rows: functionalities } = await tablesDB.listRows({
    databaseId: "68fca7cb002fb26ac958",
    tableId: "functionalities",
    queries: [
      Query.select([
        "title",
        "author",
        "description",
        "cover",
        "category",
        "versions.number",
      ]),
    ],
  });

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-16 mx-auto">
        <div className="flex flex-wrap w-full mb-10">
          <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-bright">
              Discover{" "}
              <RotatingText
                splitBy="characters"
                texts={[
                  "Appwrite power-ups",
                  "your next feature",
                  "Community favorites",
                  "powerful functionalities",
                ]}
                mainClassName="inline-flex overflow-hidden"
                staggerDuration={0.02}
                rotationInterval={3000}
              />
            </h1>
            <div className="h-1 w-20 bg-pink-600 rounded"></div>
          </div>
          <p className="lg:w-1/2 w-full leading-relaxed text-gray-500">
            Browse a centralized, community-powered collection of pre-built
            Appwrite functionalities. Get instant power-ups for your project
            with one-click install.
          </p>
        </div>
        <FunctionalityGrid functionalities={functionalities} />
      </div>
    </section>
  );
}
