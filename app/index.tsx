import React from 'react';
import { View, Text, Image, Pressable, StyleSheet, Linking } from 'react-native';
import { Link } from 'expo-router';
import { SEO } from '../components/SEO';
import { AutoCarousel } from '../components/PluginCarousel';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import plugins from '../data/plugins.json';

const FEATURED_SLUGS = [
  'vimish', 'lsp', 'completer', 'tree_view', 'ctags', 'grep',
  'find_file', 'comment', 'terminal', 'builder', 'diff', 'bookmarks',
  'go_menu', 'loc_history', 'mouse', 'mouse_menu', 'line_numbers',
  'man', 'calc',
];
const CATEGORY_ORDER: Record<string, number> = {
  'editor-styles': 0, style: 1, editing: 2, navigation: 3, ui: 4,
  lsp: 5, language: 6, syntax: 7, tools: 8, configuration: 9, fun: 10,
};
const featured = plugins
  .filter((p) => FEATURED_SLUGS.includes(p.slug))
  .sort((a, b) => {
    const catDiff = (CATEGORY_ORDER[a.category] ?? 99) - (CATEGORY_ORDER[b.category] ?? 99);
    if (catDiff !== 0) return catDiff;
    return a.name.localeCompare(b.name);
  });

export default function Home() {
  return (
    <View>
      <SEO title="yed" description="yed is a fast, extensible terminal editor with 155+ plugins. Lightweight, command-driven, and fully customizable." />
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>
          yed
        </Text>
        <Text style={styles.heroSubtitle}>
          <Text style={styles.italic}>your</Text> editor
        </Text>
        <View style={styles.heroDivider} />
        <Text style={styles.heroDescription}>
          A small, fast, and powerful terminal editor core designed to be extended
          through plugins. No assumptions about your editing style — just pure customization.
        </Text>
        <View style={styles.heroCta}>
          <Link href="/install" asChild>
            <Text style={styles.ctaButton}>Get Started</Text>
          </Link>
          <Link href="/user-guide" asChild>
            <Text style={styles.ctaLink}>Read the Guide</Text>
          </Link>
        </View>
      </View>

      {/* Screenshot */}
      <View style={styles.screenshotContainer}>
        <View style={styles.screenshotFrame}>
          <Image
            source={require('../assets/images/screenshot.png')}
            style={styles.screenshot}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Features */}
      <Text style={styles.h2}>Core Editor Features</Text>
      <View style={styles.featureGrid}>
        {[
          { title: 'FAST', desc: 'Lightweight core with zero dependencies' },
          { title: 'Truecolor', desc: '24-bit color support for modern terminals' },
          { title: 'Extensible', desc: 'Powerful plugin architecture for any workflow' },
          { title: 'Key Bindings', desc: 'Dynamic key bindings and key sequences' },
          { title: 'Frames', desc: 'Layered frame management with splits' },
          { title: 'Live Search', desc: 'Find and replace as you type' },
          { title: 'Undo / Redo', desc: 'Full undo history for every buffer' },
          { title: '155+ Plugins', desc: 'LSP, git, completion, themes, and more' },
        ].map((feature) => (
          <View key={feature.title} style={styles.featureCard}>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDesc}>{feature.desc}</Text>
          </View>
        ))}
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Plugin Carousel */}
      <AutoCarousel title="Featured Plugins" plugins={featured} />

      <View style={styles.browseRow}>
        <Link href="/plugins" asChild>
          <Text style={styles.browseButton}>
            Browse all {plugins.length} plugins {'\u2192'}
          </Text>
        </Link>
      </View>

      {/* Community */}
      <View style={styles.divider} />
      <View style={styles.communitySection}>
        <Text style={styles.communityTitle}>Join the Community</Text>
        <Text style={styles.communityDesc}>
          Get help, share configs, and connect with other yed users and developers.
        </Text>
        <Pressable
          style={styles.discordButton}
          onPress={() => Linking.openURL('https://discord.gg/cx3JFJ2gNU')}
        >
          <Text style={styles.discordButtonText}>Join the Discord</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  heroTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: 64,
    color: Colors.heading,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  heroSubtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xl,
    color: Colors.text,
    marginTop: 4,
    letterSpacing: 2,
  },
  italic: {
    fontStyle: 'italic',
  },
  heroDivider: {
    width: 60,
    height: 2,
    backgroundColor: Colors.heading,
    marginVertical: 20,
  },
  heroDescription: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.md,
    color: Colors.subtleText,
    lineHeight: Typography.fontSize.md * Typography.lineHeight.normal,
    textAlign: 'center',
    maxWidth: 500,
    marginBottom: 24,
  },
  heroCta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaButton: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.contentBg,
    backgroundColor: Colors.heading,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 6,
    overflow: 'hidden',
    fontWeight: 'bold',
    marginRight: 16,
  },
  ctaLink: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.link,
  },
  screenshotContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  screenshotFrame: {
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: Colors.link,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  screenshot: {
    width: 1400,
    height: 800,
    maxWidth: '100%' as any,
  },
  h2: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xl,
    color: Colors.heading,
    lineHeight: Typography.fontSize.xl * Typography.lineHeight.tight,
    marginTop: 32,
    marginBottom: 16,
    textAlign: 'center',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  featureCard: {
    width: '23%' as any,
    minWidth: 160,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 6,
    padding: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  featureTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.link,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featureDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.subtleText,
    lineHeight: Typography.fontSize.sm * 1.4,
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
  browseRow: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  communitySection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  communityTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xl,
    color: Colors.heading,
    marginBottom: 8,
    textAlign: 'center',
  },
  communityDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.subtleText,
    textAlign: 'center',
    marginBottom: 16,
    maxWidth: 400,
  },
  discordButton: {
    backgroundColor: '#5865F2',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  discordButtonText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  browseButton: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.contentBg,
    backgroundColor: Colors.heading,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 6,
    overflow: 'hidden',
    fontWeight: 'bold',
  },
});
