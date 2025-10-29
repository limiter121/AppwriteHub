"use server";

import { createAdminClient, createSessionClient } from "@/lib/server/appwrite";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ZipInfo from "@/lib/zipinfo";

export async function signInWithEmail(currentState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const { account } = await createAdminClient();

    const session = await account.createEmailPasswordSession({
      email,
      password,
    });

    (await cookies()).set(
      process.env.NEXT_PUBLIC_APPWRITE_COOKIE,
      session.secret,
      {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      },
    );
  } catch (error) {
    return `Something went wrong: ${error.message}`;
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function signUpWithEmail(currentState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const name = formData.get("name");

  try {
    if (
      name
        .toLowerCase()
        .replace(/[^a-z]/g, "")
        .includes("appwritehub")
    ) {
      return "Name cannot contain 'AppwriteHub'";
    }

    const { account, ID } = await createAdminClient();

    await account.create({
      userId: ID.unique(),
      email,
      password,
      name,
    });
    const session = await account.createEmailPasswordSession({
      email,
      password,
    });

    (await cookies()).set(
      process.env.NEXT_PUBLIC_APPWRITE_COOKIE,
      session.secret,
      {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      },
    );
  } catch (error) {
    return `Something went wrong: ${error.message}`;
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

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

export async function importFunctionality(currentState, formData) {
  const archive = formData.get("archive");
  if (archive.size > 0) {
    const data = await archive.arrayBuffer();
    const buffer = Buffer.from(data, "binary");
    const entries = ZipInfo.getEntries(buffer);
    if (!entries.find((e) => e.filename === "appwrite.config.json")) {
      return "No appwrite.config.json found in archive";
    }
  } else {
    return "No archive provided";
  }

  redirect("/dashboard");
}
