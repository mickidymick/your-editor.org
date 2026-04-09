import React from 'react';
import { View, Text, Image, Pressable, StyleSheet, Linking } from 'react-native';
import { Link } from 'expo-router';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

const FOOTER_LINKS = [
  {
    title: 'Getting Started',
    links: [
      { href: '/install', label: 'Installation' },
      { href: '/update', label: 'Updating' },
      { href: '/changelog', label: 'Changelog' },
    ],
  },
  {
    title: 'Documentation',
    links: [
      { href: '/user-guide', label: 'User Guide' },
      { href: '/example-configs', label: 'Example Configs' },
      { href: '/lsp-setup', label: 'LSP Setup' },
      { href: '/ypm', label: 'YPM Guide' },
      { href: '/dev-manual', label: 'Dev Manual' },
      { href: '/faq', label: 'FAQ' },
      { href: '/plugins', label: 'Plugins' },
    ],
  },
  {
    title: 'Reference',
    links: [
      { href: '/reference/commands', label: 'Commands' },
      { href: '/reference/variables', label: 'Variables' },
      { href: '/reference/attributes', label: 'Attributes' },
      { href: '/reference/status-line', label: 'Status Line' },
      { href: '/reference/events', label: 'Events' },
      { href: '/reference/keys', label: 'Keys' },
      { href: '/reference/style-components', label: 'Style Components' },
    ],
  },
];

export function Footer() {
  return (
    <View style={styles.footer}>
      <View style={styles.columns}>
        {FOOTER_LINKS.map((col) => (
          <View key={col.title} style={styles.column}>
            <Text style={styles.columnTitle}>{col.title}</Text>
            {col.links.map((link) => (
              <Link key={link.href} href={link.href as any} style={styles.footerLink}>
                {link.label}
              </Link>
            ))}
          </View>
        ))}
        <View style={styles.column}>
          <Text style={styles.columnTitle}>Community</Text>
          <Pressable onPress={() => Linking.openURL('https://www.github.com/kammerdienerb/yed')} style={styles.socialRow}>
            <Image source={require('../assets/images/GitHub-Mark-120px-plus.png')} style={styles.socialIcon} />
            <Text style={styles.footerLink}>GitHub</Text>
          </Pressable>
          <Pressable onPress={() => Linking.openURL('https://discord.gg/cx3JFJ2gNU')} style={styles.socialRow}>
            <Image source={require('../assets/images/Discord-Logo-Color.png')} style={styles.socialIcon} />
            <Text style={styles.footerLink}>Discord</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.divider} />
      <Text style={styles.credit}>
        Created by kammerdienerb & contributors {'\u00B7'} {new Date().getFullYear()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: Colors.hoverBg,
    paddingVertical: 24,
    paddingHorizontal: '10%' as any,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  columns: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  column: {
    minWidth: 150,
    marginHorizontal: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  columnTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.heading,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  footerLink: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.subtleText,
    lineHeight: Typography.fontSize.sm * 2,
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  socialIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.cardBorder,
    marginVertical: 16,
  },
  credit: {
    fontFamily: Typography.fontFamily,
    fontSize: 11,
    color: Colors.subtleText,
    textAlign: 'center',
  },
});
