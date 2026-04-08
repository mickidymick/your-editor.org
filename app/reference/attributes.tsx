import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RefTable } from '../../components/RefTable';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

const ATTR_COMMANDS = [
  { command: 'fg COLOR', description: 'Set the foreground to COLOR.' },
  { command: 'bg COLOR', description: 'Set the background to COLOR.' },
  { command: 'normal', description: 'Reset all of inverse, bold, underline, 16-light-fg, and 16-light-bg.' },
  { command: 'inverse', description: 'Instruct the terminal to render the colors inverted. Not the same as swap.' },
  { command: 'no-inverse', description: 'Unset the inverse flag.' },
  { command: 'bold', description: 'Display text using a bold font.' },
  { command: 'no-bold', description: 'Unset the bold flag.' },
  { command: 'underline', description: 'Underline the text.' },
  { command: 'no-underline', description: 'Unset the underline flag.' },
  { command: 'italic', description: 'Display text in italic.' },
  { command: 'no-italic', description: 'Unset the italic flag.' },
  { command: '16-light-fg', description: 'Use light variant of foreground. 16-color only.' },
  { command: 'no-16-light-fg', description: 'Unset the 16-light-fg flag.' },
  { command: '16-light-bg', description: 'Use light variant of background. 16-color only.' },
  { command: 'no-16-light-bg', description: 'Unset the 16-light-bg flag.' },
  { command: 'swap', description: 'Swap the foreground and background colors.' },
  { command: '&SCOMP[.FIELD]', description: 'Reference a style component. E.g. "&popup", "&active.bg", "&code-string.bold".' },
];

function ColorBadge({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.colorBadge, { borderColor: color }]}>
      <View style={[styles.colorDot, { backgroundColor: color }]} />
      <Text style={[styles.colorBadgeText, { color }]}>{label}</Text>
    </View>
  );
}

export default function AttributesReference() {
  return (
    <View>
      <Text style={styles.body}>
        Attribute strings define colors and text properties.
        Parsed by <Text style={styles.code}>yed_parse_attrs()</Text>.
      </Text>

      {/* Definitions as color-coded cards */}
      <Text style={styles.sectionTitle}>Color Types</Text>
      <View style={styles.colorCards}>
        <View style={styles.colorCard}>
          <ColorBadge label="16-color" color="#e06070" />
          <Text style={styles.colorCardDesc}>
            Customizable set of 16 terminal colors (8 + 8 bright variants).
            Specified with <Text style={styles.code}>!0</Text> through <Text style={styles.code}>!7</Text>.
          </Text>
        </View>
        <View style={styles.colorCard}>
          <ColorBadge label="256-color" color="#d4a843" />
          <Text style={styles.colorCardDesc}>
            Indexable palette supported by most modern terminals.
            Specified with <Text style={styles.code}>@0</Text> through <Text style={styles.code}>@255</Text>.
          </Text>
        </View>
        <View style={styles.colorCard}>
          <ColorBadge label="Truecolor / RGB" color={Colors.string} />
          <Text style={styles.colorCardDesc}>
            24-bit color via hex RGB string.
            E.g. <Text style={styles.code}>ff7f00</Text> = full red, half green, no blue.
          </Text>
        </View>
        <View style={styles.colorCard}>
          <ColorBadge label="Style Component" color={Colors.link} />
          <Text style={styles.colorCardDesc}>
            Named attribute set from the active style, e.g.{' '}
            <Text style={styles.code}>code-keyword</Text>. Run{' '}
            <Text style={styles.code}>scomps-list</Text> to see all components.
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Attribute Commands */}
      <Text style={styles.sectionTitle}>Attribute Commands</Text>
      <Text style={styles.body}>
        Space-separated commands that modify a working attribute starting from{' '}
        <Text style={styles.code}>ZERO_ATTR</Text> (no attributes).
      </Text>
      <RefTable rows={ATTR_COMMANDS} />
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
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
    color: Colors.text,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.md,
    color: Colors.heading,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 12,
  },
  colorCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorCard: {
    backgroundColor: Colors.codeBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 6,
    padding: 12,
    marginRight: 8,
    marginBottom: 8,
    width: '48%' as any,
    minWidth: 200,
  },
  colorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  colorBadgeText: {
    fontFamily: Typography.fontFamily,
    fontSize: 12,
    fontWeight: 'bold',
  },
  colorCardDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.subtleText,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.cardBorder,
    marginVertical: 20,
    marginHorizontal: '10%' as any,
  },
});
