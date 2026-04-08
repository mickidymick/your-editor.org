import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import { SEO } from '../../../components/SEO';
import { CodeBlock } from '../../../components/CodeBlock';
import { Colors } from '../../../constants/colors';
import { Typography } from '../../../constants/typography';
import plugins from '../../../data/plugins.json';

export function generateStaticParams(): { slug: string }[] {
  return plugins.map((p) => ({ slug: p.slug }));
}

interface SectionItem {
  title: string;
  body: string;
}

function ManTable({ title, items }: { title: string; items: SectionItem[] }) {
  if (items.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((item, i) => (
        <View key={i} style={styles.entry}>
          <Text style={styles.entryTitle}>{item.title}</Text>
          {item.body ? <Text style={styles.entryBody}>{item.body}</Text> : null}
        </View>
      ))}
    </View>
  );
}

function renderBody(text: string) {
  // Split on code blocks and render them with CodeBlock
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts.map((part, i) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      const inner = part.slice(3, -3).trim();
      return <CodeBlock key={i}>{inner}</CodeBlock>;
    }
    if (!part.trim()) return null;
    return <Text key={i} style={styles.body}>{part.trim()}</Text>;
  });
}

export default function ManPage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const plugin = plugins.find((p) => p.slug === slug);

  if (!plugin) {
    return (
      <View>
        <Text style={styles.h1}>Man page not found</Text>
        <Link href="/plugins" style={styles.link}>Back to plugins</Link>
      </View>
    );
  }

  const extraEntries = Object.entries(plugin.extraSections).filter(([, v]) => v);

  return (
    <View>
      <SEO title={`${plugin.name} — Man Page`} description={`Man page for the ${plugin.name} yed plugin.`} />
      <View style={styles.breadcrumbs}>
        <Link href="/plugins" style={styles.link}>Plugins</Link>
        <Text style={styles.breadcrumbSep}>/</Text>
        <Link href={`/plugins/${plugin.slug}` as any} style={styles.link}>{plugin.name}</Link>
        <Text style={styles.breadcrumbSep}>/</Text>
        <Text style={styles.breadcrumbCurrent}>Man Page</Text>
      </View>

      <View style={styles.manHeader}>
        <Text style={styles.h1}>{plugin.name}</Text>
        <Text style={styles.manSubtitle}>{plugin.description}</Text>
        {plugin.version ? <Text style={styles.version}>Version {plugin.version}</Text> : null}
      </View>

      <View style={styles.divider} />

      <ManTable title="Configuration" items={plugin.configuration} />
      <ManTable title="Commands" items={plugin.commands} />
      <ManTable title="Special Buffers" items={plugin.buffers} />

      {plugin.notes ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          {renderBody(plugin.notes)}
        </View>
      ) : null}

      {extraEntries.map(([key, value]) => (
        <View key={key} style={styles.section}>
          <Text style={styles.sectionTitle}>{key}</Text>
          {renderBody(value!)}
        </View>
      ))}

      {plugin.keywords.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Keywords</Text>
          <View style={styles.keywords}>
            {plugin.keywords.map((kw) => (
              <Text key={kw} style={styles.keyword}>{kw}</Text>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  breadcrumbs: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  breadcrumbSep: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.subtleText,
    marginHorizontal: 8,
  },
  breadcrumbCurrent: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.subtleText,
  },
  link: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.link,
  },
  manHeader: {
    marginBottom: 8,
  },
  h1: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xxl,
    color: Colors.heading,
    marginBottom: 8,
  },
  manSubtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.md,
    color: Colors.text,
    lineHeight: Typography.fontSize.md * Typography.lineHeight.normal,
  },
  version: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.subtleText,
    marginTop: 8,
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
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.lg,
    color: Colors.heading,
    fontWeight: 'bold',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    paddingBottom: 6,
  },
  entry: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 6,
    padding: 14,
    marginBottom: 8,
  },
  entryTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.link,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  entryBody: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal,
  },
  body: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal,
    marginBottom: 8,
  },
  keywords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
});
