import * as fs from 'fs';
import * as path from 'path';

interface ManSection {
  title: string;
  body: string;
}

type PluginCategory =
  | 'editing' | 'editor-styles' | 'navigation' | 'ui' | 'lsp'
  | 'tools' | 'configuration' | 'fun'
  | 'language' | 'syntax' | 'style';

interface PluginData {
  slug: string;
  name: string;
  description: string;
  category: PluginCategory;
  configuration: ManSection[];
  commands: ManSection[];
  buffers: ManSection[];
  notes: string;
  version: string;
  keywords: string[];
  extraSections: Record<string, string>;
  repoUrl: string;
}

function findManPages(dir: string): { filePath: string; relativePath: string }[] {
  const results: { filePath: string; relativePath: string }[] = [];

  function walk(current: string) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory() && entry.name !== '.git' && entry.name !== 'test') {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.7')) {
        results.push({
          filePath: fullPath,
          relativePath: path.relative(dir, path.dirname(fullPath)),
        });
      }
    }
  }

  walk(dir);
  return results;
}

function getCategory(relativePath: string): PluginData['category'] {
  const rp = relativePath.replace(/\\/g, '/');
  if (rp.startsWith('styles/')) return 'style';
  if (rp.startsWith('lang/syntax/')) return 'syntax';
  if (rp.startsWith('lang/tools/')) return 'tools';
  if (rp.startsWith('lang/')) return 'language';
  return 'editing'; // default, will be overridden below
}

const CATEGORY_OVERRIDES: Record<string, PluginCategory> = {
  // Editor Styles
  'vimish': 'editor-styles',
  'xul': 'editor-styles',
  'drill': 'editor-styles',
  // Editing
  'completer': 'editing',
  'auto_paren': 'editing',
  'indent_c': 'editing',
  'comment': 'editing',
  'align': 'editing',
  'word_wrap': 'editing',
  'macro': 'editing',
  'make-tab': 'editing',
  'scroll_buffer': 'editing',
  'add_template': 'editing',
  // Navigation
  'find_file': 'navigation',
  'grep': 'navigation',
  'ctags': 'navigation',
  'go_menu': 'navigation',
  'tree_view': 'navigation',
  'bookmarks': 'navigation',
  'jump_stack': 'navigation',
  'loc_history': 'navigation',
  'find_bracket': 'navigation',
  'whence_you_came': 'navigation',
  // UI
  'line_numbers': 'ui',
  'cursor_word_hl': 'ui',
  'brace_hl': 'ui',
  'paren_hl': 'ui',
  'log_hl': 'ui',
  'mouse': 'ui',
  'mouse_frame_control': 'ui',
  'mouse_menu': 'ui',
  'custom_frames': 'ui',
  'save_layout': 'ui',
  // LSP
  'lsp': 'lsp',
  'lsp_diagnostics': 'lsp',
  'lsp_info_popup': 'lsp',
  'lsp_symbol_buffer': 'lsp',
  // Tools
  'builder': 'tools',
  'diff': 'tools',
  'terminal': 'tools',
  'shell_run': 'tools',
  'calc': 'tools',
  'convert': 'tools',
  'formatter': 'tools',
  'man': 'tools',
  'profile': 'tools',
  'flame_graph': 'tools',
  'pastebin': 'tools',
  'sysclip': 'tools',
  'universal_clipboard': 'tools',
  'hook': 'tools',
  // Configuration
  'yedrc': 'configuration',
  'command-history': 'configuration',
  'confirm-quit': 'configuration',
  'auto-save': 'configuration',
  'autotrim': 'configuration',
  'extension_mapper': 'configuration',
  'git_variables': 'configuration',
  'fstyle': 'configuration',
  'style_pack': 'configuration',
  'style_picker': 'configuration',
  'style_use_term_bg': 'configuration',
  // Fun
  'yule_2021': 'fun',
  'yule_2022': 'fun',
  // Julie is an editing tool (interactive language execution)
  'julie': 'editing',
};

function getSlug(relativePath: string): string {
  return relativePath.replace(/\\/g, '/').replace(/\//g, '-');
}

function cleanTroff(text: string): string {
  return text
    .replace(/\\fB(.*?)\\fR/g, '**$1**')       // bold
    .replace(/\\fI(.*?)\\fR/g, '*$1*')          // italic
    .replace(/\\fB(.*?)\\fP/g, '**$1**')
    .replace(/\\fI(.*?)\\fP/g, '*$1*')
    .replace(/\\\[u([0-9A-Fa-f]+)\]/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/\\-/g, '\x00DASH\x00')
    .replace(/\\&/g, '')
    .replace(/\\ /g, ' ');
}

function parseManPage(filePath: string): { name: string; description: string; sections: Record<string, string> } {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  let name = '';
  let description = '';
  const sections: Record<string, string> = {};
  let currentSection = '';
  let currentContent: string[] = [];
  let inExample = false;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.startsWith('.TH ')) continue;

    if (line === '.EX') {
      inExample = true;
      currentContent.push('```');
      continue;
    }
    if (line === '.EE') {
      inExample = false;
      currentContent.push('```');
      continue;
    }

    if (inExample) {
      currentContent.push(line);
      continue;
    }

    if (line.startsWith('.SH ')) {
      if (currentSection) {
        sections[currentSection] = currentContent.join('\n').trim();
      }
      currentSection = line.substring(4).trim();
      currentContent = [];
      continue;
    }

    if (line.startsWith('.SS ')) {
      currentContent.push('### ' + cleanTroff(line.substring(4)));
      continue;
    }

    if (line === '.P') {
      currentContent.push('');
      continue;
    }

    if (line.startsWith('.IP ')) {
      currentContent.push(line.substring(4).trim() + '. ');
      continue;
    }

    if (line.startsWith('.I ')) {
      currentContent.push('*' + line.substring(3) + '*');
      continue;
    }

    if (line.startsWith('.B ')) {
      currentContent.push('**' + line.substring(3) + '**');
      continue;
    }

    if (line.startsWith('.')) continue; // skip unknown macros

    currentContent.push(cleanTroff(line));
  }

  if (currentSection) {
    sections[currentSection] = currentContent.join('\n').trim();
  }

  // Parse NAME section
  // The troff \- was replaced with a sentinel during cleaning so we can split reliably
  const nameSection = sections['NAME'] || '';
  // Try sentinel first (from \-), then fall back to plain " - "
  const nameMatch = nameSection.match(/^(.+?)\s*\x00DASH\x00\s*(.+)$/s)
    || nameSection.match(/^(\S+)\s+-\s+(.+)$/s);
  if (nameMatch) {
    name = nameMatch[1].replace(/\x00DASH\x00/g, '-').trim();
    description = nameMatch[2].replace(/\x00DASH\x00/g, '-').trim();
  } else {
    name = nameSection.replace(/\x00DASH\x00/g, '-').trim();
  }

  // Clean up remaining sentinels in all sections
  for (const key of Object.keys(sections)) {
    sections[key] = sections[key].replace(/\x00DASH\x00/g, '-');
  }

  return { name, description, sections };
}

function parseSections(sectionContent: string): ManSection[] {
  const results: ManSection[] = [];
  const parts = sectionContent.split(/^### /m);

  for (const part of parts) {
    if (!part.trim()) continue;
    const firstNewline = part.indexOf('\n');
    if (firstNewline === -1) {
      results.push({ title: part.trim(), body: '' });
    } else {
      results.push({
        title: part.substring(0, firstNewline).trim(),
        body: part.substring(firstNewline + 1).trim(),
      });
    }
  }

  return results;
}

function parseGitmodules(gitmodulesPath: string): Record<string, string> {
  const map: Record<string, string> = {};
  if (!fs.existsSync(gitmodulesPath)) return map;

  const content = fs.readFileSync(gitmodulesPath, 'utf-8');
  const lines = content.split('\n');
  let currentPath = '';

  for (const line of lines) {
    const pathMatch = line.match(/^\s*path\s*=\s*(.+)$/);
    if (pathMatch) {
      currentPath = pathMatch[1].trim();
    }
    const urlMatch = line.match(/^\s*url\s*=\s*(.+)$/);
    if (urlMatch && currentPath) {
      let url = urlMatch[1].trim().replace(/\.git$/, '');
      // Normalize the path to be relative to ypm_plugins/
      const relPath = currentPath.replace(/^ypm_plugins\//, '');
      map[relPath] = url;
      currentPath = '';
    }
  }

  return map;
}

function main() {
  const pluginsDir = path.resolve(__dirname, '../.ypm-plugins/ypm_plugins');
  const gitmodulesPath = path.resolve(__dirname, '../.ypm-plugins/.gitmodules');
  const outputPath = path.resolve(__dirname, '../data/plugins.json');

  if (!fs.existsSync(pluginsDir)) {
    console.error(`Plugins directory not found: ${pluginsDir}`);
    process.exit(1);
  }

  const repoUrls = parseGitmodules(gitmodulesPath);
  const manPages = findManPages(pluginsDir);
  console.log(`Found ${manPages.length} man pages`);

  const plugins: PluginData[] = [];

  for (const { filePath, relativePath } of manPages) {
    try {
      const { name, description, sections } = parseManPage(filePath);
      const category = getCategory(relativePath);
      const slug = getSlug(relativePath);

      const knownSections = ['NAME', 'CONFIGURATION', 'COMMANDS', 'BUFFERS', 'NOTES', 'VERSION', 'KEYWORDS'];
      const extraSections: Record<string, string> = {};
      for (const [key, value] of Object.entries(sections)) {
        if (!knownSections.includes(key) && value && value.toLowerCase() !== 'none') {
          extraSections[key] = value;
        }
      }

      const configContent = sections['CONFIGURATION'] || '';
      const commandsContent = sections['COMMANDS'] || '';
      const buffersContent = sections['BUFFERS'] || '';

      const repoUrl = repoUrls[relativePath.replace(/\\/g, '/')] || '';

      const plugin: PluginData = {
        slug,
        name,
        description,
        category,
        configuration: configContent.toLowerCase() === 'none' ? [] : parseSections(configContent),
        commands: commandsContent.toLowerCase() === 'none' ? [] : parseSections(commandsContent),
        buffers: buffersContent.toLowerCase() === 'none' ? [] : parseSections(buffersContent),
        notes: (sections['NOTES'] || '').toLowerCase() === 'none' ? '' : (sections['NOTES'] || ''),
        version: (sections['VERSION'] || '').trim(),
        keywords: (sections['KEYWORDS'] || '')
          .split(/[,\s]+/)
          .map(k => k.trim())
          .filter(k => k.length > 0),
        extraSections,
        repoUrl,
      };

      // Apply category override if exists
      if (CATEGORY_OVERRIDES[plugin.slug]) {
        plugin.category = CATEGORY_OVERRIDES[plugin.slug];
      }

      plugins.push(plugin);
    } catch (err) {
      console.warn(`Warning: Failed to parse ${filePath}: ${err}`);
    }
  }

  // Sort alphabetically by name
  plugins.sort((a, b) => a.name.localeCompare(b.name));

  // Override placeholder descriptions from man pages that just say "Description"
  const descriptionOverrides: Record<string, string> = {
    'sysclip': 'Copy yed yank buffer contents to the system clipboard.',
    'lang-tools-gofmt': 'Automatically format Go files with gofmt on save.',
  };
  for (const p of plugins) {
    if (descriptionOverrides[p.slug]) {
      p.description = descriptionOverrides[p.slug];
    }
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(plugins, null, 2));
  console.log(`Wrote ${plugins.length} plugins to ${outputPath}`);

  // Print summary
  const counts: Record<string, number> = {};
  for (const p of plugins) counts[p.category] = (counts[p.category] || 0) + 1;
  console.log(`Categories: ${JSON.stringify(counts)}`);
}

main();
