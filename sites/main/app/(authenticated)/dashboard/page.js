import FunctionalityGrid from "@/components/functionality/grid";
import ProjectLinker from "@/components/project/linker";
import ProjectList from "@/components/project/list";
import { createSessionClient, getLoggedInUser } from "@/lib/server/appwrite";
import { Button } from "@mantine/core";
import { IconCloudUp, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard · " + process.env.NEXT_PUBLIC_APP_NAME,
};

export default async function Dashboard() {
  const user = await getLoggedInUser();
  if (!user) redirect("/auth/signin");

  const { tablesDB, Query } = await createSessionClient();
  const { rows: projects } = await tablesDB.listRows({
    databaseId: "68fca7cb002fb26ac958",
    tableId: "projects",
    queries: [],
  });
  const { rows: functionalities } = await tablesDB.listRows({
    databaseId: "68fca7cb002fb26ac958",
    tableId: "functionalities",
    queries: [Query.equal("author", user.name)],
  });

  return (
    <div className="container mx-auto max-w-4xl mb-20">
      <h2 className="text-lg mb-10">
        🥳 Welcome back, <span className="font-bold">{user.name}</span> !
      </h2>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-bold flex-1">Linked projects</h1>
        <ProjectLinker buttonProps={{ size: "sm" }} iconProps={{ size: 18 }} />
      </div>
      <ProjectList projects={projects} />

      <div className="flex items-center justify-between mt-12 mb-6">
        <h1 className="text-lg font-bold flex-1">Published functionalities</h1>
        <Button
          className="shrink-0 mt-8 sm:mt-0 mx-auto"
          leftSection={<IconCloudUp size={18} />}
          color="pink"
          size="sm"
          component={Link}
          href="/functionality/publish"
        >
          Publish functionality
        </Button>
      </div>
      <FunctionalityGrid
        functionalities={functionalities}
        showFilter={false}
        cols={{ base: 1, sm: 2, md: 3 }}
      />
    </div>
  );
}
