import FunctionalityPublishForm from "@/components/functionality/publish-form";
import { getLoggedInUser } from "@/lib/server/appwrite";
import { redirect } from "next/navigation";

export default async function PublishPage() {
  const user = await getLoggedInUser();
  if (!user) redirect("/auth/signin");

  return (
    <div className="container max-w-2xl mx-auto mb-20">
      <h1 className="text-lg font-bold mb-4">Publish a new functionality</h1>

      <FunctionalityPublishForm />
    </div>
  );
}
