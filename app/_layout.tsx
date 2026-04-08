import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Platform, useWindowDimensions } from 'react-native';
import { Slot, usePathname } from 'expo-router';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Colors } from '../constants/colors';

function useFontLoader() {
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap';
    document.head.appendChild(link);
  }, []);
}

function BackgroundLayer() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const el = ref.current;
      el.style.position = 'fixed';
      el.style.top = '0';
      el.style.left = '0';
      el.style.right = '0';
      el.style.bottom = '0';
      el.style.backgroundColor = Colors.contentBg;
      el.style.backgroundImage = 'url(/big_octo.png)';
      el.style.backgroundSize = '50% auto';
      el.style.backgroundRepeat = 'no-repeat';
      el.style.backgroundPosition = 'center 50px';
      el.style.backgroundAttachment = 'fixed';
      el.style.zIndex = '-1';
      el.style.pointerEvents = 'none';
    }
  }, []);

  if (Platform.OS !== 'web') return null;

  return <div ref={ref} />;
}

export default function RootLayout() {
  useFontLoader();
  const scrollRef = useRef<ScrollView>(null);
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const isMobile = width < 700;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: 0, animated: false });
    }
  }, [pathname]);

  return (
    <View style={styles.wrapper}>
      <BackgroundLayer />
      <Header />
      <View style={styles.contentOuter}>
        <ScrollView
          ref={scrollRef}
          style={styles.scrollable}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={[styles.main, isMobile && styles.mainMobile]}>
            <Slot />
          </View>
          <Footer />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    minHeight: '100%' as any,
  },
  contentOuter: {
    flex: 1,
  },
  scrollable: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  main: {
    marginHorizontal: '10%',
    paddingVertical: 20,
    minHeight: '100vh' as any,
  },
  mainMobile: {
    marginHorizontal: 16,
  },
});
