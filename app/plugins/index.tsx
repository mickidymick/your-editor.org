import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Platform } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import { SEO } from '../../components/SEO';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import plugins from '../../data/plugins.json';

const FEATURED_SLUGS = new Set([
  'vimish', 'lsp', 'completer', 'tree_view', 'ctags', 'grep',
  'find_file', 'comment', 'terminal', 'builder', 'diff', 'bookmarks',
  'go_menu', 'loc_history', 'mouse', 'mouse_menu', 'line_numbers',
  'man', 'calc',
]);

const CATEGORIES = [
  'all', 'featured', 'editor-styles', 'style', 'editing', 'navigation', 'ui', 'lsp',
  'language', 'syntax', 'tools', 'configuration', 'fun',
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  'editor-styles': 'Editor Styles',
};

const CATEGORY_COLORS: Record<string, string> = {
  featured: Colors.heading,
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

export default function PluginsIndex() {
  const params = useLocalSearchParams<{ category?: string }>();
  const validCats = CATEGORIES.filter(c => c !== 'all');
  const initialCat = params.category && validCats.includes(params.category as any)
    ? params.category
    : 'all';
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>(initialCat);

  useEffect(() => {
    if (Platform.OS === 'web') {
      window.scrollTo(0, 0);
    }
  }, []);

  const filtered = useMemo(() => {
    let result = [...plugins] as typeof plugins;
    if (category === 'featured') {
      result = result.filter((p) => FEATURED_SLUGS.has(p.slug));
    } else if (category !== 'all') {
      result = result.filter((p) => p.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }
    result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [search, category]);

  return (
    <View>
      <SEO title="Plugins" description="Browse and search 155+ plugins available for the yed terminal editor." />
      <Text style={styles.h1}>Plugins</Text>
      <Text style={styles.intro}>
        yed has {plugins.length} plugins available through YPM. Browse and search below, or
        use <Text style={styles.code}>ypm-menu</Text> from within yed.
      </Text>

      {/* Search */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search plugins by name, description, or keyword..."
        placeholderTextColor={Colors.subtleText}
        value={search}
        onChangeText={setSearch}
      />

      {/* Category tabs */}
      <View style={styles.tabs}>
        {CATEGORIES.map((cat) => {
          const count =
            cat === 'all'
              ? plugins.length
              : cat === 'featured'
                ? FEATURED_SLUGS.size
                : plugins.filter((p) => p.category === cat).length;
          const active = category === cat;
          const color = cat === 'all' ? Colors.heading : CATEGORY_COLORS[cat] || Colors.heading;
          return (
            <Pressable
              key={cat}
              onPress={() => setCategory(cat)}
              style={active ? [styles.tabActive, { backgroundColor: color }] : styles.tab}
            >
              <Text style={active ? styles.tabTextActive : styles.tabText}>
                {cat === 'all' ? 'All' : (CATEGORY_LABELS[cat] || cat.charAt(0).toUpperCase() + cat.slice(1))} ({count})
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.resultCount}>
        {filtered.length} plugin{filtered.length !== 1 ? 's' : ''}
        {search ? ` matching "${search}"` : ''}
      </Text>

      {/* Grid */}
      <View style={styles.grid}>
        {filtered.map((plugin) => {
          const catColor = CATEGORY_COLORS[plugin.category] || Colors.link;
          const isFeatured = FEATURED_SLUGS.has(plugin.slug);
          return (
            <Link key={plugin.slug} href={`/plugins/${plugin.slug}` as any} asChild>
              <Pressable style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardName} numberOfLines={1}>{plugin.name}</Text>
                  <View style={styles.cardBadges}>
                    <View style={[styles.cardBadge, { backgroundColor: catColor }]}>
                      <Text style={styles.cardBadgeText}>
                        {CATEGORY_LABELS[plugin.category] || plugin.category}
                      </Text>
                    </View>
                    {isFeatured && (
                      <View style={[styles.cardBadge, { backgroundColor: Colors.heading }]}>
                        <Text style={styles.cardBadgeText}>featured</Text>
                      </View>
                    )}
                  </View>
                </View>
                <Text style={styles.cardDesc} numberOfLines={2}>{plugin.description}</Text>
                {plugin.keywords.length > 0 && (
                  <View style={styles.cardKeywords}>
                    {plugin.keywords.slice(0, 3).map((kw) => (
                      <Text key={kw} style={styles.cardKeyword}>{kw}</Text>
                    ))}
                  </View>
                )}
              </Pressable>
            </Link>
          );
        })}
      </View>

      {filtered.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No plugins match your search.</Text>
          <Pressable onPress={() => { setSearch(''); setCategory('all'); }}>
            <Text style={styles.clearLink}>Clear filters</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xxl,
    color: Colors.heading,
    marginBottom: 8,
  },
  intro: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
    marginBottom: 20,
  },
  code: {
    fontFamily: Typography.fontFamily,
    backgroundColor: Colors.codeBg,
    paddingHorizontal: 4,
  },
  searchInput: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    backgroundColor: Colors.codeBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    backgroundColor: Colors.hoverBg,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  tabActive: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.subtleText,
  },
  tabTextActive: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.contentBg,
    fontWeight: 'bold',
  },
  resultCount: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.subtleText,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 6,
    padding: 14,
    width: '32%' as any,
    minWidth: 250,
    marginRight: '1.33%' as any,
    marginBottom: 12,
    minHeight: 130,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.link,
    fontWeight: 'bold',
    flex: 1,
  },
  cardBadges: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  cardBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    marginLeft: 4,
  },
  cardBadgeText: {
    fontFamily: Typography.fontFamily,
    fontSize: 10,
    color: Colors.contentBg,
    fontWeight: 'bold',
  },
  cardDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal,
    marginBottom: 8,
  },
  cardKeywords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardKeyword: {
    fontFamily: Typography.fontFamily,
    fontSize: 10,
    color: Colors.subtleText,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginRight: 4,
    marginBottom: 4,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  emptyText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.md,
    color: Colors.subtleText,
    marginBottom: 12,
  },
  clearLink: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.link,
  },
});
