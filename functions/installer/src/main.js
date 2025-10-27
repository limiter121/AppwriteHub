import { Client, TablesDB, Storage, Query } from 'node-appwrite';
import { spawn, spawnSync } from 'node:child_process';
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync, rmdirSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { gte, rcompare, satisfies } from 'semver'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function installFunctionality(id, { projectId, endpoint, installs }, { tablesDb, storage, log, error, cli }) {
  log('Installing functionality:', id)

  // get latest version
  const versions = await tablesDb.listRows({
    databaseId: '68fca7cb002fb26ac958',
    tableId: 'versions',
    queries: [
      Query.equal('functionality', id),
      Query.select(['*', 'functionality.title'])
    ],
  })
  const latest = versions.rows.sort(rcompare)[0]
  log('Latest version available:', latest.number)

  // check if already installed
  const installed = installs.find(install => install.functionality === id)
  log('Installed version:', installed?.version || '-')
  if (installed && gte(installed.version, latest.number)) {
    throw new Error('Functionality with same or newer version already installed !')
  }

  // check appwrite compatibility
  const awVersion = (await (await fetch(endpoint)).json()).version
  log('Found Appwrite version:', awVersion, )
  const compatible = satisfies(awVersion, latest.compatibility)
  if (!compatible) {
    throw new Error('Functionality not compatible with Appwrite version')
  }

  const file = await storage.getFileView({
    bucketId: '68fcabcf0013485fa596',
    fileId: latest.file,
  });
  const buf = Buffer.from(file)
  const zipPath = path.join('/tmp/', latest.file + '.zip')
  const unzipPath = path.join('/tmp/', latest.file)
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

  const install = cli(['tables-db', 'create-row', '--database-id', 'appwritehub', '--table-id', 'installs', '--row-id', 'unique()', '--json', '--data', JSON.stringify({ functionality: latest.functionality.title, functionalityId: id, version: latest.number, versionId: latest.$id })], { logArgs: false, logOutput: false, parseJson: true })
  log('Functionality installed !', install.$id)

  rmSync(unzipPath, { recursive: true, force: true })
}

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key'] ?? '');
  const tablesDb = new TablesDB(client);
  const storage = new Storage(client);

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

  // Login
  cli(['client', '--endpoint', req.bodyJson.endpoint, '--project-id', req.bodyJson.project, '--key', req.bodyJson.key], { logArgs: false })

  // Check installs
  let installs = { total: 0, rows: [] }
  if (req.bodyJson.skipChecks) {
    log('Skipping checks...')
  } else {
    installs = cli(['tables-db', 'list-rows', '--database-id', 'appwritehub', '--table-id', 'installs', '--json'], { logOutput: false, parseJson: true })
    log('Found', installs.total, 'installs')
    if (installs.total === 0) {
      throw new Error('No existing installs found')
    }
  }

  await installFunctionality(req.bodyJson.functionality, { projectId: req.bodyJson.project, endpoint: req.bodyJson.endpoint, installs: installs.rows }, { tablesDb, storage, log, error, cli })

  return res.empty()
};
