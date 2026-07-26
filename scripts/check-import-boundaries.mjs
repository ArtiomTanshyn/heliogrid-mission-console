import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)))
const sourceRoot = resolve(projectRoot, 'src')
const sourceExtensions = new Set(['.ts', '.vue'])
const importPattern =
  /(?:import|export)\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)/g

const aliasTargets = [
  ['@api/', 'api/'],
  ['@app/', 'app/'],
  ['@entities/', 'entities/'],
  ['@features/', 'features/'],
  ['@mock/', 'mock/'],
  ['@shared/', 'shared/'],
  ['@/', ''],
]

const sourceFiles = []

const toPosix = (path) => path.replaceAll('\\', '/')

const walk = (directory) => {
  for (const entry of readdirSync(directory)) {
    const fullPath = resolve(directory, entry)
    const stats = statSync(fullPath)

    if (stats.isDirectory()) {
      walk(fullPath)
      continue
    }

    if ([...sourceExtensions].some((extension) => fullPath.endsWith(extension))) {
      sourceFiles.push(fullPath)
    }
  }
}

const getSourcePath = (importSource, importerPath) => {
  if (importSource.startsWith('.')) {
    const resolvedImport = resolve(dirname(importerPath), importSource)
    const relativeImport = toPosix(relative(sourceRoot, resolvedImport))

    return relativeImport.startsWith('..') ? null : relativeImport
  }

  for (const [alias, target] of aliasTargets) {
    if (importSource.startsWith(alias)) return `${target}${importSource.slice(alias.length)}`
  }

  return null
}

const getLayer = (sourcePath) => sourcePath.split('/')[0]

const getFeatureName = (sourcePath) => sourcePath.split('/')[1] ?? ''

const getViolation = (importerPath, importedPath) => {
  const importerLayer = getLayer(importerPath)
  const importedLayer = getLayer(importedPath)

  if (importerLayer === 'shared' && importedLayer !== 'shared') {
    return 'shared can only import shared modules or external packages'
  }

  if (importerLayer === 'entities') {
    if (['app', 'features', 'layouts', 'mock', 'pages', 'stores'].includes(importedLayer)) {
      return 'entities cannot import app, features, layouts, mock, pages, or stores'
    }

    if (importedLayer === 'api' && !importedPath.startsWith('api/dto/')) {
      return 'entities may import only api/dto contracts from api'
    }
  }

  if (importerLayer === 'features') {
    if (['layouts', 'mock', 'pages'].includes(importedLayer)) {
      return 'features cannot import layouts, mock, or pages'
    }

    if (importedLayer === 'features' && getFeatureName(importerPath) !== getFeatureName(importedPath)) {
      return 'features cannot import other feature modules directly'
    }
  }

  if (
    importerPath.startsWith('app/access/') &&
    ['api', 'features', 'layouts', 'mock', 'pages', 'stores'].includes(importedLayer)
  ) {
    return 'app/access cannot import api, features, layouts, mock, pages, or stores'
  }

  if (importerLayer === 'api' && ['features', 'layouts', 'pages', 'stores'].includes(importedLayer)) {
    return 'api cannot import features, layouts, pages, or stores'
  }

  if (importerLayer === 'stores' && ['features', 'layouts', 'mock', 'pages'].includes(importedLayer)) {
    return 'stores cannot import features, layouts, mock, or pages'
  }

  if (importerLayer === 'mock' && ['app', 'features', 'layouts', 'pages', 'stores'].includes(importedLayer)) {
    return 'mock cannot import app, features, layouts, pages, or stores'
  }

  return null
}

walk(sourceRoot)

const violations = []

for (const filePath of sourceFiles) {
  const source = readFileSync(filePath, 'utf8')
  const importerPath = toPosix(relative(sourceRoot, filePath))
  let match

  while ((match = importPattern.exec(source)) !== null) {
    const importSource = match[1] ?? match[2]
    const importedPath = getSourcePath(importSource, filePath)

    if (!importedPath) continue

    const violation = getViolation(importerPath, importedPath)

    if (violation) {
      violations.push(`${importerPath} -> ${importSource}: ${violation}`)
    }
  }
}

if (violations.length) {
  console.error('Import boundary violations found:')
  console.error(violations.map((violation) => `- ${violation}`).join('\n'))
  process.exit(1)
}

console.log(`Import boundaries passed for ${sourceFiles.length} source files.`)
