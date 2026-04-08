import { Platform } from 'react-native';

export const Typography = {
  fontFamily: Platform.select({
    web: '"JetBrains Mono", "Courier New", monospace',
    default: 'JetBrains Mono',
  }),
  fontSize: {
    sm: 14,
    base: 16,
    md: 18,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.6,
  },
};
