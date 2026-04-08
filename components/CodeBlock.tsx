import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

interface CodeBlockProps {
  children: string;
  lang?: 'c' | 'bash' | 'plain';
}

interface Token {
  text: string;
  type: 'plain' | 'keyword' | 'string' | 'comment' | 'preprocessor' | 'number' | 'function' | 'type';
}

const C_KEYWORDS = new Set([
  'int', 'char', 'void', 'return', 'if', 'else', 'for', 'while', 'do',
  'switch', 'case', 'break', 'continue', 'struct', 'typedef', 'enum',
  'const', 'static', 'extern', 'sizeof', 'NULL', 'true', 'false',
]);

const C_TYPES = new Set([
  'yed_plugin', 'yed_event', 'yed_event_handler', 'yed_frame', 'yed_buffer',
  'yed_line', 'yed_glyph', 'yed_state_t',
]);

function tokenizeLine(line: string, inBlockComment: boolean): { tokens: Token[]; inBlockComment: boolean } {
  const tokens: Token[] = [];
  let i = 0;

  if (inBlockComment) {
    const end = line.indexOf('*/');
    if (end === -1) {
      tokens.push({ text: line, type: 'comment' });
      return { tokens, inBlockComment: true };
    }
    tokens.push({ text: line.substring(0, end + 2), type: 'comment' });
    i = end + 2;
    inBlockComment = false;
  }

  while (i < line.length) {
    // Preprocessor
    if (i === 0 && line.trimStart().startsWith('#')) {
      tokens.push({ text: line, type: 'preprocessor' });
      return { tokens, inBlockComment };
    }

    // Line comment
    if (line[i] === '/' && line[i + 1] === '/') {
      tokens.push({ text: line.substring(i), type: 'comment' });
      return { tokens, inBlockComment };
    }

    // Block comment start
    if (line[i] === '/' && line[i + 1] === '*') {
      const end = line.indexOf('*/', i + 2);
      if (end === -1) {
        tokens.push({ text: line.substring(i), type: 'comment' });
        return { tokens, inBlockComment: true };
      }
      tokens.push({ text: line.substring(i, end + 2), type: 'comment' });
      i = end + 2;
      continue;
    }

    // String
    if (line[i] === '"') {
      let j = i + 1;
      while (j < line.length && (line[j] !== '"' || line[j - 1] === '\\')) j++;
      tokens.push({ text: line.substring(i, j + 1), type: 'string' });
      i = j + 1;
      continue;
    }

    // Char literal
    if (line[i] === "'") {
      let j = i + 1;
      while (j < line.length && (line[j] !== "'" || line[j - 1] === '\\')) j++;
      tokens.push({ text: line.substring(i, j + 1), type: 'string' });
      i = j + 1;
      continue;
    }

    // Number
    if (/[0-9]/.test(line[i]) && (i === 0 || /[\s,;(=+\-*/<>!&|^~]/.test(line[i - 1]))) {
      let j = i;
      while (j < line.length && /[0-9a-fA-Fx.]/.test(line[j])) j++;
      tokens.push({ text: line.substring(i, j), type: 'number' });
      i = j;
      continue;
    }

    // Word (keyword, type, function, or identifier)
    if (/[a-zA-Z_]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[a-zA-Z0-9_]/.test(line[j])) j++;
      const word = line.substring(i, j);

      if (C_KEYWORDS.has(word)) {
        tokens.push({ text: word, type: 'keyword' });
      } else if (C_TYPES.has(word)) {
        tokens.push({ text: word, type: 'type' });
      } else if (j < line.length && line[j] === '(') {
        tokens.push({ text: word, type: 'function' });
      } else {
        tokens.push({ text: word, type: 'plain' });
      }
      i = j;
      continue;
    }

    // Other characters
    tokens.push({ text: line[i], type: 'plain' });
    i++;
  }

  return { tokens, inBlockComment };
}

function detectLang(code: string): 'c' | 'bash' | 'plain' {
  if (code.includes('#include') || code.includes('yed_plugin') || code.includes('void ') || code.includes('int ')) {
    return 'c';
  }
  if (code.includes('#!/') || code.includes('gcc ') || code.includes('$(') || code.startsWith('$') || code.includes('./install')) {
    return 'bash';
  }
  return 'plain';
}

const TOKEN_COLORS: Record<Token['type'], string> = {
  plain: Colors.text,
  keyword: Colors.keyword,
  string: Colors.string,
  comment: Colors.comment,
  preprocessor: '#d4a843',
  number: '#c08040',
  function: Colors.text,
  type: Colors.heading,
};

function HighlightedCode({ code, lang }: { code: string; lang: 'c' | 'bash' | 'plain' }) {
  const elements = useMemo(() => {
    if (lang !== 'c') return null;

    const lines = code.split('\n');
    let inBlock = false;

    return lines.map((line, lineIdx) => {
      const { tokens, inBlockComment } = tokenizeLine(line, inBlock);
      inBlock = inBlockComment;

      return (
        <Text key={lineIdx}>
          {tokens.map((token, tokenIdx) => (
            <Text key={tokenIdx} style={{ color: TOKEN_COLORS[token.type] }}>
              {token.text}
            </Text>
          ))}
          {lineIdx < lines.length - 1 ? '\n' : ''}
        </Text>
      );
    });
  }, [code, lang]);

  if (lang !== 'c' || !elements) {
    return <Text style={codeStyles.code}>{code}</Text>;
  }

  return <Text style={codeStyles.code}>{elements}</Text>;
}

export function CodeBlock({ children, lang }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const detectedLang = lang || detectLang(children);

  const handleCopy = () => {
    if (Platform.OS === 'web') {
      navigator.clipboard.writeText(children.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <View style={codeStyles.container}>
      <HighlightedCode code={children} lang={detectedLang} />
      <Pressable style={codeStyles.copyButton} onPress={handleCopy}>
        <Text style={codeStyles.copyText}>{copied ? 'Copied!' : 'Copy'}</Text>
      </Pressable>
    </View>
  );
}

export function InlineCode({ children }: { children: string }) {
  return <Text style={codeStyles.inline}>{children}</Text>;
}

const codeStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.codeBg,
    padding: 12,
    marginVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    position: 'relative',
  },
  code: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    lineHeight: Typography.fontSize.sm * 1.5,
    paddingRight: 50,
  },
  copyButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.hoverBg,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  copyText: {
    fontFamily: Typography.fontFamily,
    fontSize: 11,
    color: Colors.subtleText,
  },
  inline: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    backgroundColor: Colors.codeBg,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
});
