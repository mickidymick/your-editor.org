import React, { useEffect } from 'react';
import { Platform } from 'react-native';

interface SEOProps {
  title: string;
  description: string;
}

export function SEO({ title, description }: SEOProps) {
  const fullTitle = title === 'yed' ? 'yed — your editor' : `${title} — yed`;

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    document.title = fullTitle;

    // Set or update meta description
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = description;

    // Set or update og:title
    let ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.content = fullTitle;

    // Set or update og:description
    let ogDesc = document.querySelector('meta[property="og:description"]') as HTMLMetaElement | null;
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.content = description;
  }, [fullTitle, description]);

  return null;
}
