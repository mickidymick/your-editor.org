import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
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

function CommandRow({ command, description, even }: { command: string; description: string; even: boolean }) {
  return (
    <View style={[styles.cmdRow, even && styles.cmdRowAlt]}>
      <Text style={styles.cmdName}>{command}</Text>
      <Text style={styles.cmdDesc}>{description}</Text>
    </View>
  );
}

export default function YPM() {
  return (
    <View>
      <SEO title="YPM Guide" description="How to use YPM, the yed plugin manager, to find, install, and manage plugins." />
      <Text style={styles.h1}>YPM — yed Plugin Manager</Text>
      <Text style={styles.intro}>
        YPM is yed's built-in plugin manager. It can find, download, build, and manage plugins
        from a collection of 155+ community and official plugins.
      </Text>

      {/* Getting Started */}
      <Text style={styles.h2}>Getting Started</Text>

      <Step number={1} title="Load YPM">
        <Text style={styles.body}>
          YPM is included with yed. If you used the default configuration setup, it's already
          loaded. Otherwise, load it manually:
        </Text>
        <CodeBlock>{'plugin-load ypm'}</CodeBlock>
        <Text style={styles.body}>
          Or add it to your <Text style={styles.code}>yedrc</Text>:
        </Text>
        <CodeBlock>{"plugin-load 'ypm'"}</CodeBlock>
      </Step>

      <Step number={2} title="Browse available plugins">
        <Text style={styles.body}>
          Open the YPM menu to see all available plugins:
        </Text>
        <CodeBlock>{'ypm-menu'}</CodeBlock>
        <Text style={styles.body}>
          This opens the <Text style={styles.code}>*ypm-menu</Text> buffer where you can browse,
          search, and install plugins interactively.
        </Text>
      </Step>

      <Step number={3} title="Install a plugin">
        <Text style={styles.body}>
          From the YPM menu, navigate to a plugin and press Enter to install it. Or install
          directly by name:
        </Text>
        <CodeBlock>{'ypm-install vimish'}</CodeBlock>
        <Callout type="tip">
          <Text style={styles.code}>ypm-install</Text> both installs and hot-loads the plugin
          immediately — no restart needed. Installed plugins are also automatically loaded on
          future startups.
        </Callout>
      </Step>

      {/* Using the YPM Menu */}
      <View style={styles.divider} />
      <Text style={styles.h2}>Using the YPM Menu</Text>

      <Text style={styles.body}>
        The <Text style={styles.code}>ypm-menu</Text> command opens an interactive plugin browser
        in a special buffer. Here's how to navigate it:
      </Text>

      <View style={styles.screenshotContainer}>
        <View style={styles.screenshotFrame}>
          <Image
            source={require('../assets/images/ypm_menu.png')}
            style={styles.screenshotImage}
            resizeMode="contain"
          />
        </View>
      </View>

      <Text style={styles.body}>The menu shows each plugin with the following information:</Text>
      <View style={styles.menuInfoTable}>
        <CommandRow command="Plugin" description="The name of the plugin" even={false} />
        <CommandRow command="Installed" description="Whether the plugin is installed on the system" even={true} />
        <CommandRow command="Loaded" description="Whether the plugin is currently loaded in the session" even={false} />
        <CommandRow command="Description" description="A description of the plugin pulled from its man page" even={true} />
      </View>

      <Text style={styles.subTitle}>Controls</Text>
      <View style={styles.menuInfoTable}>
        <CommandRow command="Up / Down" description="Move between plugins in the list" even={false} />
        <CommandRow command="Enter" description="Open the action menu for the selected plugin (Man Page, Install, Uninstall, Load, Unload)" even={true} />
        <CommandRow command="f" description="Search plugins by keyword. Press f then ESC to clear the search" even={false} />
        <CommandRow command="m" description="View the YPM man page" even={true} />
        <CommandRow command="ESC" description="Close the menu" even={false} />
      </View>

      <Text style={styles.subTitle}>Action Menu</Text>
      <Text style={styles.body}>
        Pressing Enter on a plugin opens a list of actions:
      </Text>
      <View style={styles.menuInfoTable}>
        <CommandRow command="Man Page" description="View the plugin's documentation in a new buffer. Press ESC to return" even={false} />
        <CommandRow command="Install" description="Download and build the plugin via ypm-install" even={true} />
        <CommandRow command="Uninstall" description="Remove the plugin via ypm-uninstall" even={false} />
        <CommandRow command="Load" description="Hot-load the plugin into the current session without restarting" even={true} />
        <CommandRow command="Unload" description="Unload the plugin from the current session" even={false} />
      </View>

      <Callout type="tip">
        Install automatically hot-loads the plugin, so you can start using it right away.
        Use Load/Unload to manage plugins in your current session without installing or
        uninstalling them.
      </Callout>

      {/* Commands */}
      <View style={styles.divider} />
      <Text style={styles.h2}>Commands</Text>

      <View style={styles.menuInfoTable}>
        <CommandRow command="ypm-menu" description="Create a list view of all available plugins and their current status" even={false} />
        <CommandRow command="ypm-install <name>" description="Install and hot-load the specified plugin" even={true} />
        <CommandRow command="ypm-uninstall <name>" description="Uninstall and unload the specified plugin" even={false} />
        <CommandRow command="ypm-update" description="Update all plugin submodules and reinstall all installed plugins" even={true} />
        <CommandRow command="ypm-fetch" description="Fetch the latest plugin list from the repository" even={false} />
      </View>

      {/* Plugin List */}
      <View style={styles.divider} />
      <Text style={styles.h2}>The ypm_list</Text>
      <Text style={styles.body}>
        Your installed plugins are tracked in{' '}
        <Text style={styles.code}>~/.config/yed/ypm_list</Text>. This file is automatically
        managed by YPM. When moving to a new machine, copy this file and run{' '}
        <Text style={styles.code}>ypm-update</Text> to reinstall everything.
      </Text>
      <Callout type="tip">
        Keep your <Text style={styles.code}>ypm_list</Text> in version control alongside your{' '}
        <Text style={styles.code}>yedrc</Text> for easy configuration sync across machines.
      </Callout>

      {/* Variables */}
      <View style={styles.divider} />
      <Text style={styles.h2}>Variables</Text>
      <View style={styles.menuInfoTable}>
        <CommandRow command="ypm-is-updating" description="Set to &quot;YES&quot; while a ypm-update is in progress, &quot;NO&quot; otherwise" even={false} />
      </View>

      {/* Special Buffers */}
      <View style={styles.divider} />
      <Text style={styles.h2}>Special Buffers</Text>
      <View style={styles.menuInfoTable}>
        <CommandRow command="*ypm-menu" description="Interactive plugin browser with install/uninstall controls" even={false} />
        <CommandRow command="*ypm-output" description="Build and install output log" even={true} />
      </View>

      {/* Related */}
      <View style={styles.divider} />
      <Text style={styles.h2}>Related</Text>
      <View style={styles.nextSteps}>
        <Link href="/plugins" asChild>
          <Pressable style={styles.nextCard}>
            <Text style={styles.nextCardTitle}>Browse Plugins</Text>
            <Text style={styles.nextCardDesc}>Search all 155+ available plugins</Text>
          </Pressable>
        </Link>
        <Link href="/user-guide" asChild>
          <Pressable style={styles.nextCard}>
            <Text style={styles.nextCardTitle}>User Guide</Text>
            <Text style={styles.nextCardDesc}>Learn the basics of using yed</Text>
          </Pressable>
        </Link>
        <Link href="/update" asChild>
          <Pressable style={styles.nextCard}>
            <Text style={styles.nextCardTitle}>Updating</Text>
            <Text style={styles.nextCardDesc}>Keep yed and plugins up to date</Text>
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
  h2: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xl,
    color: Colors.heading,
    marginTop: 8,
    marginBottom: 16,
  },
  subTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.md,
    color: Colors.link,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  intro: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
    marginBottom: 20,
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
  menuInfoTable: {
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },
  cmdRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  cmdRowAlt: {
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  cmdName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.link,
    flex: 1,
    minWidth: 180,
  },
  cmdDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    flex: 2,
  },
  screenshotContainer: {
    alignItems: 'center',
    marginVertical: 16,
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
  screenshotImage: {
    width: 1260,
    height: 665,
    maxWidth: '100%' as any,
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
