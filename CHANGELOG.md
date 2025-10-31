# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2025-11-01

### 🐛 Bug Fixes
- **Fixed bullet list conflict**: Regular `*` and `-` bullets now correctly render as `list-disc` instead of being mistakenly detected as emoji bullets
- **Improved pattern matching order**: Unordered list patterns now checked before emoji patterns to prevent conflicts

### 🎨 Improvements
- Better emoji bullet detection with conflict prevention
- More robust list type detection logic

## [1.0.0] - 2025-11-01

### 🎉 Initial Release

#### Added
- **Math Rendering**: Full KaTeX support for inline (`$...$`) and display (`$$...$$`) mathematics
- **Chemistry Notation**: mhchem extension for chemical formulas and reactions (`$\ce{...}$`)
- **Syntax Highlighting**: Support for 190+ languages via highlight.js
- **Smart Code Protection**: Dollar signs in code blocks stay literal, never rendered as math
- **Standard Markdown**: Complete support for headers, lists, tables, blockquotes, links, images
- **Typography Features**: Smart quotes, em dashes, and typographic enhancements
- **TypeScript Support**: Full type definitions included
- **Dual Module Format**: ESM and CommonJS builds for maximum compatibility
- **XSS Protection**: Automatic HTML escaping in code blocks

#### Features
- Parse markdown with `parse(markdown, options)` function
- Configurable options: `enableMath`, `enableChemistry`, `enableHighlight`, `enableTypography`
- Parsing order: Code → Math → Markdown (ensures proper isolation)
- Unicode support: Greek letters, emoji, international characters
- Performance: ~600ms for 1000 lines
- Browser and Node.js compatible

#### Documentation
- Comprehensive README with examples
- API reference with TypeScript types
- Real-world usage examples (scientific papers, chemistry reports)
- Live demo at [markdowntopdf.tech](https://www.markdowntopdf.tech)

#### Technical
- Built with TypeScript
- Uses tsup for optimized builds
- KaTeX ^0.16.11 for math rendering
- highlight.js ^11.10.0 for syntax highlighting
- Node.js 16+ support

[1.0.0]: https://github.com/themrsami/advanced-markdown/releases/tag/v1.0.0
