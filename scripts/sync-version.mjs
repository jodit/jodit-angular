// Copies the root package version into the publishable library package.json.
import { readFileSync, writeFileSync } from 'node:fs';

const root = JSON.parse(readFileSync('package.json', 'utf8'));
const libPath = 'projects/jodit-angular/package.json';
const lib = JSON.parse(readFileSync(libPath, 'utf8'));
lib.version = root.version;
writeFileSync(libPath, JSON.stringify(lib, null, 2) + '\n');

const changelogPath = 'CHANGELOG.md';
const changelog = readFileSync(changelogPath, 'utf8');
if (changelog.includes('## Unreleased')) {
  const date = new Date().toISOString().slice(0, 10);
  writeFileSync(changelogPath, changelog.replace('## Unreleased', `## ${root.version} (${date})`));
}
console.log(`jodit-angular -> ${root.version}`);
