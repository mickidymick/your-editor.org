import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RefTable } from '../../components/RefTable';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

const VARIABLES = [
  { command: 'tab-width', description: 'Number of columns to display for a tab character. Also used by plugins for indentation. Default 4.' },
  { command: 'cursor-line', description: 'If true, highlight the current line with the "cursor-line" style component. Default "no".' },
  { command: 'ctrl-h-is-backspace', description: 'Indicates that your terminal sends ctrl-h on backspace. Set to "no" to bind ctrl-h independently. Default "yes".' },
  { command: 'buffer-load-mode', description: 'Method to load buffers. Options: "map" (faster for large files) and "stream". Default "stream".' },
  { command: 'bracketed-paste-mode', description: 'Whether bracketed paste escape codes should be interpreted. Default "on".' },
  { command: 'enable-search-cursor-move', description: 'Whether the cursor can move during interactive search. Default "yes".' },
  { command: 'default-scroll-offset', description: 'Scroll offset for new frames. Default 5.' },
  { command: 'command-prompt-string', description: 'The command prompt prefix. Default "YED>".' },
  { command: 'fill-string', description: 'String displayed on empty lines past the buffer end. Default "~".' },
  { command: 'fill-scomp', description: 'Style component used for the fill string. Default unset.' },
  { command: 'cursor-move-clears-search', description: 'Whether cursor movement clears the search highlight. Default "yes".' },
  { command: 'use-boyer-moore', description: 'Use Boyer-Moore search algorithm (faster for long strings). Default "no".' },
  { command: 'status-line-left', description: 'Left status line format. Default " %f %b".' },
  { command: 'status-line-center', description: 'Center status line format. Default "" (empty).' },
  { command: 'status-line-right', description: 'Right status line format. Default "(%p%%)  %l :: %c  %t ".' },
  { command: 'screen-update-sync', description: 'Wrap screen updates in sync escape sequences. Default "yes".' },
  { command: 'syntax-max-line-length', description: 'Max line length for syntax highlighting. Default 1000.' },
  { command: 'border-style', description: 'Frame border style. Controls how borders between frames are drawn.' },
  { command: 'compl-words-buffer-max-lines', description: 'Max lines a buffer can have for the "words" completion source to scan it. Prevents slowdowns on large files.' },
  { command: 'screen-fake-opacity', description: 'Fake transparency for screen print overlay functions. Values less than 1.0 blend with the background. Default 0.95.' },
];

export default function VariablesReference() {
  return (
    <View>
      <View style={styles.callout}>
        <Text style={styles.calloutLabel}>TIP</Text>
        <Text style={styles.calloutBody}>
          Run <Text style={styles.code}>show-vars</Text> to see all currently set variables and
          their values in the <Text style={styles.code}>*vars</Text> buffer.
        </Text>
      </View>
      <RefTable rows={VARIABLES} />
    </View>
  );
}

const styles = StyleSheet.create({
  callout: {
    backgroundColor: Colors.cardBg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.link,
    borderRadius: 4,
    padding: 14,
    marginBottom: 16,
  },
  calloutLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.link,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  calloutBody: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
  },
  code: {
    fontFamily: Typography.fontFamily,
    backgroundColor: Colors.codeBg,
    paddingHorizontal: 4,
    color: Colors.text,
  },
});
