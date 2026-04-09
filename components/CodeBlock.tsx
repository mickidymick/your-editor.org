import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

interface CodeBlockProps {
  children: string;
  lang?: 'c' | 'bash' | 'plain' | 'yedrc';
  context?: 'terminal' | 'yed';
  reserveSlug?: boolean;
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

function tokenizeYedrcLine(line: string): Token[] {
  const tokens: Token[] = [];
  const trimmed = line.trimStart();
  const leadingSpace = line.substring(0, line.length - trimmed.length);

  if (leadingSpace) tokens.push({ text: leadingSpace, type: 'plain' });

  // Comment line
  if (trimmed.startsWith('#')) {
    tokens.push({ text: trimmed, type: 'comment' });
    return tokens;
  }

  // Empty line
  if (!trimmed) return tokens;

  let i = 0;
  // First word is the command
  let j = 0;
  while (j < trimmed.length && !/\s/.test(trimmed[j])) j++;
  tokens.push({ text: trimmed.substring(0, j), type: 'keyword' });
  i = j;

  // Rest of the line: strings and other args
  while (i < trimmed.length) {
    if (trimmed[i] === '"') {
      let k = i + 1;
      while (k < trimmed.length && !(trimmed[k] === '"' && trimmed[k - 1] !== '\\')) k++;
      tokens.push({ text: trimmed.substring(i, k + 1), type: 'string' });
      i = k + 1;
      continue;
    }
    if (trimmed[i] === "'") {
      let k = i + 1;
      while (k < trimmed.length && trimmed[k] !== "'") k++;
      tokens.push({ text: trimmed.substring(i, k + 1), type: 'string' });
      i = k + 1;
      continue;
    }
    // Line continuation backslash — treat as part of string context
    if (trimmed[i] === '\\' && i === trimmed.length - 1) {
      tokens.push({ text: trimmed[i], type: 'string' });
      i++;
      continue;
    }
    tokens.push({ text: trimmed[i], type: 'plain' });
    i++;
  }

  return tokens;
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
  preprocessor: '#d0a0c0',
  number: '#e0c080',
  function: '#d0a0d0',
  type: '#d0a0d0',
};

function HighlightedCode({ code, lang }: { code: string; lang: 'c' | 'bash' | 'plain' | 'yedrc' }) {
  const elements = useMemo(() => {
    if (lang !== 'c' && lang !== 'yedrc') return null;

    const lines = code.split('\n');
    let inBlock = false;

    return lines.map((line, lineIdx) => {
      const tokens = lang === 'yedrc'
        ? tokenizeYedrcLine(line)
        : (() => { const r = tokenizeLine(line, inBlock); inBlock = r.inBlockComment; return r.tokens; })();

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

  if ((lang !== 'c' && lang !== 'yedrc') || !elements) {
    return <Text style={codeStyles.code}>{code}</Text>;
  }

  return <Text style={codeStyles.code}>{elements}</Text>;
}

const CONTEXT_LABELS: Record<string, { label: string; color: string }> = {
  terminal: { label: 'terminal', color: Colors.string },
  yed: { label: 'yed', color: Colors.keyword },
};

export function CodeBlock({ children, lang, context, reserveSlug }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const detectedLang = lang || detectLang(children);

  const handleCopy = () => {
    if (Platform.OS === 'web') {
      navigator.clipboard.writeText(children.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const ctx = context ? CONTEXT_LABELS[context] : null;

  return (
    <View style={codeStyles.outerWrap}>
      {ctx ? (
        <View style={codeStyles.contextSlug}>
          <View style={[codeStyles.contextSlugBox, { backgroundColor: ctx.color + '20' }]}>
            <Text style={[codeStyles.contextSlugText, { color: ctx.color }]}>{ctx.label}</Text>
          </View>
        </View>
      ) : reserveSlug ? (
        <View style={codeStyles.contextSlug} />
      ) : null}
      <View style={[codeStyles.container, (ctx || reserveSlug) && { flex: 1, marginVertical: 0 }]}>
      <HighlightedCode code={children} lang={detectedLang} />
      <Pressable style={codeStyles.copyButton} onPress={handleCopy}>
        <Text style={codeStyles.copyText}>{copied ? 'Copied!' : 'Copy'}</Text>
      </Pressable>
      </View>
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
  outerWrap: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  contextSlug: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginRight: 8,
  },
  contextSlugBox: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  contextSlugText: {
    fontFamily: Typography.fontFamily,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
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
