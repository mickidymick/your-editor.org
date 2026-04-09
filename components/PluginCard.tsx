import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import styleColors from '../data/style-colors.json';

const styleColorData = styleColors as Record<string, {
  bg: string; fg: string; comment: string; keyword: string;
  fn_call: string; number: string; string: string;
  statusBg: string; statusFg: string;
}>;

interface PluginCardProps {
  slug: string;
  name: string;
  description: string;
  category: string;
  keywords?: string[];
  showBadge?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  feature: Colors.link,
  language: Colors.string,
  syntax: Colors.comment,
  style: Colors.accent,
};

function findAllStyleColors(slug: string): { name: string; colors: typeof styleColorData[string] }[] {
  const base = slug.replace('styles-', '');
  const matches = Object.keys(styleColorData).filter(k => {
    const styleName = k.replace('styles-', '');
    const baseHyphen = base.replace(/_/g, '-');
    return styleName === base ||
      styleName === baseHyphen ||
      styleName.startsWith(base + '-') ||
      styleName.startsWith(baseHyphen + '-');
  });
  return matches.map(k => ({
    name: k.replace('styles-', ''),
    colors: styleColorData[k],
  }));
}

export const PluginCard = React.memo(function PluginCard({ slug, name, description, category, keywords, showBadge = true }: PluginCardProps) {
  const styleVariants = category === 'style' ? findAllStyleColors(slug) : [];

  return (
    <Link href={`/plugins/${slug}` as any} asChild>
      <Pressable style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          {showBadge && (
            <Text style={[styles.badge, { backgroundColor: CATEGORY_COLORS[category] || Colors.link }]}>
              {category}
            </Text>
          )}
        </View>
        <Text style={styles.description} numberOfLines={2}>{description}</Text>
        {keywords && keywords.length > 0 && styleVariants.length === 0 && (
          <View style={styles.keywords}>
            {keywords.slice(0, 4).map((kw) => (
              <Text key={kw} style={styles.keyword}>{kw}</Text>
            ))}
          </View>
        )}
        {styleVariants.length > 0 && (
          <View style={styles.swatchGroup}>
            {styleVariants.map((v) => (
              <View key={v.name} style={styles.swatchRow}>
                <View style={[styles.swatchBar, { backgroundColor: '#' + v.colors.bg }]}>
                  {[v.colors.keyword, v.colors.fn_call, v.colors.string, v.colors.number, v.colors.comment, v.colors.fg].map((c, i) => (
                    <View key={i} style={[styles.swatch, { backgroundColor: '#' + c }]} />
                  ))}
                </View>
                {styleVariants.length > 1 && (
                  <Text style={styles.swatchLabel}>{v.name}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </Pressable>
    </Link>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 6,
    padding: 14,
    marginBottom: 10,
    width: '100%' as any,
    height: 145,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  name: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.md,
    color: Colors.link,
    flex: 1,
  },
  badge: {
    fontFamily: Typography.fontFamily,
    fontSize: 11,
    color: Colors.contentBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    overflow: 'hidden',
    marginLeft: 8,
  },
  description: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal,
    marginBottom: 6,
  },
  keywords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  keyword: {
    fontFamily: Typography.fontFamily,
    fontSize: 11,
    color: Colors.subtleText,
    borderWidth: 1,
    borderColor: Colors.subtleText,
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 1,
    overflow: 'hidden',
    marginRight: 4,
    marginBottom: 4,
  },
  swatchGroup: {
    marginTop: 'auto' as any,
  },
  swatchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  swatchBar: {
    flexDirection: 'row',
    borderRadius: 4,
    padding: 5,
    paddingHorizontal: 7,
  },
  swatch: {
    width: 12,
    height: 12,
    borderRadius: 3,
    marginRight: 4,
  },
  swatchLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: 10,
    color: Colors.subtleText,
    marginLeft: 6,
  },
});
