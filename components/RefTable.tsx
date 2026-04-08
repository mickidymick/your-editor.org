import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

interface RefRow {
  command: string;
  description: string;
}

interface RefTableProps {
  rows: RefRow[];
}

export function RefTable({ rows }: RefTableProps) {
  return (
    <View style={styles.table}>
      {rows.map((row, i) => (
        <View key={i} style={[styles.row, i % 2 === 0 && styles.rowAlt]}>
          <View style={styles.cellCmd}>
            <Text style={styles.cmdText}>{row.command}</Text>
          </View>
          <View style={styles.cellDesc}>
            <Text style={styles.descText}>{row.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 6,
    overflow: 'hidden',
    marginVertical: 12,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  rowAlt: {
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  cellCmd: {
    flex: 1,
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: Colors.cardBorder,
  },
  cellDesc: {
    flex: 2,
    padding: 8,
  },
  cmdText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.link,
  },
  descText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal,
  },
});
