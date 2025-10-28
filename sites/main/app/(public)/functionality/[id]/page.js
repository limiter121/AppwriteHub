import { createAdminClient } from "@/lib/server/appwrite";
import {
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
} from "@mantine/core";
import { getFormatter } from "next-intl/server";
import { colors } from "@/lib/config";
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
                    <TableTh w={160}>Installs</TableTh>
                    <TableTd>
                      {versions.reduce((a, b) => a + b.installs, 0)}
                    </TableTd>
                  </TableTr>

                  {functionality.repository && (
                    <TableTr>
                      <TableTh>Repository</TableTh>
                      <TableTd>
                        <Anchor href={functionality.repository} target="_blank" size="sm">
                          {functionality.repository}
                        </Anchor>
                      </TableTd>
                    </TableTr>
                  )}

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

              <FunctionalityInstaller functionality={functionality} />
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
