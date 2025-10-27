import { colors } from "@/lib/config";
import { createSessionClient, getLoggedInUser } from "@/lib/server/appwrite";
import {
  ActionIcon,
  Alert,
  Anchor,
  Badge,
  Group,
  Menu,
  MenuDivider,
  MenuDropdown,
  MenuItem,
  MenuLabel,
  MenuTarget,
  Stack,
  Text,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconClockPlus,
  IconDots,
  IconExternalLink,
  IconRefresh,
  IconUnlink,
} from "@tabler/icons-react";
import { getFormatter } from "next-intl/server";
import { redirect } from "next/dist/server/api-utils";

function ProjectActionMenu({ project, formatDate }) {
  return (
    <Menu shadow="md" width={200}>
      <MenuTarget>
        <ActionIcon variant="subtle" color="gray" aria-label="Actions">
          <IconDots size={20} />
        </ActionIcon>
      </MenuTarget>

      <MenuDropdown>
        <MenuLabel>
          Last updated:
          <br />
          <b>
            {formatDate(project.$createdAt, {
              day: "numeric",
              month: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
            })}
          </b>
        </MenuLabel>
        <MenuItem leftSection={<IconRefresh size={14} />}>Refresh</MenuItem>

        <MenuDivider />

        <MenuItem color="red" leftSection={<IconUnlink size={14} />}>
          Unlink project
        </MenuItem>
      </MenuDropdown>
    </Menu>
  );
}

function ActiveProjectView({ project, formatDate }) {
  const installs = JSON.parse(project.installs || "[]");

  return (
    <>
      <h2 className="font-bold text-lg">Installed functionalities</h2>
      <ul>
        {installs.map((install) => (
          <li key={install.$id} className="p-2">
            <Anchor
              c="pink"
              fw={500}
              href={`/functionality/${install.functionalityId}`}
              target="_blank"
            >
              {install.functionality}{" "}
              <IconExternalLink className="inline" size={18} />
            </Anchor>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <b>{install.version}</b> -{" "}
              <span
                className="flex items-center gap-1"
                title="Installation date"
              >
                <IconClockPlus size={16} />{" "}
                {formatDate(install.$createdAt, {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                })}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}

function LinkingProjectView({ project }) {
  return (
    <>
      <Alert
        icon={<IconAlertCircle size={24} />}
        color="yellow"
        title="Project linking in progress..."
      >
        <Text size="sm">
          Your project is being linked with AppwriteHub. This might take a few
          minutes...
        </Text>
      </Alert>
    </>
  );
}

export default async function Project({ params }) {
  const user = await getLoggedInUser();
  if (!user) redirect("/auth/signin");

  const format = await getFormatter();
  const formatDate = (date, opts) =>
    format.dateTime(
      new Date(date),
      opts || { day: "numeric", month: "numeric", year: "numeric" },
    );
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
        <Badge color={colors.projectStatus[project.status]} size="lg">
          {project.status}
        </Badge>
        <ProjectActionMenu project={project} formatDate={formatDate} />
      </Group>
      {project.status === "linking" && <LinkingProjectView project={project} />}
      {project.status === "active" && (
        <ActiveProjectView project={project} formatDate={formatDate} />
      )}
    </main>
  );
}
