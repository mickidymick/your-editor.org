import React, { useState } from 'react';
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

const DEFAULT_CONFIG = `# ~/.config/yed/yedrc

# Enable truecolor support
set truecolor "yes"

# Load the plugin manager
plugin-load "ypm"

# Set your style
style "first-dark"

# Plugins
plugin-load "auto_paren"
plugin-load "comment"
plugin-load "completer"
plugin-load "cursor_word_hl"
plugin-load "find_file"
plugin-load "go_menu"
plugin-load "grep"
plugin-load "line_numbers"
plugin-load "loc_history"
plugin-load "mouse"
plugin-load "universal_clipboard"

# Completer settings
set completer-auto "yes"

# Use ripgrep for grep
set grep-cmd "rg --vimgrep"`;

const VIMISH_CONFIG = `# ~/.config/yed/yedrc

# Enable truecolor support
set truecolor "yes"

# Load the plugin manager
plugin-load "ypm"

# Set your style
style "first-dark"

# Plugins
plugin-load "auto_paren"
plugin-load "bookmarks"
plugin-load "builder"
plugin-load "comment"
plugin-load "completer"
plugin-load "ctags"
plugin-load "cursor_word_hl"
plugin-load "diff"
plugin-load "find_file"
plugin-load "go_menu"
plugin-load "grep"
plugin-load "jump_stack"
plugin-load "loc_history"
plugin-load "man"
plugin-load "mouse"
plugin-load "mouse_menu"
plugin-load "terminal"
plugin-load "tree_view"
plugin-load "universal_clipboard"
plugin-load "vimish"

# Completer settings
set completer-auto "yes"

# Use ripgrep for grep
set grep-cmd "rg --vimgrep"

# Mouse settings
set mouse-cursor-scroll yes
set mouse-scroll-num-lines "3"

# Bookmark settings
set bookmark-use-line-numbers "1"
set bookmark-character "\u2691"
set bookmark-color "fg 3333FF"

# Builder settings
set builder-build-command 'make -j$(nproc)'
set builder-popup-rg "yes"

# Diff settings
set diff-hl-on "yes"

# Vimish keybindings
vimish-bind  normal  "tab"          go-menu
vimish-bind  normal  "spc f"        find-file
vimish-bind  normal  "spc t"        ctags-find
vimish-bind  normal  "spc i"        toggle-bookmark-on-line
vimish-bind  normal  "spc o"        goto-prev-bookmark
vimish-bind  normal  "spc p"        goto-next-bookmark
vimish-bind  normal  "ctrl-c ctrl-c" comment-toggle
vimish-bind  normal  "ctrl-y"       builder-start
vimish-bind  normal  "ctrl-u"       multi "buffer *lsp-diagnostics" "feed-keys enter"
vimish-bind  normal  "bsp"          jump-stack-pop
vimish-bind  normal  "M M"          man-word
vimish-bind  normal  "%"            brace-goto-other
vimish-bind  normal  "+"            diff-expand-truncated-lines
vimish-bind  normal  "-"            diff-contract-truncated-lines
vimish-bind  normal  "T T"          multi jump-stack-push ctags-jump-to-definition
vimish-bind  normal  "E E"          builder-jump-to-error`;

export default function ExampleConfigs() {
  const [activeTab, setActiveTab] = useState<'default' | 'vimish'>('default');

  return (
    <View>
      <SEO title="Example Configs" description="Example yedrc configurations for getting started with yed." />
      <Text style={styles.h1}>Example Configs</Text>
      <Text style={styles.intro}>
        These are starter configurations you can copy into your{' '}
        <Text style={styles.code}>~/.config/yed/yedrc</Text> file. Pick whichever
        suits your workflow and customize from there.
      </Text>

      <Callout type="note">
        These configs assume you have{' '}
        <Link href="/ypm" style={styles.link}>YPM</Link> set up.
        Plugins listed here will be loaded automatically — use{' '}
        <Text style={styles.code}>ypm-menu</Text> to install any you're missing.
      </Callout>

      {/* Tab switcher */}
      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, activeTab === 'default' && styles.tabActive]}
          onPress={() => setActiveTab('default')}
        >
          <Text style={[styles.tabText, activeTab === 'default' && styles.tabTextActive]}>
            Default yed
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'vimish' && styles.tabActive]}
          onPress={() => setActiveTab('vimish')}
        >
          <Text style={[styles.tabText, activeTab === 'vimish' && styles.tabTextActive]}>
            Vimish
          </Text>
        </Pressable>
      </View>

      {/* Default config */}
      {activeTab === 'default' && (
        <View>
          <Text style={styles.configDesc}>
            A clean starting point for yed's default keybindings. Includes essential plugins for
            file finding, completion, and grep — no modal editing.
          </Text>
          <CodeBlock lang="yedrc">{DEFAULT_CONFIG}</CodeBlock>
        </View>
      )}

      {/* Vimish config */}
      {activeTab === 'vimish' && (
        <View>
          <Text style={styles.configDesc}>
            A full-featured setup with vim-style modal editing. Includes keybindings for most
            common operations — jump to definition, build, grep, bookmarks, and more.
          </Text>
          <CodeBlock lang="yedrc">{VIMISH_CONFIG}</CodeBlock>
        </View>
      )}

      <View style={styles.divider} />

      <Text style={styles.h2}>What's in these configs</Text>
      <Text style={styles.body}>
        Both configs start with the same foundation:
      </Text>

      <View style={styles.list}>
        <Text style={styles.listItem}>
          {'\u2022'} <Text style={styles.code}>truecolor</Text> — enables 24-bit color for styles that support it
        </Text>
        <Text style={styles.listItem}>
          {'\u2022'} <Text style={styles.code}>ypm</Text> — the plugin manager, so you can install and update plugins
        </Text>
        <Text style={styles.listItem}>
          {'\u2022'} <Text style={styles.code}>completer-auto</Text> — shows completion suggestions as you type
        </Text>
        <Text style={styles.listItem}>
          {'\u2022'} <Text style={styles.code}>grep-cmd</Text> — uses ripgrep for faster project-wide search (install{' '}
          <Text style={styles.code}>rg</Text> separately)
        </Text>
      </View>

      <Text style={styles.body}>
        The vimish config adds modal editing keybindings and more plugins for navigation,
        building, and debugging. See each plugin's page for details on what the keybindings do.
      </Text>

      <View style={styles.divider} />

      <Text style={styles.h2}>Next steps</Text>
      <View style={styles.nextSteps}>
        <Link href="/plugins" style={styles.nextLink}>Browse plugins</Link>
        <Text style={styles.nextDesc}>
          — discover more plugins to add to your config
        </Text>
      </View>
      <View style={styles.nextSteps}>
        <Link href="/lsp-setup" style={styles.nextLink}>Set up LSP</Link>
        <Text style={styles.nextDesc}>
          — add language server support for go-to-definition, diagnostics, and more
        </Text>
      </View>
      <View style={styles.nextSteps}>
        <Link href="/reference/variables" style={styles.nextLink}>Variable reference</Link>
        <Text style={styles.nextDesc}>
          — see all configurable variables
        </Text>
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
    marginBottom: 12,
  },
  h2: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xl,
    color: Colors.heading,
    marginTop: 8,
    marginBottom: 12,
  },
  intro: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.md,
    color: Colors.text,
    lineHeight: Typography.fontSize.md * Typography.lineHeight.normal,
    marginBottom: 16,
  },
  body: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
    marginBottom: 12,
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
    marginBottom: 20,
  },
  calloutLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  calloutBody: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 6,
    marginRight: 10,
    backgroundColor: Colors.cardBg,
  },
  tabActive: {
    backgroundColor: Colors.heading,
    borderColor: Colors.heading,
  },
  tabText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.subtleText,
    fontWeight: 'bold',
  },
  tabTextActive: {
    color: Colors.contentBg,
  },
  configDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.cardBorder,
    marginVertical: 24,
  },
  list: {
    marginBottom: 12,
  },
  listItem: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
    marginBottom: 6,
    paddingLeft: 8,
  },
  nextSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  nextLink: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.link,
    fontWeight: 'bold',
  },
  nextDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.subtleText,
  },
});
