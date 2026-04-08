import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

interface KeyGroup {
  label: string;
  keys: { name: string; description: string }[];
}

const GROUPS: KeyGroup[] = [
  {
    label: 'Control Keys',
    keys: [
      { name: 'ctrl-a', description: 'Ctrl + A' },
      { name: 'ctrl-b', description: 'Ctrl + B' },
      { name: 'ctrl-c', description: 'Ctrl + C' },
      { name: 'ctrl-d', description: 'Ctrl + D' },
      { name: 'ctrl-e', description: 'Ctrl + E' },
      { name: 'ctrl-f', description: 'Ctrl + F' },
      { name: 'ctrl-g', description: 'Ctrl + G' },
      { name: 'ctrl-h', description: 'Ctrl + H (also backspace on some terminals)' },
      { name: 'ctrl-j', description: 'Ctrl + J' },
      { name: 'ctrl-k', description: 'Ctrl + K' },
      { name: 'ctrl-l', description: 'Ctrl + L' },
      { name: 'ctrl-n', description: 'Ctrl + N' },
      { name: 'ctrl-o', description: 'Ctrl + O' },
      { name: 'ctrl-p', description: 'Ctrl + P' },
      { name: 'ctrl-q', description: 'Ctrl + Q' },
      { name: 'ctrl-r', description: 'Ctrl + R' },
      { name: 'ctrl-s', description: 'Ctrl + S' },
      { name: 'ctrl-t', description: 'Ctrl + T' },
      { name: 'ctrl-u', description: 'Ctrl + U' },
      { name: 'ctrl-v', description: 'Ctrl + V' },
      { name: 'ctrl-w', description: 'Ctrl + W (default: write-buffer)' },
      { name: 'ctrl-x', description: 'Ctrl + X' },
      { name: 'ctrl-y', description: 'Ctrl + Y (default: command-prompt)' },
      { name: 'ctrl-z', description: 'Ctrl + Z' },
      { name: 'ctrl-/', description: 'Ctrl + /' },
    ],
  },
  {
    label: 'Arrow Keys',
    keys: [
      { name: 'arrow-up', description: 'Up arrow' },
      { name: 'arrow-down', description: 'Down arrow' },
      { name: 'arrow-left', description: 'Left arrow' },
      { name: 'arrow-right', description: 'Right arrow' },
      { name: 'ctrl-arrow-up', description: 'Ctrl + Up arrow' },
      { name: 'ctrl-arrow-down', description: 'Ctrl + Down arrow' },
      { name: 'ctrl-arrow-left', description: 'Ctrl + Left arrow' },
      { name: 'ctrl-arrow-right', description: 'Ctrl + Right arrow' },
    ],
  },
  {
    label: 'Special Keys',
    keys: [
      { name: 'tab', description: 'Tab key' },
      { name: 'shift-tab', description: 'Shift + Tab' },
      { name: 'enter', description: 'Enter / Return' },
      { name: 'backspace', description: 'Backspace (also bsp)' },
      { name: 'bsp', description: 'Backspace (alternative name)' },
      { name: 'spc', description: 'Space key' },
      { name: 'delete', description: 'Delete key (also del)' },
      { name: 'del', description: 'Delete key (alternative name)' },
      { name: 'insert', description: 'Insert key' },
      { name: 'escape', description: 'Escape key (also esc)' },
      { name: 'esc', description: 'Escape key (alternative name)' },
      { name: 'home', description: 'Home key' },
      { name: 'end', description: 'End key' },
      { name: 'page-up', description: 'Page Up (also pageup)' },
      { name: 'page-down', description: 'Page Down (also pagedown)' },
      { name: 'menu', description: 'Menu / application key' },
    ],
  },
  {
    label: 'Function Keys',
    keys: [
      { name: 'fn-1', description: 'F1' },
      { name: 'fn-2', description: 'F2' },
      { name: 'fn-3', description: 'F3' },
      { name: 'fn-4', description: 'F4' },
      { name: 'fn-5', description: 'F5' },
      { name: 'fn-6', description: 'F6' },
      { name: 'fn-7', description: 'F7' },
      { name: 'fn-8', description: 'F8' },
      { name: 'fn-9', description: 'F9' },
      { name: 'fn-10', description: 'F10' },
      { name: 'fn-11', description: 'F11' },
      { name: 'fn-12', description: 'F12' },
    ],
  },
  {
    label: 'Meta / Alt Keys',
    keys: [
      { name: 'meta-<key>', description: 'Alt/Meta + key. E.g. meta-a for Alt+A, meta-x for Alt+X.' },
    ],
  },
  {
    label: 'Key Sequences',
    keys: [
      { name: 'key1 key2', description: 'Keys pressed in sequence. E.g. "g g" for two presses of g.' },
      { name: 'multi cmd1 cmd2', description: 'Bind a key to run multiple commands in sequence.' },
    ],
  },
];

const ALL_KEYS = GROUPS.flatMap((g) => g.keys);

export default function KeysReference() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return GROUPS;
    const q = search.toLowerCase();
    return GROUPS
      .map((g) => ({
        ...g,
        keys: g.keys.filter(
          (k) => k.name.toLowerCase().includes(q) || k.description.toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.keys.length > 0);
  }, [search]);

  return (
    <View>
      <Text style={styles.intro}>
        Key names used with the <Text style={styles.code}>bind</Text> and{' '}
        <Text style={styles.code}>unbind</Text> commands.
      </Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search keys..."
        placeholderTextColor={Colors.subtleText}
        value={search}
        onChangeText={setSearch}
      />

      {filtered.map((group) => (
        <View key={group.label} style={styles.group}>
          <Text style={styles.groupLabel}>{group.label}</Text>
          <View style={styles.table}>
            {group.keys.map((key, i) => (
              <View key={key.name} style={[styles.row, i % 2 === 0 && styles.rowAlt]}>
                <Text style={styles.keyCell}>{key.name}</Text>
                <Text style={styles.descCell}>{key.description}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  intro: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal,
    marginBottom: 12,
  },
  code: {
    fontFamily: Typography.fontFamily,
    backgroundColor: Colors.codeBg,
    paddingHorizontal: 3,
  },
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
  keyCell: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.link,
    flex: 1,
    minWidth: 150,
  },
  descCell: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    flex: 2,
  },
});
