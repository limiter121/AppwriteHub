"use client";

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
import { colors } from "@/lib/config";
import { GradientSegmentedControl } from "@/components/GradientSegmentedControl";
import { useState } from "react";

export default function FunctionalityGrid({ functionalities }) {
  const [filter, setFilter] = useState("All");
  const filtered =
    filter === "All"
      ? functionalities
      : functionalities.filter(
          (f) => f.category === filter.toLowerCase().replace(" ", "-"),
        );

  return (
    <>
      <GradientSegmentedControl
        radius="xl"
        size="md"
        mb="xl"
        data={["All", "Content Management", "Integration", "Other"]}
        value={filter}
        onChange={setFilter}
      />
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }}>
        {filtered.map((functionality) => (
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
              <Badge color={colors.category[functionality.category]} size="sm">
                {functionality.category.replace("-", " ").toUpperCase()}
              </Badge>
            </Group>
          </Card>
        ))}
      </SimpleGrid>
      {filtered.length === 0 && (
        <div className="flex flex-col gap-8 p-20 items-center justify-center">
          <Image src="/empty.svg" alt="No functionalities yet..." w={300} />
          <p>No functionalities yet...</p>
        </div>
      )}
    </>
  );
}
