# 🔥 EmojiCompiler — Friendly, Visual & Funny C++ Playground

[![React 19](https://img.shields.io/badge/React-19-61dafb.svg?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3-646cff.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
[![GSAP](https://img.shields.io/badge/GSAP-3.15-88CE02.svg?style=flat-square&logo=greensock)](https://greensock.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

A high-performance, web-based C++ playground and educational compiler suite that turns obscure compiler diagnostics into friendly, visual, funny, and interactive learning experiences.

Repository: **[https://github.com/Someone1701/emoji_compiler](https://github.com/Someone1701/emoji_compiler)**

---

## 🎬 GSAP Cinematic Intro & Landing Page

Inspired by cinematic motion architecture (such as **Sentinal**):
- **Curtain Zoom Intro Screen (`#intro-screen`)**:
  - Cosmic beacon and pulsing radiant aura.
  - Kinetic emblem with floating particle rings.
  - Pinned `ScrollTrigger` scrub that smoothly scales the emblem 3.2x into the camera with dynamic depth-of-field blur (`blur(12px)`) and opacity dissipation.
- **Interactive Hero Simulator**:
  - Live preview terminal demonstrating missing semicolons with inline before/after diffs and an interactive "Apply Fix ✨" button complete with confetti bursts.
- **5-Stage Compiler Pipeline Stepper**:
  - Visual tracking through *Preprocess*, *Lex/Parse*, *Semantic Analysis*, *IR CodeGen*, and *Assemble/Link*.
- **Feature Bento Grid**:
  - Glassmorphic, hover-reactive cards highlighting AI-assisted auto-fix, humor roast levels, Big-O complexity analysis, PDF exports, and audio chimes.
- **Algorithm Showcase**:
  - Instant loading cards for classic competitive programming patterns (Two Sum, Valid Parentheses, Kadane's Max Subarray, Binary Search).

---

## 🌟 Core Features

1. **Monaco C++ Code Editor**:
   - Full C++ syntax highlighting, line numbers, automatic layout, and Dark/Light theme toggle.
   - Run shortcut: `Ctrl+Enter` (or `Cmd+Enter` on macOS).
   - Stdin input panel for interactive programs (`cin`, `getline`).
   - Console & Error Summary panels with formatted stdout, stderr, execution time, and memory usage.

2. **C++ Compilation Engine**:
   - Selectable **C++17** (GCC 9.2) and **C++20** (GCC 14.1) sandbox via Judge0 API with execution time & memory limits.
   - Built-in resilient offline simulation fallback for 100% zero-downtime demonstration.
   - Intelligent diagnostic parser extracting `{ line, column, severity, message, code snippet, errorType }`.

3. **Emoji Error Highlighting**:
   - In-editor gutter icons and squiggly line decorations with animated emojis:
     - ✂️ Missing semicolon
     - 👻 Undeclared variable / identifier
     - 🧩 Type mismatch
     - 💥 Segmentation fault (SIGSEGV / nullptr)
     - ♾️ Infinite loop / Time Limit Exceeded (TLE)
     - 📦 Missing `#include` header
     - 🗑️ Unused variable
     - 🏃 Missing return statement
     - ➗ Division by zero (SIGFPE)
     - 🧱 Brace / parenthesis mismatch
     - 🔥 General compiler error
     - ⚠️ Compiler warning
     - 💡 Helpful compiler note
     - 🎉 Zero-error clean compilation (with confetti celebration!)

4. **Interactive Comment Popover**:
   - Clicking or hovering an error opens an anchored comment bubble featuring:
     - **Witty Joke** tailored to the error type.
     - **Plain-English Explanation** & toggleable **"Explain Like I'm a Beginner" (ELI5)** mode.
     - **Suggested Fix with Before/After Code Diff** (highlighted in red & green).
     - **"Apply Fix" button** that patches the editor code automatically.
     - **Collapsible Raw Compiler Message** with one-click copy.
     - **Google Docs-style line comments** with reply threads and resolve status.

5. **Humor Level Control**:
   - `0 = Professional`: Clean, factual, technical explanations with zero jokes.
   - `1 = Light Puns`: Gentle humor and relatable metaphors.
   - `2 = Full Roast`: Playful, witty sarcasm aimed at the code (never insulting the user).
   - Rotating status messages while compiling (e.g., *"Bribing the compiler with virtual coffee..."*, *"Counting semicolons..."*).

6. **Advanced Analysis & Utilities**:
   - **Big-O Complexity Analyzer**: Heuristic static analysis estimating time complexity ($O(1)$, $O(\log N)$, $O(N)$, $O(N \log N)$, $O(N^2)$, $O(2^N)$) alongside AST token frequencies.
   - **PDF Report Exporter**: Download comprehensive debugging summaries with code snippets, diagnostics, and resolved fixes.
   - **Sound Effects Engine**: Web Audio synthesis for compile clicks, success chimes, and error thuds.
   - **Mascot Moods**: Interactive animated companion that reacts to code execution states.

---

## 🏗️ Architecture & File Structure

```
emoji_compiler/
├── src/
│   ├── app/
│   │   ├── App.tsx                     # Top-level view switcher ('landing' | 'editor')
│   │   ├── EmojiCompiler.css           # Design tokens, themes & layout styling
│   │   ├── main.tsx                    # React DOM entry point
│   │   └── store/
│   │       └── emojiCompilerStore.ts   # Zustand state (code, diagnostics, comments, humor)
│   ├── components/
│   │   ├── Header/
│   │   │   └── Header.tsx              # Toolbar, sample picker, humor slider, standard selector
│   │   ├── Landing/
│   │   │   ├── LandingPage.tsx         # GSAP pinned curtain intro, hero simulator & bento grid
│   │   │   └── Landing.css             # Glassmorphic, cosmic dark theme styles & animations
│   │   ├── Editor/
│   │   │   └── EmojiCodeEditor.tsx     # Monaco editor with glyph margin emojis & squiggly lines
│   │   ├── Comments/
│   │   │   └── ErrorCommentPopover.tsx # Interactive bubble, diff view, apply fix & peer notes
│   │   ├── Complexity/
│   │   │   └── ComplexityPanel.tsx     # Big-O estimation and token frequency breakdown
│   │   ├── Panels/
│   │   │   └── OutputPanel.tsx         # Console stdout/stderr, Error Summary, Stdin & Comments
│   │   ├── Mascot/
│   │   │   └── MascotCompanion.tsx     # Animated emotive mascot companion
│   │   └── Export/
│   │       └── ExportPdfButton.tsx     # PDF report generator using jsPDF
│   ├── data/
│   │   ├── jokes.json                  # Database of jokes & beginner explanations per error type
│   │   └── samplePrograms.ts           # 11 pre-configured programs with deliberate bugs & algorithms
│   ├── lib/
│   │   ├── compilerService.ts          # Judge0 API integration + offline simulation engine
│   │   ├── diagnosticParser.ts         # Regex GCC/Clang diagnostic parser & auto-fix generator
│   │   ├── complexityAnalyzer.ts       # AST token analysis & Big-O estimation
│   │   ├── pipelinePhases.ts           # 5-stage compilation pipeline data & phase mapping
│   │   ├── soundEffects.ts             # Web Audio API sound generator
│   │   └── pdfExporter.ts              # PDF diagnostic reporting
│   └── types/
│       └── compiler.ts                 # TypeScript interfaces (Diagnostic, Fix, Comment, Result)
├── index.html                          # HTML5 shell with Google Fonts & emoji favicon
├── vite.config.ts                      # Vite build configuration (base: './')
└── package.json                        # Dependencies and build scripts
```

---

## 🔍 How the Diagnostic Parser Works

1. **Extraction**:
   - Compiler output is captured from GCC/Clang `compile_output` or `stderr`.
   - The parser matches standard GCC/Clang diagnostic signatures:
     ```regex
     (?:^|[\r\n])(?:[a-zA-Z0-9_\-\.\/\\:]+):(\d+):(\d+):\s*(fatal error|error|warning|note):\s*(.*)
     ```
2. **Classification & Normalization**:
   - `categorizeError(message, sourceCode)` sanitizes unicode curly quotes (`\u2018`, `\u2019`) and categorizes error signatures (e.g. missing semicolons, undeclared identifiers, type conversions, control path missing return, SIGSEGV).
3. **Joke & Explanation Mapping**:
   - Looks up the `errorType` inside `src/data/jokes.json`.
   - Selects a joke matching the user's active `humorLevel` (0, 1, or 2).
4. **Auto-Fix Generation**:
   - `generateSuggestedFix()` analyzes target lines and constructs:
     - `originalCode`: the faulty line
     - `replacementCode`: the patched line (e.g. appending `;`, prepending `#include <iostream>`, or initializing safe pointers)
     - `description`: human-readable summary of the fix.

---

## 🎭 How to Add New Jokes

All jokes, explanations, and loading banners are stored in:
📂 `src/data/jokes.json`

To add a new joke or error category:
```json
"your_error_type": {
  "emoji": "🎯",
  "name": "Target Error Name",
  "plain": "Formal technical explanation.",
  "beginner": "ELI5 simple explanation for novices.",
  "level_0": [
    "Professional explanation with zero jokes."
  ],
  "level_1": [
    "Light pun or relatable metaphor."
  ],
  "level_2": [
    "Spicy, sarcastic code roast."
  ]
}
```

---

## 🚀 Setup and Run Instructions

### 1. Prerequisites
- **Node.js** ≥ 18
- **npm** ≥ 9

### 2. Install & Start Dev Server
```bash
# Clone the repository
git clone https://github.com/Someone1701/emoji_compiler.git
cd emoji_compiler

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Open your browser to:
👉 **http://localhost:5173/**

### 3. Production Build & Test
```bash
# Type check and build bundle
npm run build

# Run unit tests
npx vitest run

# Preview production build
npm run preview
```

---

## 📄 License

MIT © [Someone1701](https://github.com/Someone1701)
