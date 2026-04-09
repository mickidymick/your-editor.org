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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.h2}>{title}</Text>
      {children}
    </View>
  );
}

function ServerCard({ name, install, config, languages }: {
  name: string;
  install: string;
  config: string;
  languages: string;
}) {
  return (
    <View style={styles.serverCard}>
      <Text style={styles.serverName}>{name}</Text>
      <Text style={styles.serverLangs}>{languages}</Text>
      <Text style={styles.serverInstallLabel}>Install:</Text>
      <CodeBlock lang="bash" context="terminal">{install}</CodeBlock>
      <Text style={styles.serverConfigLabel}>Add to yedrc:</Text>
      <CodeBlock lang="yedrc" context="yed">{config}</CodeBlock>
    </View>
  );
}

export default function LspSetup() {
  return (
    <View>
      <SEO title="LSP Setup" description="Set up Language Server Protocol support in yed for go-to-definition, diagnostics, completion, and more." />
      <Text style={styles.h1}>LSP Setup</Text>
      <Text style={styles.intro}>
        The Language Server Protocol gives yed IDE-like features — go-to-definition, hover info,
        diagnostics, and symbol search. It works by connecting to external language servers that
        understand your code.
      </Text>

      <Section title="What you get">
        <View style={styles.featureGrid}>
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Go to Definition</Text>
            <Text style={styles.featureDesc}>Jump to where a function, type, or variable is defined across your project.</Text>
          </View>
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Diagnostics</Text>
            <Text style={styles.featureDesc}>See errors and warnings inline as you type, without running a build.</Text>
          </View>
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Hover Info</Text>
            <Text style={styles.featureDesc}>View function signatures, type info, and documentation by moving your cursor to a symbol.</Text>
          </View>
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Symbol Search</Text>
            <Text style={styles.featureDesc}>Search for symbols across your project by name.</Text>
          </View>
        </View>
      </Section>

      <View style={styles.divider} />

      <Section title="Quick start">
        <Text style={styles.body}>
          LSP in yed uses multiple plugins that each handle a different feature. At minimum you
          need the{' '}
          <Link href="/plugins/lsp" style={styles.link}>lsp</Link> plugin — the core client that
          talks to language servers. Then add feature plugins for what you want:
        </Text>

        <View style={styles.pluginTable}>
          <View style={styles.pluginRow}>
            <Link href="/plugins/lsp" style={styles.pluginLink}>lsp</Link>
            <Text style={styles.pluginDesc}>Core LSP client (required)</Text>
          </View>
          <View style={[styles.pluginRow, styles.pluginRowAlt]}>
            <Link href="/plugins/lsp_diagnostics" style={styles.pluginLink}>lsp_diagnostics</Link>
            <Text style={styles.pluginDesc}>Inline errors and warnings</Text>
          </View>
          <View style={styles.pluginRow}>
            <Link href="/plugins/lsp_info_popup" style={styles.pluginLink}>lsp_info_popup</Link>
            <Text style={styles.pluginDesc}>Hover info popups</Text>
          </View>
          <View style={[styles.pluginRow, styles.pluginRowAlt]}>
            <Link href="/plugins/lsp_symbol_buffer" style={styles.pluginLink}>lsp_symbol_buffer</Link>
            <Text style={styles.pluginDesc}>Symbol search and file overview</Text>
          </View>
          <View style={styles.pluginRow}>
            <Link href="/plugins/completer" style={styles.pluginLink}>completer</Link>
            <Text style={styles.pluginDesc}>Completion popup (works with LSP sources)</Text>
          </View>
        </View>

        <Text style={styles.body}>Add these to your <Text style={styles.code}>ypm_list</Text>:</Text>
        <CodeBlock reserveSlug>{`lsp
lsp_diagnostics
lsp_info_popup
lsp_symbol_buffer
completer`}</CodeBlock>
        <Text style={styles.body}>
          And add this to your <Text style={styles.code}>yedrc</Text>:
        </Text>
        <CodeBlock lang="yedrc" context="yed">{'set completer-auto "yes"'}</CodeBlock>
      </Section>

      <View style={styles.divider} />

      <Section title="Language server setup">
        <Text style={styles.body}>
          Each language needs its own language server installed on your system. Then you tell yed
          about it with{' '}
          <Text style={styles.code}>lsp-define-server</Text> in your yedrc. The format is:
        </Text>
        <CodeBlock lang="yedrc" context="yed">{'lsp-define-server <NAME> <COMMAND> <LANGUAGE> [LANGUAGE...]'}</CodeBlock>

        <Text style={styles.body}>
          Here are common setups:
        </Text>

        <ServerCard
          name="clangd"
          languages="C / C++"
          install="sudo apt install clangd"
          config={'lsp-define-server CLANGD clangd --background-index C C++'}
        />

        <Callout type="note">
          clangd needs a <Text style={styles.code}>compile_commands.json</Text> in your project
          root to understand how your code is built. Generate one with{' '}
          <Text style={styles.code}>bear -- make</Text> or with cmake:{' '}
          <Text style={styles.code}>cmake -DCMAKE_EXPORT_COMPILE_COMMANDS=1</Text>.
          Without it, clangd won't be able to find headers or index your project properly.
        </Callout>

        <ServerCard
          name="pylsp"
          languages="Python"
          install="pip install python-lsp-server"
          config={'lsp-define-server PYLSP pylsp Python'}
        />

        <ServerCard
          name="bash-language-server"
          languages="Shell / Bash"
          install="npm install -g bash-language-server"
          config={'lsp-define-server BASHLSP "bash-language-server start" Shell'}
        />

        <ServerCard
          name="gopls"
          languages="Go"
          install="go install golang.org/x/tools/gopls@latest"
          config={'lsp-define-server GOPLS gopls Go'}
        />

        <ServerCard
          name="rust-analyzer"
          languages="Rust"
          install="rustup component add rust-analyzer"
          config={'lsp-define-server RUST_ANALYZER rust-analyzer Rust'}
        />

        <Callout type="tip">
          You can define as many language servers as you need — yed will use the right one
          based on the filetype of the buffer you're editing.
        </Callout>
      </Section>

      <View style={styles.divider} />

      <Section title="Example keybindings">
        <Text style={styles.body}>
          If you're using{' '}
          <Link href="/plugins/vimish" style={styles.link}>vimish</Link>, here are some
          keybindings you might find useful as a starting point:
        </Text>
        <CodeBlock lang="yedrc" context="yed">{`# Jump to definition (push location first for jump-stack)
vimish-bind  normal  "T T"        multi jump-stack-push ctags-jump-to-definition

# View diagnostics list
vimish-bind  normal  "ctrl-u"     multi "buffer *lsp-diagnostics" "feed-keys enter"

# Search symbols
vimish-bind  normal  "spc s"      lsp-search-symbol

# Pop back after jumping
vimish-bind  normal  "bsp"        jump-stack-pop`}</CodeBlock>
      </Section>

      <View style={styles.divider} />

      <Section title="Troubleshooting">
        <Text style={styles.body}>
          If LSP isn't working, check these common issues:
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>
            {'\u2022'} Make sure the language server is installed and on your{' '}
            <Text style={styles.code}>PATH</Text>
          </Text>
          <Text style={styles.listItem}>
            {'\u2022'} Check <Text style={styles.code}>*log</Text> buffer for error messages
            — run <Text style={styles.code}>buffer *log</Text>
          </Text>
          <Text style={styles.listItem}>
            {'\u2022'} Ensure the filetype is set correctly — check with{' '}
            <Text style={styles.code}>get ft</Text>
          </Text>
          <Text style={styles.listItem}>
            {'\u2022'} The language name in <Text style={styles.code}>lsp-define-server</Text>{' '}
            must match the filetype exactly (e.g. "C" not "c")
          </Text>
        </View>
      </Section>

      <View style={styles.divider} />
      <Text style={styles.h2}>Related</Text>
      <View style={styles.nextSteps}>
        <Link href="/plugins" asChild>
          <Pressable style={styles.nextCard}>
            <Text style={styles.nextCardTitle}>Plugins</Text>
            <Text style={styles.nextCardDesc}>Browse all available plugins</Text>
          </Pressable>
        </Link>
        <Link href="/user-guide" asChild>
          <Pressable style={styles.nextCard}>
            <Text style={styles.nextCardTitle}>User Guide</Text>
            <Text style={styles.nextCardDesc}>Learn the basics of using yed</Text>
          </Pressable>
        </Link>
        <Link href="/faq" asChild>
          <Pressable style={styles.nextCard}>
            <Text style={styles.nextCardTitle}>FAQ</Text>
            <Text style={styles.nextCardDesc}>Common questions answered</Text>
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
    marginBottom: 12,
  },
  h2: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xl,
    color: Colors.heading,
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
  section: {
    marginBottom: 8,
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
  divider: {
    height: 1,
    backgroundColor: Colors.cardBorder,
    marginVertical: 24,
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
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureCard: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 6,
    padding: 14,
    width: '48%' as any,
    minWidth: 200,
    marginRight: '2%' as any,
    marginBottom: 10,
  },
  featureTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.heading,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featureDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal,
  },
  pluginTable: {
    marginBottom: 16,
  },
  pluginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  pluginRowAlt: {
    backgroundColor: Colors.cardBg,
    borderRadius: 4,
  },
  pluginLink: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.link,
    fontWeight: 'bold',
    width: 160,
  },
  pluginDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.subtleText,
    flex: 1,
  },
  serverCard: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 6,
    padding: 16,
    marginBottom: 16,
  },
  serverName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.lg,
    color: Colors.heading,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  serverLangs: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.subtleText,
    marginBottom: 12,
  },
  serverInstallLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.subtleText,
    marginBottom: 4,
  },
  serverConfigLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.subtleText,
    marginBottom: 4,
    marginTop: 8,
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
});
