import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RefTable } from '../../components/RefTable';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

const SPECIFIERS = [
  { command: '%b', description: 'The name of the active buffer.' },
  { command: '%B', description: 'The full path of the active buffer.' },
  { command: '%c', description: 'The cursor column number.' },
  { command: '%f', description: "The active frame's number." },
  { command: '%F', description: 'The file type of the active buffer.' },
  { command: '%l', description: 'The cursor line number.' },
  { command: '%n', description: "The active frame's name." },
  { command: '%p', description: "Cursor vertical position as a percentage." },
  { command: '%t', description: 'Current time (12-hour).' },
  { command: '%T', description: 'Current time (24-hour).' },
  { command: '%(VARNAME)', description: 'Contents of the variable VARNAME.' },
  { command: '%[ATTRS]', description: 'Set status line attributes to ATTRS.' },
  { command: '%{VARNAME}', description: 'Set attributes from the variable VARNAME.' },
];

export default function StatusLineReference() {
  return (
    <View>
      <Text style={styles.body}>
        The variables <Text style={styles.code}>status-line-left</Text>,{' '}
        <Text style={styles.code}>status-line-center</Text>, and{' '}
        <Text style={styles.code}>status-line-right</Text> accept these format specifiers.
      </Text>

      {/* Example preview */}
      <View style={styles.exampleBox}>
        <Text style={styles.exampleLabel}>Default Status Line</Text>
        <View style={styles.statusBar}>
          <Text style={styles.statusLeft}>
            <Text style={styles.statusDim}> 1 </Text>
            <Text style={styles.statusText}>my_file.c</Text>
          </Text>
          <Text style={styles.statusRight}>
            <Text style={styles.statusDim}>(42%)</Text>
            <Text style={styles.statusText}>  128 :: 15  </Text>
            <Text style={styles.statusDim}>3:45 PM </Text>
          </Text>
        </View>
        <View style={styles.exampleFormats}>
          <View style={styles.formatRow}>
            <Text style={styles.formatLabel}>Left:</Text>
            <Text style={styles.formatValue}>" %f %b"</Text>
          </View>
          <View style={styles.formatRow}>
            <Text style={styles.formatLabel}>Right:</Text>
            <Text style={styles.formatValue}>"(%p%%)  %l :: %c  %t "</Text>
          </View>
        </View>
      </View>

      {/* Specifiers */}
      <Text style={styles.sectionTitle}>Format Specifiers</Text>
      <RefTable rows={SPECIFIERS} />

      {/* Padding */}
      <View style={styles.divider} />
      <Text style={styles.sectionTitle}>Padding & Justification</Text>
      <Text style={styles.body}>
        Add a width and alignment after <Text style={styles.code}>%</Text> to pad output:
      </Text>

      <View style={styles.paddingCards}>
        <View style={styles.paddingCard}>
          <Text style={styles.paddingCode}>%-10b</Text>
          <Text style={styles.paddingArrow}>{'\u2192'}</Text>
          <View style={styles.paddingPreview}>
            <Text style={styles.paddingResult}>{'my_file   '}</Text>
          </View>
          <Text style={styles.paddingDesc}>Left justified, 10 cells</Text>
        </View>
        <View style={styles.paddingCard}>
          <Text style={styles.paddingCode}>%15(my-var)</Text>
          <Text style={styles.paddingArrow}>{'\u2192'}</Text>
          <View style={styles.paddingPreview}>
            <Text style={styles.paddingResult}>{'      some-value'}</Text>
          </View>
          <Text style={styles.paddingDesc}>Right justified, 15 cells</Text>
        </View>
        <View style={styles.paddingCard}>
          <Text style={styles.paddingCode}>%=30F</Text>
          <Text style={styles.paddingArrow}>{'\u2192'}</Text>
          <View style={styles.paddingPreview}>
            <Text style={styles.paddingResult}>{'            C             '}</Text>
          </View>
          <Text style={styles.paddingDesc}>Center justified, 30 cells</Text>
        </View>
      </View>
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
  divider: {
    height: 1,
    backgroundColor: Colors.cardBorder,
    marginVertical: 20,
    marginHorizontal: '10%' as any,
  },
  exampleBox: {
    backgroundColor: Colors.codeBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 6,
    padding: 16,
    marginBottom: 20,
  },
  exampleLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: 12,
    color: Colors.subtleText,
    marginBottom: 10,
  },
  statusBar: {
    backgroundColor: Colors.headerBg,
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusLeft: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
  },
  statusRight: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
  },
  statusText: {
    color: Colors.text,
  },
  statusDim: {
    color: Colors.subtleText,
  },
  exampleFormats: {
    marginTop: 4,
  },
  formatRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  formatLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: 12,
    color: Colors.subtleText,
    width: 50,
  },
  formatValue: {
    fontFamily: Typography.fontFamily,
    fontSize: 12,
    color: Colors.link,
  },
  paddingCards: {
    marginTop: 4,
  },
  paddingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.codeBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 6,
  },
  paddingCode: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.link,
    minWidth: 120,
  },
  paddingArrow: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.subtleText,
    marginHorizontal: 10,
  },
  paddingPreview: {
    backgroundColor: Colors.headerBg,
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  paddingResult: {
    fontFamily: Typography.fontFamily,
    fontSize: 12,
    color: Colors.text,
  },
  paddingDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: 12,
    color: Colors.subtleText,
    marginLeft: 12,
    flex: 1,
  },
});
