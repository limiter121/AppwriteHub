"use client";

import { MantineProvider } from "@mantine/core";

export function Providers({ children }) {
  return (
    <MantineProvider defaultColorScheme="auto">{children}</MantineProvider>
  );
}
