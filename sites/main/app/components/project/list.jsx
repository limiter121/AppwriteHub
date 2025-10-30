import { Badge, Group, Text, Anchor, Stack, Paper } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { colors } from "@/lib/config";

export default function ProjectList({ projects }) {
  return (
    <>
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
                  <p className="text-xs text-dimmed">
                    Endpoint:{" "}
                    <span className="font-mono">{project.endpoint}</span>
                  </p>
                  <p className="text-xs text-dimmed">
                    ID: <span className="font-mono">{project.$id}</span>
                  </p>
                  <p className="text-xs text-dimmed">
                    Appwrite:{" "}
                    <span className="font-mono">{project.version}</span>
                  </p>
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
    </>
  );
}
