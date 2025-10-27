import { createSessionClient, getLoggedInUser } from "@/lib/server/appwrite";
import {
  ActionIcon,
  Badge,
  Group,
  Menu,
  MenuDivider,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Stack,
  Text,
} from "@mantine/core";
import { IconDots, IconRefresh, IconUnlink } from "@tabler/icons-react";
import { redirect } from "next/dist/server/api-utils";

function ProjectActionMenu({ project }) {
  return (
    <Menu shadow="md" width={200}>
      <MenuTarget>
        <ActionIcon variant="subtle" color="gray" aria-label="Actions">
          <IconDots size={20} />
        </ActionIcon>
      </MenuTarget>

      <MenuDropdown>
        <MenuItem leftSection={<IconRefresh size={14} />}>Refresh</MenuItem>

        <MenuDivider />

        <MenuItem color="red" leftSection={<IconUnlink size={14} />}>
          Unlink project
        </MenuItem>
      </MenuDropdown>
    </Menu>
  );
}

export default async function Project({ params }) {
  const user = await getLoggedInUser();
  if (!user) redirect("/auth/signin");

  const { id } = await params;
  const { tablesDB, Query } = await createSessionClient();
  const project = await tablesDB.getRow({
    databaseId: "68fca7cb002fb26ac958",
    tableId: "projects",
    rowId: id,
    queries: [],
  });
  return (
    <main className="container mx-auto max-w-4xl">
      <Group justify="space-between">
        <Stack gap={2} flex={1} mb="lg">
          <Text c="bright" fw="bold" size="xl">
            {project.name}
          </Text>
          <Text size="xs" c="dimmed">
            Endpoint: {project.endpoint}
          </Text>
          <Text size="xs" c="dimmed" ff="monospace">
            ID: {project.$id}
          </Text>
        </Stack>
        <Badge color="green" size="lg">
          {project.status}
        </Badge>
        <ProjectActionMenu project={project} />
      </Group>
      <h2 className="font-medium">Installed functionalities</h2>
    </main>
  );
}
