import React, { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { Link, usePathname } from 'expo-router';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

const NAV_LINKS = [
  { href: '/install', label: 'Install' },
  { href: '/update', label: 'Update' },
  { href: '/changelog', label: 'Changelog' },
  { href: '/user-guide', label: 'User Guide' },
  { href: '/ypm', label: 'YPM Guide' },
  { href: '/plugins', label: 'Plugins' },
  { href: '/faq', label: 'FAQ' },
  { href: '/dev-manual', label: 'Dev Manual' },
  { href: '/reference/commands', label: 'Reference' },
];

export function Header() {
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const isMobile = width < 700;
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/reference/commands') {
      return pathname.startsWith('/reference');
    }
    return pathname === href;
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerInner}>
        <Link href="/" asChild>
          <Pressable style={StyleSheet.flatten([styles.logoLink, pathname === '/' && styles.active])}>
            <View style={pathname === '/' ? styles.logoCircle : styles.logoCircleInactive}>
              <Image
                source={require('../assets/images/yed_logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </Pressable>
        </Link>

        {isMobile ? (
          <Pressable style={styles.hamburger} onPress={() => setMenuOpen(!menuOpen)}>
            <Text style={styles.hamburgerText}>{menuOpen ? '\u2715' : '\u2630'}</Text>
          </Pressable>
        ) : (
          <View style={styles.navLinks}>
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href as any} asChild>
                <Pressable style={StyleSheet.flatten([styles.navLink, isActive(link.href) && styles.active])}>
                  <Text style={styles.navText}>{link.label}</Text>
                </Pressable>
              </Link>
            ))}
          </View>
        )}
      </View>

      {isMobile && menuOpen && (
        <View style={styles.mobileMenu}>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href as any} asChild>
              <Pressable
                style={StyleSheet.flatten([styles.mobileLink, isActive(link.href) && styles.active])}
                onPress={() => setMenuOpen(false)}
              >
                <Text style={styles.navText}>{link.label}</Text>
              </Pressable>
            </Link>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.headerBg,
    zIndex: 10000,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  logoLink: {
    padding: 14,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  logoImage: {
    width: 36,
    height: 36,
  },
  logoCircle: {
    backgroundColor: Colors.headerBg,
    borderRadius: 22,
    padding: 4,
    borderWidth: 2,
    borderColor: Colors.heading,
  },
  logoCircleInactive: {
    borderRadius: 22,
    padding: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  navLinks: {
    flexDirection: 'row',
    flex: 1,
  },
  navLink: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  navText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    lineHeight: 20,
  },
  active: {
    backgroundColor: Colors.contentBg,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  hamburger: {
    marginLeft: 'auto',
    padding: 14,
    paddingHorizontal: 16,
  },
  hamburgerText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.lg,
    color: Colors.text,
  },
  mobileMenu: {
    backgroundColor: Colors.headerBg,
  },
  mobileLink: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.hoverBg,
  },
});
