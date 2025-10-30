"use server";

import { createAdminClient, createSessionClient } from "@/lib/server/appwrite";
import { configToContents } from "@/lib/appwrite";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { iter } from 'but-unzip';

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
    let appwriteConfig
    for (const entry of iter(buffer)) {
      if (entry.filename === "appwrite.config.json") {
        console.log('found appwrite config')
        const bytes = await entry.read();
        appwriteConfig = JSON.parse(bytes.toString('utf-8'));
        break;
      }
    }
    if (!appwriteConfig) {
      return "No appwrite.config.json found in archive";
    }
    const contents = configToContents(appwriteConfig);
  } else {
    return "No archive provided";
  }

  redirect("/dashboard");
}
