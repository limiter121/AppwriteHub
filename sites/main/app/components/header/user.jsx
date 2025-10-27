import UserAvatar from "@/components/user/avatar";
import UserSkeleton from "@/components/user/skeleton";
import UserMenu from "@/components/user/menu";
import { Button } from "@mantine/core";
import Link from "next/link";
import { signOut } from "@/lib/server/appwrite";
import { Suspense } from "react";

export default async function HeaderUser({ user, className }) {
  return (
    <div className={className}>
      {user && (
        <Suspense fallback={<UserSkeleton />}>
          <UserMenu signOut={signOut}>
            <UserAvatar user={user} />
          </UserMenu>
        </Suspense>
      )}
      {!user && (
        <>
          <Button
            color="pink"
            variant="light"
            component={Link}
            href="/auth/signin"
          >
            Sign in
          </Button>
        </>
      )}
    </div>
  );
}
