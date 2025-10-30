import { Client, Account, Databases } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);

export function configToContents(appwriteConfig) {
  const contents = {};
  
  // TablesDB
  if (appwriteConfig.tablesDB?.length > 0) {
    contents.databases = {};
    for (const db of (appwriteConfig.tablesDB || [])) {
      contents.databases[db.name] = [];
    }
    for (const table of (appwriteConfig.tables || [])) {
      const db = appwriteConfig.tablesDB.find(db => db.$id === table.databaseId)
      contents.databases[db.name].push(table.name);
    }
  }

  // Functions
  if (appwriteConfig.functions?.length > 0) {
    contents.functions = [];
    for (const fn of appwriteConfig.functions) {
      contents.functions.push(fn.name);
    }
  }

  // Buckets
  if (appwriteConfig.buckets?.length > 0) {
    contents.storage = [];
    for (const bucket of appwriteConfig.buckets) {
      contents.storage.push(bucket.name);
    }
  }

  // Sites
  if (appwriteConfig.sites?.length > 0) {
    contents.sites = [];
    for (const site of appwriteConfig.sites) {
      contents.sites.push(site.name);
    }
  }

  return contents
}

export { client, account, databases };
