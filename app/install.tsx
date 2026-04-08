import React from 'react';
import { View, Text, Pressable, StyleSheet, Linking } from 'react-native';
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

export default function Install() {
  return (
    <View>
      <SEO title="Installation" description="How to build and install the yed terminal editor from source." />
      <Text style={styles.h1}>Installation</Text>

      <Callout type="note">
        <Text style={styles.code}>yed</Text> is known to work on most flavors of Linux, macOS,
        and the Windows Subsystem for Linux.
      </Callout>

      <Text style={styles.h2}>Build from source</Text>

      <Text style={styles.body}>Requirements:</Text>
      <View style={styles.list}>
        <Text style={styles.listItem}>{'\u2022'} C compiler supporting <Text style={styles.code}>-std=gnu99</Text></Text>
      </View>

      <Step number={1} title="Clone the repository">
        <Text style={styles.body}>
          Grab the latest source code from{' '}
          <Text style={styles.link} onPress={() => Linking.openURL('https://github.com/kammerdienerb/yed')}>
            github.com/kammerdienerb/yed
          </Text>
        </Text>
        <CodeBlock>{'git clone https://github.com/kammerdienerb/yed.git'}</CodeBlock>
      </Step>

      <Step number={2} title="Build and install">
        <Text style={styles.body}>
          Use the provided <Text style={styles.code}>install.sh</Text> to build and install.
          Options can be set in <Text style={styles.code}>install.options</Text> or via flags:
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>
            <Text style={styles.code}>-c CONFIG</Text> — build configuration (<Text style={styles.code}>debug</Text> or <Text style={styles.code}>release</Text>). Default: <Text style={styles.code}>release</Text>
          </Text>
          <Text style={styles.listItem}>
            <Text style={styles.code}>-p PREFIX</Text> — installation prefix path. Default: a reasonable system path like <Text style={styles.code}>/usr</Text>
          </Text>
        </View>

        <Text style={styles.exampleLabel}>Debug build to a test directory:</Text>
        <CodeBlock>{'./install.sh -c debug -p test'}</CodeBlock>

        <Text style={styles.exampleLabel}>User-local release build:</Text>
        <CodeBlock>{'./install.sh -p ~/.local'}</CodeBlock>

        <Text style={styles.exampleLabel}>System-wide release build:</Text>
        <CodeBlock>{'sudo ./install.sh'}</CodeBlock>
      </Step>

      <Step number={3} title="Verify installation">
        <Callout type="note">
          If you installed to a non-default path, make sure the directory containing the{' '}
          <Text style={styles.code}>yed</Text> executable is in your <Text style={styles.code}>PATH</Text>.
        </Callout>
        <Text style={styles.body}>
          You should now be able to run <Text style={styles.code}>yed</Text>:
        </Text>
        <CodeBlock>{'yed'}</CodeBlock>
      </Step>

      {/* Next Steps */}
      <View style={styles.divider} />
      <Text style={styles.h2}>Next Steps</Text>
      <View style={styles.nextSteps}>
        <Link href="/user-guide" asChild>
          <Pressable style={styles.nextCard}>
            <Text style={styles.nextCardTitle}>User Guide</Text>
            <Text style={styles.nextCardDesc}>Learn the basics of using yed</Text>
          </Pressable>
        </Link>
        <Link href="/update" asChild>
          <Pressable style={styles.nextCard}>
            <Text style={styles.nextCardTitle}>Updating</Text>
            <Text style={styles.nextCardDesc}>How to update to the latest version</Text>
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
  list: {
    marginLeft: 16,
    marginBottom: 12,
  },
  listItem: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
    marginBottom: 6,
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
