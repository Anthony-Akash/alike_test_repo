/**
 * Checks for static assets in /public that are not referenced anywhere in the
 * app/ or server/ source trees. Run via: pnpm check:assets
 *
 * References are detected as plain filename matches (e.g. "god.svg") inside
 * .vue, .ts, .mjs, .json files. This catches both URL strings like
 * src="/icons/god.svg" and any import-based usage.
 */

import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const PUBLIC_DIR = join(ROOT, 'public')
const SOURCE_DIRS = [join(ROOT, 'app'), join(ROOT, 'server'), join(ROOT, 'i18n')]
const SOURCE_EXTENSIONS = new Set(['.vue', '.ts', '.mjs', '.js', '.json', '.css'])
const ASSET_EXTENSIONS = new Set(['.svg', '.png', '.jpg', '.jpeg', '.webp', '.gif', '.ico', '.pdf'])

/** Recursively collect all files under a directory. */
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...await walk(full))
    } else {
      files.push(full)
    }
  }
  return files
}

// Collect all public asset paths
const publicFiles = (await walk(PUBLIC_DIR)).filter((f) => {
  const ext = f.slice(f.lastIndexOf('.')).toLowerCase()
  return ASSET_EXTENSIONS.has(ext)
})

// Collect all source file contents into one big string for fast search
const sourceFiles = (
  await Promise.all(SOURCE_DIRS.map(walk))
).flat().filter((f) => {
  const ext = f.slice(f.lastIndexOf('.')).toLowerCase()
  return SOURCE_EXTENSIONS.has(ext)
})

const sourceContents = (
  await Promise.all(sourceFiles.map((f) => readFile(f, 'utf8').catch(() => '')))
).join('\n')

// Check each asset
const unused = []
const used = []

for (const asset of publicFiles) {
  const filename = asset.slice(asset.lastIndexOf('/') + 1)
  // Match by filename — catches "/icons/god.svg", "god.svg", 'god.svg', god.svg
  if (sourceContents.includes(filename)) {
    used.push(asset)
  } else {
    unused.push(asset)
  }
}

const relPath = (p) => relative(ROOT, p)

console.log('\n📦 Public asset audit')
console.log(`   Scanned: ${publicFiles.length} assets  |  Source files: ${sourceFiles.length}\n`)

if (unused.length === 0) {
  console.log('✅ All public assets are referenced in source files.\n')
} else {
  console.log(`⚠️  ${unused.length} unused asset(s):\n`)
  for (const f of unused) {
    console.log(`   ✗  ${relPath(f)}`)
  }
  console.log('')
}

if (used.length > 0) {
  console.log(`✅ ${used.length} asset(s) in use:\n`)
  for (const f of used) {
    console.log(`   ✓  ${relPath(f)}`)
  }
  console.log('')
}

process.exit(unused.length > 0 ? 1 : 0)
