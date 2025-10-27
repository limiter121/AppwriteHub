import { getLoggedInUser } from "@/lib/server/appwrite";
import { Button, TextInput } from "@mantine/core";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const user = await getLoggedInUser();
  if (!user) redirect("/auth/signin");

  return (
    <div className="container max-w-xl mx-auto">
      <h1 className="text-lg font-bold mb-4">Account</h1>

      <form className="flex flex-col gap-3">
        <TextInput label="Name" name="name" defaultValue={user.name} />
        <TextInput label="Email" name="email" defaultValue={user.email} />
        <Button type="submit">Save</Button>
      </form>
    </div>
  );
}
