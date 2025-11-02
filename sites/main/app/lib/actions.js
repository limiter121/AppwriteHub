"use server";

import {
  createAdminClient,
  createSessionClient,
  getRemoteClient,
} from "@/lib/server/appwrite";
import { configToContents } from "@/lib/appwrite";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { iter } from "but-unzip";

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

  try {
    const remoteClient = await getRemoteClient(endpoint, project, key);
    const pong = await remoteClient.ping();
    console.log("ping:", pong);

    const version = (
      await (await fetch(`${endpoint.replace("/v1", "")}/versions`)).json()
    ).server;
    console.log("version", version);

    const { tablesDB } = await createSessionClient();
    await tablesDB.createRow({
      databaseId: "68fca7cb002fb26ac958",
      tableId: "projects",
      rowId: project,
      data: {
        name,
        endpoint,
        key,
        version,
        status: "active",
      },
    });

    revalidatePath("/dashboard");
    return true;
  } catch (error) {
    console.error("LINK FAIL!", error);
    return error.message;
  }
}

export async function installFunctionality(currentState, formData) {
  const functionality = formData.get("functionality");
  if (!functionality) {
    return "No functionality selected";
  }
  const id = formData.get("project");
  if (!id) {
    return "No project selected";
  }

  const { functions } = await createSessionClient();
  try {
    await functions.createExecution({
      functionId: "68fdcbc20008ec351432",
      body: JSON.stringify({
        project: id,
        functionality,
      }),
      async: true,
    });
  } catch (error) {
    console.error("INSTALL FAIL!", error);
    return error.message;
  }

  return true;
}

export async function importFunctionality(currentState, formData) {
  const title = formData.get("title");
  if (!title) {
    return "No title provided";
  }

  const description = formData.get("description");
  if (!description) {
    return "No description provided";
  }

  const category = formData.get("category");
  if (!category) {
    return "No category provided";
  }

  const version = formData.get("version");
  if (!version) {
    return "No version provided";
  }

  const compatibility = formData.get("compatibility");
  if (!compatibility) {
    return "No compatibile Appwrite version provided";
  }

  const repository =
    formData.get("repository")?.length > 0 ? formData.get("repository") : null;
  const changelog = formData.get("changelog");

  const services = formData.get("services").split(",");
  if (!services.length) {
    return "No services provided";
  }

  let file;
  const archive = formData.get("archive");
  if (archive.size > 0) {
    const data = await archive.arrayBuffer();
    const buffer = Buffer.from(data, "binary");
    let appwriteConfig;
    for (const entry of iter(buffer)) {
      if (entry.filename === "appwrite.config.json") {
        console.log("found appwrite config");
        const bytes = await entry.read();
        appwriteConfig = JSON.parse(bytes.toString("utf-8"));
        break;
      }
    }
    if (!appwriteConfig) {
      return "No appwrite.config.json found in archive";
    }
    const contents = configToContents(appwriteConfig);

    file = { contents, buffer };
  } else {
    return "No archive provided";
  }

  try {
    const { storage, ID, InputFile } = await createAdminClient();
    const { account, tablesDB, Permission, Role } = await createSessionClient();

    const ids = {
      functionality: ID.unique(),
      file: ID.unique(),
      version: ID.unique(),
    };

    const user = await account.get();

    const functionalityRow = await tablesDB.createRow({
      databaseId: "68fca7cb002fb26ac958",
      tableId: "functionalities",
      rowId: ids.functionality,
      data: {
        title,
        description,
        author: user.name,
        category,
        repository,
        services,
      },
      permissions: [Permission.write(Role.user(user.$id))],
    });

    await tablesDB.createRow({
      databaseId: "68fca7cb002fb26ac958",
      tableId: "versions",
      rowId: ids.version,
      data: {
        functionality: functionalityRow.$id,
        number: version,
        changelog,
        compatibility,
        contents: JSON.stringify(file.contents),
        file: ids.file,
      },
      permissions: [Permission.write(Role.user(user.$id))],
    });

    await storage.createFile({
      bucketId: "68fcabcf0013485fa596",
      fileId: ids.file,
      file: InputFile.fromBuffer(
        file.buffer,
        `${ids.functionality}_${ids.version}.zip`,
      ),
    });
  } catch (error) {
    console.error("CREATE FAIL!", error);
    return error.message;
  }

  redirect("/dashboard");
}
