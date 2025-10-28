import ProjectLinker from "@/components/project/linker";
import { colors } from "@/lib/config";
import { createSessionClient, getLoggedInUser } from "@/lib/server/appwrite";
import { Badge, Group, Text, Anchor, Stack, Paper } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard · " + process.env.NEXT_PUBLIC_APP_NAME,
}

export default async function Dashboard() {
  const user = await getLoggedInUser();
  if (!user) redirect("/auth/signin");

  const { tablesDB, Query } = await createSessionClient();
  const { rows: projects } = await tablesDB.listRows({
    databaseId: "68fca7cb002fb26ac958",
    tableId: "projects",
    queries: [],
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
      {projects.length === 0 && (
        <div className="flex flex-col gap-8 p-20 items-center justify-center">
          <Image
            src="/empty.svg"
            alt="No projects linked yet..."
            width={300}
            height={120}
          />
          <p>No projects linked yet...</p>
        </div>
      )}
      <Stack>
        {projects.map((project) => (
          <Anchor
            key={project.$id}
            underline="never"
            c="black"
            component={Link}
            href={`/projects/${project.$id}`}
          >
            <Paper
              shadow="sm"
              p="lg"
              className="hover:border-pink transition"
              withBorder
            >
              <Group justify="space-between">
                <Stack gap={2} flex={1}>
                  <Text c="bright" fw="bold" size="lg">
                    {project.name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    Endpoint: {project.endpoint}
                  </Text>
                  <Text size="xs" c="dimmed" ff="monospace">
                    ID: {project.$id}
                  </Text>
                </Stack>
                <Badge color={colors.projectStatus[project.status]} size="lg">
                  {project.status}
                </Badge>
                <IconChevronRight className="text-text" size={30} />
              </Group>
            </Paper>
          </Anchor>
        ))}
      </Stack>
    </div>
  );
}
