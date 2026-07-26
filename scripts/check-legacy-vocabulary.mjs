import { readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)))

const scannedEntries = ['src', 'docs', 'README.md', 'package.json', 'index.html', 'public']
const skippedDirectories = new Set(['.git', 'coverage', 'dist', 'node_modules'])
const scannedExtensions = new Set(['.css', '.html', '.json', '.md', '.svg', '.ts', '.vue'])

const retiredVocabulary = [
  ['agent', /\bagent\b/i],
  ['sales', /\bsales\b/i],
  ['report', /\breports?\b/i],
  ['USA', /\bUSA\b/i],
  ['Canada', /\bCanada\b/i],
  ['insurance', /\binsurance\b/i],
  ['investment plan', /\binvestment\s+plan\b/i],
  ['commission', /\bcommission\b/i],
  ['chargeback', /\bchargebacks?\b/i],
  ['persistency', /\bpersistency\b/i],
  ['SalesPulse', /\bSalesPulse\b/i],
]

const files = []

const toPosix = (path) => path.replaceAll('\\', '/')

const addFile = (filePath) => {
  if (scannedExtensions.has(extname(filePath))) {
    files.push(filePath)
  }
}

const walk = (directory) => {
  for (const entry of readdirSync(directory)) {
    if (skippedDirectories.has(entry)) continue

    const fullPath = resolve(directory, entry)
    const stats = statSync(fullPath)

    if (stats.isDirectory()) {
      walk(fullPath)
      continue
    }

    addFile(fullPath)
  }
}

for (const entry of scannedEntries) {
  const fullPath = resolve(projectRoot, entry)
  const stats = statSync(fullPath)

  if (stats.isDirectory()) {
    walk(fullPath)
    continue
  }

  addFile(fullPath)
}

const findings = []

for (const filePath of files) {
  const source = readFileSync(filePath, 'utf8')
  const lines = source.split(/\r?\n/)

  lines.forEach((line, index) => {
    for (const [label, pattern] of retiredVocabulary) {
      if (pattern.test(line)) {
        findings.push(`${toPosix(relative(projectRoot, filePath))}:${index + 1} contains "${label}"`)
      }
    }
  })
}

if (findings.length) {
  console.error('Retired vocabulary found:')
  console.error(findings.map((finding) => `- ${finding}`).join('\n'))
  process.exit(1)
}

console.log(`Vocabulary check passed for ${files.length} files.`)
