"use client";

import FunctionalityDropzone from "@/components/functionality/dropzone";
import { importFunctionality } from "@/lib/actions";
import {
  Alert,
  Button,
  MultiSelect,
  Select,
  SimpleGrid,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useActionState } from "react";

export default function FunctionalityPublishForm() {
  const [error, action, pending] = useActionState(importFunctionality);

  return (
    <>
      {error && (
        <Alert color="red" mb="lg" title="Something went wrong">
          {error}
        </Alert>
      )}
      <form action={action} className="flex flex-col gap-6">
        <TextInput
          name="title"
          label="Title"
          placeholder="ex. My Awesome CMS"
          required
        />
        <Textarea
          name="description"
          label="Description"
          placeholder="ex. A simple CMS for your Appwrite project"
          minRows={2}
          resize="vertical"
          required
        />
        <Select
          name="category"
          label="Category"
          data={[
            { value: "content-management", label: "Content Management" },
            { value: "integration", label: "Integration" },
            { value: "other", label: "Other" },
          ]}
          placeholder="Pick a category"
          required
        />
        <MultiSelect
          name="services"
          label="Services used"
          placeholder="Pick at least one"
          data={[
            { value: "databases", label: "Databases" },
            { value: "functions", label: "Functions" },
            { value: "storage", label: "Storage" },
            { value: "sites", label: "Sites" },
          ]}
          required
        />
        <TextInput
          name="repository"
          label="Repository URL"
          placeholder="ex. https://github.com/limiter121/AppwriteHub"
        />
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <TextInput
            name="version"
            label="Version"
            placeholder="ex. 1.0.0"
            description={
              <>
                semver version.{" "}
                <a
                  className="underline"
                  href="https://devhints.io/semver"
                  target="_blank"
                >
                  Cheatsheet
                </a>
              </>
            }
            required
          />
          <TextInput
            name="compatibility"
            label="Compatible with Appwrite"
            placeholder="ex. 1.8.0 or ^1.8.0 or ~1.8"
            description={
              <>
                semver range.{" "}
                <a
                  className="underline"
                  href="https://devhints.io/semver"
                  target="_blank"
                >
                  Cheatsheet
                </a>
              </>
            }
            required
          />
        </SimpleGrid>
        <Textarea
          name="changelog"
          label="Changelog"
          placeholder="What's new in this version?"
          minRows={4}
          resize="vertical"
        />
        <FunctionalityDropzone name="archive" />

        <Button type="submit" loading={pending} color="pink" size="md">
          Publish to AppwriteHub
        </Button>
      </form>
    </>
  );
}
