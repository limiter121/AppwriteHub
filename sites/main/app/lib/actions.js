"use server";

import { createSessionClient } from "@/lib/server/appwrite";
import { revalidatePath } from "next/cache";

export async function linkProject(currentState, formData) {
  const name = formData.get("name");
  const project = formData.get("project");
  const endpoint = formData.get("endpoint");
  const key = formData.get("key");
  console.log("LINK", project);

  const { tablesDB } = await createSessionClient();
  await tablesDB.createRow({
    databaseId: "68fca7cb002fb26ac958",
    tableId: "projects",
    rowId: project,
    data: {
      name,
      endpoint,
      key,
    },
  });

  revalidatePath("/dashboard");

  return true;
}
