import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform, Image } from 'react-native';
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

function Section({ number, title, id, children }: { number: number; title: string; id: string; children: React.ReactNode }) {
  return (
    <View style={styles.section} nativeID={id}>
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

function scrollToId(id: string) {
  if (Platform.OS === 'web') {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

const TOC = [
  { id: 'sec-1', title: 'Plugin Basics' },
  { id: 'sec-2', title: 'Commands' },
  { id: 'sec-3', title: 'Event System' },
  { id: 'sec-4', title: 'Buffers & Content' },
  { id: 'sec-5', title: 'Variables' },
  { id: 'sec-6', title: 'Frames & UI' },
  { id: 'sec-7', title: 'Undo / Redo' },
  { id: 'sec-8', title: 'Building Plugins' },
  { id: 'sec-9', title: 'Example: A Simple Plugin' },
  { id: 'sec-10', title: 'Creating a Style' },
];

export default function DevManual() {
  return (
    <View>
      <SEO title="Developer Manual" description="How to write plugins for yed — the C plugin API, events, commands, and more." />
      <Text style={styles.h1}>Developer Manual</Text>
      <Text style={styles.intro}>
        This guide covers how to write plugins for yed. Plugins are shared objects (.so files)
        generally written in C that extend the editor with commands, event handlers, and custom behavior.
      </Text>

      {/* TOC */}
      <View style={styles.toc}>
        <Text style={styles.tocTitle}>Contents</Text>
        {TOC.map((item, i) => (
          <Pressable key={item.id} onPress={() => scrollToId(item.id)}>
            <Text style={styles.tocItem}>{i + 1}. {item.title}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.divider} />

      {/* 1. Plugin Basics */}
      <Section number={1} title="Plugin Basics" id="sec-1">
        <Text style={styles.body}>
          Every plugin must implement a boot function. This is the entry point called when the
          plugin is loaded:
        </Text>
        <CodeBlock lang="c" reserveSlug>{`#include <yed/plugin.h>

int yed_plugin_boot(yed_plugin *self) {
    YED_PLUG_VERSION_CHECK();

    // Register commands, event handlers, variables here

    return 0; // 0 = success
}`}</CodeBlock>

        <SubSection title="Global State">
          <Text style={styles.body}>
            Access the editor state through the global <Text style={styles.code}>ys</Text> pointer:
          </Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableCmd}>ys-&gt;active_frame</Text>
              <Text style={styles.tableDesc}>The currently active frame</Text>
            </View>
            <View style={[styles.tableRow, styles.tableRowAlt]}>
              <Text style={styles.tableCmd}>ys-&gt;buffers</Text>
              <Text style={styles.tableDesc}>All open buffers</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCmd}>ys-&gt;vars</Text>
              <Text style={styles.tableDesc}>User variables</Text>
            </View>
            <View style={[styles.tableRow, styles.tableRowAlt]}>
              <Text style={styles.tableCmd}>ys-&gt;commands</Text>
              <Text style={styles.tableDesc}>Registered commands</Text>
            </View>
          </View>
        </SubSection>

        <SubSection title="Plugin Cleanup">
          <Text style={styles.body}>
            Register an unload function for cleanup when the plugin is unloaded:
          </Text>
          <CodeBlock lang="c" reserveSlug>{`void my_unload(yed_plugin *self) {
    // Free resources, remove state
}

// In yed_plugin_boot:
yed_plugin_set_unload_fn(self, my_unload);`}</CodeBlock>
        </SubSection>
      </Section>

      {/* 2. Commands */}
      <Section number={2} title="Commands" id="sec-2">
        <Text style={styles.body}>
          Commands are the primary way users interact with plugin functionality. Register them
          during boot:
        </Text>
        <CodeBlock lang="c" reserveSlug>{`void my_command(int n_args, char **args) {
    if (n_args < 1) {
        yed_cerr("expected an argument");
        return;
    }
    // Do something with args[0]
}

// In yed_plugin_boot:
yed_plugin_set_command(self, "my-command", my_command);`}</CodeBlock>

        <SubSection title="Executing Commands">
          <Text style={styles.body}>
            Run any command from within a plugin using the <Text style={styles.code}>YEXE</Text> macro:
          </Text>
          <CodeBlock lang="c" reserveSlug>{`YEXE("style", "gruvbox");
YEXE("buffer", "my_file.c");
YEXE("cursor-down");`}</CodeBlock>
        </SubSection>
      </Section>

      {/* 3. Event System */}
      <Section number={3} title="Event System" id="sec-3">
        <Text style={styles.body}>
          Plugins react to editor events by registering handlers. The event system supports 70+
          event types covering buffer modifications, cursor movement, rendering, and more.
        </Text>
        <CodeBlock lang="c" reserveSlug>{`void my_handler(yed_event *event) {
    // React to the event
    // Access context: event->buffer, event->frame,
    //                 event->row, event->col, etc.
}

// In yed_plugin_boot:
yed_event_handler h;
h.kind = EVENT_BUFFER_PRE_WRITE;
h.fn   = my_handler;
yed_plugin_add_event_handler(self, h);`}</CodeBlock>

        <SubSection title="Common Events">
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableCmd}>EVENT_BUFFER_PRE_WRITE</Text>
              <Text style={styles.tableDesc}>Before a buffer is saved to disk</Text>
            </View>
            <View style={[styles.tableRow, styles.tableRowAlt]}>
              <Text style={styles.tableCmd}>EVENT_BUFFER_POST_MOD</Text>
              <Text style={styles.tableDesc}>After buffer content is modified</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCmd}>EVENT_BUFFER_POST_LOAD</Text>
              <Text style={styles.tableDesc}>After a buffer is loaded from disk</Text>
            </View>
            <View style={[styles.tableRow, styles.tableRowAlt]}>
              <Text style={styles.tableCmd}>EVENT_LINE_PRE_DRAW</Text>
              <Text style={styles.tableDesc}>Before a line is drawn (for syntax highlighting)</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCmd}>EVENT_KEY_PRESSED</Text>
              <Text style={styles.tableDesc}>A key was pressed</Text>
            </View>
            <View style={[styles.tableRow, styles.tableRowAlt]}>
              <Text style={styles.tableCmd}>EVENT_CURSOR_POST_MOVE</Text>
              <Text style={styles.tableDesc}>After the cursor moves</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCmd}>EVENT_VAR_POST_SET</Text>
              <Text style={styles.tableDesc}>After a variable is set</Text>
            </View>
            <View style={[styles.tableRow, styles.tableRowAlt]}>
              <Text style={styles.tableCmd}>EVENT_STYLE_CHANGE</Text>
              <Text style={styles.tableDesc}>When the active style changes</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCmd}>EVENT_PLUGIN_POST_LOAD</Text>
              <Text style={styles.tableDesc}>After a plugin is loaded (for deferred init)</Text>
            </View>
          </View>
        </SubSection>
        <Callout type="tip">
          See the <Link href="/reference/events" style={styles.link}>Events Reference</Link> for
          the full list of 70+ event types.
        </Callout>
      </Section>

      {/* 4. Buffers & Content */}
      <Section number={4} title="Buffers & Content" id="sec-4">
        <Text style={styles.body}>
          Manipulate buffer contents programmatically:
        </Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCmd}>yed_create_buffer(name)</Text>
            <Text style={styles.tableDesc}>Create a new buffer</Text>
          </View>
          <View style={[styles.tableRow, styles.tableRowAlt]}>
            <Text style={styles.tableCmd}>yed_buff_get_line(buf, row)</Text>
            <Text style={styles.tableDesc}>Get a line from a buffer</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCmd}>yed_buff_insert_string(buf, str, row, col)</Text>
            <Text style={styles.tableDesc}>Insert a string at a position</Text>
          </View>
          <View style={[styles.tableRow, styles.tableRowAlt]}>
            <Text style={styles.tableCmd}>yed_buff_n_lines(buf)</Text>
            <Text style={styles.tableDesc}>Get the number of lines</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCmd}>yed_append_to_line(buf, row, glyph)</Text>
            <Text style={styles.tableDesc}>Append a glyph to a line</Text>
          </View>
          <View style={[styles.tableRow, styles.tableRowAlt]}>
            <Text style={styles.tableCmd}>yed_pop_from_line(buf, row)</Text>
            <Text style={styles.tableDesc}>Remove last glyph from a line</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCmd}>yed_line_col_to_glyph(line, col)</Text>
            <Text style={styles.tableDesc}>Get the glyph at a position</Text>
          </View>
        </View>

        <SubSection title="Special Buffers">
          <Text style={styles.body}>
            Create special buffers (prefixed with <Text style={styles.code}>*</Text>) for plugin UI:
          </Text>
          <CodeBlock lang="c" reserveSlug>{`yed_buffer *buf = yed_create_buffer("*my-plugin-output");
buf->flags |= BUFF_RD_ONLY | BUFF_SPECIAL;`}</CodeBlock>
        </SubSection>
      </Section>

      {/* 5. Variables */}
      <Section number={5} title="Variables" id="sec-5">
        <Text style={styles.body}>
          Use variables for plugin configuration:
        </Text>
        <CodeBlock lang="c" reserveSlug>{`// Set a default (only if not already set by user)
if (!yed_get_var("my-plugin-option")) {
    yed_set_var("my-plugin-option", "default-value");
}

// Read a variable
char *val = yed_get_var("my-plugin-option");`}</CodeBlock>
        <Callout type="note">
          Always check for NULL when reading variables — they may not be set.
        </Callout>
      </Section>

      {/* 6. Frames & UI */}
      <Section number={6} title="Frames & UI" id="sec-6">
        <Text style={styles.body}>
          Access frame information for cursor position and buffer context:
        </Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCmd}>ys-&gt;active_frame</Text>
            <Text style={styles.tableDesc}>Current frame pointer</Text>
          </View>
          <View style={[styles.tableRow, styles.tableRowAlt]}>
            <Text style={styles.tableCmd}>frame-&gt;cursor_line</Text>
            <Text style={styles.tableDesc}>Cursor line number</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCmd}>frame-&gt;cursor_col</Text>
            <Text style={styles.tableDesc}>Cursor column number</Text>
          </View>
          <View style={[styles.tableRow, styles.tableRowAlt]}>
            <Text style={styles.tableCmd}>frame-&gt;buffer</Text>
            <Text style={styles.tableDesc}>The buffer displayed in this frame</Text>
          </View>
        </View>
      </Section>

      {/* 7. Undo/Redo */}
      <Section number={7} title="Undo / Redo" id="sec-7">
        <Text style={styles.body}>
          Wrap buffer modifications in undo records so users can undo your plugin's changes:
        </Text>
        <CodeBlock lang="c" reserveSlug>{`yed_start_undo_record(frame, buffer);

// Make your buffer modifications here

yed_end_undo_record(frame, buffer);`}</CodeBlock>
        <Text style={styles.body}>
          Use <Text style={styles.code}>yed_merge_undo_records(buffer)</Text> to merge with the
          previous record if the changes should be a single undo step.
        </Text>
      </Section>

      {/* 8. Building Plugins */}
      <Section number={8} title="Building Plugins" id="sec-8">
        <Text style={styles.body}>
          Create a <Text style={styles.code}>build.sh</Text> script for your plugin:
        </Text>
        <CodeBlock lang="bash" reserveSlug>{`#!/usr/bin/env bash
gcc -o my_plugin.so my_plugin.c \\
    $(yed --print-cflags) \\
    $(yed --print-ldflags)`}</CodeBlock>
        <Text style={styles.body}>
          The <Text style={styles.code}>yed</Text> command provides the correct compiler and
          linker flags dynamically. For C++ plugins, use <Text style={styles.code}>g++</Text> instead.
        </Text>
        <Callout type="tip">
          Plugins are loaded from directories listed by{' '}
          <Text style={styles.code}>plugins-list-dirs</Text>. The default location is{' '}
          <Text style={styles.code}>~/.config/yed/plugins/</Text>.
        </Callout>
      </Section>

      {/* 9. Example */}
      <Section number={9} title="Example: A Simple Plugin" id="sec-9">
        <Text style={styles.body}>
          Here's a complete plugin that adds a command to count the lines in the current buffer:
        </Text>
        <CodeBlock lang="c" reserveSlug>{`#include <yed/plugin.h>

void count_lines(int n_args, char **args) {
    yed_frame *frame = ys->active_frame;

    if (!frame || !frame->buffer) {
        yed_cerr("no active buffer");
        return;
    }

    int n = yed_buff_n_lines(frame->buffer);
    char msg[64];
    snprintf(msg, sizeof(msg), "%d lines", n);
    yed_cprint("%s", msg);
}

int yed_plugin_boot(yed_plugin *self) {
    YED_PLUG_VERSION_CHECK();
    yed_plugin_set_command(self, "count-lines", count_lines);
    return 0;
}`}</CodeBlock>
        <Text style={styles.body}>
          Build it, drop the <Text style={styles.code}>.so</Text> in your plugins directory, and
          run <Text style={styles.code}>plugin-load count_lines</Text>.
        </Text>
        <View style={styles.heroContainer}>
          <View style={styles.heroFrame}>
            <Image
              source={require('../assets/images/count_lines.png')}
              style={styles.heroImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.heroCaption}>
            The command line shows "(count-lines) 21 lines" after running the count-lines command.
          </Text>
        </View>
      </Section>

      {/* 10. Creating a Style */}
      <Section number={10} title="Creating a Style" id="sec-10">
        <Text style={styles.body}>
          Styles are plugins that define color themes. They use the{' '}
          <Text style={styles.code}>PACKABLE_STYLE</Text> macro and set attributes on all{' '}
          <Link href="/reference/style-components" style={styles.link}>style components</Link>.
          {' '}For a simpler approach, the{' '}
          <Link href="/plugins/fstyle" style={styles.link}>fstyle</Link>
          {' '}plugin lets you create styles in a plaintext format — a good way to experiment with
          color palettes before committing to a full style plugin.
        </Text>

        <SubSection title="Basic Structure">
          <Text style={styles.body}>
            A style plugin defines colors for truecolor (RGB) with optional 256-color fallbacks:
          </Text>
          <CodeBlock lang="c" reserveSlug>{`#include <yed/plugin.h>

#define ALT(rgb, _256) (tc ? (rgb) : (_256))

#define bg_color     (ALT(RGB_32_hex(1d2021), 234))
#define fg_color     (ALT(RGB_32_hex(d5c4a1), 250))
#define accent       (ALT(RGB_32_hex(fb4934), 167))
#define string_color (ALT(RGB_32_hex(b8bb26), 142))
#define comment_color (ALT(RGB_32_hex(665c54), 241))

PACKABLE_STYLE(my_theme) {
    yed_style s;
    int       tc, attr_kind;

    YED_PLUG_VERSION_CHECK();

    tc        = !!yed_get_var("truecolor");
    attr_kind = tc ? ATTR_KIND_RGB : ATTR_KIND_256;

    memset(&s, 0, sizeof(s));

    /* Frame colors */
    s.active.flags   = ATTR_FG_KIND_BITS(attr_kind)
                     | ATTR_BG_KIND_BITS(attr_kind);
    s.active.fg      = fg_color;
    s.active.bg      = bg_color;
    s.inactive       = s.active;

    /* Borders */
    s.active_border    = s.active;
    s.active_border.fg = accent;
    s.inactive_border  = s.inactive;

    /* Cursor line */
    s.cursor_line.flags = ATTR_FG_KIND_BITS(attr_kind)
                        | ATTR_BG_KIND_BITS(attr_kind);
    s.cursor_line.fg    = fg_color;
    s.cursor_line.bg    = ALT(RGB_32_hex(282828), 235);

    /* Search */
    s.search.flags = ATTR_FG_KIND_BITS(attr_kind)
                   | ATTR_BG_KIND_BITS(attr_kind)
                   | ATTR_BOLD;
    s.search.fg    = bg_color;
    s.search.bg    = accent;

    /* Selection */
    s.selection.flags = ATTR_FG_KIND_BITS(attr_kind)
                      | ATTR_BG_KIND_BITS(attr_kind);
    s.selection.fg    = fg_color;
    s.selection.bg    = ALT(RGB_32_hex(504945), 239);

    /* UI elements */
    s.status_line.flags = ATTR_FG_KIND_BITS(attr_kind)
                        | ATTR_BG_KIND_BITS(attr_kind)
                        | ATTR_BOLD;
    s.status_line.fg    = fg_color;
    s.status_line.bg    = comment_color;
    s.command_line      = s.active;

    /* Code highlighting */
    s.code_comment.flags = ATTR_FG_KIND_BITS(attr_kind);
    s.code_comment.fg    = comment_color;

    s.code_keyword.flags = ATTR_FG_KIND_BITS(attr_kind)
                         | ATTR_BOLD;
    s.code_keyword.fg    = accent;

    s.code_string.flags  = ATTR_FG_KIND_BITS(attr_kind);
    s.code_string.fg     = string_color;

    s.code_number.flags  = ATTR_FG_KIND_BITS(attr_kind);
    s.code_number.fg     = ALT(RGB_32_hex(d3869b), 175);

    /* Register the style */
    yed_plugin_set_style(self, "my_theme", &s);

    return 0;
}`}</CodeBlock>
        </SubSection>

        <SubSection title="Key Concepts">
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableCmd}>PACKABLE_STYLE(name)</Text>
              <Text style={styles.tableDesc}>Macro that wraps yed_plugin_boot for style plugins.</Text>
            </View>
            <View style={[styles.tableRow, styles.tableRowAlt]}>
              <Text style={styles.tableCmd}>RGB_32_hex(RRGGBB)</Text>
              <Text style={styles.tableDesc}>Convert a hex color to the internal RGB format.</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCmd}>ATTR_KIND_RGB</Text>
              <Text style={styles.tableDesc}>Use truecolor RGB attributes.</Text>
            </View>
            <View style={[styles.tableRow, styles.tableRowAlt]}>
              <Text style={styles.tableCmd}>ATTR_KIND_256</Text>
              <Text style={styles.tableDesc}>Use 256-color palette attributes.</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCmd}>ATTR_FG_KIND_BITS(kind)</Text>
              <Text style={styles.tableDesc}>Set the foreground color kind in the flags.</Text>
            </View>
            <View style={[styles.tableRow, styles.tableRowAlt]}>
              <Text style={styles.tableCmd}>ATTR_BG_KIND_BITS(kind)</Text>
              <Text style={styles.tableDesc}>Set the background color kind in the flags.</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCmd}>ATTR_BOLD</Text>
              <Text style={styles.tableDesc}>Flag to enable bold text.</Text>
            </View>
            <View style={[styles.tableRow, styles.tableRowAlt]}>
              <Text style={styles.tableCmd}>ATTR_UNDERLINE</Text>
              <Text style={styles.tableDesc}>Flag to enable underlined text.</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCmd}>yed_plugin_set_style(self, name, &s)</Text>
              <Text style={styles.tableDesc}>Register the style with yed.</Text>
            </View>
          </View>
        </SubSection>

        <Callout type="tip">
          Use the <Text style={styles.code}>ALT(rgb, _256)</Text> pattern to provide both
          truecolor and 256-color fallbacks. Check{' '}
          <Text style={styles.code}>yed_get_var("truecolor")</Text> to determine which mode the
          user has enabled. See the{' '}
          <Link href="/reference/style-components" style={styles.link}>Style Components Reference</Link>{' '}
          for all components you should define.
        </Callout>
      </Section>

      {/* Related */}
      <View style={styles.divider} />
      <Text style={styles.h2}>Related</Text>
      <View style={styles.nextSteps}>
        <Link href="/plugins" asChild>
          <Pressable style={styles.nextCard}>
            <Text style={styles.nextCardTitle}>Browse Plugins</Text>
            <Text style={styles.nextCardDesc}>See how existing plugins are built</Text>
          </Pressable>
        </Link>
        <Link href="/reference/commands" asChild>
          <Pressable style={styles.nextCard}>
            <Text style={styles.nextCardTitle}>Command Reference</Text>
            <Text style={styles.nextCardDesc}>All built-in commands</Text>
          </Pressable>
        </Link>
        <Link href="/user-guide" asChild>
          <Pressable style={styles.nextCard}>
            <Text style={styles.nextCardTitle}>User Guide</Text>
            <Text style={styles.nextCardDesc}>Editor fundamentals</Text>
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
  intro: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
    marginBottom: 16,
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
  link: {
    color: Colors.link,
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
  table: {
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tableRowAlt: {
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  tableCmd: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.link,
    flex: 1,
    minWidth: 200,
  },
  tableDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    flex: 2,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal,
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
  heroContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  heroFrame: {
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: Colors.link,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  heroImage: {
    width: 1100,
    height: 581,
    maxWidth: '100%' as any,
  },
  heroCaption: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.subtleText,
    marginTop: 8,
    textAlign: 'center',
  },
});
