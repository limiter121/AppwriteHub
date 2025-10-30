import { colors } from "@/lib/config";
import { createSessionClient, getLoggedInUser } from "@/lib/server/appwrite";
import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  ActionIcon,
  Alert,
  Anchor,
  Badge,
  Button,
  Group,
  Image,
  Menu,
  MenuDivider,
  MenuDropdown,
  MenuItem,
  MenuLabel,
  MenuTarget,
  Stack,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Text,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconDots,
  IconExternalLink,
  IconRefresh,
  IconSearch,
  IconUnlink,
} from "@tabler/icons-react";
import { getFormatter } from "next-intl/server";
import { redirect } from "next/dist/server/api-utils";
import Link from "next/link";

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
  const installs = project.installs.sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt)).reduce((result, install) => {
    const id = install.functionality.$id;
    if (!result[id]) {
      result[id] = [];
    }
    result[id].push(install);
    return result;
  }, {});

  return (
    <>
      <h2 className="font-bold text-lg mb-2">Installs</h2>
      {project.installs?.length > 0 && (
        <Accordion variant="contained">
          {Object.values(installs).map(([install, ...rest]) => (
            <AccordionItem key={install.$id} value={install.functionality.$id}>
              <AccordionControl
                p="sm"
                icon={
                  <Image
                    src={
                      install.functionality.cover
                        ? `https://fra.cloud.appwrite.io/v1/storage/buckets/68fcabcf0013485fa596/files/${install.functionality.cover}/view?project=68fa5b200021065d9e06`
                        : "/placeholder-light.avif"
                    }
                    h={48}
                    bdrs="sm"
                    alt={install.functionality.title}
                  />
                }
              >
                <Anchor
                  c="pink"
                  fw={500}
                  href={`/functionality/${install.functionality.$id}`}
                  target="_blank"
                  className="flex items-center gap-1 w-fit"
                >
                  {install.functionality.title}
                  <IconExternalLink className="inline" size={16} />
                </Anchor>
              </AccordionControl>
              <AccordionPanel>
                <Table>
                  <TableThead>
                    <TableTr>
                      <TableTh>Version</TableTh>
                      <TableTh w={200} ta="center">
                        Date
                      </TableTh>
                      <TableTh w={150} ta="right">
                        Status
                      </TableTh>
                    </TableTr>
                  </TableThead>
                  <TableTbody>
                    {[install, ...rest].map((install) => (
                      <TableTr key={install.$id}>
                        <TableTd className="font-bold">
                          {install.version.number}
                        </TableTd>
                        <TableTd ta="right">
                          {formatDate(install.$createdAt, {
                            day: "numeric",
                            month: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            second: "numeric",
                          })}
                        </TableTd>
                        <TableTd ta="right">
                          <Badge
                            variant="dot"
                            color={colors.installStatus[install.status]}
                          >
                            {install.status}
                          </Badge>
                        </TableTd>
                      </TableTr>
                    ))}
                  </TableTbody>
                </Table>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      )}
      {project.installs.length === 0 && (
        <div className="flex flex-col gap-8 p-16 items-center justify-center">
          <Image src="/empty.svg" alt="No functionalities yet..." w={300} />
          <p>No functionalities installed yet...</p>
          <Button
            color="pink"
            component={Link}
            href="/browse"
            leftSection={<IconSearch size={14} />}
          >
            Browse
          </Button>
        </div>
      )}
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
    queries: [
      Query.select([
        "*",
        "installs.*",
        "installs.version.*",
        "installs.functionality.*",
      ]),
    ],
  });
  return (
    <main className="container mx-auto max-w-4xl mb-20">
      <Group justify="space-between">
        <Stack gap={2} flex={1} mb="lg">
          <Text c="bright" fw="bold" size="xl">
            {project.name}
          </Text>
          <p className="text-xs text-dimmed">
            Endpoint: <span className="font-mono">{project.endpoint}</span>
          </p>
          <p className="text-xs text-dimmed">
            ID: <span className="font-mono">{project.$id}</span>
          </p>
          <p className="text-xs text-dimmed">
            Appwrite: <span className="font-mono">{project.version}</span>
          </p>
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
