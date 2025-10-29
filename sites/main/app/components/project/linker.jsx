"use client";

import { Alert, Button, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconLinkPlus } from "@tabler/icons-react";
import { linkProject } from "@/lib/actions";
import { useActionState } from "react";

export default function ProjectLinker({ children, buttonProps, iconProps }) {
  const [added, action, pending] = useActionState(linkProject, false);
  const [linkModalOpened, { open: openLinkModal, close: closeLinkModal }] =
    useDisclosure(false);

  if (added && linkModalOpened) {
    closeLinkModal();
  }

  return (
    <>
      {children ? (
        children
      ) : (
        <Button
          className="shrink-0 mt-8 sm:mt-0 mx-auto"
          leftSection={<IconLinkPlus {...iconProps} />}
          color="pink"
          onClick={openLinkModal}
          {...buttonProps}
        >
          Link project
        </Button>
      )}

      <Modal
        opened={linkModalOpened}
        onClose={closeLinkModal}
        title={<>Link your Appwrite project</>}
        centered
      >
        <form action={action}>
          <TextInput
            name="name"
            label="Project name"
            placeholder="ex. My Awesome Project"
            mb="md"
            required
          />

          <section className="border-y py-4 border-gray-light">
            <p className="text-sm">
              Obtained from the Appwrite Console → <i>Your Project</i> →
              Settings → Overview → API Credentials
            </p>

            <TextInput
              name="endpoint"
              label="API Endpoint"
              placeholder="ex. https://cloud.appwrite.io/v1"
              mt="xs"
              required
            />
            <TextInput
              name="project"
              label="Project ID"
              placeholder="ex. 3n8r9ds0jwme4g1aamia"
              mt="xs"
              required
            />
          </section>
          <section className="border-b py-4 border-gray-light">
            <p className="text-sm">
              Obtained from the Appwrite Console → <i>Your Project</i> →
              Overview → Integrations → API keys
            </p>

            <TextInput
              name="key"
              label="API Key"
              placeholder="ex. standard_up9zxjp8086kczbvbg1x0f92aikfg0..."
              mt="xs"
              required
            />
            <Alert variant="light" color="yellow" mt="sm">
              Make sure the API key has <b>all scopes enabled</b>.
            </Alert>
          </section>

          <Button
            type="submit"
            loading={pending}
            color="pink"
            leftSection={<IconLinkPlus size={18} />}
            size="sm"
            mt="lg"
            fullWidth
          >
            Link project
          </Button>
          <p></p>
        </form>
      </Modal>
    </>
  );
}
