import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { SEO } from '../components/SEO';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import changelog from '../data/changelog.json';

const SECTION_COLORS: Record<string, string> = {
  fixed: '#e06070',
  changed: '#d4a843',
  added: Colors.string,
};

function ChangelogEntry({ entry, defaultOpen }: { entry: typeof changelog[0]; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const isEmpty = entry.fixed.length === 0 && entry.changed.length === 0 && entry.added.length === 0;

  return (
    <View style={styles.entry}>
      <Pressable onPress={() => setOpen(!open)} style={styles.entryHeader}>
        <View style={styles.entryTitleRow}>
          <Text style={styles.chevron}>{open ? '\u25BC' : '\u25B6'}</Text>
          <Text style={styles.version}>v{entry.version}</Text>
          {defaultOpen && (
            <View style={styles.latestBadge}>
              <Text style={styles.latestBadgeText}>latest</Text>
            </View>
          )}
        </View>
        <Text style={styles.date}>{entry.date}</Text>
      </Pressable>

      {open && !isEmpty && (
        <View style={styles.entryBody}>
          <ChangeSection label="Added" items={entry.added} color={SECTION_COLORS.added} />
          <ChangeSection label="Changed" items={entry.changed} color={SECTION_COLORS.changed} />
          <ChangeSection label="Fixed" items={entry.fixed} color={SECTION_COLORS.fixed} />
        </View>
      )}

      {open && isEmpty && (
        <View style={styles.entryBody}>
          <Text style={styles.emptyText}>No changes recorded.</Text>
        </View>
      )}
    </View>
  );
}

function ChangeSection({ label, items, color }: { label: string; items: string[]; color: string }) {
  if (items.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={[styles.sectionBadge, { backgroundColor: color }]}>
        <Text style={styles.sectionBadgeText}>{label}</Text>
      </View>
      {items.map((item, i) => (
        <View key={i} style={styles.itemRow}>
          <Text style={[styles.itemBullet, { color }]}>{'\u2022'}</Text>
          <Text style={styles.itemText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export default function Changelog() {
  return (
    <View>
      <SEO title="Changelog" description="Release history and changes for every version of yed." />
      <Text style={styles.h1}>Changelog</Text>
      <Text style={styles.subtitle}>
        {changelog.length} releases — latest: v{changelog[0]?.version}
      </Text>

      {changelog.map((entry, i) => (
        <ChangelogEntry key={entry.version} entry={entry} defaultOpen={i === 0} />
      ))}

      <View style={styles.divider} />
      <Text style={styles.h2}>Related</Text>
      <View style={styles.nextSteps}>
        <Link href="/update" asChild>
          <Pressable style={styles.nextCard}>
            <Text style={styles.nextCardTitle}>Updating</Text>
            <Text style={styles.nextCardDesc}>How to update to the latest version</Text>
          </Pressable>
        </Link>
        <Link href="/install" asChild>
          <Pressable style={styles.nextCard}>
            <Text style={styles.nextCardTitle}>Installation</Text>
            <Text style={styles.nextCardDesc}>First time setup</Text>
          </Pressable>
        </Link>
        <Link href="/plugins" asChild>
          <Pressable style={styles.nextCard}>
            <Text style={styles.nextCardTitle}>Plugins</Text>
            <Text style={styles.nextCardDesc}>Browse 153 plugins</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  h2: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xl,
    color: Colors.heading,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.cardBorder,
    marginVertical: 32,
    marginHorizontal: '15%' as any,
    shadowColor: Colors.link,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  nextSteps: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  nextCard: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 6,
    padding: 16,
    marginRight: 12,
    marginBottom: 12,
    minWidth: 180,
    flex: 1,
  },
  nextCardTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.link,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  nextCardDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.subtleText,
  },
  h1: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xxl,
    color: Colors.heading,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.subtleText,
    marginBottom: 24,
  },
  entry: {
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 6,
    overflow: 'hidden',
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardBg,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  entryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevron: {
    fontFamily: Typography.fontFamily,
    fontSize: 10,
    color: Colors.subtleText,
    marginRight: 10,
    width: 12,
  },
  version: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.lg,
    color: Colors.heading,
    fontWeight: 'bold',
  },
  latestBadge: {
    backgroundColor: Colors.string,
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 10,
  },
  latestBadgeText: {
    fontFamily: Typography.fontFamily,
    fontSize: 10,
    color: Colors.contentBg,
    fontWeight: 'bold',
  },
  date: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.subtleText,
  },
  entryBody: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingLeft: 38,
  },
  emptyText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.subtleText,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 14,
  },
  sectionBadge: {
    alignSelf: 'flex-start',
    borderRadius: 3,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 8,
  },
  sectionBadgeText: {
    fontFamily: Typography.fontFamily,
    fontSize: 11,
    color: Colors.contentBg,
    fontWeight: 'bold',
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingLeft: 4,
  },
  itemBullet: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    marginRight: 8,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal,
  },
  itemText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal,
    flex: 1,
  },
});
