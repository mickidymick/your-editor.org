import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Linking } from 'react-native';
import { Link } from 'expo-router';
import { SEO } from '../components/SEO';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

function FAQItem({ question, children }: { question: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.faqItem}>
      <Pressable onPress={() => setOpen(!open)} style={styles.faqHeader}>
        <Text style={styles.faqChevron}>{open ? '\u25BC' : '\u25B6'}</Text>
        <Text style={styles.faqQuestion}>{question}</Text>
      </Pressable>
      {open && (
        <View style={styles.faqAnswer}>
          {children}
        </View>
      )}
    </View>
  );
}

export default function FAQ() {
  return (
    <View>
      <SEO title="FAQ" description="Frequently asked questions about the yed terminal editor." />
      <Text style={styles.h1}>Frequently Asked Questions</Text>

      <FAQItem question="How do I quit yed?">
        <Text style={styles.body}>
          Open the command line (<Text style={styles.code}>ctrl-y</Text>), type{' '}
          <Text style={styles.code}>quit</Text>, and press Enter.
        </Text>
      </FAQItem>

      <FAQItem question="How do I get syntax highlighting?">
        <Text style={styles.body}>
          Load a language plugin such as <Text style={styles.code}>lang/c</Text> and{' '}
          <Text style={styles.code}>lang/syntax/c</Text>. You can browse all language plugins on
          the <Link href={{ pathname: '/plugins', params: { category: 'language' } }} style={styles.link}>Plugins</Link> page.
        </Text>
      </FAQItem>

      <FAQItem question="Can I change yed's colors?">
        <Text style={styles.body}>
          Yes! Use the <Text style={styles.code}>style</Text> command to activate a theme from a
          style plugin. Browse available themes on the{' '}
          <Link href={{ pathname: '/plugins', params: { category: 'style' } }} style={styles.link}>Styles</Link> page.
        </Text>
      </FAQItem>

      <FAQItem question="How do I get line numbers?">
        <Text style={styles.body}>
          Load the <Text style={styles.code}>line_numbers</Text> plugin. You can install it via
          YPM: <Text style={styles.code}>ypm-install line_numbers</Text>
        </Text>
      </FAQItem>

      <FAQItem question="How do I move my config to a new machine?">
        <Text style={styles.body}>
          Copy your <Text style={styles.code}>yedrc</Text> files and{' '}
          <Text style={styles.code}>ypm_list</Text> to{' '}
          <Text style={styles.code}>~/.config/yed</Text> on the new machine, recompile{' '}
          <Text style={styles.code}>init.so</Text>, and run{' '}
          <Text style={styles.code}>ypm-update</Text> to reinstall all plugins.
        </Text>
      </FAQItem>

      <FAQItem question="How do I install plugins?">
        <Text style={styles.body}>
          Use <Text style={styles.code}>ypm-menu</Text> to browse and install interactively, or{' '}
          <Text style={styles.code}>ypm-install &lt;name&gt;</Text> to install by name. See the{' '}
          <Link href="/ypm" style={styles.link}>YPM Guide</Link> for more details.
        </Text>
      </FAQItem>

      <FAQItem question="How do I update yed?">
        <Text style={styles.body}>
          Pull the latest source and rebuild. See the{' '}
          <Link href="/update" style={styles.link}>Update</Link> page for full instructions.
        </Text>
      </FAQItem>

      <FAQItem question="What keybindings does yed use?">
        <Text style={styles.body}>
          yed has minimal default bindings — <Text style={styles.code}>ctrl-y</Text> for the
          command prompt, <Text style={styles.code}>ctrl-w</Text> to save, and arrow keys for
          movement. You can customize everything with{' '}
          <Text style={styles.code}>bind</Text> / <Text style={styles.code}>unbind</Text>, or use
          the <Text style={styles.code}>vimish</Text> plugin for vim-style modal editing.
        </Text>
      </FAQItem>

      <FAQItem question="Does yed support LSP?">
        <Text style={styles.body}>
          Yes! Load the <Text style={styles.code}>lsp</Text> plugin along with feature plugins
          like <Text style={styles.code}>completer</Text>,{' '}
          <Text style={styles.code}>lsp_info_popup</Text>, and{' '}
          <Text style={styles.code}>lsp_diagnostics</Text>. See the{' '}
          <Link href="/plugins/lsp" style={styles.link}>LSP plugin</Link> page for setup details.
        </Text>
      </FAQItem>

      <FAQItem question="What platforms does yed run on?">
        <Text style={styles.body}>
          yed runs on most flavors of Linux, macOS (including Apple Silicon), and the Windows
          Subsystem for Linux (WSL). It requires a C compiler supporting{' '}
          <Text style={styles.code}>-std=gnu99</Text> to build from source.
        </Text>
      </FAQItem>

      <FAQItem question="How do I save a file?">
        <Text style={styles.body}>
          Use the <Text style={styles.code}>write-buffer</Text> command. The default keybinding
          is <Text style={styles.code}>ctrl-w</Text>. You can also save to a different path
          with <Text style={styles.code}>write-buffer /path/to/file</Text>.
        </Text>
      </FAQItem>

      <FAQItem question="How do I open multiple files / split the screen?">
        <Text style={styles.body}>
          Open files with the <Text style={styles.code}>buffer</Text> command. Split the current
          frame with <Text style={styles.code}>frame-vsplit</Text> (vertical) or{' '}
          <Text style={styles.code}>frame-hsplit</Text> (horizontal). Switch between frames
          with <Text style={styles.code}>frame-next</Text> and{' '}
          <Text style={styles.code}>frame-prev</Text>. See the{' '}
          <Link href="/user-guide" style={styles.link}>User Guide</Link> for more on frames.
        </Text>
      </FAQItem>

      <FAQItem question="How do I search and replace?">
        <Text style={styles.body}>
          Use <Text style={styles.code}>find-in-buffer</Text> to search interactively — it
          highlights matches as you type. Jump between matches with{' '}
          <Text style={styles.code}>find-next-in-buffer</Text> and{' '}
          <Text style={styles.code}>find-prev-in-buffer</Text>. To replace, use{' '}
          <Text style={styles.code}>replace-current-search</Text> which will prompt for the
          replacement text.
        </Text>
      </FAQItem>

      <FAQItem question="How do I undo/redo?">
        <Text style={styles.body}>
          Use the <Text style={styles.code}>undo</Text> and{' '}
          <Text style={styles.code}>redo</Text> commands. Every buffer maintains its own full
          undo history.
        </Text>
      </FAQItem>

      <FAQItem question="What's the difference between init.so and yedrc?">
        <Text style={styles.body}>
          <Text style={styles.code}>init.so</Text> is a compiled C plugin that runs at startup —
          use it for dynamic configuration logic. <Text style={styles.code}>yedrc</Text> is a
          plain text file of yed commands — simpler and doesn't need recompiling. Most users put
          day-to-day config (keybindings, variables, plugin loading) in their yedrc and only use
          init.c for advanced behavior.
        </Text>
      </FAQItem>

      <FAQItem question="How do I enable truecolor?">
        <Text style={styles.body}>
          Set the <Text style={styles.code}>truecolor</Text> variable to{' '}
          <Text style={styles.code}>yes</Text> in your yedrc <Text style={{ fontStyle: 'italic' }}>before</Text> loading
          any style plugins. Your terminal must support 24-bit color.
        </Text>
      </FAQItem>

      <FAQItem question="Can I use yed like vim?">
        <Text style={styles.body}>
          Yes! Install the <Text style={styles.code}>vimish</Text> plugin for vim-style modal
          editing with normal, insert, and visual modes. There's also{' '}
          <Text style={styles.code}>xul</Text> (inspired by vim and kakoune) and{' '}
          <Text style={styles.code}>drill</Text> (kakoune-style). Browse them on the{' '}
          <Link href={{ pathname: '/plugins', params: { category: 'editor-styles' } }} style={styles.link}>Editor Styles</Link> page.
        </Text>
      </FAQItem>

      <FAQItem question="How do I copy/paste from the system clipboard?">
        <Text style={styles.body}>
          Use the <Text style={styles.code}>sysclip</Text> plugin (uses{' '}
          <Text style={styles.code}>xsel</Text>) or{' '}
          <Text style={styles.code}>universal_clipboard</Text> (uses OSC 52 escape sequences,
          works over SSH). Install either via YPM.
        </Text>
      </FAQItem>

      <FAQItem question="How do I write my own plugin?">
        <Text style={styles.body}>
          Plugins are shared objects written in C. See the{' '}
          <Link href="/dev-manual" style={styles.link}>Developer Manual</Link> for a complete
          guide covering the plugin API, events, commands, and a working example.
        </Text>
      </FAQItem>

      <FAQItem question="Where can I get help?">
        <Text style={styles.body}>
          Join the yed community on{' '}
          <Text style={styles.link} onPress={() => Linking.openURL('https://discord.gg/cx3JFJ2gNU')}>Discord</Text> — users and developers are
          happy to help. You can also check the{' '}
          <Link href="/user-guide" style={styles.link}>User Guide</Link> and{' '}
          <Link href="/reference/commands" style={styles.link}>Reference</Link> pages.
        </Text>
      </FAQItem>
      <View style={styles.divider} />
      <Text style={styles.h2}>Learn More</Text>
      <View style={styles.nextSteps}>
        <Link href="/user-guide" asChild>
          <Pressable style={styles.nextCard}>
            <Text style={styles.nextCardTitle}>User Guide</Text>
            <Text style={styles.nextCardDesc}>Complete guide to using yed</Text>
          </Pressable>
        </Link>
        <Link href="/install" asChild>
          <Pressable style={styles.nextCard}>
            <Text style={styles.nextCardTitle}>Installation</Text>
            <Text style={styles.nextCardDesc}>Get yed up and running</Text>
          </Pressable>
        </Link>
        <Link href="/plugins" asChild>
          <Pressable style={styles.nextCard}>
            <Text style={styles.nextCardTitle}>Plugins</Text>
            <Text style={styles.nextCardDesc}>Browse 155+ plugins</Text>
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
  link: {
    color: Colors.link,
  },
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
  faqItem: {
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 6,
    marginBottom: 8,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  faqChevron: {
    fontFamily: Typography.fontFamily,
    fontSize: 10,
    color: Colors.subtleText,
    marginRight: 12,
    width: 12,
  },
  faqQuestion: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.md,
    color: Colors.heading,
    flex: 1,
  },
  faqAnswer: {
    paddingHorizontal: 40,
    paddingVertical: 14,
  },
});
