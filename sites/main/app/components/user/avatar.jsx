import { Avatar } from "@mantine/core";

export default async function UserAvatar({ user }) {
  return (
    <Avatar radius="xl" name={user?.name} alt={user?.name} color="initials" />
  );
}
