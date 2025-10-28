"use server";
import { Client, Account, TablesDB, Query, ID } from "node-appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

  const cookie = process.env.NEXT_PUBLIC_APPWRITE_COOKIE;
  const session = (await cookies()).get(cookie);
  if (!session || !session.value) {
    throw new Error("No session");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get tablesDB() {
      return new TablesDB(client);
    },
    get Query() {
      return Query;
    },
    get cookieName() {
      return cookie;
    },
  };
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.NEXT_APPWRITE_KEY);

  return {
    get account() {
      return new Account(client);
    },
    get tablesDB() {
      return new TablesDB(client);
    },
    get Query() {
      return Query;
    },
    get ID() {
      return ID;
    }
  };
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch (error) {
    return null;
  }
}

export async function signOut() {
  const { account, cookieName } = await createSessionClient();

  (await cookies()).delete(cookieName);
  try {
    await account.deleteSession({ sessionId: "current" });
  } catch (error) {}

  redirect("/");
}
