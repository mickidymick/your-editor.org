import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { SEO } from '../components/SEO';
import { CodeBlock } from '../components/CodeBlock';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

function Callout({ type, children }: { type: 'note' | 'tip'; children: React.ReactNode }) {
  const color = type === 'note' ? Colors.string : Colors.link;
  return (
    <View style={[styles.callout, { borderLeftColor: color }]}>
      <Text style={[styles.calloutLabel, { color }]}>{type.toUpperCase()}</Text>
      <Text style={styles.calloutBody}>{children}</Text>
    </View>
  );
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <View style={styles.step}>
      <View style={styles.stepHeader}>
        <View style={styles.stepNumber}>
          <Text style={styles.stepNumberText}>{number}</Text>
        </View>
        <Text style={styles.stepTitle}>{title}</Text>
      </View>
      <View style={styles.stepContent}>
        {children}
      </View>
    </View>
  );
}

export default function Update() {
  return (
    <View>
      <SEO title="Updating" description="How to update yed and its plugins to the latest version." />
      <Text style={styles.h1}>Updating yed</Text>

      <Text style={styles.h2}>Updating the Editor</Text>

      <Step number={1} title="Pull the latest changes">
        <Text style={styles.body}>
          Navigate to your cloned repository and pull the latest source:
        </Text>
        <CodeBlock>{`cd yed\ngit pull`}</CodeBlock>
      </Step>

      <Step number={2} title="Rebuild and install">
        <Text style={styles.body}>
          Run the install script with the same flags you used during your initial installation:
        </Text>
        <CodeBlock>{'./install.sh'}</CodeBlock>
        <Callout type="note">
          If you originally installed to a custom prefix, use the same flag. For example:
        </Callout>
        <Text style={styles.exampleLabel}>User-local install:</Text>
        <CodeBlock>{'./install.sh -p ~/.local'}</CodeBlock>
        <Text style={styles.exampleLabel}>System-wide install:</Text>
        <CodeBlock>{'sudo ./install.sh'}</CodeBlock>
      </Step>

      {/* Updating Plugins */}
      <View style={styles.divider} />
      <Text style={styles.h2}>Updating Plugins</Text>

      <Text style={styles.body}>
        If you're using YPM (the yed plugin manager), you can update all installed plugins from
        within yed:
      </Text>
      <CodeBlock>{'ypm-update'}</CodeBlock>
      <Text style={styles.body}>
        This will fetch the latest versions of all plugins in your{' '}
        <Text style={styles.code}>ypm_list</Text> and rebuild them.
      </Text>

      {/* Checking Version */}
      <View style={styles.divider} />
      <Text style={styles.h2}>Checking Your Version</Text>

      <Text style={styles.body}>From the command line:</Text>
      <CodeBlock>{'yed --version'}</CodeBlock>

      <Text style={styles.body}>Or from within yed:</Text>
      <CodeBlock>{'version'}</CodeBlock>

      <Text style={styles.body}>
        See the <Link href="/changelog" style={styles.link}>Changelog</Link> for details on
        what's changed in each version.
      </Text>

      {/* Next Steps */}
      <View style={styles.divider} />
      <Text style={styles.h2}>Related</Text>
      <View style={styles.nextSteps}>
        <Link href="/changelog" asChild>
          <Pressable style={styles.nextCard}>
            <Text style={styles.nextCardTitle}>Changelog</Text>
            <Text style={styles.nextCardDesc}>See what's new in each version</Text>
          </Pressable>
        </Link>
        <Link href="/install" asChild>
          <Pressable style={styles.nextCard}>
            <Text style={styles.nextCardTitle}>Installation</Text>
            <Text style={styles.nextCardDesc}>First time setup instructions</Text>
          </Pressable>
        </Link>
        <Link href="/plugins" asChild>
          <Pressable style={styles.nextCard}>
            <Text style={styles.nextCardTitle}>Plugins</Text>
            <Text style={styles.nextCardDesc}>Browse 155+ available plugins</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xxl,
    color: Colors.heading,
    lineHeight: Typography.fontSize.xxl * Typography.lineHeight.tight,
    marginBottom: 20,
  },
  h2: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xl,
    color: Colors.heading,
    lineHeight: Typography.fontSize.xl * Typography.lineHeight.tight,
    marginTop: 8,
    marginBottom: 16,
  },
  body: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
    marginBottom: 8,
  },
  code: {
    fontFamily: Typography.fontFamily,
    backgroundColor: Colors.codeBg,
    paddingHorizontal: 4,
    color: Colors.text,
  },
  link: {
    color: Colors.link,
  },
  callout: {
    backgroundColor: Colors.cardBg,
    borderLeftWidth: 3,
    borderRadius: 4,
    padding: 14,
    marginVertical: 12,
  },
  calloutLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  calloutBody: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
  },
  step: {
    marginBottom: 24,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.heading,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.contentBg,
    fontWeight: 'bold',
  },
  stepTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.lg,
    color: Colors.heading,
  },
  stepContent: {
    marginLeft: 40,
  },
  exampleLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.subtleText,
    marginTop: 8,
    marginBottom: 2,
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
});
