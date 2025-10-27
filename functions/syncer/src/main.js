import { Client, TablesDB, Query } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key'] ?? '');
  const tablesDB = new TablesDB(client);

  let projects = []
  if (req?.bodyJson?.project) {
    const project = await tablesDB.getRow({
      databaseId: '68fca7cb002fb26ac958',
      tableId: 'projects',
      rowId: req.bodyJson.project,
    })
    projects = { total: 1, rows: [project] }
  } else {
    projects = await tablesDB.listRows({
      databaseId: '68fca7cb002fb26ac958',
      tableId: 'projects',
    })
  }
  log('Found', projects.total, 'projects')

  const updates = []
  const remoteClient = new Client()
  for (const project of projects.rows) {
    log('Syncing project:', project.$id)
    try {
      remoteClient.setEndpoint(project.endpoint)
      remoteClient.setProject(project.$id)
      remoteClient.setKey(project.key)
      const remoteTablesDB = new TablesDB(remoteClient)

      const installs = await remoteTablesDB.listRows({
        databaseId: 'appwritehub',
        tableId: 'installs',
        queries: [],
      });
      log('Found', installs.total, 'installs')

      updates.push({
        $id: project.$id,
        endpoint: project.endpoint,
        key: project.key,
        status: 'active',
        installs: JSON.stringify(installs.rows.map(install => ({
          $id: install.$id,
          functionality: install.functionality,
          functionalityId: install.functionalityId,
          version: install.version,
          versionId: install.versionId,
          $createdAt: install.$createdAt,
        }))),
      })
    } catch (e) {
      error('Failed to sync project !', project.$id, e.message)

      updates.push({ $id: project.$id, status: 'unreachable' })
    }
  }
  
  if (updates.length) {
    const result = await tablesDB.upsertRows({
      databaseId: '68fca7cb002fb26ac958',
      tableId: 'projects',
      rows: updates,
    });
    log('Updated', result.total, 'projects')
  }

  return res.empty()
};
