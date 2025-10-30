"use client";

import FunctionalityDropzone from "@/components/functionality/dropzone";
import { importFunctionality } from "@/lib/actions";
import { Alert, Button, Select, Textarea, TextInput } from "@mantine/core";
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
          data={["Content Management", "Integration", "Other"]}
          placeholder="Pick a category"
          required
        />
        <TextInput
          name="repository"
          label="Repository URL"
          placeholder="ex. https://github.com/limiter121/AppwriteHub"
        />
        <TextInput
          name="version"
          label="Version"
          placeholder="ex. 1.0.0"
          description="Must follow SemVer specification"
          required
        />
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
