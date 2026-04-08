import * as fs from 'fs';
import * as path from 'path';

// xterm 256-color palette (indices 0-255) -> hex RGB
const XTERM_256: string[] = (() => {
  const palette: string[] = [];
  // 0-15: standard + bright colors
  const base16 = [
    '000000','800000','008000','808000','000080','800080','008080','c0c0c0',
    '808080','ff0000','00ff00','ffff00','0000ff','ff00ff','00ffff','ffffff',
  ];
  palette.push(...base16);
  // 16-231: 6x6x6 color cube
  const vals = [0, 95, 135, 175, 215, 255];
  for (let r = 0; r < 6; r++)
    for (let g = 0; g < 6; g++)
      for (let b = 0; b < 6; b++)
        palette.push(
          vals[r].toString(16).padStart(2,'0') +
          vals[g].toString(16).padStart(2,'0') +
          vals[b].toString(16).padStart(2,'0')
        );
  // 232-255: grayscale
  for (let i = 0; i < 24; i++) {
    const v = 8 + i * 10;
    const h = v.toString(16).padStart(2,'0');
    palette.push(h + h + h);
  }
  return palette;
})();

const ATTR_16_MAP: Record<string, string> = {
  ATTR_16_BLACK: '000000',
  ATTR_16_RED: 'cc0000',
  ATTR_16_GREEN: '00cc00',
  ATTR_16_YELLOW: 'cccc00',
  ATTR_16_BLUE: '0000cc',
  ATTR_16_MAGENTA: 'cc00cc',
  ATTR_16_CYAN: '00cccc',
  ATTR_16_WHITE: 'cccccc',
  ATTR_16_GREY: '808080',
  ATTR_16_LIGHT_RED: 'ff0000',
  ATTR_16_LIGHT_GREEN: '00ff00',
  ATTR_16_LIGHT_YELLOW: 'ffff00',
  ATTR_16_LIGHT_BLUE: '5555ff',
  ATTR_16_LIGHT_MAGENTA: 'ff00ff',
  ATTR_16_LIGHT_CYAN: '00ffff',
  ATTR_16_LIGHT_WHITE: 'ffffff',
};

interface StyleColors {
  bg: string;
  fg: string;
  comment: string;
  keyword: string;
  fn_call: string;
  number: string;
  string: string;
  statusBg: string;
  statusFg: string;
  gutterFg: string;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '').padStart(6, '0');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return clamp(r).toString(16).padStart(2,'0') +
         clamp(g).toString(16).padStart(2,'0') +
         clamp(b).toString(16).padStart(2,'0');
}

// Evaluate a color expression from the C source and return hex string
function evalColorExpr(expr: string, defines: Map<string, string>): string | null {
  expr = expr.trim().replace(/;$/, '').trim();

  // Check ATTR_16_* constants
  for (const [key, val] of Object.entries(ATTR_16_MAP)) {
    if (expr === key) return val;
  }

  // Pure integer (256-color index)
  if (/^\d+$/.test(expr)) {
    const idx = parseInt(expr);
    if (idx >= 0 && idx < 256) return XTERM_256[idx];
  }

  // Defined name reference
  if (defines.has(expr)) {
    return defines.get(expr)!;
  }

  // 0xRRGGBB
  const hexMatch = expr.match(/^0x([0-9a-fA-F]{6})$/);
  if (hexMatch) return hexMatch[1].toLowerCase();

  // RGB_32_hex(RRGGBB)
  const hex32Match = expr.match(/RGB_32_hex\(\s*([0-9a-fA-F]{6})\s*\)/);
  if (hex32Match && !expr.includes('+') && !expr.includes('-')) {
    return hex32Match[1].toLowerCase();
  }

  // RGB_32(r, g, b)
  const rgb32Match = expr.match(/^RGB_32\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
  if (rgb32Match) {
    return rgbToHex(parseInt(rgb32Match[1]), parseInt(rgb32Match[2]), parseInt(rgb32Match[3]));
  }

  // MAYBE_CONVERT(...) or ALT(..., ...) — extract the first (truecolor) argument
  const wrapperMatch = expr.match(/^(?:MAYBE_CONVERT|ALT)\(\s*(.*?)(?:\s*,\s*\d+\s*)?\)$/s);
  if (wrapperMatch) {
    return evalColorExpr(wrapperMatch[1], defines);
  }

  // Handle addition/subtraction of color expressions
  // e.g. RGB_32(30, 30, 30) + RGB_32(20, 25, 35)
  // e.g. RGB_32_hex(d5c4a1) - RGB_32(80, 50, 20)
  const parts = splitColorArithmetic(expr);
  if (parts && parts.length > 1) {
    let r = 0, g = 0, b = 0;
    for (const part of parts) {
      const val = evalColorExpr(part.expr, defines);
      if (!val) return null;
      const [pr, pg, pb] = hexToRgb(val);
      if (part.op === '+') { r += pr; g += pg; b += pb; }
      else { r -= pr; g -= pg; b -= pb; }
    }
    return rgbToHex(r, g, b);
  }

  // Parenthesized expression
  if (expr.startsWith('(') && expr.endsWith(')')) {
    return evalColorExpr(expr.slice(1, -1), defines);
  }

  return null;
}

function splitColorArithmetic(expr: string): { op: '+' | '-'; expr: string }[] | null {
  // Split on + or - that are outside parentheses
  const parts: { op: '+' | '-'; expr: string }[] = [];
  let depth = 0;
  let current = '';
  let currentOp: '+' | '-' = '+';

  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (ch === '(' || ch === '<') depth++;
    else if (ch === ')' || ch === '>') depth--;
    else if (depth === 0 && (ch === '+' || ch === '-')) {
      const trimmed = current.trim();
      if (trimmed) {
        parts.push({ op: currentOp, expr: trimmed });
      }
      currentOp = ch as '+' | '-';
      current = '';
      continue;
    }
    current += ch;
  }
  const trimmed = current.trim();
  if (trimmed) parts.push({ op: currentOp, expr: trimmed });

  return parts.length > 1 ? parts : null;
}

interface ParsedStyle {
  name: string;
  colors: StyleColors;
}

function parseStyleFile(filePath: string): ParsedStyle[] {
  const src = fs.readFileSync(filePath, 'utf-8');
  const results: ParsedStyle[] = [];

  // Phase 1: collect all #define color definitions (may be redefined between styles)
  // We'll process the file in sections split by yed_plugin_set_style calls
  const styleNames: string[] = [];
  const styleRegex = /yed_plugin_set_style\s*\(\s*self\s*,\s*"([^"]+)"/g;
  let m;
  while ((m = styleRegex.exec(src)) !== null) {
    styleNames.push(m[1]);
  }

  if (styleNames.length === 0) return [];

  // For each style, we need to find the defines and assignments active at that point
  // Strategy: process the file linearly, tracking defines and style assignments
  const lines = src.split('\n');
  let defines = new Map<string, string>();
  let assignments: Record<string, string> = {};
  let currentStyleIdx = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    // #define name (value) or #define name value
    const defMatch = trimmed.match(/^#define\s+(\w+)\s+(.+)$/);
    if (defMatch) {
      const name = defMatch[1];
      let val = defMatch[2].trim().replace(/;$/, '').trim();
      if (name === 'MAYBE_CONVERT' || name === 'ALT') continue; // skip macros
      // Try to resolve immediately
      const resolved = evalColorExpr(val, defines);
      if (resolved) {
        defines.set(name, resolved);
      }
    }

    // #undef — track redefinitions
    const undefMatch = trimmed.match(/^#undef\s+(\w+)/);
    if (undefMatch) {
      defines.delete(undefMatch[1]);
    }

    // s.xxx.fg = value;  or  s.xxx.bg = value;
    const assignMatch = trimmed.match(/s\.(\w+)\.(\w+)\s*=\s*(.+?)\s*;/);
    if (assignMatch) {
      const field = assignMatch[1];
      const prop = assignMatch[2];
      const val = assignMatch[3].trim();
      const key = `${field}.${prop}`;
      assignments[key] = val;
    }

    // Copy assignments like s.code_character = s.code_string;
    const copyMatch = trimmed.match(/s\.(\w+)\s*=\s*s\.(\w+)\s*;/);
    if (copyMatch) {
      const dst = copyMatch[1];
      const src_ = copyMatch[2];
      // Copy fg and bg
      if (assignments[`${src_}.fg`]) assignments[`${dst}.fg`] = assignments[`${src_}.fg`];
      if (assignments[`${src_}.bg`]) assignments[`${dst}.bg`] = assignments[`${src_}.bg`];
    }

    // When we hit yed_plugin_set_style, extract colors for this style
    if (trimmed.includes('yed_plugin_set_style') && currentStyleIdx < styleNames.length) {
      const styleName = styleNames[currentStyleIdx];

      const resolve = (key: string, fallback: string): string => {
        const raw = assignments[key];
        if (!raw) return fallback;
        // Try resolving through defines first
        const fromDefine = defines.get(raw);
        if (fromDefine) return fromDefine;
        // Try evaluating expression
        const evaluated = evalColorExpr(raw, defines);
        return evaluated || fallback;
      };

      // Determine if this is a light theme based on name or background brightness
      const bgHex = resolve('active.bg', '1a1a2e');
      const [br, bg_, bb] = hexToRgb(bgHex);
      const brightness = (br * 299 + bg_ * 587 + bb * 114) / 1000;
      const isLight = brightness > 128;
      const defaultFg = isLight ? '333333' : 'cccccc';
      const defaultComment = isLight ? '888888' : '666666';

      const colors: StyleColors = {
        bg: bgHex,
        fg: resolve('active.fg', defaultFg),
        comment: resolve('code_comment.fg', defaultComment),
        keyword: resolve('code_keyword.fg', resolve('active.fg', defaultFg)),
        fn_call: resolve('code_fn_call.fg', resolve('active.fg', defaultFg)),
        number: resolve('code_number.fg', resolve('active.fg', defaultFg)),
        string: resolve('code_string.fg', resolve('active.fg', defaultFg)),
        statusBg: resolve('status_line.bg', resolve('active.fg', defaultFg)),
        statusFg: resolve('status_line.fg', resolve('active.bg', bgHex)),
        gutterFg: defaultComment,
      };

      results.push({ name: styleName, colors });
      currentStyleIdx++;
      // Reset assignments for next style variant (but keep defines until #undef)
      if (currentStyleIdx < styleNames.length) {
        // Only partially reset — some files reuse assignments
        // Keep defines, clear assignments for fields that get reassigned
      }
    }

    // memset(&s, 0, ...) resets assignments
    if (trimmed.includes('memset(&s')) {
      assignments = {};
    }
  }

  return results;
}

function generateSvg(styleName: string, c: StyleColors): string {
  const W = 520;
  const H = 260;
  const GUTTER_W = 36;
  const LINE_H = 18;
  const FONT_SIZE = 12;
  const PAD_LEFT = 8;
  const PAD_TOP = 12;
  const STATUS_H = 22;
  const CHAR_W = 7.2;

  // Code lines with syntax tokens
  // Each token: [text, colorKey]
  type Token = [string, keyof StyleColors | 'none'];
  const codeLines: Token[][] = [
    [['/* A style for yed */', 'comment']],
    [['#include', 'keyword'], [' <stdio.h>', 'fg']],
    [],
    [['int', 'keyword'], [' ', 'none'], ['main', 'fn_call'], ['(', 'fg'], ['void', 'keyword'], [')', 'fg'], [' {', 'fg']],
    [['    ', 'none'], ['char', 'keyword'], [' *s = ', 'fg'], ['"hello"', 'string'], [';', 'fg']],
    [['    ', 'none'], ['int', 'keyword'], [' n = ', 'fg'], ['42', 'number'], [';', 'fg']],
    [['    ', 'none'], ['printf', 'fn_call'], ['(s);', 'fg']],
    [['    ', 'none'], ['return', 'keyword'], [' ', 'none'], ['0', 'number'], [';', 'fg']],
    [['}', 'fg']],
  ];

  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs><style>text { font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, monospace; }</style></defs>
<rect width="${W}" height="${H}" rx="8" fill="#${c.bg}"/>`;

  // Render code lines
  for (let i = 0; i < codeLines.length; i++) {
    const y = PAD_TOP + (i + 1) * LINE_H;
    const lineNum = i + 1;

    // Line number in gutter
    svg += `\n<text x="${GUTTER_W - 4}" y="${y}" text-anchor="end" font-size="${FONT_SIZE}" fill="#${c.gutterFg}" opacity="0.5">${lineNum}</text>`;

    // Code tokens
    let x = GUTTER_W + PAD_LEFT;
    for (const [text, colorKey] of codeLines[i]) {
      const color = colorKey === 'none' ? c.fg : c[colorKey];
      svg += `<text x="${x}" y="${y}" font-size="${FONT_SIZE}" fill="#${color}">${esc(text)}</text>`;
      x += text.length * CHAR_W;
    }
  }

  // Gutter separator line
  svg += `\n<line x1="${GUTTER_W}" y1="0" x2="${GUTTER_W}" y2="${H - STATUS_H}" stroke="#${c.gutterFg}" opacity="0.15"/>`;

  // Status bar
  const statusY = H - STATUS_H;
  svg += `\n<rect y="${statusY}" width="${W}" height="${STATUS_H}" rx="0" fill="#${c.statusBg}"/>`;
  // Rounded bottom corners overlay
  svg += `\n<rect y="${statusY}" width="${W}" height="${STATUS_H}" rx="8" fill="#${c.statusBg}" clip-path="inset(0 0 0 0 round 0 0 8px 8px)"/>`;
  // Use a clip path approach: just cover the bottom with the rounded rect
  svg += `\n<rect x="0" y="${H - 8}" width="${W}" height="8" rx="0" fill="#${c.statusBg}"/>`;
  svg += `\n<path d="M0,${H - 8} L0,${H} Q0,${H} 0,${H} L0,${H - 8} Z" fill="#${c.statusBg}"/>`;
  // Simpler: just use clip-path
  // Actually let me simplify - just draw status bar and then round bottom corners
  svg = svg.replace(
    `<rect width="${W}" height="${H}" rx="8" fill="#${c.bg}"/>`,
    `<clipPath id="clip"><rect width="${W}" height="${H}" rx="8"/></clipPath>
<rect width="${W}" height="${H}" rx="8" fill="#${c.bg}" clip-path="url(#clip)"/>`
  );
  // Redo status bar inside clip path group
  svg = svg.replace(
    `<rect y="${statusY}" width="${W}" height="${STATUS_H}" rx="0" fill="#${c.statusBg}"/>`,
    ''
  );
  svg = svg.replace(
    `<rect y="${statusY}" width="${W}" height="${STATUS_H}" rx="8" fill="#${c.statusBg}" clip-path="inset(0 0 0 0 round 0 0 8px 8px)"/>`,
    ''
  );
  svg = svg.replace(
    `<rect x="0" y="${H - 8}" width="${W}" height="8" rx="0" fill="#${c.statusBg}"/>`,
    ''
  );
  svg = svg.replace(
    `<path d="M0,${H - 8} L0,${H} Q0,${H} 0,${H} L0,${H - 8} Z" fill="#${c.statusBg}"/>`,
    ''
  );

  // Re-add status bar cleanly
  svg += `\n<g clip-path="url(#clip)">`;
  svg += `\n<rect y="${statusY}" width="${W}" height="${STATUS_H}" fill="#${c.statusBg}"/>`;
  svg += `\n<text x="10" y="${statusY + 15}" font-size="${FONT_SIZE}" fill="#${c.statusFg}" font-weight="bold"> ${esc(styleName)}</text>`;
  svg += `\n<text x="${W - 10}" y="${statusY + 15}" font-size="${FONT_SIZE}" fill="#${c.statusFg}" text-anchor="end">yed</text>`;
  svg += `\n</g>`;

  svg += '\n</svg>';
  return svg;
}

// Main
const stylesDir = path.resolve(__dirname, '../.ypm-plugins/ypm_plugins/styles');
const outDir = path.resolve(__dirname, '../public/style-previews');
const colorsOutPath = path.resolve(__dirname, '../data/style-colors.json');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const allColors: Record<string, StyleColors> = {};
let totalGenerated = 0;

const styleDirs = fs.readdirSync(stylesDir).filter(d =>
  fs.statSync(path.join(stylesDir, d)).isDirectory()
);

for (const dir of styleDirs) {
  const cFile = path.join(stylesDir, dir, `${dir}.c`);
  if (!fs.existsSync(cFile)) continue;

  const styles = parseStyleFile(cFile);
  for (const style of styles) {
    const slug = `styles-${style.name}`;
    const svg = generateSvg(style.name, style.colors);
    const outFile = path.join(outDir, `${slug}.svg`);
    fs.writeFileSync(outFile, svg);
    allColors[slug] = style.colors;
    totalGenerated++;
    console.log(`  Generated: ${slug}.svg`);
  }
}

// Write colors JSON for use in the app
fs.writeFileSync(colorsOutPath, JSON.stringify(allColors, null, 2));
console.log(`\nGenerated ${totalGenerated} style preview SVGs in ${outDir}`);
console.log(`Wrote color data to ${colorsOutPath}`);
