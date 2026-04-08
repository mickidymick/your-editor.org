import * as fs from 'fs';
import * as path from 'path';

interface ChangelogEntry {
  version: string;
  date: string;
  fixed: string[];
  changed: string[];
  added: string[];
}

function main() {
  const changelogPath = path.resolve(process.env.HOME || '~', 'yed/CHANGELOG.md');
  const outputPath = path.resolve(__dirname, '../data/changelog.json');

  if (!fs.existsSync(changelogPath)) {
    console.error(`Changelog not found: ${changelogPath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(changelogPath, 'utf-8');
  const lines = content.split('\n');

  const entries: ChangelogEntry[] = [];
  let current: ChangelogEntry | null = null;
  let currentSection: 'fixed' | 'changed' | 'added' | null = null;
  let currentItem: string[] = [];

  function flushItem() {
    if (current && currentSection && currentItem.length > 0) {
      current[currentSection].push(currentItem.join(' ').trim());
    }
    currentItem = [];
  }

  for (const line of lines) {
    // Version header: ## 1700 - TBD or ## 1600 - 2024-7-3
    const versionMatch = line.match(/^## (\d+)\s*-\s*(.+)$/);
    if (versionMatch) {
      flushItem();
      if (current) entries.push(current);
      current = {
        version: versionMatch[1],
        date: versionMatch[2].trim(),
        fixed: [],
        changed: [],
        added: [],
      };
      currentSection = null;
      continue;
    }

    // Section header: ### Fixed, ### Changed, ### Added
    const sectionMatch = line.match(/^### (Fixed|Changed|Added)$/i);
    if (sectionMatch && current) {
      flushItem();
      currentSection = sectionMatch[1].toLowerCase() as 'fixed' | 'changed' | 'added';
      continue;
    }

    // Bullet item
    const bulletMatch = line.match(/^\s{4}-\s+(.+)$/);
    if (bulletMatch && current && currentSection) {
      flushItem();
      currentItem.push(bulletMatch[1]);
      continue;
    }

    // Continuation line (indented further)
    const continuationMatch = line.match(/^\s{6,}(.+)$/);
    if (continuationMatch && currentItem.length > 0) {
      currentItem.push(continuationMatch[1]);
      continue;
    }
  }

  flushItem();
  if (current) entries.push(current);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(entries, null, 2));
  console.log(`Wrote ${entries.length} changelog entries to ${outputPath}`);
}

main();
