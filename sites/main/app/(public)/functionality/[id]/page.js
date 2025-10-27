import { createAdminClient, Query } from "@/lib/server/appwrite";
import {
  Button,
  Image,
  Table,
  TableTbody,
  TableTh,
  TableTr,
  TableTd,
  Badge,
  Timeline,
  TimelineItem,
  Text,
  Anchor,
  Modal,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { getFormatter } from "next-intl/server";
import { colors } from "@/lib/config";
import Link from "next/link";
import FunctionalityInstaller from "@/components/functionality/installer";

export async function generateMetadata({ params }, parent) {
  const { id } = await params;
  const { tablesDB, Query } = await createAdminClient();
  const functionality = await tablesDB.getRow({
    databaseId: "68fca7cb002fb26ac958",
    tableId: "functionalities",
    rowId: id,
    queries: [Query.select(["title", "author"])],
  });

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: functionality.title + " · " + process.env.NEXT_PUBLIC_APP_NAME,
    description: functionality.description,
    openGraph: {
      images: [
        `https://fra.cloud.appwrite.io/v1/storage/buckets/68fcabcf0013485fa596/files/${functionality.cover || "68fd0ca6001ea0925027"}/view?project=68fa5b200021065d9e06`,
        ...previousImages,
      ],
    },
  };
}

export default async function Functionality({ params }) {
  const format = await getFormatter();
  const { id } = await params;
  const { tablesDB, Query } = await createAdminClient();
  const functionality = await tablesDB.getRow({
    databaseId: "68fca7cb002fb26ac958",
    tableId: "functionalities",
    rowId: id,
    queries: [Query.select(["*", "versions.*"])],
  });
  const versions = functionality.versions.reverse();
  const { rows: installs } = await tablesDB.listRows({
    databaseId: "68fca7cb002fb26ac958",
    tableId: "installs",
    queries: [
      Query.select(["$id", "version.number"]),
      Query.equal("version.functionality.$id", functionality.$id),
    ],
  });

  return (
    <>
      <section className="text-gray-600 body-font overflow-hidden">
        <div className="container px-5 py-10 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <img
              alt={functionality.title}
              className="lg:w-1/2 w-full lg:h-lg h-64 object-cover object-center lightmode rounded-lg"
              src={`https://fra.cloud.appwrite.io/v1/storage/buckets/68fcabcf0013485fa596/files/${functionality.cover || "68fd0ca6001ea0925027"}/view?project=68fa5b200021065d9e06`}
            />
            <img
              alt={functionality.title}
              className="lg:w-1/2 w-full lg:h-lg h-64 object-cover object-center darkmode rounded-lg"
              src={`https://fra.cloud.appwrite.io/v1/storage/buckets/68fcabcf0013485fa596/files/${functionality.cover || "68fd0cb7001ea9e40f95"}/view?project=68fa5b200021065d9e06`}
            />
            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h1 className="text-4xl title-font font-bold text-bright mb-1">
                {functionality.title}
              </h1>
              <h2 className="text-xs title-font text-bright tracking-widest">
                by <b>{functionality.author}</b>
              </h2>
              <Badge
                color={colors.category[functionality.category]}
                variant="light"
                my="xs"
              >
                {functionality.category.replace("-", " ").toUpperCase()}
              </Badge>
              <p className="leading-relaxed mt-4">
                {functionality.description}
              </p>

              <ul className="flex gap-2 items-center">
                Uses:
                {functionality.services.map((service) => (
                  <Badge key={service} color="pink" variant="light" my="xs">
                    {service.toUpperCase()}
                  </Badge>
                ))}
              </ul>

              <Table variant="vertical" layout="fixed" withTableBorder my="xl">
                <TableTbody>
                  <TableTr>
                    <TableTh>Installs</TableTh>
                    <TableTd>
                      {versions.reduce((a, b) => a + b.installs, 0)}
                    </TableTd>
                  </TableTr>

                  <TableTr>
                    <TableTh>Added</TableTh>
                    <TableTd>
                      {format.relativeTime(new Date(functionality.$createdAt), {
                        unit: "day",
                      })}
                    </TableTd>
                  </TableTr>
                </TableTbody>
              </Table>

              <FunctionalityInstaller functionality={functionality}>
                {installs.length > 0 && (
                  <p className="text-sm text-center mt-2">
                    You already installed in{" "}
                    <Anchor component={Link} href="/dashboard" size="sm">
                      {installs.length} projects
                    </Anchor>
                  </p>
                )}
              </FunctionalityInstaller>
            </div>
          </div>
        </div>
      </section>
      <section className="text-gray-600 body-font overflow-hidden">
        <div className="container px-5 pt-10 pb-20 mx-auto lg:w-4/5">
          <h2 className="text-lg mb-4">Version history</h2>
          <Timeline active={0} color="pink" bulletSize={24} lineWidth={4}>
            {versions.map((version) => (
              <TimelineItem title={version.number} key={version.$id}>
                <Text size="xs" mt={4} mb="sm">
                  {format.dateTime(new Date(version.$createdAt), {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                  })}
                </Text>
                {version.changelog?.split("\n").map((line, i) => (
                  <Text key={i} c="dimmed" size="sm">
                    {line}
                  </Text>
                ))}
              </TimelineItem>
            ))}
          </Timeline>
        </div>
      </section>
    </>
  );
}
