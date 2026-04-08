import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

interface EventInfo {
  name: string;
  description: string;
}

interface EventGroup {
  label: string;
  events: EventInfo[];
}

const GROUPS: EventGroup[] = [
  {
    label: 'Buffer',
    events: [
      { name: 'EVENT_BUFFER_CREATED', description: 'A new buffer was created.' },
      { name: 'EVENT_BUFFER_PRE_LOAD', description: 'Before a buffer is loaded from disk.' },
      { name: 'EVENT_BUFFER_POST_LOAD', description: 'After a buffer is loaded from disk.' },
      { name: 'EVENT_BUFFER_PRE_WRITE', description: 'Before a buffer is written to disk.' },
      { name: 'EVENT_BUFFER_POST_WRITE', description: 'After a buffer is written to disk.' },
      { name: 'EVENT_BUFFER_PRE_MOD', description: 'Before buffer content is modified.' },
      { name: 'EVENT_BUFFER_POST_MOD', description: 'After buffer content is modified.' },
      { name: 'EVENT_BUFFER_PRE_INSERT', description: 'Before a character is inserted.' },
      { name: 'EVENT_BUFFER_POST_INSERT', description: 'After a character is inserted.' },
      { name: 'EVENT_BUFFER_PRE_DELETE', description: 'Before a forward delete.' },
      { name: 'EVENT_BUFFER_POST_DELETE', description: 'After a forward delete.' },
      { name: 'EVENT_BUFFER_PRE_DELETE_BACK', description: 'Before a backspace delete.' },
      { name: 'EVENT_BUFFER_POST_DELETE_BACK', description: 'After a backspace delete.' },
      { name: 'EVENT_BUFFER_PRE_FOCUS', description: 'Before a buffer gains focus.' },
      { name: 'EVENT_BUFFER_FOCUSED', description: 'After a buffer gains focus.' },
      { name: 'EVENT_BUFFER_PRE_SET_FT', description: 'Before a buffer\'s filetype is set.' },
      { name: 'EVENT_BUFFER_POST_SET_FT', description: 'After a buffer\'s filetype is set.' },
    ],
  },
  {
    label: 'Cursor',
    events: [
      { name: 'EVENT_CURSOR_PRE_MOVE', description: 'Before the cursor moves.' },
      { name: 'EVENT_CURSOR_POST_MOVE', description: 'After the cursor moves.' },
    ],
  },
  {
    label: 'Frame',
    events: [
      { name: 'EVENT_FRAME_PRE_ACTIVATE', description: 'Before a frame is activated.' },
      { name: 'EVENT_FRAME_ACTIVATED', description: 'After a frame is activated.' },
      { name: 'EVENT_FRAME_PRE_DELETE', description: 'Before a frame is deleted.' },
      { name: 'EVENT_FRAME_POST_DELETE', description: 'After a frame is deleted.' },
      { name: 'EVENT_FRAME_PRE_SET_BUFFER', description: 'Before a frame\'s buffer is set.' },
      { name: 'EVENT_FRAME_POST_SET_BUFFER', description: 'After a frame\'s buffer is set.' },
      { name: 'EVENT_FRAME_PRE_RESIZE', description: 'Before a frame is resized.' },
      { name: 'EVENT_FRAME_POST_RESIZE', description: 'After a frame is resized.' },
      { name: 'EVENT_FRAME_PRE_MOVE', description: 'Before a frame is moved.' },
      { name: 'EVENT_FRAME_POST_MOVE', description: 'After a frame is moved.' },
      { name: 'EVENT_FRAME_PRE_SCROLL', description: 'Before a frame scrolls.' },
      { name: 'EVENT_FRAME_POST_SCROLL', description: 'After a frame scrolls.' },
      { name: 'EVENT_FRAME_PRE_UPDATE', description: 'Before a frame is updated/redrawn.' },
      { name: 'EVENT_FRAME_POST_UPDATE', description: 'After a frame is updated/redrawn.' },
      { name: 'EVENT_FRAME_PRE_BUFF_DRAW', description: 'Before a frame\'s buffer content is drawn.' },
    ],
  },
  {
    label: 'Drawing',
    events: [
      { name: 'EVENT_LINE_PRE_DRAW', description: 'Before a line is drawn. Used for syntax highlighting.' },
      { name: 'EVENT_ROW_PRE_CLEAR', description: 'Before a screen row is cleared.' },
      { name: 'EVENT_PRE_DRAW_EVERYTHING', description: 'Before the full screen redraw.' },
      { name: 'EVENT_POST_DRAW_EVERYTHING', description: 'After the full screen redraw.' },
      { name: 'EVENT_PRE_DIRECT_DRAWS', description: 'Before direct draw operations.' },
      { name: 'EVENT_POST_DIRECT_DRAWS', description: 'After direct draw operations.' },
      { name: 'EVENT_STATUS_LINE_PRE_UPDATE', description: 'Before the status line is updated.' },
      { name: 'EVENT_HIGHLIGHT_REQUEST', description: 'Request highlighting for arbitrary strings (not just buffer lines).' },
    ],
  },
  {
    label: 'Keys',
    events: [
      { name: 'EVENT_KEY_PRESSED', description: 'A key was pressed.' },
      { name: 'EVENT_KEY_PRE_BIND', description: 'Before a key binding is created.' },
      { name: 'EVENT_KEY_POST_BIND', description: 'After a key binding is created.' },
      { name: 'EVENT_KEY_PRE_UNBIND', description: 'Before a key binding is removed.' },
      { name: 'EVENT_KEY_POST_UNBIND', description: 'After a key binding is removed.' },
    ],
  },
  {
    label: 'Commands',
    events: [
      { name: 'EVENT_CMD_PRE_RUN', description: 'Before a command is executed.' },
      { name: 'EVENT_CMD_POST_RUN', description: 'After a command is executed.' },
    ],
  },
  {
    label: 'Plugins',
    events: [
      { name: 'EVENT_PLUGIN_PRE_LOAD', description: 'Before a plugin is loaded.' },
      { name: 'EVENT_PLUGIN_POST_LOAD', description: 'After a plugin is loaded. Useful for deferred initialization.' },
      { name: 'EVENT_PLUGIN_PRE_UNLOAD', description: 'Before a plugin is unloaded.' },
      { name: 'EVENT_PLUGIN_POST_UNLOAD', description: 'After a plugin is unloaded.' },
      { name: 'EVENT_PLUGIN_MESSAGE', description: 'Inter-plugin communication. Used by LSP and other plugin systems.' },
    ],
  },
  {
    label: 'Variables',
    events: [
      { name: 'EVENT_VAR_PRE_SET', description: 'Before a variable is set.' },
      { name: 'EVENT_VAR_POST_SET', description: 'After a variable is set.' },
      { name: 'EVENT_VAR_PRE_UNSET', description: 'Before a variable is unset.' },
      { name: 'EVENT_VAR_POST_UNSET', description: 'After a variable is unset.' },
    ],
  },
  {
    label: 'System',
    events: [
      { name: 'EVENT_STYLE_CHANGE', description: 'The active style has changed.' },
      { name: 'EVENT_TERMINAL_RESIZED', description: 'The terminal was resized.' },
      { name: 'EVENT_SIGNAL_RECEIVED', description: 'A signal was received by the process.' },
      { name: 'EVENT_PRE_PUMP', description: 'Before the main event loop pump.' },
      { name: 'EVENT_POST_PUMP', description: 'After the main event loop pump.' },
      { name: 'EVENT_PRE_QUIT', description: 'Before the editor quits.' },
    ],
  },
];

const ALL_EVENTS = GROUPS.flatMap((g) => g.events);

export default function EventsReference() {
  const [search, setSearch] = useState('');
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return GROUPS
      .filter((g) => !activeGroup || g.label === activeGroup)
      .map((g) => ({
        ...g,
        events: g.events.filter(
          (e) =>
            !search ||
            e.name.toLowerCase().includes(q) ||
            e.description.toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.events.length > 0);
  }, [search, activeGroup]);

  const totalShown = filtered.reduce((sum, g) => sum + g.events.length, 0);

  return (
    <View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search events..."
        placeholderTextColor={Colors.subtleText}
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.categoryTabs}>
        <Pressable
          onPress={() => setActiveGroup(null)}
          style={!activeGroup ? styles.catActive : styles.cat}
        >
          <Text style={!activeGroup ? styles.catTextActive : styles.catText}>
            All ({ALL_EVENTS.length})
          </Text>
        </Pressable>
        {GROUPS.map((g) => (
          <Pressable
            key={g.label}
            onPress={() => setActiveGroup(activeGroup === g.label ? null : g.label)}
            style={activeGroup === g.label ? styles.catActive : styles.cat}
          >
            <Text style={activeGroup === g.label ? styles.catTextActive : styles.catText}>
              {g.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.resultCount}>{totalShown} events</Text>

      {filtered.map((group) => (
        <View key={group.label} style={styles.group}>
          <Text style={styles.groupLabel}>{group.label}</Text>
          <View style={styles.table}>
            {group.events.map((evt, i) => (
              <View key={evt.name} style={[styles.row, i % 2 === 0 && styles.rowAlt]}>
                <Text style={styles.evtCell}>{evt.name}</Text>
                <Text style={styles.descCell}>{evt.description}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}

      {totalShown === 0 && (
        <Text style={styles.empty}>No events match your search.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    backgroundColor: Colors.codeBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  categoryTabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  cat: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 3,
    marginRight: 4,
    marginBottom: 4,
  },
  catActive: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 3,
    marginRight: 4,
    marginBottom: 4,
    backgroundColor: Colors.heading,
  },
  catText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.subtleText,
  },
  catTextActive: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.contentBg,
    fontWeight: 'bold',
  },
  resultCount: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.subtleText,
    marginBottom: 16,
  },
  group: {
    marginBottom: 20,
  },
  groupLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.heading,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  table: {
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 6,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  rowAlt: {
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  evtCell: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.link,
    flex: 1,
    minWidth: 250,
  },
  descCell: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    flex: 2,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal,
  },
  empty: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.md,
    color: Colors.subtleText,
    textAlign: 'center',
    marginTop: 40,
  },
});
