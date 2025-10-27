"use client";

import { Alert, Button, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconLinkPlus, IconPlus } from "@tabler/icons-react";

export default function ProjectLinker({ children, buttonProps, iconProps }) {
  const [linkModalOpened, { open: openLinkModal, close: closeLinkModal }] =
    useDisclosure(false);

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
        <form>
          <section className="border-b pb-4 border-slate-200">
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
          <section className="border-b py-4 border-slate-200">
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
