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

const YEDRC_HEADER = `#                 _
#  _   _  ___  __| |_ __ ___
# | | | |/ _ \\/ _\` | '__/ __|
# | |_| |  __/ (_| | | | (__
#  \\__, |\\___|\\__,_|_|  \\___|
#  |___/
#
# your-editor.org
# Add your name and customize to your liking!
`;

const DEFAULT_YEDRC = `${YEDRC_HEADER}

#========================#
#         Style          #
#========================#

# Enable truecolor support
set truecolor "yes"

# Set your style
style "first-dark"


#========================#
#       Variables        #
#========================#

# Completer settings
set completer-auto "yes"

# Mouse settings
set mouse-cursor-scroll "yes"
set mouse-scroll-num-lines "3"

# Copy to system clipboard on yank
set universal-copy-on-yank "yes"


#========================#
#       Keybindings      #
#========================#

# File navigation
bind ctrl-p find-file
bind ctrl-tab go-menu
bind ctrl-shift-f grep

# Editing
bind ctrl-/ comment-toggle
bind ctrl-s write-buffer

# Navigation
bind ctrl-g cursor-line-goto

# Terminal
bind ctrl-\` terminal`;

const DEFAULT_YPM_LIST = `auto_paren
comment
completer
cursor_word_hl
find_file
go_menu
grep
line_numbers
loc_history
mouse
terminal
universal_clipboard
style_pack
style_picker
lang/c
lang/cpp
lang/python
lang/sh
lang/yedrc
lang/make
lang/rust
lang/syntax/c
lang/syntax/cpp
lang/syntax/python
lang/syntax/sh
lang/syntax/yedrc
lang/syntax/make
lang/syntax/rust`;

const VIMISH_YEDRC = `${YEDRC_HEADER}

#========================#
#         Style          #
#========================#

# Enable truecolor support
set truecolor "yes"

# Set your style
style "first-dark"


#========================#
#       Variables        #
#========================#

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

# Ctags settings
set ctags-regen-on-write "yes"
set ctags-compl "yes"

# Copy to system clipboard on yank
set universal-copy-on-yank "yes"


#========================#
#       Keybindings      #
#========================#

# File navigation
vimish-bind  normal  "spc f"        find-file
vimish-bind  normal  "spc e"        tree-view-list
vimish-bind  normal  "spc b"        go-menu
vimish-bind  normal  "spc g"        grep

# Code navigation
vimish-bind  normal  "g d"          multi jump-stack-push ctags-jump-to-definition
vimish-bind  normal  "g r"          lsp-search-symbol
vimish-bind  normal  "K"            lsp-info
vimish-bind  normal  "ctrl-o"       jump-stack-pop

# Comments
vimish-bind  normal  "g c"          comment-toggle

# Build
vimish-bind  normal  "spc m"        builder-start
vimish-bind  normal  "spc j"        builder-jump-to-error

# Bookmarks
vimish-bind  normal  "spc i"        toggle-bookmark-on-line
vimish-bind  normal  "[ b"          goto-prev-bookmark
vimish-bind  normal  "] b"          goto-next-bookmark

# Diagnostics
vimish-bind  normal  "spc d"        multi "buffer *lsp-diagnostics" "feed-keys enter"

# Misc
vimish-bind  normal  "spc t"        terminal
vimish-bind  normal  "%"            brace-goto-other`;

const VIMISH_YPM_LIST = `auto_paren
bookmarks
builder
comment
completer
ctags
cursor_word_hl
diff
find_file
go_menu
grep
jump_stack
loc_history
man
mouse
mouse_menu
terminal
tree_view
universal_clipboard
vimish
style_pack
style_picker
lang/c
lang/cpp
lang/python
lang/sh
lang/yedrc
lang/make
lang/rust
lang/syntax/c
lang/syntax/cpp
lang/syntax/python
lang/syntax/sh
lang/syntax/yedrc
lang/syntax/make
lang/syntax/rust`;

export default function ExampleConfigs() {
  const [activeTab, setActiveTab] = useState<'default' | 'vimish'>('default');

  const yedrc = activeTab === 'default' ? DEFAULT_YEDRC : VIMISH_YEDRC;
  const ypmList = activeTab === 'default' ? DEFAULT_YPM_LIST : VIMISH_YPM_LIST;

  return (
    <View>
      <SEO title="Starter Configs" description="Starter yedrc and ypm_list configurations for getting started with yed." />
      <Text style={styles.h1}>Starter Configs</Text>
      <Text style={styles.intro}>
        Pick a starter config below and save both files to{' '}
        <Text style={styles.code}>~/.config/yed/</Text>.
      </Text>
      <Text style={styles.body}>
        If the directory doesn't exist yet, create it:
      </Text>
      <CodeBlock context="terminal">{'mkdir -p ~/.config/yed'}</CodeBlock>
      <View style={styles.fileExplain}>
        <Text style={styles.body}>
          <Text style={styles.code}>yedrc</Text> — your settings and keybindings
        </Text>
        <Text style={styles.body}>
          <Text style={styles.code}>ypm_list</Text> — which plugins YPM should install
        </Text>
      </View>

      <View style={styles.divider} />

      <Text style={styles.h2}>Choose your style</Text>
      <Text style={styles.body}>
        <Text style={styles.bold}>Default yed</Text> works like most text editors — you type and
        it inserts text. If you're used to editors like nano, Notepad++, or VS Code, start here.
      </Text>
      <Text style={styles.body}>
        <Text style={styles.bold}>Vimish</Text> uses modal editing, where keys do different things
        depending on the mode you're in. Normal mode is for navigating and running commands, insert
        mode is for typing text. If you're coming from vim or neovim, this will feel familiar.
      </Text>

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

      {/* Config description */}
      {activeTab === 'default' ? (
        <Text style={styles.configDesc}>
          A clean starting point with yed's default keybindings. Includes essential plugins for
          file finding, completion, and grep — no modal editing.
        </Text>
      ) : (
        <Text style={styles.configDesc}>
          A full-featured setup with vim-style modal editing. Includes keybindings for
          jump to definition, build, grep, bookmarks, and more.
        </Text>
      )}

      {/* yedrc */}
      <Text style={styles.fileLabel}>~/.config/yed/yedrc</Text>
      <CodeBlock lang="yedrc" reserveSlug>{yedrc}</CodeBlock>

      {/* ypm_list */}
      <Text style={styles.fileLabel}>~/.config/yed/ypm_list</Text>
      <CodeBlock reserveSlug>{ypmList}</CodeBlock>

      <Link href="/user-guide" asChild>
        <Pressable style={styles.guideCta}>
          <Text style={styles.guideCtaText}>Next: Open yed for the first time →</Text>
        </Pressable>
      </Link>

      {/* Next steps */}
      <View style={styles.divider} />

      <Text style={styles.h2}>Next steps</Text>
      <View style={styles.nextSteps}>
        <Link href="/user-guide" style={styles.nextLink}>User Guide</Link>
        <Text style={styles.nextDesc}>
          — opening yed, buffers, frames, keybindings, and more
        </Text>
      </View>
      <View style={styles.nextSteps}>
        <Link href="/ypm" style={styles.nextLink}>YPM Guide</Link>
        <Text style={styles.nextDesc}>
          — manage plugins, update, and sync across machines
        </Text>
      </View>
      <View style={styles.nextSteps}>
        <Link href="/plugins" style={styles.nextLink}>Browse plugins</Link>
        <Text style={styles.nextDesc}>
          — discover more plugins to add to your ypm_list
        </Text>
      </View>
      <View style={styles.nextSteps}>
        <Link href="/lsp-setup" style={styles.nextLink}>LSP Setup</Link>
        <Text style={styles.nextDesc}>
          — add language server support for go-to-definition, diagnostics, and more
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
  bold: {
    fontWeight: 'bold',
    color: Colors.heading,
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
  guideCta: {
    backgroundColor: Colors.heading,
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignSelf: 'center',
    marginTop: 24,
  },
  guideCtaText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.md,
    color: Colors.contentBg,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  fileExplain: {
    marginTop: 12,
    marginBottom: 8,
  },
  fileLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.subtleText,
    marginTop: 16,
    marginBottom: 4,
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
