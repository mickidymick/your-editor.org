import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Slot, Link, usePathname } from 'expo-router';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

const REF_LINKS = [
  { href: '/reference/commands', label: 'Commands' },
  { href: '/reference/variables', label: 'Variables' },
  { href: '/reference/attributes', label: 'Attributes' },
  { href: '/reference/status-line', label: 'Status Line' },
  { href: '/reference/events', label: 'Events' },
  { href: '/reference/keys', label: 'Keys' },
  { href: '/reference/style-components', label: 'Style Components' },
];

export default function ReferenceLayout() {
  const pathname = usePathname();

  return (
    <View>
      <Text style={styles.h1}>Reference</Text>
      <View style={styles.tabsRow}>
        {REF_LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link key={link.href} href={link.href as any} asChild>
              <Pressable style={active ? styles.tabActive : styles.tab}>
                <Text style={active ? styles.tabTextActive : styles.tabText}>
                  {link.label}
                </Text>
              </Pressable>
            </Link>
          );
        })}
      </View>
      <View style={styles.content}>
        <Slot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xxl,
    color: Colors.heading,
    lineHeight: Typography.fontSize.xxl * Typography.lineHeight.tight,
    marginBottom: 16,
  },
  tabsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 6,
    backgroundColor: Colors.hoverBg,
    marginRight: 6,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  tabActive: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 6,
    backgroundColor: Colors.heading,
    marginRight: 6,
    borderWidth: 1,
    borderColor: Colors.heading,
  },
  tabText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.subtleText,
  },
  tabTextActive: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.contentBg,
    fontWeight: 'bold',
  },
  content: {
    backgroundColor: 'rgba(17, 34, 51, 0.65)',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 8,
    padding: 20,
  },
});
