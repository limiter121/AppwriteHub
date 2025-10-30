import { Client, TablesDB, Storage, Query, Permission, Role, ID } from 'node-appwrite';
import { spawn, spawnSync } from 'node:child_process';
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync, rmdirSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { gte, rcompare, satisfies } from 'semver'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function installFunctionality(id, fileId, projectId, { storage, log, error, cli }) {
  log('Installing functionality:', id)

  const file = await storage.getFileView({
    bucketId: '68fcabcf0013485fa596',
    fileId,
  });
  const buf = Buffer.from(file)
  const zipPath = path.join('/tmp/', fileId + '.zip')
  const unzipPath = path.join('/tmp/', fileId)
  writeFileSync(zipPath, buf)

  const unzip = await spawnSync('unzip', ['-o', zipPath, '-d', unzipPath])
  log({
    output: unzip.stdout.toString(),
    error: unzip.stderr.toString(),
    code: unzip.status
  })
  unlinkSync(zipPath)

  const configPath = path.join(unzipPath, 'appwrite.config.json')
  const config = JSON.parse(readFileSync(configPath, 'utf-8'))
  config.projectId = projectId
  delete config.projectName
  delete config.settings
  writeFileSync(configPath, JSON.stringify(config))

  cli(['push', 'tables', '--all', '--force'], { spawnOptions: { cwd: unzipPath } })

  rmSync(unzipPath, { recursive: true, force: true })
}

export default async ({ req, res, log, error }) => {
  const adminClient = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key'] ?? '');
  const tablesDb = new TablesDB(adminClient);
  const storage = new Storage(adminClient);

  const sessionClient = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setJWT(req.headers['x-appwrite-user-jwt'] ?? '');
  const userTablesDb = new TablesDB(sessionClient);

  const cli = (args, { logArgs = true, logOutput = true, parseJson = false, spawnOptions = undefined } = {}) => {
    const normalizedArgs = Array.isArray(args) ? args : [args]
    if (logArgs) { log('→', normalizedArgs.join(' ')) }
    const run = spawnSync(__dirname + '/../node_modules/.bin/appwrite', normalizedArgs, spawnOptions);
    const result = {
      output: run.stdout.toString(),
      error: run.stderr.toString(),
      code: run.status,
    }
    if (result.output && logOutput) { log(result.output) }
    if (result.error || result.code !== 0) {
      error(result.error)
      error('code:', result.code, '\n')
      throw new Error(result.error);
    }
    if (parseJson) { return JSON.parse(result.output) }
    return result.output
  }

  // get latest version
  const versions = await tablesDb.listRows({
    databaseId: '68fca7cb002fb26ac958',
    tableId: 'versions',
    queries: [
      Query.equal('functionality', req.bodyJson.functionality),
      Query.orderDesc('$createdAt'),
      Query.limit(1),
    ],
  })
  const latest = versions.rows[0]
  log('Latest version available:', latest.number)

  const install = await tablesDb.createRow({
    databaseId: '68fca7cb002fb26ac958',
    tableId: 'installs',
    rowId: ID.unique(),
    data: {
      project: req.bodyJson.project,
      functionality: req.bodyJson.functionality,
      version: latest.$id,
      status: 'installing',
    },
    permissions: [
      Permission.read(Role.user(req.headers['x-appwrite-user-id'])),
    ]
  })
  log('install id: ', install.$id)

  let status
  try {
    const project = await userTablesDb.getRow({
      databaseId: '68fca7cb002fb26ac958',
      tableId: 'projects',
      rowId: req.bodyJson.project,
    });

    // Login
    cli(['client', '--endpoint', project.endpoint, '--project-id', project.project, '--key', project.key], { logArgs: false })

    // check if already installed
    const installs = await tablesDb.listRows({
      databaseId: '68fca7cb002fb26ac958',
      tableId: 'installs',
      queries: [
        Query.equal('functionality', req.bodyJson.functionality),
        Query.equal('status', 'success'),
        Query.select(['*', 'version.number', 'version.compatibility'])
      ],
    })
    for (const install of installs.rows) {
      if (gte(install.version.number, latest.number)) {
        throw new Error('Functionality with same or newer version already installed !')
      }
    }

    // check appwrite compatibility
    const compatible = satisfies(project.version, latest.compatibility)
    if (!compatible) {
      throw new Error('Functionality not compatible with Appwrite version')
    }

    await installFunctionality(req.bodyJson.functionality, latest.file, project.$id, { storage, log, error, cli })

    status = 'success'
  } catch (e) {
    status = 'failed'

    throw e
  } finally {
    await tablesDb.updateRow({
      databaseId: '68fca7cb002fb26ac958',
      tableId: 'installs',
      rowId: install.$id,
      data: {
        status,
      },
    })
  }

  return res.empty()
};
