import React from 'react';
import { View, Text, Pressable, StyleSheet, Linking, Image } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import { SEO } from '../../../components/SEO';
import { CodeBlock } from '../../../components/CodeBlock';
import { Colors } from '../../../constants/colors';
import { Typography } from '../../../constants/typography';
import plugins from '../../../data/plugins.json';
import pluginExtras from '../../../data/plugin-extras.json';
import styleColors from '../../../data/style-colors.json';

const PLUGIN_IMAGES: Record<string, any> = {
  'calc': require('../../../assets/images/calc.png'),
  'diff': require('../../../assets/images/diff.png'),
  'grep': require('../../../assets/images/grep.png'),
  'bookmarks': require('../../../assets/images/bookmarks.png'),
  'cursor_word_hl': require('../../../assets/images/cursor_word_hl.png'),
  'terminal': require('../../../assets/images/terminal.png'),
  'tree_view': require('../../../assets/images/tree_view.png'),
  'find_file': require('../../../assets/images/find_file.png'),
  'completer': require('../../../assets/images/completer.png'),
  'style_picker': require('../../../assets/images/style_picker.png'),
  'lsp_info_popup': require('../../../assets/images/lsp_info_popup.png'),
  'fstyle': require('../../../assets/images/fstyle.png'),
  'lsp_diagnostics': require('../../../assets/images/lsp_diagnostics.png'),
  'go_menu': require('../../../assets/images/go_menu.png'),
  'builder': require('../../../assets/images/builder.png'),
  'mouse_menu': require('../../../assets/images/mouse_menu.png'),
  'line_numbers': require('../../../assets/images/line_numbers.png'),
};

const styleColorData = styleColors as Record<string, {
  bg: string; fg: string; comment: string; keyword: string;
  fn_call: string; number: string; string: string;
}>;

export function generateStaticParams(): { slug: string }[] {
  return plugins.map((p) => ({ slug: p.slug }));
}

const CATEGORY_LABELS: Record<string, string> = {
  editing: 'Editing',
  'editor-styles': 'Editor Style',
  navigation: 'Navigation',
  ui: 'UI',
  lsp: 'LSP',
  tools: 'Tool',
  configuration: 'Configuration',
  language: 'Language',
  syntax: 'Syntax Highlighting',
  style: 'Color Theme',
  fun: 'Fun',
};

const FEATURED_SLUGS = new Set([
  'vimish', 'lsp', 'completer', 'tree_view', 'ctags', 'grep',
  'find_file', 'comment', 'terminal', 'builder', 'diff', 'bookmarks',
  'go_menu', 'loc_history', 'mouse', 'mouse_menu', 'line_numbers',
  'man', 'calc', 'universal_clipboard',
]);

const CATEGORY_COLORS: Record<string, string> = {
  editing: Colors.link,
  'editor-styles': '#9b59b6',
  navigation: '#2ecc71',
  ui: Colors.comment,
  lsp: '#e67e22',
  tools: '#d4a843',
  configuration: '#8ba4b0',
  language: Colors.string,
  syntax: Colors.comment,
  style: '#d81e5b',
  fun: '#e74c3c',
};

const extras = pluginExtras as Record<string, {
  summary?: string;
  related?: string[];
  exampleConfig?: string;
  warning?: string;
  infoCards?: { title: string; description: string; default?: boolean }[];
  infoCardsLink?: string;
  infoCardsLinkText?: string;
  bundledStyles?: string[];
  previewImage?: string;
}>;

export default function PluginDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const plugin = plugins.find((p) => p.slug === slug);

  if (!plugin) {
    return (
      <View>
        <Text style={styles.h1}>Plugin not found</Text>
        <Text style={styles.body}>
          No plugin with slug "{slug}".{' '}
          <Link href="/plugins" style={styles.link}>Back to plugins</Link>
        </Text>
      </View>
    );
  }

  const catColor = CATEGORY_COLORS[plugin.category] || Colors.link;
  const extra = extras[plugin.slug];
  const summary = extra?.summary || plugin.description;
  const relatedSlugs = extra?.related || [];
  const relatedPlugins = relatedSlugs
    .map((s) => plugins.find((p) => p.slug === s))
    .filter(Boolean) as typeof plugins;
  const exampleConfig = extra?.exampleConfig;
  const warning = extra?.warning;

  const commandCount = plugin.commands.length;
  const configCount = plugin.configuration.length;
  const bufferCount = plugin.buffers.length;
  const hasStats = commandCount > 0 || configCount > 0 || bufferCount > 0;

  // Pull top commands to show on main page (up to 5)
  const topCommands = plugin.commands.slice(0, 5);

  return (
    <View>
      <SEO title={plugin.name} description={summary} />
      <Link href="/plugins" style={styles.backLink}>{'\u2190'} All Plugins</Link>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.h1}>{plugin.name}</Text>
        <View style={styles.meta}>
          <View style={[styles.badge, { backgroundColor: catColor }]}>
            <Text style={styles.badgeText}>
              {CATEGORY_LABELS[plugin.category] || plugin.category}
            </Text>
          </View>
          {FEATURED_SLUGS.has(plugin.slug) && (
            <View style={[styles.badge, { backgroundColor: Colors.heading }]}>
              <Text style={styles.badgeText}>Featured</Text>
            </View>
          )}
          {plugin.version ? <Text style={styles.version}>v{plugin.version}</Text> : null}
        </View>
      </View>

      {/* Summary */}
      <Text style={styles.summary}>{summary}</Text>

      {/* Warning */}
      {warning && (
        <View style={styles.warning}>
          <Text style={styles.warningLabel}>WARNING</Text>
          <Text style={styles.warningBody}>{warning}</Text>
        </View>
      )}

      {/* Style preview for color themes */}
      {plugin.category === 'style' && (() => {
        // Find all style variants for this plugin
        const previewSlugs = Object.keys(styleColorData).filter(
          k => k === plugin.slug || k.startsWith(plugin.slug.replace('styles-', 'styles-'))
        );
        // Match slugs that belong to this plugin's source file
        const pluginBase = plugin.slug.replace('styles-', '');
        const pluginBaseHyphen = pluginBase.replace(/_/g, '-');
        const matchingSlugs = Object.keys(styleColorData).filter(k => {
          const styleName = k.replace('styles-', '');
          return styleName === pluginBase ||
            styleName === pluginBaseHyphen ||
            styleName.startsWith(pluginBase + '-') ||
            styleName.startsWith(pluginBaseHyphen + '-');
        });
        const slugsToShow = matchingSlugs.length > 0 ? matchingSlugs : previewSlugs;

        return slugsToShow.length > 0 ? (
          <View style={styles.previewSection}>
            {slugsToShow.map(s => (
              <View key={s} style={styles.previewWrapper}>
                <Image
                  source={{ uri: `/style-previews/${s}.svg` }}
                  style={styles.previewImage}
                  resizeMode="contain"
                />
              </View>
            ))}
          </View>
        ) : null;
      })()}

      {/* Plugin preview image */}
      {(PLUGIN_IMAGES[plugin.slug] || extra?.previewImage) && (
        <View style={styles.pluginPreviewSection}>
          <View style={styles.pluginPreviewFrame}>
            <Image
              source={PLUGIN_IMAGES[plugin.slug] || { uri: extra?.previewImage }}
              style={styles.pluginPreviewImage}
            />
          </View>
        </View>
      )}

      {/* Links row */}
      <View style={styles.linksRow}>
        {plugin.repoUrl ? (
          <Pressable onPress={() => Linking.openURL(plugin.repoUrl)} style={styles.linkButton}>
            <Text style={styles.linkButtonText}>GitHub</Text>
          </Pressable>
        ) : null}
        <Link href={`/plugins/${plugin.slug}/man` as any} asChild>
          <Pressable style={styles.linkButton}>
            <Text style={styles.linkButtonText}>Man Page</Text>
          </Pressable>
        </Link>
      </View>

      {/* At-a-glance stats */}
      {hasStats && (
        <View style={styles.statsRow}>
          {commandCount > 0 && (
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{commandCount}</Text>
              <Text style={styles.statLabel}>command{commandCount !== 1 ? 's' : ''}</Text>
            </View>
          )}
          {configCount > 0 && (
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{configCount}</Text>
              <Text style={styles.statLabel}>config option{configCount !== 1 ? 's' : ''}</Text>
            </View>
          )}
          {bufferCount > 0 && (
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{bufferCount}</Text>
              <Text style={styles.statLabel}>special buffer{bufferCount !== 1 ? 's' : ''}</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.divider} />

      {/* Info cards */}
      {extra?.infoCards && extra.infoCards.length > 0 && (
        <View style={styles.section}>
          <View style={styles.infoCardsGrid}>
            {extra.infoCards.map((card, i) => (
              <View key={i} style={[styles.infoCard, card.default && styles.infoCardHighlight]}>
                <View style={styles.infoCardHeader}>
                  <Text style={styles.infoCardTitle}>{card.title}</Text>
                  {card.default && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>default</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.infoCardDesc}>{card.description}</Text>
              </View>
            ))}
          {extra.infoCardsLink && (
            <Pressable onPress={() => Linking.openURL(extra.infoCardsLink!)}>
              <Text style={styles.infoCardsLink}>
                {extra.infoCardsLinkText || 'Learn more'} {'\u2192'}
              </Text>
            </Pressable>
          )}
          </View>
        </View>
      )}

      {/* Bundled styles */}
      {extra?.bundledStyles && extra.bundledStyles.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Included Styles ({extra.bundledStyles.length})
          </Text>
          <View style={styles.bundledGrid}>
            {extra.bundledStyles.map((s) => {
              const slug = `styles-${s}`;
              const base = s.replace(/_/g, '-');
              // Find all matching style color variants
              const variants = Object.entries(styleColorData).filter(([k]) => {
                const name = k.replace('styles-', '');
                return name === s || name === base ||
                  name.startsWith(s + '-') || name.startsWith(base + '-');
              });
              return (
                <Link key={s} href={`/plugins/${slug}` as any} asChild>
                  <Pressable style={styles.bundledCard}>
                    <Text style={styles.bundledName}>{s.replace(/_/g, ' ')}</Text>
                    {variants.map(([key, sc]) => (
                      <View key={key} style={[styles.bundledSwatch, { backgroundColor: '#' + sc.bg }]}>
                        {[sc.keyword, sc.fn_call, sc.string, sc.number, sc.comment, sc.fg].map((c, i) => (
                          <View key={i} style={[styles.bundledSwatchDot, { backgroundColor: '#' + c }]} />
                        ))}
                      </View>
                    ))}
                  </Pressable>
                </Link>
              );
            })}
          </View>
        </View>
      )}

      {/* Key commands */}
      {topCommands.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {commandCount > 5 ? 'Key Commands' : 'Commands'}
          </Text>
          {topCommands.map((cmd, i) => (
            <View key={i} style={styles.commandCard}>
              <Text style={styles.commandName}>{cmd.title}</Text>
              {cmd.body ? <Text style={styles.commandDesc}>{cmd.body}</Text> : null}
            </View>
          ))}
          {commandCount > 5 && (
            <Link href={`/plugins/${plugin.slug}/man` as any} style={styles.moreLink}>
              View all {commandCount} commands in man page {'\u2192'}
            </Link>
          )}
        </View>
      )}

      {/* Example config */}
      {exampleConfig && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuration</Text>
          <Text style={styles.configHint}>
            Example yedrc snippet — see the{' '}
            <Link href={`/plugins/${plugin.slug}/man` as any} style={styles.configLink}>
              man page
            </Link>
            {' '}for all options.
          </Text>
          <CodeBlock lang="yedrc">{exampleConfig}</CodeBlock>
        </View>
      )}

      {/* Notes */}
      {plugin.notes ? (
        <View style={styles.callout}>
          <Text style={styles.calloutLabel}>NOTES</Text>
          <Text style={styles.calloutBody}>{plugin.notes}</Text>
        </View>
      ) : null}

      {/* Keywords */}
      {plugin.keywords.length > 0 && (
        <View style={styles.keywordsRow}>
          {plugin.keywords.map((kw) => (
            <Text key={kw} style={styles.keyword}>{kw}</Text>
          ))}
        </View>
      )}

      {/* Related plugins */}
      {relatedPlugins.length > 0 && (
        <>
          <View style={styles.divider} />
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Related Plugins</Text>
            <View style={styles.relatedGrid}>
              {relatedPlugins.map((rp) => {
                const rpColor = CATEGORY_COLORS[rp.category] || Colors.link;
                const rpExtra = extras[rp.slug];
                return (
                  <Link key={rp.slug} href={`/plugins/${rp.slug}` as any} asChild>
                    <Pressable style={styles.relatedCard}>
                      <View style={styles.relatedHeader}>
                        <Text style={styles.relatedName}>{rp.name}</Text>
                        <View style={[styles.relatedBadge, { backgroundColor: rpColor }]}>
                          <Text style={styles.relatedBadgeText}>
                            {CATEGORY_LABELS[rp.category] || rp.category}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.relatedDesc} numberOfLines={2}>
                        {rpExtra?.summary ? rpExtra.summary.split('.')[0] + '.' : rp.description}
                      </Text>
                    </Pressable>
                  </Link>
                );
              })}
            </View>
          </View>
        </>
      )}

      {/* Install hint */}
      <View style={styles.divider} />
      <View style={styles.installBox}>
        <Text style={styles.installLabel}>Install with YPM</Text>
        <View style={styles.installCode}>
          <Text style={styles.installCodeText}>ypm-install {plugin.name}</Text>
        </View>
        <Text style={styles.installSub}>
          Or use <Text style={styles.code}>ypm-menu</Text> to browse and install interactively.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backLink: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.link,
    marginBottom: 16,
  },
  header: {
    marginBottom: 8,
  },
  h1: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xxl,
    color: Colors.heading,
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 12,
  },
  badgeText: {
    fontFamily: Typography.fontFamily,
    fontSize: 12,
    color: Colors.contentBg,
    fontWeight: 'bold',
  },
  version: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.subtleText,
  },
  summary: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.md,
    color: Colors.text,
    lineHeight: Typography.fontSize.md * Typography.lineHeight.normal,
    marginTop: 16,
    marginBottom: 16,
  },
  linksRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  linkButton: {
    backgroundColor: Colors.hoverBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  linkButtonText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.link,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 6,
    padding: 16,
    marginBottom: 8,
  },
  stat: {
    alignItems: 'center',
    marginRight: 32,
  },
  statNumber: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xl,
    color: Colors.heading,
    fontWeight: 'bold',
  },
  statLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.subtleText,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.cardBorder,
    marginVertical: 24,
    shadowColor: Colors.link,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.lg,
    color: Colors.heading,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  commandCard: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 6,
    padding: 14,
    marginBottom: 8,
  },
  commandName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.link,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  commandDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal,
  },
  moreLink: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.link,
    marginTop: 4,
  },
  configHint: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.subtleText,
    marginBottom: 8,
  },
  configLink: {
    color: Colors.link,
  },
  infoCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoCard: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 6,
    padding: 14,
    width: '48%' as any,
    minWidth: 200,
    marginRight: '2%' as any,
    marginBottom: 10,
  },
  bundledGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  bundledCard: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 6,
    padding: 10,
    marginRight: 10,
    marginBottom: 10,
    minWidth: 140,
  },
  bundledSwatchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bundledSwatch: {
    flexDirection: 'row',
    borderRadius: 4,
    padding: 5,
    paddingHorizontal: 7,
    marginBottom: 4,
  },
  bundledVariantLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: 10,
    color: Colors.subtleText,
    marginLeft: 6,
  },
  bundledSwatchDot: {
    width: 14,
    height: 14,
    borderRadius: 3,
    marginRight: 5,
  },
  bundledName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.link,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  infoCardsLink: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.link,
    marginTop: 4,
    marginBottom: 8,
  },
  infoCardHighlight: {
    borderColor: Colors.heading,
    borderWidth: 2,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  infoCardTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.heading,
    fontWeight: 'bold',
  },
  defaultBadge: {
    backgroundColor: Colors.heading,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  defaultBadgeText: {
    fontFamily: Typography.fontFamily,
    fontSize: 10,
    color: Colors.contentBg,
    fontWeight: 'bold',
  },
  infoCardDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal,
  },
  warning: {
    backgroundColor: '#2a1a1a',
    borderLeftWidth: 3,
    borderLeftColor: '#e74c3c',
    borderRadius: 4,
    padding: 14,
    marginBottom: 16,
  },
  warningLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: '#e74c3c',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  warningBody: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal,
  },
  callout: {
    backgroundColor: Colors.cardBg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.string,
    borderRadius: 4,
    padding: 14,
    marginBottom: 20,
  },
  calloutLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.string,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  calloutBody: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal,
  },
  keywordsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  keyword: {
    fontFamily: Typography.fontFamily,
    fontSize: 12,
    color: Colors.subtleText,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  relatedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  relatedCard: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 6,
    padding: 14,
    width: '48%' as any,
    minWidth: 220,
    marginRight: '2%' as any,
    marginBottom: 10,
  },
  relatedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  relatedName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.link,
    fontWeight: 'bold',
  },
  relatedBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  relatedBadgeText: {
    fontFamily: Typography.fontFamily,
    fontSize: 10,
    color: Colors.contentBg,
    fontWeight: 'bold',
  },
  relatedDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.subtleText,
    lineHeight: Typography.fontSize.sm * 1.4,
  },
  installBox: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 6,
    padding: 20,
    alignItems: 'center',
  },
  installLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.heading,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  installCode: {
    backgroundColor: Colors.codeBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  installCodeText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.link,
  },
  installSub: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.subtleText,
  },
  body: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal,
  },
  link: {
    color: Colors.link,
  },
  code: {
    fontFamily: Typography.fontFamily,
    backgroundColor: Colors.codeBg,
    paddingHorizontal: 4,
    color: Colors.text,
  },
  previewSection: {
    marginBottom: 16,
    width: '50%' as any,
    minWidth: 300,
  },
  previewWrapper: {
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  previewImage: {
    width: '100%' as any,
    aspectRatio: 2,
  },
  pluginPreviewSection: {
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  pluginPreviewFrame: {
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 6,
    overflow: 'hidden',
  },
  pluginPreviewImage: {
    width: 800,
    height: 420,
    maxWidth: '100%' as any,
  },
});
