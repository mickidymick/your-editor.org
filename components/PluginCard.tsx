import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

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

export const PluginCard = React.memo(function PluginCard({ slug, name, description, category, keywords, showBadge = true }: PluginCardProps) {
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
        {keywords && keywords.length > 0 && (
          <View style={styles.keywords}>
            {keywords.slice(0, 4).map((kw) => (
              <Text key={kw} style={styles.keyword}>{kw}</Text>
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
});
