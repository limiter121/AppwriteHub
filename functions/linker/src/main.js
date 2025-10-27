import { Client, TablesDB, Functions, Query } from 'node-appwrite';

const APPWRITEHUB_INSTALLER_FN = '68fdcbc20008ec351432'
const APPWRITEHUB_SYNCER_FN = '68ff972e001437d4c551'
const APPWRITEHUB_CORE_FUNCTIONALITY = '68fe47ec002b89946ca2'

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key'] ?? '');
  const tablesDB = new TablesDB(client);
  const functions = new Functions(client);

  const remoteClient = new Client()
    .setEndpoint(req.bodyJson.endpoint)
    .setProject(req.bodyJson.$id)
    .setKey(req.bodyJson.key);
  const remoteTablesDB = new TablesDB(remoteClient);

  log('Linking project:', req.bodyJson.$id)
  
  try {
    const installs = await remoteTablesDB.listRows({
        databaseId: 'appwritehub',
        tableId: 'installs',
        queries: [],
    });
    log('Found', installs.total, 'installs')
    if (!installs.total) { throw new Error('DB exists but is empty') }

    if (!installs.rows.find(install => install.functionality === APPWRITEHUB_CORE_FUNCTIONALITY)) {
      throw new Error('Core functionality is not installed')
    }
  } catch (e) {
    log('No installs found -', e.message)

    // Install mandatory AppwriteHub Core functionality
    const result = await functions.createExecution({
      functionId: APPWRITEHUB_INSTALLER_FN,
      body: JSON.stringify({
        endpoint: req.bodyJson.endpoint,
        project: req.bodyJson.$id,
        key: req.bodyJson.key,
        functionality: APPWRITEHUB_CORE_FUNCTIONALITY,
        skipChecks: true,
      }),
    });
    log('installer result:', result.status)
    if (result.status === 'failed') {
      throw new Error(result.errors)
    }
  }

  // trigger project sync
  const syncer = await functions.createExecution({
    functionId: APPWRITEHUB_SYNCER_FN,
    body: JSON.stringify({
      project: req.bodyJson.$id,
    }),
    async: true,
  })
  log('triggered syncer:', syncer.$id)

  return res.empty()
};
