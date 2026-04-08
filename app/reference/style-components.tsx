import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

interface ScompGroup {
  label: string;
  scomps: { name: string; description: string }[];
}

const GROUPS: ScompGroup[] = [
  {
    label: 'Frame & Editor',
    scomps: [
      { name: 'active', description: 'Foreground and background for the active frame.' },
      { name: 'inactive', description: 'Foreground and background for inactive frames.' },
      { name: 'active_border', description: 'Border of the active frame.' },
      { name: 'inactive_border', description: 'Border of inactive frames.' },
      { name: 'active_gutter', description: 'Gutter (left margin) of the active frame.' },
      { name: 'inactive_gutter', description: 'Gutter of inactive frames.' },
      { name: 'cursor_line', description: 'Highlight for the line the cursor is on.' },
      { name: 'selection', description: 'Highlight for selected text.' },
      { name: 'search', description: 'Highlight for search matches.' },
      { name: 'search_cursor', description: 'Highlight for the current search match under the cursor.' },
    ],
  },
  {
    label: 'UI Elements',
    scomps: [
      { name: 'status_line', description: 'The status line at the bottom of each frame.' },
      { name: 'command_line', description: 'The command prompt area.' },
      { name: 'popup', description: 'Popup menus (e.g. completion popup).' },
      { name: 'popup_alt', description: 'Alternate/highlighted item in popup menus.' },
      { name: 'attention', description: 'Elements that need user attention (errors, warnings).' },
      { name: 'associate', description: 'Associated/related highlights (e.g. matching brackets).' },
      { name: 'good', description: 'Positive indicators (success messages, valid states).' },
      { name: 'bad', description: 'Negative indicators (error messages, invalid states).' },
    ],
  },
  {
    label: 'Code Highlighting',
    scomps: [
      { name: 'code_comment', description: 'Comments in source code.' },
      { name: 'code_keyword', description: 'Language keywords (if, else, return, etc.).' },
      { name: 'code_control_flow', description: 'Control flow keywords (break, continue, goto).' },
      { name: 'code_typename', description: 'Type names (int, char, struct names).' },
      { name: 'code_preprocessor', description: 'Preprocessor directives (#include, #define).' },
      { name: 'code_fn_call', description: 'Function calls.' },
      { name: 'code_number', description: 'Numeric literals.' },
      { name: 'code_constant', description: 'Constants and enum values.' },
      { name: 'code_field', description: 'Struct/object field access.' },
      { name: 'code_variable', description: 'Variable names.' },
      { name: 'code_string', description: 'String literals.' },
      { name: 'code_character', description: 'Character literals.' },
      { name: 'code_escape', description: 'Escape sequences within strings.' },
    ],
  },
  {
    label: 'Named Colors',
    scomps: [
      { name: 'white', description: 'White color attribute.' },
      { name: 'gray', description: 'Gray color attribute.' },
      { name: 'black', description: 'Black color attribute.' },
      { name: 'red', description: 'Red color attribute.' },
      { name: 'orange', description: 'Orange color attribute.' },
      { name: 'yellow', description: 'Yellow color attribute.' },
      { name: 'lime', description: 'Lime color attribute.' },
      { name: 'green', description: 'Green color attribute.' },
      { name: 'turquoise', description: 'Turquoise color attribute.' },
      { name: 'cyan', description: 'Cyan color attribute.' },
      { name: 'blue', description: 'Blue color attribute.' },
      { name: 'purple', description: 'Purple color attribute.' },
      { name: 'magenta', description: 'Magenta color attribute.' },
      { name: 'pink', description: 'Pink color attribute.' },
    ],
  },
];

const ALL_SCOMPS = GROUPS.flatMap((g) => g.scomps);

export default function StyleComponentsReference() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return GROUPS;
    const q = search.toLowerCase();
    return GROUPS
      .map((g) => ({
        ...g,
        scomps: g.scomps.filter(
          (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.scomps.length > 0);
  }, [search]);

  const total = filtered.reduce((sum, g) => sum + g.scomps.length, 0);

  return (
    <View>
      <Text style={styles.intro}>
        Style components are named attribute sets that themes define. Reference them in attribute
        strings with <Text style={styles.code}>&name</Text> (e.g.{' '}
        <Text style={styles.code}>&code_keyword</Text>). Access specific fields with{' '}
        <Text style={styles.code}>&name.fg</Text>, <Text style={styles.code}>&name.bg</Text>, etc.
      </Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search style components..."
        placeholderTextColor={Colors.subtleText}
        value={search}
        onChangeText={setSearch}
      />

      <Text style={styles.resultCount}>{total} components</Text>

      {filtered.map((group) => (
        <View key={group.label} style={styles.group}>
          <Text style={styles.groupLabel}>{group.label}</Text>
          <View style={styles.table}>
            {group.scomps.map((scomp, i) => (
              <View key={scomp.name} style={[styles.row, i % 2 === 0 && styles.rowAlt]}>
                <Text style={styles.scompCell}>{scomp.name}</Text>
                <Text style={styles.descCell}>{scomp.description}</Text>
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
    marginBottom: 12,
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
  scompCell: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.link,
    flex: 1,
    minWidth: 160,
  },
  descCell: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    flex: 2,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal,
  },
});
