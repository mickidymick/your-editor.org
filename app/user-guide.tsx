import React from 'react';
import { View, Text, Image, Pressable, StyleSheet, Linking, Platform } from 'react-native';
import { Link } from 'expo-router';
import { SEO } from '../components/SEO';
import { CodeBlock } from '../components/CodeBlock';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

function scrollToId(id: string) {
  if (Platform.OS === 'web') {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function Callout({ type, children }: { type: 'note' | 'tip'; children: React.ReactNode }) {
  const color = type === 'note' ? Colors.string : Colors.link;
  return (
    <View style={[styles.callout, { borderLeftColor: color }]}>
      <Text style={[styles.calloutLabel, { color }]}>{type.toUpperCase()}</Text>
      <Text style={styles.calloutBody}>{children}</Text>
    </View>
  );
}

function Section({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section} nativeID={`section-${number}`}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionNumber}>
          <Text style={styles.sectionNumberText}>{number}</Text>
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.subSection}>
      <Text style={styles.subTitle}>{title}</Text>
      {children}
    </View>
  );
}

const TOC_ITEMS = [
  'Starting yed for the first time',
  'Running commands',
  'Keybindings',
  'Buffers',
  'Frames',
  'Variables',
  'Styles',
  'Plugins',
];

export default function UserGuide() {
  return (
    <View>
      <SEO title="User Guide" description="Learn how to use yed — configuration, commands, keybindings, buffers, frames, and plugins." />
      <Text style={styles.h1}>User Guide</Text>
      <Text style={styles.intro}>
        This guide explains the normal operation and concepts of yed. It assumes you've already{' '}
        <Link href="/install" style={styles.link}>installed yed</Link>. For more help, join our{' '}
        <Text style={styles.link} onPress={() => Linking.openURL('https://discord.gg/cx3JFJ2gNU')}>
          Discord
        </Text>.
      </Text>

      {/* Quick Links */}
      <View style={styles.quickLinks}>
        <Link href="/reference/commands" asChild>
          <Pressable style={styles.quickLink}>
            <Text style={styles.quickLinkText}>Command Ref</Text>
          </Pressable>
        </Link>
        <Link href="/reference/variables" asChild>
          <Pressable style={styles.quickLink}>
            <Text style={styles.quickLinkText}>Variable Ref</Text>
          </Pressable>
        </Link>
        <Link href="/reference/attributes" asChild>
          <Pressable style={styles.quickLink}>
            <Text style={styles.quickLinkText}>Attribute Ref</Text>
          </Pressable>
        </Link>
        <Link href="/reference/status-line" asChild>
          <Pressable style={styles.quickLink}>
            <Text style={styles.quickLinkText}>Status Line Ref</Text>
          </Pressable>
        </Link>
      </View>

      {/* TOC */}
      <View style={styles.toc}>
        <Text style={styles.tocTitle}>Contents</Text>
        {TOC_ITEMS.map((item, i) => (
          <Pressable key={i} onPress={() => scrollToId(`section-${i + 1}`)}>
            <Text style={styles.tocItem}>{i + 1}. {item}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.divider} />

      {/* Section 1 */}
      <Section number={1} title="Starting yed for the first time">
        <Text style={styles.body}>
          <Text style={styles.code}>yed</Text> can be started by simply entering "yed" on the
          command line.
        </Text>
        <CodeBlock context="terminal">{'yed'}</CodeBlock>
        <Callout type="note">
          If you installed to a non-default path, make sure the directory containing the{' '}
          <Text style={styles.code}>yed</Text> executable is in your <Text style={styles.code}>PATH</Text>.
        </Callout>

        <SubSection title="Configuration">
          <Text style={styles.body}>
            All configuration lives in{' '}
            <Text style={styles.code}>~/.config/yed</Text>.
          </Text>
          <Text style={styles.body}>
            If you already created this directory and added a{' '}
            <Link href="/example-configs" style={styles.link}>starter config</Link>,
            yed will load your <Text style={styles.code}>yedrc</Text> and
            automatically install plugins from your{' '}
            <Text style={styles.code}>ypm_list</Text> on the first run.
          </Text>
          <Text style={styles.body}>
            If the directory doesn't exist yet, you'll see a popup asking to create it
            with a default configuration:
          </Text>
          <View style={styles.imageContainer}>
            <Image
              source={require('../assets/images/dot_yed_popup.png')}
              style={styles.popupImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.body}>
            Hit '<Text style={styles.code}>y</Text>' to create the directory with a default
            configuration. You may also see a popup asking to update YPM.
          </Text>
        </SubSection>

        <SubSection title="init.so">
          <Text style={styles.body}>
            The root of any yed configuration is{' '}
            <Text style={styles.code}>~/.config/yed/init.so</Text>. This is a yed plugin that's
            automatically loaded at startup. Its source code,{' '}
            <Text style={styles.code}>init.c</Text>, does the following:
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>{'\u2022'} Uses <Text style={styles.code}>YEXE()</Text> to run yed commands</Text>
            <Text style={styles.listItem}>{'\u2022'} Creates a <Text style={styles.code}>recompile-init</Text> command</Text>
            <Text style={styles.listItem}>{'\u2022'} Loads plugins (<Text style={styles.code}>ypm</Text> and <Text style={styles.code}>yedrc</Text>)</Text>
            <Text style={styles.listItem}>{'\u2022'} Instructs <Text style={styles.code}>yedrc</Text> to load <Text style={styles.code}>~/.config/yed/yedrc</Text></Text>
          </View>
        </SubSection>

        <SubSection title="yedrc">
          <Text style={styles.body}>
            <Text style={styles.code}>yedrc</Text> is a plugin that lets you source files
            containing yed commands. Most simple configuration — loading plugins, setting
            variables, activating a style — can be done this way without recompiling.
          </Text>
          <Callout type="tip">
            For dynamic behavior (conditional variables, custom frame rules, etc.), program it
            in <Text style={styles.code}>init.c</Text> or a custom plugin instead.
          </Callout>
        </SubSection>

        <SubSection title="Different Config Paths">
          <Text style={styles.body}>
            yed checks for config in this order:
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>1. <Text style={styles.code}>YED_CONFIG_DIR</Text> environment variable</Text>
            <Text style={styles.listItem}>2. <Text style={styles.code}>XDG_CONFIG_HOME</Text>/yed</Text>
            <Text style={styles.listItem}>3. <Text style={styles.code}>~/.config/yed</Text> (default)</Text>
          </View>
        </SubSection>
      </Section>

      {/* Section 2 */}
      <Section number={2} title="Running commands">
        <Text style={styles.body}>
          Most behavior in yed is command driven. Even pressing the right arrow key is a key
          binding that maps to the <Text style={styles.code}>cursor-right</Text> command.
        </Text>
        <Text style={styles.body}>Commands can be invoked by:</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>{'\u2022'} Programmatically using <Text style={styles.code}>YEXE()</Text></Text>
          <Text style={styles.listItem}>{'\u2022'} Through a key binding</Text>
          <Text style={styles.listItem}>{'\u2022'} Typing in the command line (<Text style={styles.code}>ctrl-y</Text> by default)</Text>
        </View>
        <Text style={styles.body}>
          See the <Link href="/reference/commands" style={styles.link}>Command Reference</Link> for
          all available commands.
        </Text>
      </Section>

      {/* Section 3 */}
      <Section number={3} title="Keybindings">
        <Text style={styles.body}>
          Use <Text style={styles.code}>bind</Text> and <Text style={styles.code}>unbind</Text>{' '}
          to customize key mappings. For example, to change the command prompt binding from{' '}
          <Text style={styles.code}>ctrl-y</Text> to <Text style={styles.code}>ctrl-x</Text>:
        </Text>
        <CodeBlock context="yed">{'bind ctrl-x command-prompt\nunbind ctrl-y'}</CodeBlock>
        <Callout type="note">
          Do the bind before the unbind so you can still access the command prompt to type the
          commands!
        </Callout>
        <Callout type="note">
          Some plugins like <Text style={styles.code}>vimish</Text> have their own binding
          systems. Check the plugin documentation.
        </Callout>
        <Text style={styles.body}>
          Add these commands to your configuration to make them persist.
        </Text>
      </Section>

      {/* Section 4 */}
      <Section number={4} title="Buffers">
        <Text style={styles.body}>
          Buffers are units of text content, typically representing a file. Open a file from the
          command line or from within yed:
        </Text>
        <CodeBlock context="terminal">{'yed my_file.txt'}</CodeBlock>
        <CodeBlock context="yed">{'buffer my_file.txt'}</CodeBlock>
        <Text style={styles.body}>
          Editing modifies the buffer, not the file on disk. Save with{' '}
          <Text style={styles.code}>write-buffer</Text> (default: <Text style={styles.code}>ctrl-w</Text>).
        </Text>
        <SubSection title="Special Buffers">
          <Text style={styles.body}>
            Special buffers (prefixed with <Text style={styles.code}>*</Text>) don't represent
            files. Examples: <Text style={styles.code}>*bindings</Text>,{' '}
            <Text style={styles.code}>*vars</Text>, <Text style={styles.code}>*yank</Text>,{' '}
            <Text style={styles.code}>*log</Text>.
          </Text>
          <CodeBlock context="yed">{'buffer *log'}</CodeBlock>
          <Text style={styles.body}>
            Many plugins implement functionality through special buffers.
          </Text>
        </SubSection>
      </Section>

      {/* Section 5 */}
      <Section number={5} title="Frames">
        <Text style={styles.body}>
          Frames are screen areas that display buffers — like windows, panes, or views. They can
          be created with <Text style={styles.code}>frame-new</Text> and split with{' '}
          <Text style={styles.code}>frame-vsplit</Text> / <Text style={styles.code}>frame-hsplit</Text>.
        </Text>
        <Text style={styles.body}>
          Opening a new buffer doesn't create a new frame — it displays in the current one. Use{' '}
          <Text style={styles.code}>buffer-next</Text> and{' '}
          <Text style={styles.code}>buffer-prev</Text> to cycle. Switch frames with{' '}
          <Text style={styles.code}>frame-next</Text> / <Text style={styles.code}>frame-prev</Text>.
        </Text>
        <Callout type="note">
          Deleting a frame doesn't affect the buffer it was displaying.
        </Callout>
        <View style={styles.screenshotContainer}>
          <View style={styles.screenshotFrame}>
            <Image
              source={{ uri: '/screenshot-split.svg' }}
              style={styles.screenshotSplit}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.screenshotCaption}>
            A vertical split: code on the left, tree_view file browser on the right.
          </Text>
        </View>
      </Section>

      {/* Section 6 */}
      <Section number={6} title="Variables">
        <Text style={styles.body}>
          Variables are key/value string pairs for configuring the editor and plugins. Use{' '}
          <Text style={styles.code}>set</Text>, <Text style={styles.code}>unset</Text>, and{' '}
          <Text style={styles.code}>get</Text> to manage them.
        </Text>
        <Text style={styles.body}>
          See the <Link href="/reference/variables" style={styles.link}>Variable Reference</Link>{' '}
          for all built-in variables.
        </Text>
      </Section>

      {/* Section 7 */}
      <Section number={7} title="Styles">
        <Text style={styles.body}>
          Activate a color theme using the <Text style={styles.code}>style</Text> command.
          Styles are provided by plugins.
        </Text>
        <CodeBlock context="yed">{'style monokai'}</CodeBlock>
        <Callout type="note">
          The only style available without plugins is "default".
        </Callout>
        <Text style={styles.body}>
          Most styles support truecolor. Enable it in your yedrc before setting a style:
        </Text>
        <CodeBlock context="yed">{`set truecolor "yes"
style "gruvbox"`}</CodeBlock>
        <Text style={styles.body}>
          Browse all available themes on the{' '}
          <Link href={{ pathname: '/plugins', params: { category: 'style' } }} style={styles.link}>Styles</Link> plugin page.
        </Text>
      </Section>

      {/* Section 8 */}
      <Section number={8} title="Plugins">
        <Text style={styles.body}>
          Almost all advanced functionality comes from plugins. The recommended way to manage
          plugins is through your{' '}
          <Text style={styles.code}>ypm_list</Text> file — add plugin names to it and YPM
          will install and load them automatically on startup.
        </Text>

        <SubSection title="YPM (yed plugin manager)">
          <Text style={styles.body}>
            YPM is included with yed and handles downloading, building, and loading plugins.
            Use <Text style={styles.code}>ypm-menu</Text> to browse and install plugins
            interactively, or add them directly to your{' '}
            <Text style={styles.code}>~/.config/yed/ypm_list</Text> file.
          </Text>
          <Text style={styles.body}>
            Learn more on the <Link href="/ypm" style={styles.link}>YPM Guide</Link> page.
          </Text>
        </SubSection>

        <SubSection title="Manual loading">
          <Text style={styles.body}>
            You can also load plugins manually with{' '}
            <Text style={styles.code}>plugin-load</Text> and unload with{' '}
            <Text style={styles.code}>plugin-unload</Text>. This is useful for trying out
            a plugin in your current session without permanently adding it to your{' '}
            <Text style={styles.code}>ypm_list</Text>.
          </Text>
          <Callout type="tip">
            Use <Text style={styles.code}>ypm_list</Text> for your permanent plugin setup.
            Use <Text style={styles.code}>plugin-load</Text> for quick testing.
          </Callout>
        </SubSection>

        <Text style={styles.body}>
          Browse all available plugins on the{' '}
          <Link href="/plugins" style={styles.link}>Plugins</Link> page.
        </Text>
      </Section>

      <Link href="/ypm" asChild>
        <Pressable style={styles.guideCta}>
          <Text style={styles.guideCtaText}>Next: Learn about YPM →</Text>
        </Pressable>
      </Link>

      <View style={styles.divider} />

      {/* Related */}
      <Text style={styles.sectionTitle}>Related</Text>
      <View style={styles.nextSteps}>
        <Link href="/faq" asChild>
          <Pressable style={styles.nextCard}>
            <Text style={styles.nextCardTitle}>FAQ</Text>
            <Text style={styles.nextCardDesc}>Common questions answered</Text>
          </Pressable>
        </Link>
        <Link href="/dev-manual" asChild>
          <Pressable style={styles.nextCard}>
            <Text style={styles.nextCardTitle}>Dev Manual</Text>
            <Text style={styles.nextCardDesc}>Write your own plugins</Text>
          </Pressable>
        </Link>
        <Link href="/reference/commands" asChild>
          <Pressable style={styles.nextCard}>
            <Text style={styles.nextCardTitle}>Reference</Text>
            <Text style={styles.nextCardDesc}>Commands, variables, events</Text>
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
    marginBottom: 8,
  },
  intro: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
    marginBottom: 16,
  },
  link: {
    color: Colors.link,
  },
  quickLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  quickLink: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  quickLinkText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.link,
  },
  toc: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 6,
    padding: 16,
    marginBottom: 8,
  },
  tocTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.heading,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tocItem: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.link,
    lineHeight: Typography.fontSize.sm * 1.8,
  },
  guideCta: {
    backgroundColor: Colors.heading,
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignSelf: 'center',
    marginTop: 32,
  },
  guideCtaText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.md,
    color: Colors.contentBg,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.cardBorder,
    marginVertical: 28,
    marginHorizontal: '15%' as any,
    shadowColor: Colors.link,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.heading,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionNumberText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.contentBg,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xl,
    color: Colors.heading,
  },
  sectionContent: {
    marginLeft: 44,
  },
  subSection: {
    marginTop: 20,
    marginBottom: 12,
  },
  subTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.md,
    color: Colors.link,
    fontWeight: 'bold',
    marginBottom: 8,
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
  list: {
    marginLeft: 16,
    marginBottom: 12,
  },
  listItem: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
    marginBottom: 4,
  },
  callout: {
    backgroundColor: Colors.cardBg,
    borderLeftWidth: 3,
    borderRadius: 4,
    padding: 14,
    marginVertical: 10,
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
  imageContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  popupImage: {
    width: 500,
    height: 120,
    maxWidth: '100%' as any,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 6,
  },
  nextSteps: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 32,
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
  screenshotContainer: {
    alignItems: 'center',
    marginVertical: 20,
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
  screenshotSplit: {
    width: 900,
    height: 450,
    maxWidth: '100%' as any,
  },
  screenshotCaption: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.subtleText,
    fontStyle: 'italic',
    marginTop: 10,
    textAlign: 'center',
  },
});
