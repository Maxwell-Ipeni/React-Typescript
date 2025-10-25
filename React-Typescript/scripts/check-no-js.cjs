#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')

function walk(dir, list = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === 'dist' || e.name === '.git') continue
    const full = path.join(dir, e.name)
    if (e.isDirectory()) walk(full, list)
    else list.push(full)
  }
  return list
}

const all = walk(path.join(root, 'src'))
const jsFiles = all.filter((p) => p.endsWith('.js') || p.endsWith('.jsx'))
if (jsFiles.length) {
  console.error('\nERROR: Found JavaScript files under src (project must be TypeScript-only):')
  jsFiles.forEach((f) => console.error(' - ' + path.relative(root, f)))
  console.error('\nRename these to .ts/.tsx and add proper typings, or remove them.\n')
  process.exit(1)
}
console.log('No JS files under src — good.')
