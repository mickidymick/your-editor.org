import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { SEO } from '../components/SEO';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

export default function NotFound() {
  return (
    <View style={styles.container}>
      <SEO title="Page Not Found" description="The page you're looking for doesn't exist." />
      <Text style={styles.code}>404</Text>
      <Text style={styles.title}>Page not found</Text>
      <Text style={styles.body}>
        The page you're looking for doesn't exist or has been moved.
      </Text>
      <View style={styles.links}>
        <Link href="/" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Go Home</Text>
          </Pressable>
        </Link>
        <Link href="/plugins" asChild>
          <Pressable style={styles.linkButton}>
            <Text style={styles.linkText}>Browse Plugins</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  code: {
    fontFamily: Typography.fontFamily,
    fontSize: 72,
    color: Colors.heading,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  title: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xl,
    color: Colors.text,
    marginBottom: 12,
  },
  body: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.subtleText,
    marginBottom: 32,
  },
  links: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: Colors.heading,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 6,
    marginRight: 16,
  },
  buttonText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.contentBg,
    fontWeight: 'bold',
  },
  linkButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  linkText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.link,
  },
});
