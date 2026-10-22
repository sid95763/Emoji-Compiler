export type TokenCategory =
  | 'keyword'
  | 'identifier'
  | 'literal'
  | 'operator'
  | 'punctuation'
  | 'preprocessor'
  | 'comment';

export interface CppToken {
  id: string;
  text: string;
  category: TokenCategory;
  line: number;
  column: number;
}

export interface LexerResult {
  tokens: CppToken[];
  categoryCounts: Record<TokenCategory, number>;
  totalCount: number;
}

const CPP_KEYWORDS = new Set([
  'alignas', 'alignof', 'and', 'and_eq', 'asm', 'atomic_cancel', 'atomic_commit',
  'atomic_noexcept', 'auto', 'bitand', 'bitor', 'bool', 'break', 'case', 'catch',
  'char', 'char8_t', 'char16_t', 'char32_t', 'class', 'compl', 'concept',
  'const', 'consteval', 'constexpr', 'constinit', 'const_cast', 'continue',
  'co_await', 'co_return', 'co_yield', 'decltype', 'default', 'delete', 'do',
  'double', 'dynamic_cast', 'else', 'enum', 'explicit', 'export', 'extern',
  'false', 'float', 'for', 'friend', 'goto', 'if', 'inline', 'int', 'long',
  'mutable', 'namespace', 'new', 'noexcept', 'not', 'not_eq', 'nullptr',
  'operator', 'or', 'or_eq', 'override', 'private', 'protected', 'public',
  'reflexpr', 'register', 'reinterpret_cast', 'requires', 'return', 'short',
  'signed', 'sizeof', 'static', 'static_assert', 'static_cast', 'struct',
  'switch', 'template', 'this', 'thread_local', 'throw', 'true', 'try',
  'typedef', 'typeid', 'typename', 'union', 'unsigned', 'using', 'virtual',
  'void', 'volatile', 'wchar_t', 'while', 'xor', 'xor_eq', 'string', 'vector'
]);

/**
 * Fast, lightweight, zero-dependency C++ tokenizer for the live token visualizer.
 */
export function tokenizeCpp(code: string): LexerResult {
  const tokens: CppToken[] = [];
  const categoryCounts: Record<TokenCategory, number> = {
    keyword: 0,
    identifier: 0,
    literal: 0,
    operator: 0,
    punctuation: 0,
    preprocessor: 0,
    comment: 0,
  };

  const lines = code.split('\n');
  let tokenId = 0;
  let inMultiLineComment = false;
  let multiLineCommentStartLine = 1;
  let multiLineCommentStartCol = 1;
  let multiLineCommentBuffer = '';

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const lineText = lines[lineIdx];
    const lineNum = lineIdx + 1;
    let col = 0;

    // Continue multi-line comment if active
    if (inMultiLineComment) {
      const endCommentIdx = lineText.indexOf('*/');
      if (endCommentIdx === -1) {
        multiLineCommentBuffer += '\n' + lineText;
        continue;
      } else {
        multiLineCommentBuffer += '\n' + lineText.slice(0, endCommentIdx + 2);
        tokens.push({
          id: `tok-${tokenId++}`,
          text: multiLineCommentBuffer,
          category: 'comment',
          line: multiLineCommentStartLine,
          column: multiLineCommentStartCol,
        });
        categoryCounts.comment++;
        inMultiLineComment = false;
        col = endCommentIdx + 2;
      }
    }

    while (col < lineText.length) {
      // 1. Skip whitespace
      if (/\s/.test(lineText[col])) {
        col++;
        continue;
      }

      const colStart = col + 1;

      // 2. Preprocessor directive (#include, #define, etc.)
      if (lineText[col] === '#') {
        const remaining = lineText.slice(col).trim();
        tokens.push({
          id: `tok-${tokenId++}`,
          text: remaining,
          category: 'preprocessor',
          line: lineNum,
          column: colStart,
        });
        categoryCounts.preprocessor++;
        break; // Consumed rest of the line
      }

      // 3. Single-line comment
      if (lineText.slice(col, col + 2) === '//') {
        const commentContent = lineText.slice(col);
        tokens.push({
          id: `tok-${tokenId++}`,
          text: commentContent,
          category: 'comment',
          line: lineNum,
          column: colStart,
        });
        categoryCounts.comment++;
        break; // Consumed rest of line
      }

      // 4. Multi-line comment start
      if (lineText.slice(col, col + 2) === '/*') {
        const endCommentIdx = lineText.indexOf('*/', col + 2);
        if (endCommentIdx !== -1) {
          const commentContent = lineText.slice(col, endCommentIdx + 2);
          tokens.push({
            id: `tok-${tokenId++}`,
            text: commentContent,
            category: 'comment',
            line: lineNum,
            column: colStart,
          });
          categoryCounts.comment++;
          col = endCommentIdx + 2;
          continue;
        } else {
          inMultiLineComment = true;
          multiLineCommentStartLine = lineNum;
          multiLineCommentStartCol = colStart;
          multiLineCommentBuffer = lineText.slice(col);
          break;
        }
      }

      // 5. String Literal ("...")
      if (lineText[col] === '"') {
        let strEnd = col + 1;
        while (strEnd < lineText.length && lineText[strEnd] !== '"') {
          if (lineText[strEnd] === '\\') strEnd++; // Skip escape char
          strEnd++;
        }
        if (strEnd < lineText.length) strEnd++; // Include closing quote
        const strVal = lineText.slice(col, strEnd);
        tokens.push({
          id: `tok-${tokenId++}`,
          text: strVal,
          category: 'literal',
          line: lineNum,
          column: colStart,
        });
        categoryCounts.literal++;
        col = strEnd;
        continue;
      }

      // 6. Character Literal ('...')
      if (lineText[col] === "'") {
        let charEnd = col + 1;
        while (charEnd < lineText.length && lineText[charEnd] !== "'") {
          if (lineText[charEnd] === '\\') charEnd++;
          charEnd++;
        }
        if (charEnd < lineText.length) charEnd++;
        const charVal = lineText.slice(col, charEnd);
        tokens.push({
          id: `tok-${tokenId++}`,
          text: charVal,
          category: 'literal',
          line: lineNum,
          column: colStart,
        });
        categoryCounts.literal++;
        col = charEnd;
        continue;
      }

      // 7. Numeric Literal (int, float, hex)
      if (/\d/.test(lineText[col]) || (lineText[col] === '.' && /\d/.test(lineText[col + 1] || ''))) {
        let numEnd = col;
        while (numEnd < lineText.length && /[0-9a-fA-FxX.eE+-]/.test(lineText[numEnd])) {
          numEnd++;
        }
        const numVal = lineText.slice(col, numEnd);
        tokens.push({
          id: `tok-${tokenId++}`,
          text: numVal,
          category: 'literal',
          line: lineNum,
          column: colStart,
        });
        categoryCounts.literal++;
        col = numEnd;
        continue;
      }

      // 8. Word (Keyword or Identifier)
      if (/[a-zA-Z_]/.test(lineText[col])) {
        let wordEnd = col;
        while (wordEnd < lineText.length && /\w/.test(lineText[wordEnd])) {
          wordEnd++;
        }
        const word = lineText.slice(col, wordEnd);
        const category: TokenCategory = CPP_KEYWORDS.has(word) ? 'keyword' : 'identifier';
        tokens.push({
          id: `tok-${tokenId++}`,
          text: word,
          category,
          line: lineNum,
          column: colStart,
        });
        categoryCounts[category]++;
        col = wordEnd;
        continue;
      }

      // 9. Multi-char Operators (<<, >>, ==, !=, <=, >=, &&, ||, ++, --, +=, -=, etc.)
      const twoChar = lineText.slice(col, col + 2);
      if (
        ['<<', '>>', '==', '!=', '<=', '>=', '&&', '||', '++', '--', '+=', '-=', '*=', '/=', '->', '::'].includes(twoChar)
      ) {
        const isPunct = twoChar === '::' || twoChar === '->';
        const category: TokenCategory = isPunct ? 'punctuation' : 'operator';
        tokens.push({
          id: `tok-${tokenId++}`,
          text: twoChar,
          category,
          line: lineNum,
          column: colStart,
        });
        categoryCounts[category]++;
        col += 2;
        continue;
      }

      // 10. Single char Punctuation
      if ([';', '{', '}', '(', ')', '[', ']', ',', '.'].includes(lineText[col])) {
        tokens.push({
          id: `tok-${tokenId++}`,
          text: lineText[col],
          category: 'punctuation',
          line: lineNum,
          column: colStart,
        });
        categoryCounts.punctuation++;
        col++;
        continue;
      }

      // 11. Single char Operator (+, -, *, /, %, <, >, =, !, &, |, ^, ~, ?)
      if (['+', '-', '*', '/', '%', '<', '>', '=', '!', '&', '|', '^', '~', '?', ':'].includes(lineText[col])) {
        tokens.push({
          id: `tok-${tokenId++}`,
          text: lineText[col],
          category: 'operator',
          line: lineNum,
          column: colStart,
        });
        categoryCounts.operator++;
        col++;
        continue;
      }

      // 12. Fallback single character
      tokens.push({
        id: `tok-${tokenId++}`,
        text: lineText[col],
        category: 'punctuation',
        line: lineNum,
        column: colStart,
      });
      categoryCounts.punctuation++;
      col++;
    }
  }

  return {
    tokens,
    categoryCounts,
    totalCount: tokens.length,
  };
}
