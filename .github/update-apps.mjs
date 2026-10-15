// Rewrites the "My apps" list in README.md from the website's project data,
// so the profile always shows the same apps as https://zerontwoi.github.io.

import { readFile, writeFile } from 'node:fs/promises';

const SITE = 'https://zerontwoi.github.io/';
const res = await fetch(process.env.DATA_URL ?? new URL('data/projects.json', SITE));
if (!res.ok) throw new Error(`Could not load the project data: HTTP ${res.status}`);
const { projects } = await res.json();

const cell = text => String(text ?? '').replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
const rows = projects.map(p => {
  const icon = p.icon ? `<img src="${new URL(p.icon, SITE)}" width="44" alt="">` : '';
  const action = p.release ? `[⬇️ Download](${SITE}#${p.repo})` : `[See it](${p.url})`;
  return `| ${icon} | **[${cell(p.title)}](${p.url})**<br>${cell(p.description)} | ${action} |`;
});
const table = ['| | App | |', '|:-:|---|:-:|', ...rows].join('\n');

const readme = await readFile('README.md', 'utf8');
await writeFile('README.md', readme.replace(
  /(<!-- APPS:START -->)[\s\S]*?(<!-- APPS:END -->)/,
  (match, start, end) => `${start}\n${table}\n${end}`,
));
console.log(`Listed ${projects.length} apps.`);
