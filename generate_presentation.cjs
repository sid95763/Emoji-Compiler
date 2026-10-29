const pptxgen = require('pptxgenjs');
const path = require('path');

const pptx = new pptxgen();

// Define Standard Modern 16:9 Widescreen Layout (13.333" x 7.5")
pptx.defineLayout({ name: 'WIDE_16_9', width: 13.333, height: 7.5 });
pptx.layout = 'WIDE_16_9';

pptx.title = 'EmojiCompiler: Interactive C++ Compiler Architecture';
pptx.author = 'Compiler Design Team';
pptx.company = 'Computer Science & Engineering';

// Professional High-Contrast Palette
const BG_DARK = '0B1120';       // Deep slate navy canvas
const CARD_BG = '1E293B';       // Slate 800 background
const CARD_BG_ALT = '0F172A';   // Slate 900 nested container
const CARD_BORDER = '334155';   // Slate 700 border
const ACCENT_GREEN = '10B981';  // Emerald Green
const ACCENT_CYAN = '38BDF8';   // Sky Cyan
const ACCENT_AMBER = 'F59E0B';  // Warm Amber
const ACCENT_PURPLE = 'A855F7'; // Purple Accent
const ACCENT_RED = 'EF4444';    // Red Accent
const TEXT_WHITE = 'F8FAFC';    // Crisp White Heading
const TEXT_MUTED = '94A3B8';    // Slate 400 Secondary Text
const TEXT_LIGHT = 'E2E8F0';    // Slate 200 Primary Body

// Base Template Helper for Slides 2-13
function createBaseSlide(title, category = 'COMPILER DESIGN PROJECT') {
  const slide = pptx.addSlide();
  slide.background = { color: BG_DARK };

  // Category Tag
  slide.addText(category.toUpperCase(), {
    x: 0.8,
    y: 0.38,
    w: 11.73,
    h: 0.28,
    fontSize: 10,
    fontFace: 'Arial',
    color: ACCENT_CYAN,
    bold: true,
  });

  // Slide Title
  slide.addText(title, {
    x: 0.8,
    y: 0.68,
    w: 11.73,
    h: 0.55,
    fontSize: 22,
    fontFace: 'Arial',
    color: TEXT_WHITE,
    bold: true,
    valign: 'middle',
  });

  // Bottom Footer
  slide.addText('EmojiCompiler — Educational Compiler Design Architecture  |  16:9 Widescreen', {
    x: 0.8,
    y: 6.95,
    w: 9.0,
    h: 0.3,
    fontSize: 9,
    fontFace: 'Arial',
    color: TEXT_MUTED,
    valign: 'middle',
  });

  return slide;
}

// ==========================================
// SLIDE 1: TITLE SLIDE
// ==========================================
{
  const slide = pptx.addSlide();
  slide.background = { color: BG_DARK };

  // Left Accent Bar
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 1.0,
    y: 1.6,
    w: 0.15,
    h: 3.4,
    fill: { color: ACCENT_GREEN },
    line: { color: ACCENT_GREEN },
  });

  slide.addText('⚡ EMOJICOMPILER STUDIO', {
    x: 1.35,
    y: 1.6,
    w: 10.5,
    h: 0.45,
    fontSize: 15,
    fontFace: 'Arial',
    color: ACCENT_GREEN,
    bold: true,
  });

  slide.addText('Visual, Interactive & Humorous C++ Compiler Architecture', {
    x: 1.35,
    y: 2.1,
    w: 10.8,
    h: 1.4,
    fontSize: 32,
    fontFace: 'Arial',
    color: TEXT_WHITE,
    bold: true,
    valign: 'top',
    fit: 'shrink',
  });

  slide.addText('An Educational Compiler Suite bridging Lexing, Parsing, Semantic Analysis, and Runtime Diagnostics with Gamified Developer Feedback.', {
    x: 1.35,
    y: 3.55,
    w: 10.8,
    h: 0.8,
    fontSize: 14,
    fontFace: 'Arial',
    color: TEXT_MUTED,
    fit: 'shrink',
  });

  // Author & Course Meta Card
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 1.35,
    y: 4.8,
    w: 10.8,
    h: 1.4,
    fill: { color: CARD_BG },
    line: { color: CARD_BORDER, width: 1 },
    rectRadius: 0.08,
  });

  slide.addText([
    { text: 'Course / Focus: ', options: { bold: true, color: ACCENT_CYAN, fontSize: 11.5 } },
    { text: 'Compiler Design (CD) Project     |     ', options: { color: TEXT_LIGHT, fontSize: 11.5 } },
    { text: 'Technology Stack: ', options: { bold: true, color: ACCENT_GREEN, fontSize: 11.5 } },
    { text: 'React 19 • TypeScript • Monaco Editor • Zustand • AST Engine\n', options: { color: TEXT_LIGHT, fontSize: 11.5 } },
    { text: 'Key Innovations: ', options: { bold: true, color: ACCENT_AMBER, fontSize: 11.5 } },
    { text: '5-Stage Pipeline Stepper • Live Token Visualizer • Big-O Complexity Heuristic • 3-Tier Humor Matrix', options: { color: TEXT_LIGHT, fontSize: 11.5 } },
  ], {
    x: 1.6,
    y: 4.95,
    w: 10.3,
    h: 1.1,
    fontFace: 'Arial',
    valign: 'middle',
    fit: 'shrink',
  });
}

// ==========================================
// SLIDE 2: PROBLEM STATEMENT & MOTIVATION
// ==========================================
{
  const slide = createBaseSlide('Problem Statement: The C++ Learning Cliff', 'Motivation & Background');

  // Left Card: The Traditional Problem
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8,
    y: 1.45,
    w: 5.7,
    h: 5.25,
    fill: { color: CARD_BG },
    line: { color: '475569', width: 1 },
    rectRadius: 0.1,
  });

  slide.addText('Traditional GCC/Clang Experience ❌', {
    x: 1.1,
    y: 1.65,
    w: 5.1,
    h: 0.4,
    fontSize: 15,
    fontFace: 'Arial',
    color: ACCENT_RED,
    bold: true,
  });

  slide.addText([
    { text: '• Cryptic Diagnostic Output:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'Deep template cascades, unfamiliar linker errors, and dense terminal syntax dumps intimidate students and beginners.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '• The Black Box Pipeline:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'Students cannot see what stage caught their error (Did Lexer fail? Did Parser fail? Or was it Semantic Analysis?).\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '• Cascading Cognitive Overload:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'A single omitted semicolon produces 15+ misleading cascading compiler errors.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '• Textbook Theory Disconnect:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'Classroom compiler theory covers CFGs and symbol tables, but practical IDEs hide these internals completely.', options: { color: TEXT_MUTED, fontSize: 10.5 } },
  ], {
    x: 1.1,
    y: 2.15,
    w: 5.1,
    h: 4.35,
    fontFace: 'Arial',
    valign: 'top',
    fit: 'shrink',
  });

  // Right Card: The EmojiCompiler Solution
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.83,
    y: 1.45,
    w: 5.7,
    h: 5.25,
    fill: { color: CARD_BG },
    line: { color: ACCENT_GREEN, width: 1.5 },
    rectRadius: 0.1,
  });

  slide.addText('The EmojiCompiler Solution 🟢', {
    x: 7.13,
    y: 1.65,
    w: 5.1,
    h: 0.4,
    fontSize: 15,
    fontFace: 'Arial',
    color: ACCENT_GREEN,
    bold: true,
  });

  slide.addText([
    { text: '• Human-Centric Diagnostics:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'Translates raw errors into intuitive emojis (✂️ Missing Semicolon, 👻 Ghost Variable, 💥 Segfault, ♾️ TLE).\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '• 5-Stage Live Pipeline Stepper:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'Visual progress tracker from Lexing to Assembly that pinpoints the exact failure phase.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '• One-Click AST Fixes & Diffs:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'Inline red/green before-and-after diffs with automated patch application directly into code.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '• Humor & Gamification Engine:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'Selectable humor levels (Pro, Puns, Roast), Mascot companion, and clean compilation streaks.', options: { color: TEXT_MUTED, fontSize: 10.5 } },
  ], {
    x: 7.13,
    y: 2.15,
    w: 5.1,
    h: 4.35,
    fontFace: 'Arial',
    valign: 'top',
    fit: 'shrink',
  });
}

// ==========================================
// SLIDE 3: SYSTEM ARCHITECTURE
// ==========================================
{
  const slide = createBaseSlide('System Architecture & High-Level Data Flow', 'Engineering Architecture');

  const components = [
    { title: '1. Monaco Code Editor', color: ACCENT_CYAN, desc: 'Full C++ syntax highlighting, line numbers, glyph margin emoji decorations, and Ctrl+Enter keyboard bindings.' },
    { title: '2. Lightweight Lexer', color: ACCENT_PURPLE, desc: 'Real-time token visualizer categorizing C++ into Keywords, Identifiers, Literals, Operators, Comments, and Preprocessors.' },
    { title: '3. Hybrid Compiler Engine', color: ACCENT_GREEN, desc: 'Dual-path architecture: Judge0 cloud sandbox with strict 1200ms timeout + zero-latency local C++ simulation engine.' },
    { title: '4. Diagnostic & Humor Matrix', color: ACCENT_AMBER, desc: 'Pattern-matching parser classifying severity, error phase, generating witty jokes, ELI5 notes, and inline AST fixes.' },
  ];

  components.forEach((comp, idx) => {
    const x = 0.8 + idx * 2.98;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x,
      y: 1.45,
      w: 2.78,
      h: 2.7,
      fill: { color: CARD_BG },
      line: { color: comp.color, width: 1.2 },
      rectRadius: 0.08,
    });

    slide.addText(comp.title, {
      x: x + 0.18,
      y: 1.65,
      w: 2.42,
      h: 0.45,
      fontSize: 12.5,
      fontFace: 'Arial',
      color: comp.color,
      bold: true,
      valign: 'top',
    });

    slide.addText(comp.desc, {
      x: x + 0.18,
      y: 2.15,
      w: 2.42,
      h: 1.85,
      fontSize: 10.5,
      fontFace: 'Arial',
      color: TEXT_LIGHT,
      valign: 'top',
      fit: 'shrink',
    });
  });

  // Bottom Box: State Flow Loop
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8,
    y: 4.35,
    w: 11.73,
    h: 2.35,
    fill: { color: CARD_BG_ALT },
    line: { color: CARD_BORDER, width: 1 },
    rectRadius: 0.08,
  });

  slide.addText('CORE REACTIVE STATE LOOP (Zustand 5 Store Architecture)', {
    x: 1.1,
    y: 4.55,
    w: 11.13,
    h: 0.32,
    fontSize: 12,
    fontFace: 'Arial',
    color: ACCENT_GREEN,
    bold: true,
  });

  slide.addText([
    { text: 'User Code Input  ➔  ', options: { bold: true, color: TEXT_WHITE, fontSize: 11.5 } },
    { text: 'Live Token Stream (200ms debounce)  ➔  ', options: { color: ACCENT_CYAN, fontSize: 11.5 } },
    { text: 'Compilation Trigger (Ctrl+Enter)  ➔  ', options: { color: ACCENT_AMBER, fontSize: 11.5 } },
    { text: 'Pipeline Animation  ➔  ', options: { color: ACCENT_PURPLE, fontSize: 11.5 } },
    { text: 'Diagnostic & Output Parsing  ➔  ', options: { color: ACCENT_GREEN, fontSize: 11.5 } },
    { text: 'Editor Emoji Glyphs + Diff Popovers + Mascot Speech + Streak Tracking', options: { bold: true, color: TEXT_WHITE, fontSize: 11.5 } },
  ], {
    x: 1.1,
    y: 4.95,
    w: 11.13,
    h: 0.7,
    fontFace: 'Arial',
    valign: 'top',
    fit: 'shrink',
  });

  slide.addText('State persistence: User stats, clean run streaks, achievements, and peer line comments persist automatically in browser LocalStorage.', {
    x: 1.1,
    y: 5.85,
    w: 11.13,
    h: 0.5,
    fontSize: 10.5,
    fontFace: 'Arial',
    color: TEXT_MUTED,
    italic: true,
  });
}

// ==========================================
// SLIDE 4: PHASE 1 - LEXICAL ANALYSIS
// ==========================================
{
  const slide = createBaseSlide('Phase 1: Lexical Analysis & Live Token Visualizer', 'Compiler Pipeline');

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8,
    y: 1.45,
    w: 5.7,
    h: 5.25,
    fill: { color: CARD_BG },
    line: { color: ACCENT_CYAN, width: 1 },
    rectRadius: 0.1,
  });

  slide.addText('Theory: Tokenization & Regex Scanning', {
    x: 1.1,
    y: 1.65,
    w: 5.1,
    h: 0.35,
    fontSize: 15,
    fontFace: 'Arial',
    color: ACCENT_CYAN,
    bold: true,
  });

  slide.addText([
    { text: '• Purpose in Compiler Theory:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'Converts continuous source character stream into a sequence of discrete lexical tokens <token_type, value> while discarding whitespace.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '• Built-In Token Categories:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'Keywords (int, return), Identifiers (names), Literals ("strings", 42), Operators (+, <<), Punctuation (;, {}), Comments, and Preprocessor (#include).\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '• Lexical Errors Caught:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'Unterminated string literals (e.g. cout << "hello...;), stray characters (e.g. @, $), and unclosed multiline comments /*.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '• Emoji Assigned: 🔤 ', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'Lexing stage tag ("Caught at the lexical tokenization gate!").', options: { color: ACCENT_GREEN, fontSize: 10.5 } },
  ], {
    x: 1.1,
    y: 2.15,
    w: 5.1,
    h: 4.35,
    fontFace: 'Arial',
    valign: 'top',
    fit: 'shrink',
  });

  // Right Box: Live Token Visualizer UI Component
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.83,
    y: 1.45,
    w: 5.7,
    h: 5.25,
    fill: { color: CARD_BG_ALT },
    line: { color: CARD_BORDER, width: 1 },
    rectRadius: 0.1,
  });

  slide.addText('Live Token Visualizer (TokensTab.tsx)', {
    x: 7.13,
    y: 1.65,
    w: 5.1,
    h: 0.35,
    fontSize: 15,
    fontFace: 'Arial',
    color: ACCENT_GREEN,
    bold: true,
  });

  slide.addText([
    { text: '• Real-Time Interactive Stream:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'Debounced scanning (200ms) instantly categorizes all tokens in the editor without server latency.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '• Visual Color Coding:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: '  - Keywords: Purple\n  - Identifiers: Sky Blue\n  - Literals: Amber\n  - Operators: Mint Green\n  - Punctuation: Slate\n\n', options: { color: TEXT_LIGHT, fontSize: 10.5 } },
    { text: '• Click-to-Jump Navigation:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'Clicking any token badge automatically centers the Monaco editor and highlights the exact line and column.', options: { color: TEXT_MUTED, fontSize: 10.5 } },
  ], {
    x: 7.13,
    y: 2.15,
    w: 5.1,
    h: 4.35,
    fontFace: 'Arial',
    valign: 'top',
    fit: 'shrink',
  });
}

// ==========================================
// SLIDE 5: PHASE 2 - SYNTAX ANALYSIS
// ==========================================
{
  const slide = createBaseSlide('Phase 2: Syntax Analysis (Parsing & Grammar Rules)', 'Compiler Pipeline');

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8,
    y: 1.45,
    w: 5.7,
    h: 5.25,
    fill: { color: CARD_BG },
    line: { color: ACCENT_PURPLE, width: 1 },
    rectRadius: 0.1,
  });

  slide.addText('Context-Free Grammar & AST Construction', {
    x: 1.1,
    y: 1.65,
    w: 5.1,
    h: 0.35,
    fontSize: 15,
    fontFace: 'Arial',
    color: ACCENT_PURPLE,
    bold: true,
  });

  slide.addText([
    { text: '• Grammatical Parsing:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'Validates that token sequences follow C++ production rules (e.g. Statement -> Expression ";").\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '• Abstract Syntax Tree (AST):\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'Hierarchical representation of program logic eliminating redundant syntactic sugar.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '• The #1 Student Pitfall — Semicolons:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'C++ requires explicit statement boundaries. Omitting ; before a subsequent token triggers grammar breakdown.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '• Delimiter Balance Verification:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'Stack-based verification of (), {}, and [] to pinpoint unclosed braces with exact line coordinates.', options: { color: TEXT_MUTED, fontSize: 10.5 } },
  ], {
    x: 1.1,
    y: 2.15,
    w: 5.1,
    h: 4.35,
    fontFace: 'Arial',
    valign: 'top',
    fit: 'shrink',
  });

  // Right Box: Semicolon & Delimiter Handling in EmojiCompiler
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.83,
    y: 1.45,
    w: 5.7,
    h: 5.25,
    fill: { color: CARD_BG_ALT },
    line: { color: CARD_BORDER, width: 1 },
    rectRadius: 0.1,
  });

  slide.addText('EmojiCompiler Parsing Engine Features', {
    x: 7.13,
    y: 1.65,
    w: 5.1,
    h: 0.35,
    fontSize: 15,
    fontFace: 'Arial',
    color: ACCENT_AMBER,
    bold: true,
  });

  slide.addText([
    { text: '✂️ Missing Semicolon Detection:\n', options: { bold: true, color: ACCENT_AMBER, fontSize: 11 } },
    { text: 'Identifies non-terminated expressions and pins glyph marker on the exact line needing the semicolon.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '🧱 Unmatched Bracket Diagnosis:\n', options: { bold: true, color: ACCENT_AMBER, fontSize: 11 } },
    { text: 'Maintains bracket call stack and highlights missing closing braces at input termination.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '✨ Before/After Inline Diff:\n', options: { bold: true, color: ACCENT_AMBER, fontSize: 11 } },
    { text: 'Generates real-time green/red visual diff preview in the error comment popover.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '🚀 1-Click "Apply Fix" Action:\n', options: { bold: true, color: ACCENT_GREEN, fontSize: 11 } },
    { text: 'Applies patch directly to the active Monaco editor line and increments the user fix streak!', options: { color: TEXT_LIGHT, fontSize: 10.5 } },
  ], {
    x: 7.13,
    y: 2.15,
    w: 5.1,
    h: 4.35,
    fontFace: 'Arial',
    valign: 'top',
    fit: 'shrink',
  });
}

// ==========================================
// SLIDE 6: PHASE 3 - SEMANTIC ANALYSIS
// ==========================================
{
  const slide = createBaseSlide('Phase 3: Semantic Analysis & Symbol Tables', 'Compiler Pipeline');

  const semanticCards = [
    {
      emoji: '👻',
      title: 'Undeclared Variables (Ghost Vars)',
      desc: 'Detects variable use before declaration or out of scope. Checks symbol table and suggests appropriate declaration types.',
    },
    {
      emoji: '🧩',
      title: 'Type Compatibility Checking',
      desc: 'Catches invalid type conversions, such as assigning const char* string literals to integer variables.',
    },
    {
      emoji: '📦',
      title: 'Missing Header Detection',
      desc: 'Recognizes cout, vector, string, stack, or unordered_map without required #include directives.',
    },
    {
      emoji: '🗑️',
      title: 'Unused Symbol Warnings',
      desc: 'Flags variables allocated on the stack frame that are never read or mutated, optimizing memory usage.',
    },
  ];

  semanticCards.forEach((c, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 0.8 + col * 6.03;
    const y = 1.45 + row * 2.7;

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x,
      y,
      w: 5.7,
      h: 2.5,
      fill: { color: CARD_BG },
      line: { color: CARD_BORDER, width: 1 },
      rectRadius: 0.1,
    });

    slide.addText(`${c.emoji}  ${c.title}`, {
      x: x + 0.3,
      y: y + 0.25,
      w: 5.1,
      h: 0.4,
      fontSize: 14,
      fontFace: 'Arial',
      color: ACCENT_CYAN,
      bold: true,
      valign: 'top',
    });

    slide.addText(c.desc, {
      x: x + 0.3,
      y: y + 0.75,
      w: 5.1,
      h: 1.5,
      fontSize: 11,
      fontFace: 'Arial',
      color: TEXT_LIGHT,
      valign: 'top',
      fit: 'shrink',
    });
  });
}

// ==========================================
// SLIDE 7: PHASE 4 & 5 - OPTIMIZATION & ASSEMBLY
// ==========================================
{
  const slide = createBaseSlide('Phases 4 & 5: Complexity Analysis & Runtime Traps', 'Compiler Pipeline');

  // Left Card: Big-O Analyzer
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8,
    y: 1.45,
    w: 5.7,
    h: 5.25,
    fill: { color: CARD_BG },
    line: { color: ACCENT_GREEN, width: 1 },
    rectRadius: 0.1,
  });

  slide.addText('Code Complexity Analyzer (Static IR Heuristic)', {
    x: 1.1,
    y: 1.65,
    w: 5.1,
    h: 0.4,
    fontSize: 14,
    fontFace: 'Arial',
    color: ACCENT_GREEN,
    bold: true,
  });

  slide.addText([
    { text: '• Static Loop Depth Estimation:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'Heuristic AST traversal calculating nested for and while loop depths.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '• Big-O Notations Classified:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'O(1) Constant, O(log N) Logarithmic, O(N) Linear, O(N log N) Linearithmic, O(N²) Quadratic, O(N³) Cubic.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '• Bottleneck Highlighting:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'Automatically highlights the deepest loop in Monaco editor with amber warning glyphs.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '• Educational Complexity Badges:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'Real-time footer meter showing complexity score and warning explanations.', options: { color: TEXT_MUTED, fontSize: 10.5 } },
  ], {
    x: 1.1,
    y: 2.15,
    w: 5.1,
    h: 4.35,
    fontFace: 'Arial',
    valign: 'top',
    fit: 'shrink',
  });

  // Right Card: Assembly & Runtime Traps
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.83,
    y: 1.45,
    w: 5.7,
    h: 5.25,
    fill: { color: CARD_BG },
    line: { color: ACCENT_AMBER, width: 1 },
    rectRadius: 0.1,
  });

  slide.addText('Assembly & Runtime Execution Stage', {
    x: 7.13,
    y: 1.65,
    w: 5.1,
    h: 0.4,
    fontSize: 14,
    fontFace: 'Arial',
    color: ACCENT_AMBER,
    bold: true,
  });

  slide.addText([
    { text: '• Assembly Code Generator:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'Produces clean x86-64 assembly (.globl main, pushq %rbp, movl $0, %eax) available for export.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '• 💥 Segfault (SIGSEGV Exit Code 139):\n', options: { bold: true, color: ACCENT_RED, fontSize: 11 } },
    { text: 'Simulates memory access violations when dereferencing nullptr or wild pointers.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '• ♾️ Infinite Loop (TLE Exit Code 137):\n', options: { bold: true, color: ACCENT_AMBER, fontSize: 11 } },
    { text: 'Catches non-terminating loops with simulated CPU time-limit traps.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '• ➗ Division by Zero (SIGFPE Exit Code 136):\n', options: { bold: true, color: ACCENT_CYAN, fontSize: 11 } },
    { text: 'Traps arithmetic exceptions before host runtime corruption.', options: { color: TEXT_MUTED, fontSize: 10.5 } },
  ], {
    x: 7.13,
    y: 2.15,
    w: 5.1,
    h: 4.35,
    fontFace: 'Arial',
    valign: 'top',
    fit: 'shrink',
  });
}

// ==========================================
// SLIDE 8: THE HUMOR MATRIX & DIAGNOSTIC ENGINE
// ==========================================
{
  const slide = createBaseSlide('The Humor Matrix & Adaptive Diagnostics', 'Pedagogical Innovation');

  const levels = [
    {
      num: 'LEVEL 0',
      title: 'Professional Mode 🎓',
      color: ACCENT_CYAN,
      tag: 'Strictly Factual',
      desc: 'Clean, ISO standard-compliant technical explanations. Designed for competitive programming and exam mode without comedic distractions.',
      sample: '“Missing semicolon at line 6 before closing brace.”',
    },
    {
      num: 'LEVEL 1',
      title: 'Light Puns Mode 💡',
      color: ACCENT_GREEN,
      tag: 'Gentle & Encouraging',
      desc: 'Friendly metaphors and gentle computer science puns to keep spirits high during late-night programming assignments.',
      sample: '“Semicolons: the silent heroes of C++. Don’t leave this line hanging!”',
    },
    {
      num: 'LEVEL 2',
      title: 'Roast Mode 🔥',
      color: ACCENT_AMBER,
      tag: 'Playful Code Roasts',
      desc: 'Witty, sharp banter aimed strictly at the code syntax (never the student). Features subtle screen-shake animations and audio laughs.',
      sample: '“Even JavaScript knows a semicolon belongs here. What’s your excuse?”',
    },
  ];

  levels.forEach((lvl, idx) => {
    const x = 0.8 + idx * 4.04;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x,
      y: 1.45,
      w: 3.65,
      h: 5.25,
      fill: { color: CARD_BG },
      line: { color: lvl.color, width: 1.3 },
      rectRadius: 0.1,
    });

    slide.addText(lvl.num, {
      x: x + 0.25,
      y: 1.65,
      w: 3.15,
      h: 0.25,
      fontSize: 10.5,
      fontFace: 'Arial',
      color: lvl.color,
      bold: true,
    });

    slide.addText(lvl.title, {
      x: x + 0.25,
      y: 1.95,
      w: 3.15,
      h: 0.4,
      fontSize: 14,
      fontFace: 'Arial',
      color: TEXT_WHITE,
      bold: true,
    });

    slide.addText(lvl.desc, {
      x: x + 0.25,
      y: 2.45,
      w: 3.15,
      h: 1.7,
      fontSize: 10.5,
      fontFace: 'Arial',
      color: TEXT_MUTED,
      valign: 'top',
      fit: 'shrink',
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x + 0.25,
      y: 4.4,
      w: 3.15,
      h: 2.05,
      fill: { color: CARD_BG_ALT },
      line: { color: CARD_BORDER, width: 1 },
      rectRadius: 0.08,
    });

    slide.addText('SAMPLE MASCOT FEEDBACK:', {
      x: x + 0.4,
      y: 4.55,
      w: 2.85,
      h: 0.25,
      fontSize: 9,
      fontFace: 'Arial',
      color: lvl.color,
      bold: true,
    });

    slide.addText(lvl.sample, {
      x: x + 0.4,
      y: 4.85,
      w: 2.85,
      h: 1.45,
      fontSize: 10.5,
      fontFace: 'Arial',
      color: TEXT_LIGHT,
      italic: true,
      valign: 'top',
      fit: 'shrink',
    });
  });
}

// ==========================================
// SLIDE 9: RESILIENT HYBRID ENGINE
// ==========================================
{
  const slide = createBaseSlide('Engine Resilience: Solving the "Output Hang" Bug', 'System Reliability');

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8,
    y: 1.45,
    w: 5.7,
    h: 5.25,
    fill: { color: CARD_BG },
    line: { color: ACCENT_RED, width: 1 },
    rectRadius: 0.1,
  });

  slide.addText('The Critical Bug Identified 🐛', {
    x: 1.1,
    y: 1.65,
    w: 5.1,
    h: 0.35,
    fontSize: 15,
    fontFace: 'Arial',
    color: ACCENT_RED,
    bold: true,
  });

  slide.addText([
    { text: '• Root Cause Analysis:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'Public Judge0 API endpoint (ce.judge0.com) drops packets or hangs indefinitely behind firewalls.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '• Missing Fetch Timeout:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'Standard fetch() lacked an AbortSignal timeout. Requests waited for infinite TCP keep-alive.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '• UI Freeze Cascade:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'isCompiling remained true forever, the RUN button was permanently locked, and the Output Panel never rendered.', options: { color: TEXT_MUTED, fontSize: 10.5 } },
  ], {
    x: 1.1,
    y: 2.15,
    w: 5.1,
    h: 4.35,
    fontFace: 'Arial',
    valign: 'top',
    fit: 'shrink',
  });

  // Right Card: Solution Implemented
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.83,
    y: 1.45,
    w: 5.7,
    h: 5.25,
    fill: { color: CARD_BG },
    line: { color: ACCENT_GREEN, width: 1.5 },
    rectRadius: 0.1,
  });

  slide.addText('Resilient Dual-Engine Solution 🛡️', {
    x: 7.13,
    y: 1.65,
    w: 5.1,
    h: 0.35,
    fontSize: 15,
    fontFace: 'Arial',
    color: ACCENT_GREEN,
    bold: true,
  });

  slide.addText([
    { text: '• 1200ms Strict AbortController:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'Aborts remote network calls after 1.2s, preventing UI lockups completely.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '• Connection Status Caching:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'Remembers offline state so subsequent compilations run locally with 0ms delay.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '• Full Local C++ Output Evaluator:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'Evaluates cout, cin (stdin stream), variables, and arithmetic expressions accurately in browser.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '• Live Compiling Animation in Output Panel:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'Renders pulse-spinner and active stage indicator so user always receives immediate visual feedback.', options: { color: TEXT_LIGHT, fontSize: 10.5 } },
  ], {
    x: 7.13,
    y: 2.15,
    w: 5.1,
    h: 4.35,
    fontFace: 'Arial',
    valign: 'top',
    fit: 'shrink',
  });
}

// ==========================================
// SLIDE 10: USER EXPERIENCE & GAMIFICATION
// ==========================================
{
  const slide = createBaseSlide('Gamification, Mascot & Interactive Experience', 'Developer Engagement');

  const features = [
    {
      emoji: '🐛',
      title: 'Emotive Bug Mascot',
      desc: 'Interactive companion with 6 animated mood states (idle, happy, panic, segfault, sleepy, laughing) delivering contextual advice.',
    },
    {
      emoji: '🔥',
      title: 'Clean Compilation Streaks',
      desc: 'Tracks consecutive error-free builds in user state, encouraging careful programming habits and thorough code inspection.',
    },
    {
      emoji: '🏆',
      title: 'Achievement Badges',
      desc: 'Unlocks milestone toasts: First Compile, Zero-Error Run, Ghost Hunter (10 vars fixed), Semicolon Veteran, and Night Owl.',
    },
    {
      emoji: '💬',
      title: 'Inline Peer Line Comments',
      desc: 'Google Docs-style comment threads attached directly to source line numbers with resolve toggles and author tags.',
    },
  ];

  features.forEach((f, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 0.8 + col * 6.03;
    const y = 1.45 + row * 2.7;

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x,
      y,
      w: 5.7,
      h: 2.5,
      fill: { color: CARD_BG },
      line: { color: CARD_BORDER, width: 1 },
      rectRadius: 0.1,
    });

    slide.addText(`${f.emoji}  ${f.title}`, {
      x: x + 0.3,
      y: y + 0.25,
      w: 5.1,
      h: 0.4,
      fontSize: 14,
      fontFace: 'Arial',
      color: ACCENT_AMBER,
      bold: true,
      valign: 'top',
    });

    slide.addText(f.desc, {
      x: x + 0.3,
      y: y + 0.75,
      w: 5.1,
      h: 1.5,
      fontSize: 11,
      fontFace: 'Arial',
      color: TEXT_LIGHT,
      valign: 'top',
      fit: 'shrink',
    });
  });
}

// ==========================================
// SLIDE 11: SAMPLE PROGRAM BENCHMARKS & TESTING
// ==========================================
{
  const slide = createBaseSlide('Sample Library & Automated Verification Suite', 'Validation & Testing');

  // Left: 10 Benchmark Sample Programs
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8,
    y: 1.45,
    w: 5.7,
    h: 5.25,
    fill: { color: CARD_BG },
    line: { color: ACCENT_CYAN, width: 1 },
    rectRadius: 0.1,
  });

  slide.addText('10 Curated Educational Programs', {
    x: 1.1,
    y: 1.65,
    w: 5.1,
    h: 0.35,
    fontSize: 15,
    fontFace: 'Arial',
    color: ACCENT_CYAN,
    bold: true,
  });

  slide.addText([
    { text: '1. Unterminated String 🔤 ', options: { bold: true, color: TEXT_WHITE, fontSize: 10 } },
    { text: '— Lexing stage test\n', options: { color: TEXT_MUTED, fontSize: 10 } },
    { text: '2. Missing Semicolon ✂️ ', options: { bold: true, color: TEXT_WHITE, fontSize: 10 } },
    { text: '— Parsing stage test\n', options: { color: TEXT_MUTED, fontSize: 10 } },
    { text: '3. Undeclared Ghost Var 👻 ', options: { bold: true, color: TEXT_WHITE, fontSize: 10 } },
    { text: '— Semantic symbol test\n', options: { color: TEXT_MUTED, fontSize: 10 } },
    { text: '4. Segfault Nullptr Dereference 💥 ', options: { bold: true, color: TEXT_WHITE, fontSize: 10 } },
    { text: '— SIGSEGV test\n', options: { color: TEXT_MUTED, fontSize: 10 } },
    { text: '5. Nested Loop O(N³) 🐢 ', options: { bold: true, color: TEXT_WHITE, fontSize: 10 } },
    { text: '— Big-O complexity test\n', options: { color: TEXT_MUTED, fontSize: 10 } },
    { text: '6. Clean Compile ✨ ', options: { bold: true, color: TEXT_WHITE, fontSize: 10 } },
    { text: '— Confetti celebration & streak\n', options: { color: TEXT_MUTED, fontSize: 10 } },
    { text: '7. Two Sum (Hash Map O(N)) 🎯 ', options: { bold: true, color: TEXT_WHITE, fontSize: 10 } },
    { text: '— Algorithm test\n', options: { color: TEXT_MUTED, fontSize: 10 } },
    { text: '8. Valid Parentheses (Stack) 🧱 ', options: { bold: true, color: TEXT_WHITE, fontSize: 10 } },
    { text: '— Data structures\n', options: { color: TEXT_MUTED, fontSize: 10 } },
    { text: '9. Kadane’s Max Subarray 📈 ', options: { bold: true, color: TEXT_WHITE, fontSize: 10 } },
    { text: '— Dynamic programming\n', options: { color: TEXT_MUTED, fontSize: 10 } },
    { text: '10. Binary Search O(log N) 🔍 ', options: { bold: true, color: TEXT_WHITE, fontSize: 10 } },
    { text: '— Logarithmic search test', options: { color: TEXT_MUTED, fontSize: 10 } },
  ], {
    x: 1.1,
    y: 2.1,
    w: 5.1,
    h: 4.4,
    fontFace: 'Arial',
    valign: 'top',
    fit: 'shrink',
  });

  // Right: Automated Test Results
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.83,
    y: 1.45,
    w: 5.7,
    h: 5.25,
    fill: { color: CARD_BG_ALT },
    line: { color: ACCENT_GREEN, width: 1.5 },
    rectRadius: 0.1,
  });

  slide.addText('Vitest Automated Test Suite (100% Passed)', {
    x: 7.13,
    y: 1.65,
    w: 5.1,
    h: 0.35,
    fontSize: 14,
    fontFace: 'Arial',
    color: ACCENT_GREEN,
    bold: true,
  });

  slide.addText([
    { text: '✓ 1. Compilation Pipeline View (5 tests passed)\n', options: { bold: true, color: ACCENT_GREEN, fontSize: 10 } },
    { text: '  - Correctly categorizes lexing, parsing, semantic, and runtime phases.\n\n', options: { color: TEXT_MUTED, fontSize: 9.5 } },
    { text: '✓ 2. Live Token Visualizer & Lexer (1 test passed)\n', options: { bold: true, color: ACCENT_GREEN, fontSize: 10 } },
    { text: '  - Validates full spectrum C++ keyword, literal, and operator tokens.\n\n', options: { color: TEXT_MUTED, fontSize: 9.5 } },
    { text: '✓ 3. Bug Mascot States & Humor Speech (1 test passed)\n', options: { bold: true, color: ACCENT_GREEN, fontSize: 10 } },
    { text: '  - Ensures dialogue matches humor level without exceeding word budget.\n\n', options: { color: TEXT_MUTED, fontSize: 9.5 } },
    { text: '✓ 4. Error Streaks & Achievements (2 tests passed)\n', options: { bold: true, color: ACCENT_GREEN, fontSize: 10 } },
    { text: '  - Validates streak tracking and milestone unlock conditions.\n\n', options: { color: TEXT_MUTED, fontSize: 9.5 } },
    { text: '✓ 5. Complexity Analyzer Heuristics (3 tests passed)\n', options: { bold: true, color: ACCENT_GREEN, fontSize: 10 } },
    { text: '  - Accurately classifies O(1), O(log N), O(N), and O(N³).\n\n', options: { color: TEXT_MUTED, fontSize: 9.5 } },
    { text: '✓ 6. Resilient Compiler Execution (5 tests passed)\n', options: { bold: true, color: ACCENT_GREEN, fontSize: 10 } },
    { text: '  - Verifies zero-hang execution, custom cout evaluation, and runtime traps.', options: { color: TEXT_MUTED, fontSize: 9.5 } },
  ], {
    x: 7.13,
    y: 2.1,
    w: 5.1,
    h: 4.4,
    fontFace: 'Arial',
    valign: 'top',
    fit: 'shrink',
  });
}

// ==========================================
// SLIDE 12: TECHNICAL IMPLEMENTATION STACK
// ==========================================
{
  const slide = createBaseSlide('Technical Implementation Stack & Tools', 'Technologies Used');

  const stack = [
    { category: 'Frontend Core', tech: 'React 19 & TypeScript 5.9', desc: 'Component lifecycle, strict typing, and zero runtime type errors across all compiler services.' },
    { category: 'Build & Bundling', tech: 'Vite 7.3 & ESModules', desc: 'Lightning-fast Hot Module Replacement (HMR) and optimized multi-chunk production tree-shaking.' },
    { category: 'Code Editor', tech: 'Monaco Editor (@monaco-editor/react)', desc: 'Industrial-grade VS Code editor core with custom glyph margins, line decorations, and keybindings.' },
    { category: 'State Management', tech: 'Zustand 5.0 with LocalStorage', desc: 'Lightweight atomic state store managing code, diagnostics, comments, streaks, and settings.' },
    { category: 'Cinematic Motion', tech: 'GSAP 3.15 & ScrollTrigger', desc: 'Curtain zoom landing sequence, scrubbed transform depth effects, and smooth layout resizing.' },
    { category: 'Reporting & Audio', tech: 'jsPDF 4.2 & Web Audio API', desc: 'Full diagnostic PDF debugging report export and synthesized audio reactions with zero sound file assets.' },
  ];

  stack.forEach((item, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const x = 0.8 + col * 4.04;
    const y = 1.45 + row * 2.7;

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x,
      y,
      w: 3.65,
      h: 2.5,
      fill: { color: CARD_BG },
      line: { color: CARD_BORDER, width: 1 },
      rectRadius: 0.1,
    });

    slide.addText(item.category.toUpperCase(), {
      x: x + 0.25,
      y: y + 0.2,
      w: 3.15,
      h: 0.25,
      fontSize: 10,
      fontFace: 'Arial',
      color: ACCENT_CYAN,
      bold: true,
    });

    slide.addText(item.tech, {
      x: x + 0.25,
      y: y + 0.45,
      w: 3.15,
      h: 0.35,
      fontSize: 12.5,
      fontFace: 'Arial',
      color: TEXT_WHITE,
      bold: true,
    });

    slide.addText(item.desc, {
      x: x + 0.25,
      y: y + 0.85,
      w: 3.15,
      h: 1.45,
      fontSize: 10.5,
      fontFace: 'Arial',
      color: TEXT_MUTED,
      valign: 'top',
      fit: 'shrink',
    });
  });
}

// ==========================================
// SLIDE 13: CONCLUSION & FUTURE SCOPE
// ==========================================
{
  const slide = createBaseSlide('Conclusion & Future Horizons', 'Summary & Roadmap');

  // Left Card: Key Takeaways
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8,
    y: 1.45,
    w: 5.7,
    h: 5.25,
    fill: { color: CARD_BG },
    line: { color: ACCENT_GREEN, width: 1 },
    rectRadius: 0.1,
  });

  slide.addText('Key Educational Contributions 🏆', {
    x: 1.1,
    y: 1.65,
    w: 5.1,
    h: 0.35,
    fontSize: 15,
    fontFace: 'Arial',
    color: ACCENT_GREEN,
    bold: true,
  });

  slide.addText([
    { text: '• Demystified Compiler Phases:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'Transforms abstract textbook phases into live visual steps (Lexer, Parser, Semantic, IR, Assembly).\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '• Humanized Debugging:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'Eliminates error intimidation through emoji diagnostics, before/after diffs, and 1-click AST fix application.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '• Resilient Dual-Engine Design:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'Guarantees 100% zero-hang execution both online (Judge0) and offline (Local C++ simulator).\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '• Gamified Code Quality:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'Encourages clean coding standards through clean run streaks, achievements, and complexity meters.', options: { color: TEXT_LIGHT, fontSize: 10.5 } },
  ], {
    x: 1.1,
    y: 2.15,
    w: 5.1,
    h: 4.35,
    fontFace: 'Arial',
    valign: 'top',
    fit: 'shrink',
  });

  // Right Card: Future Scope
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.83,
    y: 1.45,
    w: 5.7,
    h: 5.25,
    fill: { color: CARD_BG },
    line: { color: ACCENT_CYAN, width: 1 },
    rectRadius: 0.1,
  });

  slide.addText('Future Roadmap & Enhancements 🚀', {
    x: 7.13,
    y: 1.65,
    w: 5.1,
    h: 0.35,
    fontSize: 15,
    fontFace: 'Arial',
    color: ACCENT_CYAN,
    bold: true,
  });

  slide.addText([
    { text: '• In-Browser WebAssembly Clang (Wasm):\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'Compiling real Clang 18 into WebAssembly to execute native multi-translation units directly in browser memory.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '• Interactive 3D AST Visualization Graph:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'Rendering interactive D3/Three.js node graphs of the Abstract Syntax Tree as code is typed.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '• Multi-File Compilation Support:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'Header inclusion graphs (.h/.cpp) to visualize linker resolution and symbol table linking.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '• Classroom Collaboration Mode:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11 } },
    { text: 'WebRTC real-time pair programming with instructor live code inspection and comments.', options: { color: TEXT_LIGHT, fontSize: 10.5 } },
  ], {
    x: 7.13,
    y: 2.15,
    w: 5.1,
    h: 4.35,
    fontFace: 'Arial',
    valign: 'top',
    fit: 'shrink',
  });
}

// Generate the presentation file
const outputPath = path.join(__dirname, 'EmojiCompiler_Presentation.pptx');
pptx.writeFile({ fileName: outputPath })
  .then(() => {
    console.log('Presentation regenerated successfully at: ' + outputPath);
  })
  .catch((err) => {
    console.error('Error generating presentation:', err);
    process.exit(1);
  });
