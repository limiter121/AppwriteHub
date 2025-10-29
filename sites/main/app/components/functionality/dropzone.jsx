"use client";

import { Group, Text } from "@mantine/core";
import {
  Dropzone,
  DropzoneAccept,
  DropzoneIdle,
  DropzoneReject,
  MIME_TYPES,
} from "@mantine/dropzone";
import { IconFileTypeZip, IconUpload, IconX } from "@tabler/icons-react";
import { useRef, useState } from "react";

export default function FunctionalityDropzone(props) {
  const [file, setFile] = useState();
  const hiddenInputRef = useRef();

  return (
    <Dropzone
      onDrop={(files) => {
        setFile(files[0]);
        if (hiddenInputRef.current) {
          // Workaround from https://stackoverflow.com/a/68182158/1068446
          const dataTransfer = new DataTransfer();
          files.forEach((v) => {
            dataTransfer.items.add(v);
          });
          hiddenInputRef.current.files = dataTransfer.files;
        }
      }}
      maxSize={25 * 1024 ** 2}
      maxFiles={1}
      accept={[MIME_TYPES.zip]}
      acceptColor="green"
      multiple={false}
      inputProps={{ ref: hiddenInputRef }}
      {...props}
    >
      <Group
        justify="center"
        gap="xl"
        mih={160}
        style={{ pointerEvents: "none" }}
      >
        <DropzoneAccept>
          <IconUpload
            size={52}
            color="var(--mantine-color-green-6)"
            stroke={1.5}
          />
        </DropzoneAccept>
        <DropzoneReject>
          <IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
        </DropzoneReject>
        <DropzoneIdle>
          <IconFileTypeZip
            size={64}
            color="var(--mantine-color-dimmed)"
            stroke={1.5}
          />
        </DropzoneIdle>

        {!file && (
          <div>
            <Text size="xl" inline>
              Drag the archive here or click to select it
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              Max size: 25 MB
            </Text>
          </div>
        )}
        {file && (
          <Text size="xl" inline>
            {file.name}
          </Text>
        )}
      </Group>
    </Dropzone>
  );
}
