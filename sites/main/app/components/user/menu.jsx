"use client";

import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown, IconLogout, IconUser } from "@tabler/icons-react";
import { Group, Menu, UnstyledButton } from "@mantine/core";
import Link from "next/link";

export default function UserMenu({ children, signOut }) {
  const [_opened, { open, close }] = useDisclosure(false);

  return (
    <Menu
      width={200}
      position="bottom-end"
      transitionProps={{ transition: "pop-top-right" }}
      onClose={close}
      onOpen={open}
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton>
          <Group gap={7}>
            {children}
            <IconChevronDown size={12} stroke={1.5} />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconUser size={16} stroke={1.5} />}
          component={Link}
          href="/account"
        >
          Account
        </Menu.Item>
        <Menu.Item
          color="red"
          leftSection={<IconLogout size={16} stroke={1.5} />}
          onClick={signOut}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
