import React, { useRef, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { PluginCard } from './PluginCard';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

interface Plugin {
  slug: string;
  name: string;
  description: string;
  category: string;
  keywords: string[];
}

interface PluginCarouselProps {
  title: string;
  plugins: Plugin[];
}

function FadeEdges() {
  if (Platform.OS !== 'web') return null;

  return (
    <>
      <FadeEdge side="left" />
      <FadeEdge side="right" />
    </>
  );
}

function FadeEdge({ side }: { side: 'left' | 'right' }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    el.style.position = 'absolute';
    el.style.top = '0';
    el.style.bottom = '0';
    el.style.width = '60px';
    el.style.zIndex = '1';
    el.style.pointerEvents = 'none';
    if (side === 'left') {
      el.style.left = '0';
      el.style.background = `linear-gradient(to right, ${Colors.contentBg}, transparent)`;
    } else {
      el.style.right = '0';
      el.style.background = `linear-gradient(to left, ${Colors.contentBg}, transparent)`;
    }
  }, [side]);

  return <div ref={ref} />;
}

export function PluginCarousel({ title, plugins }: PluginCarouselProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.carouselWrap}>
        <FadeEdges />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {plugins.map((plugin) => (
            <View key={plugin.slug} style={styles.cardWrapper}>
              <PluginCard {...plugin} showBadge={false} />
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

export function AutoCarousel({ title, plugins }: PluginCarouselProps) {
  const scrollRef = useRef<ScrollView>(null);
  const offsetRef = useRef(0);
  const pausedRef = useRef(false);

  const doubled = useMemo(() => [...plugins, ...plugins], [plugins]);
  const wrapRef = useRef<View>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const cardWidth = 300 + 12;
    const singleSetWidth = plugins.length * cardWidth;

    const interval = setInterval(() => {
      if (pausedRef.current || !scrollRef.current) return;

      offsetRef.current += 1;

      // When we've scrolled past the first set, jump back seamlessly
      if (offsetRef.current >= singleSetWidth) {
        offsetRef.current -= singleSetWidth;
        scrollRef.current.scrollTo({ x: offsetRef.current, animated: false });
      }

      scrollRef.current.scrollTo({ x: offsetRef.current, animated: false });
    }, 30);

    return () => clearInterval(interval);
  }, [plugins.length]);

  useEffect(() => {
    if (Platform.OS !== 'web' || !wrapRef.current) return;
    const el = wrapRef.current as any;
    const pause = () => { pausedRef.current = true; };
    const resume = () => { pausedRef.current = false; };
    el.addEventListener?.('mouseenter', pause);
    el.addEventListener?.('mouseleave', resume);
    return () => {
      el.removeEventListener?.('mouseenter', pause);
      el.removeEventListener?.('mouseleave', resume);
    };
  }, []);

  return (
    <View style={styles.autoContainer}>
      <Text style={styles.autoTitle}>{title}</Text>
      <View ref={wrapRef} style={styles.carouselWrap}>
        <FadeEdges />
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          onTouchStart={() => { pausedRef.current = true; }}
          onTouchEnd={() => { pausedRef.current = false; }}
          scrollEventThrottle={16}
          onScroll={(e) => {
            offsetRef.current = e.nativeEvent.contentOffset.x;
          }}
        >
          {doubled.map((plugin, i) => (
            <View key={`${plugin.slug}-${i}`} style={styles.autoCardWrapper}>
              <PluginCard {...plugin} showBadge={false} />
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xl,
    color: Colors.heading,
    marginBottom: 12,
  },
  carouselWrap: {
    position: 'relative',
  },
  scrollContent: {
    paddingRight: 16,
    paddingLeft: 8,
  },
  cardWrapper: {
    width: 280,
    marginRight: 12,
  },
  autoContainer: {
    marginVertical: 32,
  },
  autoTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.xl,
    color: Colors.heading,
    marginBottom: 16,
    textAlign: 'center',
  },
  autoCardWrapper: {
    width: 300,
    marginRight: 12,
  },
});
