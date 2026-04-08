import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

interface Command {
  command: string;
  description: string;
}

interface CommandGroup {
  label: string;
  commands: Command[];
}

const GROUPS: CommandGroup[] = [
  {
    label: 'System',
    commands: [
      { command: 'command-prompt [start-string]', description: 'Open the command prompt with start-string if provided.' },
      { command: 'quit', description: 'Quit yed.' },
      { command: 'reload', description: 'Reload your entire configuration.' },
      { command: 'reload-core', description: 'Reload the editor core.' },
      { command: 'redraw', description: 'Clear the screen and redraw all elements.' },
      { command: 'version', description: 'Print the current version.' },
      { command: 'suspend', description: "Suspend the editor to the parent shell's background job control." },
      { command: 'nop', description: "Doesn't do anything." },
    ],
  },
  {
    label: 'Variables',
    commands: [
      { command: 'set <var> <val>', description: 'Set the variable var to val.' },
      { command: 'get <var>', description: 'Print the value of var.' },
      { command: 'unset <var>', description: 'Unset var.' },
      { command: 'toggle-var <var>', description: 'Toggle between true/false values for var.' },
    ],
  },
  {
    label: 'Shell',
    commands: [
      { command: 'sh <cmd>', description: 'Run a shell command and show its output over the whole screen.' },
      { command: 'sh-silent <cmd>', description: 'Run a shell command without displaying any output.' },
      { command: 'less <cmd>', description: 'Run a shell command and send its output to the less pager.' },
    ],
  },
  {
    label: 'Cursor Movement',
    commands: [
      { command: 'cursor-down', description: 'Move the cursor down 1 line.' },
      { command: 'cursor-up', description: 'Move the cursor up one line.' },
      { command: 'cursor-left', description: 'Move the cursor left one glyph.' },
      { command: 'cursor-right', description: 'Move the cursor right one glyph.' },
      { command: 'cursor-line-begin', description: 'Move the cursor to the beginning of the line.' },
      { command: 'cursor-line-end', description: 'Move the cursor to the end of the line.' },
      { command: 'cursor-prev-word', description: 'Move the cursor to the previous start-of-word.' },
      { command: 'cursor-next-word', description: 'Move the cursor to the next start-of-word.' },
      { command: 'cursor-prev-paragraph', description: 'Move the cursor to the previous start-of-paragraph.' },
      { command: 'cursor-next-paragraph', description: 'Move the cursor to the next start-of-paragraph.' },
      { command: 'cursor-page-up', description: 'Move the cursor up to the previous page.' },
      { command: 'cursor-page-down', description: 'Move the cursor down to the next page.' },
      { command: 'cursor-buffer-begin', description: 'Move the cursor to the beginning of the buffer.' },
      { command: 'cursor-buffer-end', description: 'Move the cursor to the end of the buffer.' },
      { command: 'cursor-line [N]', description: 'Move the cursor to line N.' },
      { command: 'word-under-cursor', description: 'Print the word under the cursor.' },
      { command: 'forward-cursor-word <cmd>', description: 'Run cmd with the word under the cursor as the argument. E.g. forward-cursor-word ctags-find.' },
    ],
  },
  {
    label: 'Buffers',
    commands: [
      { command: 'buffer <name>', description: 'Open buffer in the active frame. If it doesn\'t exist, try to load it from the file system.' },
      { command: 'buffer-hidden <name>', description: 'Same as buffer, but does not open a frame.' },
      { command: 'buffer-delete [name]', description: 'Delete the named buffer, or the active buffer if no name given.' },
      { command: 'buffer-next', description: 'Show the next buffer in the active frame.' },
      { command: 'buffer-prev', description: 'Show the previous buffer in the active frame.' },
      { command: 'buffer-name', description: 'Print the name of the buffer in the active frame.' },
      { command: 'buffer-path', description: 'Print the full path of the buffer in the active frame.' },
      { command: 'buffer-reload [name]', description: "Reload the buffer's contents from disk." },
      { command: 'buffer-set-ft <ft>', description: "Set the active buffer's filetype." },
    ],
  },
  {
    label: 'Frames',
    commands: [
      { command: 'frame-new [top left height width]', description: 'Create a new frame (values 0.0–1.0). Full size if no args.' },
      { command: 'frame-delete', description: 'Delete the active frame.' },
      { command: 'frame-vsplit', description: 'Split the active frame vertically (new frame on right).' },
      { command: 'frame-hsplit', description: 'Split the active frame horizontally (new frame on bottom).' },
      { command: 'frame-next', description: 'Activate the next frame.' },
      { command: 'frame-prev', description: 'Activate the previous frame.' },
      { command: 'frame-tree-next', description: 'Activate the next frame tree (split group).' },
      { command: 'frame-tree-prev', description: 'Activate the previous frame tree (split group).' },
      { command: 'frame-move', description: 'Move the active frame interactively.' },
      { command: 'frame-set-position <top> <left>', description: "Set the frame's position (values 0–1)." },
      { command: 'frame-resize', description: 'Resize the active frame interactively.' },
      { command: 'frame-tree-resize', description: 'Resize the active frame tree interactively.' },
      { command: 'frame-set-size <h> <w>', description: "Set the frame's size (values 0–1)." },
      { command: 'frame-tree-set-size <h> <w>', description: "Set the frame tree's size (values 0–1)." },
      { command: 'frame <name/number>', description: 'Activate the frame with the given name or number.' },
      { command: 'frame-name [name]', description: "Get or set the active frame's name." },
      { command: 'frame-unname', description: "Clear the active frame's name." },
    ],
  },
  {
    label: 'Editing',
    commands: [
      { command: 'insert <keycode>', description: 'Insert glyph for keycode at the cursor.' },
      { command: 'simple-insert-string <string>', description: 'Insert string at the cursor.' },
      { command: 'delete-back', description: 'Delete the glyph behind the cursor.' },
      { command: 'delete-forward', description: 'Delete the glyph at the cursor.' },
      { command: 'delete-line', description: 'Delete the current line.' },
      { command: 'write-buffer [path]', description: 'Write the buffer to disk at the given or original path.' },
      { command: 'undo', description: 'Undo one record.' },
      { command: 'redo', description: 'Redo one record.' },
    ],
  },
  {
    label: 'Selection & Clipboard',
    commands: [
      { command: 'select', description: 'Start selecting text.' },
      { command: 'select-lines', description: 'Start line-wise selection.' },
      { command: 'select-rect', description: 'Start rectangular selection mode.' },
      { command: 'select-off', description: 'Stop selecting text.' },
      { command: 'yank-selection', description: 'Yank selected text to the *yank buffer.' },
      { command: 'paste-yank-buffer', description: 'Paste the *yank buffer at the cursor.' },
    ],
  },
  {
    label: 'Search & Replace',
    commands: [
      { command: 'find-in-buffer [string]', description: 'Search for string. Interactive if no string given.' },
      { command: 'find-next-in-buffer', description: 'Jump to the next match.' },
      { command: 'find-prev-in-buffer', description: 'Jump to the previous match.' },
      { command: 'replace-current-search', description: 'Replace occurrences of the search string. Interactive.' },
    ],
  },
  {
    label: 'Plugins',
    commands: [
      { command: 'plugin-load <name>', description: 'Load plugin called name.' },
      { command: 'plugin-unload <name>', description: 'Unload plugin called name.' },
      { command: 'plugin-toggle <name>', description: 'Toggle a plugin (load if unloaded, unload if loaded).' },
      { command: 'plugin-path <name>', description: 'Print the full path to the loaded plugin.' },
      { command: 'plugins-list', description: 'List all loaded plugins.' },
      { command: 'plugins-list-dirs', description: 'Print plugin search directories (descending priority).' },
      { command: 'plugins-add-dir', description: 'Add a path to plugin search directories (highest priority).' },
    ],
  },
  {
    label: 'Styles',
    commands: [
      { command: 'style [name]', description: 'Activate a style, or print the active style name.' },
      { command: 'style-off', description: 'Deactivate any active style.' },
      { command: 'styles-list', description: 'List all styles.' },
      { command: 'scomps-list', description: 'List all style components.' },
    ],
  },
  {
    label: 'Key Bindings',
    commands: [
      { command: 'bind <keys> <cmd> [args...]', description: 'Bind keys to run a command with optional args.' },
      { command: 'unbind <keys>', description: 'Unbind keys.' },
      { command: 'show-bindings', description: 'Show the *bindings buffer.' },
    ],
  },
  {
    label: 'Other',
    commands: [
      { command: 'echo [strings...]', description: 'Print strings to the log and command line.' },
      { command: 'alias <name> <cmd>', description: 'Create an alias for a command.' },
      { command: 'unalias <name>', description: 'Remove an alias.' },
      { command: 'multi [cmds...]', description: 'Run each command sequentially.' },
      { command: 'repeat <num> <cmd> [args...]', description: 'Repeat a command num times.' },
      { command: 'feed-keys <keys...>', description: 'Send keys to yed.' },
      { command: 'cursor-style <style>', description: 'Set cursor style (block, underline, bar, blinking/steady).' },
      { command: 'show-vars', description: 'Show the *vars buffer.' },
      { command: 'log', description: 'Show the *log buffer.' },
      { command: 'special-buffer-prepare-focus', description: 'Create/activate a frame for special buffers.' },
      { command: 'special-buffer-prepare-jump-focus', description: 'Activate the destination frame for a special buffer jump.' },
      { command: 'special-buffer-prepare-unfocus', description: 'Delete/deactivate the special buffer frame.' },
    ],
  },
];

const ALL_COMMANDS = GROUPS.flatMap((g) => g.commands);

export default function CommandsReference() {
  const [search, setSearch] = useState('');
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!search && !activeGroup) return GROUPS;

    const q = search.toLowerCase();
    return GROUPS
      .filter((g) => !activeGroup || g.label === activeGroup)
      .map((g) => ({
        ...g,
        commands: g.commands.filter(
          (c) =>
            !search ||
            c.command.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.commands.length > 0);
  }, [search, activeGroup]);

  const totalShown = filtered.reduce((sum, g) => sum + g.commands.length, 0);

  return (
    <View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search commands..."
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
            All ({ALL_COMMANDS.length})
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

      <Text style={styles.resultCount}>{totalShown} commands</Text>

      {filtered.map((group) => (
        <View key={group.label} style={styles.group}>
          <Text style={styles.groupLabel}>{group.label}</Text>
          <View style={styles.table}>
            {group.commands.map((cmd, i) => (
              <View key={cmd.command} style={[styles.row, i % 2 === 0 && styles.rowAlt]}>
                <Text style={styles.cmdCell}>{cmd.command}</Text>
                <Text style={styles.descCell}>{cmd.description}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}

      {totalShown === 0 && (
        <Text style={styles.empty}>No commands match your search.</Text>
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
  cmdCell: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.link,
    flex: 1,
    minWidth: 200,
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
