import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Linking, Platform } from 'react-native';
import { Link } from 'expo-router';
import { SEO } from '../components/SEO';
import { CodeBlock } from '../components/CodeBlock';

function DiscordIcon({ size = 16, color = '#8ba4b0' }: { size?: number; color?: string }) {
  const ref = useRef<View>(null);

  useEffect(() => {
    if (Platform.OS !== 'web' || !ref.current) return;
    const el = ref.current as any;
    el.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z"/></svg>`;
  }, [size, color]);

  return <View ref={ref} style={{ width: size, height: size, marginRight: 8 }} />;
}
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

function FAQItem({ question, children, defaultOpen = false }: { question: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
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

function FAQSection({ title, color, children, search }: { title: string; color: string; children: React.ReactNode; search: string }) {
  // Filter children based on search
  const filtered = useMemo(() => {
    if (!search) return children;
    const items = React.Children.toArray(children);
    return items.filter((child: any) => {
      const q = child?.props?.question || '';
      return q.toLowerCase().includes(search.toLowerCase());
    });
  }, [children, search]);

  const arr = React.Children.toArray(filtered);
  if (arr.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={[styles.sectionHeader, { borderLeftColor: color }]}>
        <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
      </View>
      {filtered}
    </View>
  );
}

export default function FAQ() {
  const [search, setSearch] = useState('');

  return (
    <View>
      <SEO title="FAQ" description="Frequently asked questions about the yed terminal editor." />
      <Text style={styles.h1}>Frequently Asked Questions</Text>

      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search questions..."
          placeholderTextColor={Colors.subtleText}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <Pressable style={styles.discordBanner} onPress={() => Linking.openURL('https://discord.gg/cx3JFJ2gNU')}>
        <DiscordIcon size={28} color="#5865F2" />
        <View>
          <Text style={styles.discordTitle}>Join the yed community</Text>
          <Text style={styles.discordSub}>Ask questions, share configs, and get help on Discord.</Text>
        </View>
      </Pressable>

      <FAQSection title="Getting Started" color={Colors.string} search={search}>
        <FAQItem question="How do I quit yed?" defaultOpen>
          <Text style={styles.body}>
            Open the command prompt with <Text style={styles.code}>ctrl-y</Text>, type{' '}
            <Text style={styles.code}>quit</Text>, and press Enter.
          </Text>
          <Text style={styles.bodyMuted}>
            If you're using vimish, you can also quit with <Text style={styles.code}>:q</Text> or{' '}
            <Text style={styles.code}>:q!</Text>.
          </Text>
        </FAQItem>

        <FAQItem question="How do I save a file?" defaultOpen>
          <Text style={styles.body}>
            The default keybinding is <Text style={styles.code}>ctrl-w</Text>, which runs{' '}
            <Text style={styles.code}>write-buffer</Text>.
          </Text>
          <Text style={styles.body}>
            You can also save to a different path:
          </Text>
          <CodeBlock context="yed">{'write-buffer /path/to/file'}</CodeBlock>
        </FAQItem>

        <FAQItem question="What keybindings does yed use?">
          <Text style={styles.body}>
            yed ships with minimal default bindings:
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>{'\u2022'} <Text style={styles.code}>ctrl-y</Text> — command prompt</Text>
            <Text style={styles.listItem}>{'\u2022'} <Text style={styles.code}>ctrl-w</Text> — save</Text>
            <Text style={styles.listItem}>{'\u2022'} Arrow keys — movement</Text>
          </View>
          <Text style={styles.body}>
            You can customize everything with <Text style={styles.code}>bind</Text> /{' '}
            <Text style={styles.code}>unbind</Text> in your yedrc. Or, install an editor
            style plugin like <Text style={styles.code}>vimish</Text> for a full set of
            keybindings. See the{' '}
            <Link href="/user-guide" style={styles.link}>User Guide</Link> for more.
          </Text>
        </FAQItem>

        <FAQItem question="What platforms does yed run on?">
          <Text style={styles.body}>
            yed runs on most flavors of Linux, macOS (including Apple Silicon), and the Windows
            Subsystem for Linux (WSL). It requires a C compiler supporting{' '}
            <Text style={styles.code}>-std=gnu99</Text> to build from source.
          </Text>
        </FAQItem>

        <FAQItem question="How do I update yed?">
          <Text style={styles.body}>
            Pull the latest source and rebuild with the same install flags you originally used.
            See the <Link href="/update" style={styles.link}>Update</Link> page for full
            instructions.
          </Text>
        </FAQItem>
      </FAQSection>

      <FAQSection title="Editing" color={Colors.keyword} search={search}>
        <FAQItem question="How do I open multiple files / split the screen?">
          <Text style={styles.body}>
            Open files with the <Text style={styles.code}>buffer</Text> command:
          </Text>
          <CodeBlock context="yed">{'buffer my_file.txt'}</CodeBlock>
          <Text style={styles.body}>
            Split the current frame with <Text style={styles.code}>frame-vsplit</Text> or{' '}
            <Text style={styles.code}>frame-hsplit</Text>. Switch between frames with{' '}
            <Text style={styles.code}>frame-next</Text> and{' '}
            <Text style={styles.code}>frame-prev</Text>.
          </Text>
          <Text style={styles.bodyMuted}>
            See the <Link href="/user-guide" style={styles.link}>User Guide</Link> section
            on frames for more details.
          </Text>
        </FAQItem>

        <FAQItem question="How do I search and replace?">
          <Text style={styles.body}>
            Use <Text style={styles.code}>find-in-buffer</Text> to search — it highlights
            matches as you type. Navigate between matches with:
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>{'\u2022'} <Text style={styles.code}>find-next-in-buffer</Text> — jump to next match</Text>
            <Text style={styles.listItem}>{'\u2022'} <Text style={styles.code}>find-prev-in-buffer</Text> — jump to previous match</Text>
            <Text style={styles.listItem}>{'\u2022'} <Text style={styles.code}>replace-current-search</Text> — replace (prompts for replacement text)</Text>
          </View>
        </FAQItem>

        <FAQItem question="How do I undo/redo?">
          <Text style={styles.body}>
            Use the <Text style={styles.code}>undo</Text> and{' '}
            <Text style={styles.code}>redo</Text> commands. Every buffer maintains its own
            full undo history.
          </Text>
        </FAQItem>

        <FAQItem question="How do I copy/paste from the system clipboard?">
          <Text style={styles.body}>
            Install one of these plugins via YPM:
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>{'\u2022'} <Text style={styles.code}>universal_clipboard</Text> — uses OSC 52 escape sequences, works over SSH</Text>
            <Text style={styles.listItem}>{'\u2022'} <Text style={styles.code}>sysclip</Text> — uses <Text style={styles.code}>xsel</Text>, local only</Text>
          </View>
          <Text style={styles.bodyMuted}>
            <Text style={styles.code}>universal_clipboard</Text> is recommended for most setups.
          </Text>
        </FAQItem>

        <FAQItem question="How do I comment/uncomment code?">
          <Text style={styles.body}>
            Install the <Text style={styles.code}>comment</Text> plugin and use{' '}
            <Text style={styles.code}>comment-toggle</Text>. It automatically detects your
            filetype's comment syntax (<Text style={styles.code}>//</Text> for C,{' '}
            <Text style={styles.code}>#</Text> for shell, etc.).
          </Text>
        </FAQItem>

        <FAQItem question="Does yed support mouse input?">
          <Text style={styles.body}>
            Yes! Install the <Text style={styles.code}>mouse</Text> plugin for basic mouse
            support — clicking to place the cursor and scrolling. Add{' '}
            <Text style={styles.code}>mouse_menu</Text> for right-click context menus and{' '}
            <Text style={styles.code}>mouse_frame_control</Text> for resizing and
            manipulating frames with the mouse.
          </Text>
        </FAQItem>

        <FAQItem question="Can I run build commands from within yed?">
          <Text style={styles.body}>
            The <Link href="/plugins/builder" style={styles.link}>builder</Link> plugin runs
            build commands in the background, parses errors, and lets you jump directly to
            error locations in your code.
          </Text>
          <Text style={styles.body}>
            Set your build command in your yedrc:
          </Text>
          <CodeBlock context="yed">{"set builder-build-command 'make -j$(nproc)'"}</CodeBlock>
        </FAQItem>

        <FAQItem question="How do I navigate back to where I was?">
          <Text style={styles.body}>
            The <Link href="/plugins/jump_stack" style={styles.link}>jump_stack</Link> plugin
            maintains a stack of locations — push your position before jumping somewhere,
            then pop back when you're done. Great paired with ctags or LSP go-to-definition.
          </Text>
          <Text style={styles.body}>
            The <Link href="/plugins/loc_history" style={styles.link}>loc_history</Link> plugin
            remembers your cursor position between sessions, so when you reopen a file
            you're right where you left off.
          </Text>
        </FAQItem>

        <FAQItem question="Can I bookmark lines?">
          <Text style={styles.body}>
            Install the <Link href="/plugins/bookmarks" style={styles.link}>bookmarks</Link> plugin
            to mark lines with visual indicators. You can jump between bookmarks and search
            them across all open buffers.
          </Text>
        </FAQItem>
      </FAQSection>

      <FAQSection title="Customization" color={Colors.link} search={search}>
        <FAQItem question="How do I get syntax highlighting?">
          <Text style={styles.body}>
            You need two plugins per language — the language definition and the syntax
            highlighter. For example, for C:
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>{'\u2022'} <Text style={styles.code}>lang/c</Text> — language definition</Text>
            <Text style={styles.listItem}>{'\u2022'} <Text style={styles.code}>lang/syntax/c</Text> — syntax highlighting</Text>
          </View>
          <Text style={styles.body}>
            Install both via YPM or add them to your{' '}
            <Text style={styles.code}>ypm_list</Text>. Browse all available languages on
            the <Link href={{ pathname: '/plugins', params: { category: 'language' } }} style={styles.link}>Plugins</Link> page.
          </Text>
        </FAQItem>

        <FAQItem question="Can I change yed's colors?">
          <Text style={styles.body}>
            Yes! Styles are provided by plugins. The quickest way to get started:
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>1. Add <Text style={styles.code}>style_pack</Text> to your ypm_list for a collection of themes</Text>
            <Text style={styles.listItem}>2. Add <Text style={styles.code}>style_picker</Text> to browse and preview them interactively</Text>
            <Text style={styles.listItem}>3. Set your favorite in your yedrc with <Text style={styles.code}>style "name"</Text></Text>
          </View>
          <Text style={styles.body}>
            Browse all themes on the{' '}
            <Link href={{ pathname: '/plugins', params: { category: 'style' } }} style={styles.link}>Styles</Link> page.
          </Text>
        </FAQItem>

        <FAQItem question="How do I get line numbers?">
          <Text style={styles.body}>
            Add <Text style={styles.code}>line_numbers</Text> to your{' '}
            <Text style={styles.code}>ypm_list</Text>, or install it from within yed:
          </Text>
          <CodeBlock context="yed">{'ypm-install line_numbers'}</CodeBlock>
        </FAQItem>

        <FAQItem question="Can I use yed like vim?">
          <Text style={styles.body}>
            Yes! Install the <Text style={styles.code}>vimish</Text> plugin for vim-style modal
            editing with normal, insert, and visual modes.
          </Text>
          <Text style={styles.body}>
            There are also alternative editor style plugins:
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>{'\u2022'} <Text style={styles.code}>xul</Text> — inspired by vim and kakoune</Text>
            <Text style={styles.listItem}>{'\u2022'} <Text style={styles.code}>drill</Text> — kakoune-style</Text>
          </View>
          <Text style={styles.bodyMuted}>
            Browse them on the{' '}
            <Link href={{ pathname: '/plugins', params: { category: 'editor-styles' } }} style={styles.link}>Editor Styles</Link> page.
          </Text>
        </FAQItem>

        <FAQItem question="How do I enable truecolor?">
          <Text style={styles.body}>
            Add this to your yedrc <Text style={{ fontStyle: 'italic' }}>before</Text> loading
            any style plugins:
          </Text>
          <CodeBlock context="yed">{"set truecolor \"yes\""}</CodeBlock>
          <Text style={styles.bodyMuted}>
            Your terminal must support 24-bit color for this to work.
          </Text>
        </FAQItem>

        <FAQItem question="What's the difference between init.so and yedrc?">
          <Text style={styles.body}>
            <Text style={styles.code}>init.so</Text> is a compiled C plugin that runs at startup.
            Use it for dynamic configuration logic like conditional variables or custom frame rules.
          </Text>
          <Text style={styles.body}>
            <Text style={styles.code}>yedrc</Text> is a plain text file of yed commands — simpler
            and doesn't need recompiling. Most users put day-to-day config here: keybindings,
            variables, style selection.
          </Text>
          <Text style={styles.bodyMuted}>
            You only need to touch init.c for advanced behavior. The default one generated
            on first run handles loading ypm and your yedrc automatically.
          </Text>
        </FAQItem>

        <FAQItem question="Can I save and restore my frame layout?">
          <Text style={styles.body}>
            Install the <Text style={styles.code}>save_layout</Text> plugin to save your
            current split configuration and restore it later — useful for complex
            multi-pane setups.
          </Text>
        </FAQItem>

        <FAQItem question="Can yed show git info in the status line?">
          <Text style={styles.body}>
            The <Link href="/plugins/git_variables" style={styles.link}>git_variables</Link> plugin exposes your current
            branch, status, and other git properties as yed variables. You can use these in
            your status line configuration to show git info while you work.
          </Text>
        </FAQItem>

        <FAQItem question="How do I get auto-completion?">
          <Text style={styles.body}>
            Install the <Link href="/plugins/completer" style={styles.link}>completer</Link> plugin.
            It pulls completions from multiple sources — words in open buffers, ctags, and LSP.
            Enable automatic suggestions with:
          </Text>
          <CodeBlock context="yed">{'set completer-auto "yes"'}</CodeBlock>
        </FAQItem>
      </FAQSection>

      <FAQSection title="Plugins & LSP" color="#d0a0d0" search={search}>
        <FAQItem question="How do I install plugins?">
          <Text style={styles.body}>
            The easiest way is to add plugin names to your{' '}
            <Text style={styles.code}>~/.config/yed/ypm_list</Text> file and run{' '}
            <Text style={styles.code}>ypm-update</Text>. You can also:
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>{'\u2022'} Use <Text style={styles.code}>ypm-menu</Text> to browse and install interactively</Text>
            <Text style={styles.listItem}>{'\u2022'} Use <Text style={styles.code}>ypm-install &lt;name&gt;</Text> to install by name</Text>
          </View>
          <Text style={styles.bodyMuted}>
            See the <Link href="/ypm" style={styles.link}>YPM Guide</Link> for more details.
          </Text>
        </FAQItem>

        <FAQItem question="Does yed support LSP?">
          <Text style={styles.body}>
            Yes! You need the <Text style={styles.code}>lsp</Text> plugin as the core client,
            plus feature plugins for what you want:
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>{'\u2022'} <Text style={styles.code}>lsp_diagnostics</Text> — inline errors and warnings</Text>
            <Text style={styles.listItem}>{'\u2022'} <Text style={styles.code}>lsp_info_popup</Text> — hover info</Text>
            <Text style={styles.listItem}>{'\u2022'} <Text style={styles.code}>lsp_symbol_buffer</Text> — symbol search</Text>
            <Text style={styles.listItem}>{'\u2022'} <Text style={styles.code}>completer</Text> — completion (works with LSP)</Text>
          </View>
          <Text style={styles.bodyMuted}>
            See the <Link href="/lsp-setup" style={styles.link}>LSP Setup</Link> page for
            full instructions including language server configuration.
          </Text>
        </FAQItem>

        <FAQItem question="How do I move my config to a new machine?">
          <Text style={styles.body}>
            Copy these files to <Text style={styles.code}>~/.config/yed</Text> on the new machine:
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>{'\u2022'} <Text style={styles.code}>yedrc</Text> — your settings and keybindings</Text>
            <Text style={styles.listItem}>{'\u2022'} <Text style={styles.code}>ypm_list</Text> — your plugin list</Text>
          </View>
          <Text style={styles.body}>
            Then open yed — it will recompile <Text style={styles.code}>init.so</Text> and
            install your plugins automatically.
          </Text>
          <Text style={styles.bodyMuted}>
            Keep both files in version control for easy syncing.
          </Text>
        </FAQItem>

        <FAQItem question="How do I jump to a symbol's definition?">
          <Text style={styles.body}>
            There are two approaches:
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>{'\u2022'} <Text style={styles.code}>ctags</Text> — generates a tag file from your code and lets you jump to definitions. Fast and works without a language server.</Text>
            <Text style={styles.listItem}>{'\u2022'} <Text style={styles.code}>lsp_symbol_buffer</Text> — uses your language server to find definitions, declarations, and references interactively.</Text>
          </View>
          <Text style={styles.bodyMuted}>
            Both work well with <Text style={styles.code}>jump_stack</Text> so you can
            pop back to where you were.
          </Text>
        </FAQItem>

        <FAQItem question="How do I browse files in my project?">
          <Text style={styles.body}>
            The <Link href="/plugins/find_file" style={styles.link}>find_file</Link> plugin
            gives you a fuzzy file finder — type part of a filename and it narrows down matches
            instantly. The <Link href="/plugins/tree_view" style={styles.link}>tree_view</Link> plugin
            shows a sidebar with your project's directory structure.
          </Text>
        </FAQItem>

        <FAQItem question="How do I write my own plugin?">
          <Text style={styles.body}>
            Plugins are shared objects written in C. The{' '}
            <Link href="/dev-manual" style={styles.link}>Developer Manual</Link> covers
            everything: the plugin API, events, commands, and a working example to get started.
          </Text>
        </FAQItem>
      </FAQSection>

      <FAQSection title="Help" color={Colors.subtleText} search={search}>
        <FAQItem question="Where can I get help?">
          <Text style={styles.body}>
            Join the yed community on{' '}
            <Text style={styles.link} onPress={() => Linking.openURL('https://discord.gg/cx3JFJ2gNU')}>Discord</Text> — users
            and developers are happy to help.
          </Text>
          <Text style={styles.body}>
            You can also check:
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>{'\u2022'} <Link href="/user-guide" style={styles.link}>User Guide</Link> — covers all the basics</Text>
            <Text style={styles.listItem}>{'\u2022'} <Link href="/reference/commands" style={styles.link}>Reference</Link> — complete command and variable docs</Text>
            <Text style={styles.listItem}>{'\u2022'} <Link href="/plugins" style={styles.link}>Plugins</Link> — browse all 153 plugins</Text>
          </View>
        </FAQItem>
      </FAQSection>

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
            <Text style={styles.nextCardDesc}>Browse 153 plugins</Text>
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
  h2: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xl,
    color: Colors.heading,
    marginBottom: 16,
  },
  body: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
    marginBottom: 8,
  },
  bodyMuted: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.subtleText,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal,
    marginTop: 4,
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
    marginBottom: 8,
  },
  listItem: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
    marginBottom: 4,
    paddingLeft: 8,
  },
  searchWrap: {
    marginBottom: 20,
  },
  discordBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1e2e',
    borderWidth: 1,
    borderColor: '#5865F240',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  discordTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: '#5865F2',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  discordSub: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.subtleText,
  },
  searchInput: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    borderLeftWidth: 3,
    paddingLeft: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.lg,
    fontWeight: 'bold',
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
