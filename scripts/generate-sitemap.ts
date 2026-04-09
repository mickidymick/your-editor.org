import * as fs from 'fs';
import * as path from 'path';

const DOMAIN = 'https://your-editor.org';

const STATIC_PAGES = [
  '/',
  '/install',
  '/update',
  '/changelog',
  '/user-guide',
  '/ypm',
  '/plugins',
  '/example-configs',
  '/lsp-setup',
  '/faq',
  '/dev-manual',
  '/reference/commands',
  '/reference/variables',
  '/reference/attributes',
  '/reference/status-line',
  '/reference/events',
  '/reference/keys',
  '/reference/style-components',
];

function main() {
  const pluginsPath = path.resolve(__dirname, '../data/plugins.json');
  const plugins = JSON.parse(fs.readFileSync(pluginsPath, 'utf-8'));

  const urls = [
    ...STATIC_PAGES,
    ...plugins.map((p: any) => `/plugins/${p.slug}`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url: string) => `  <url>
    <loc>${DOMAIN}${url}</loc>
  </url>`).join('\n')}
</urlset>`;

  const outputPath = path.resolve(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, xml);
  console.log(`Wrote sitemap with ${urls.length} URLs to ${outputPath}`);
}

main();
