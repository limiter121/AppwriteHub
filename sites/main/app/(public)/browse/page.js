import RotatingText from "@/components/rotating-text";
import { createAdminClient } from "@/lib/server/appwrite";
import {
  Badge,
  Card,
  CardSection,
  Group,
  Image,
  SimpleGrid,
  Text,
} from "@mantine/core";
import Link from "next/link";
import { Suspense } from "react";
import { colors } from "@/lib/config";

export const metadata = {
  title: "Browse · " + process.env.NEXT_PUBLIC_APP_NAME,
  description: "Browse a centralized, community-powered collection of pre-built Appwrite functionalities. Get instant power-ups for your project with one-click install.",
}

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
        <div className="flex flex-wrap w-full mb-20">
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
        <Suspense fallback={<div>Loading...</div>}>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }}>
            {functionalities.map((functionality) => (
              <Card
                key={functionality.$id}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                className="hover:z-10 hover:scale-105 hover:shadow-lg hover:border-pink-600 group transition"
                component={Link}
                href={`/functionality/${functionality.$id}`}
              >
                <CardSection>
                  <Image
                    src={
                      functionality.cover
                        ? `https://fra.cloud.appwrite.io/v1/storage/buckets/68fcabcf0013485fa596/files/${functionality.cover}/view?project=68fa5b200021065d9e06`
                        : "/placeholder-light.avif"
                    }
                    h={256}
                    alt={functionality.title}
                    darkHidden
                  />
                  <Image
                    src={
                      functionality.cover
                        ? `https://fra.cloud.appwrite.io/v1/storage/buckets/68fcabcf0013485fa596/files/${functionality.cover}/view?project=68fa5b200021065d9e06`
                        : "/placeholder-dark.avif"
                    }
                    h={256}
                    alt={functionality.title}
                    lightHidden
                  />
                </CardSection>

                <Text
                  fw="bold"
                  size="xl"
                  mt="sm"
                  className="group-hover:text-pink-600 transition"
                >
                  {functionality.title}
                </Text>
                <Text size="xs" c="dimmed">
                  by {functionality.author}
                </Text>

                <Text size="sm" c="dimmed" fs="italic" mt="sm">
                  {functionality.description.substring(0, 100)}...
                </Text>

                <Group justify="space-between" mt="sm">
                  <Badge
                    color={colors.category[functionality.category]}
                    size="sm"
                  >
                    {functionality.category.replace("-", " ").toUpperCase()}
                  </Badge>
                </Group>
              </Card>
            ))}
          </SimpleGrid>
        </Suspense>
      </div>
    </section>
  );
}
