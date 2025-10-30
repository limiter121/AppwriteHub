"use client";

import {
  Alert,
  Button,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconLinkPlus, IconPlus } from "@tabler/icons-react";
import Link from "next/link";

export default function FunctionalityInstaller({
  children,
  functionality,
  projects,
}) {
  const [
    installModalOpened,
    { open: openInstallModal, close: closeInstallModal },
  ] = useDisclosure(false);
  const eligibleProjects = projects
    .filter((project) => {
      if (project.status !== "active") return false;
      if (
        project.installs?.find(
          (install) => install.functionality.$id === functionality.$id,
        )
      )
        return false;
      return true;
    })
    .map((project) => ({ value: project.$id, label: project.name }));

  return (
    <>
      <Button
        color="pink"
        leftSection={<IconPlus />}
        className="ml-auto"
        size="md"
        fullWidth
        onClick={openInstallModal}
      >
        Install now
      </Button>
      {children}

      <Modal
        opened={installModalOpened}
        onClose={closeInstallModal}
        title={
          <>
            Install <b>{functionality.title}</b>
          </>
        }
        centered
      >
        <form>
          <Select
            label="Project"
            placeholder="Select your project"
            data={eligibleProjects}
            nothingFoundMessage={
              <Stack gap="xs">
                <Text size="sm">No eligible projects found...</Text>
                <Button
                  color="pink"
                  variant="light"
                  component={Link}
                  href="/dashboard"
                  leftSection={<IconLinkPlus size={16} />}
                  size="xs"
                  w={150}
                  mx="auto"
                >
                  Link a project
                </Button>
              </Stack>
            }
            required
          />

          <Button
            type="submit"
            color="pink"
            leftSection={<IconPlus />}
            size="sm"
            mt="lg"
            fullWidth
          >
            Install now
          </Button>
          <p></p>
        </form>
      </Modal>
    </>
  );
}
