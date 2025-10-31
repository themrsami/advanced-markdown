# 🚀 Advanced Markdown

> **A powerful, extensible Markdown parser with built-in support for math equations (KaTeX) and chemistry notation (mhchem). Perfect for scientific documents, technical documentation, and educational content.**

[![npm version](https://img.shields.io/npm/v/advanced-markdown)](https://www.npmjs.com/package/advanced-markdown)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/npm/l/advanced-markdown)](LICENSE)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/advanced-markdown)](https://bundlephobia.com/package/advanced-markdown)

✨ **[Try it Live](https://www.markdowntopdf.tech)** - Experience advanced-markdown in action!

---

## ✨ Why Advanced Markdown?

Traditional Markdown parsers are great, but what if you need to write scientific papers, chemistry notes, or mathematical documentation? **Advanced Markdown** bridges that gap by seamlessly integrating:

- 🧮 **Mathematical Equations** - Render beautiful LaTeX math with KaTeX (inline `$x^2$` and display `$$equations$$`)
- 🧪 **Chemistry Notation** - Write chemical formulas and reactions with mhchem (`$\ce{H2O}$`, `$\ce{2H2 + O2 -> 2H2O}$`)
- 💻 **Syntax Highlighting** - Code blocks with 190+ languages via highlight.js
- 🎯 **Smart Parsing** - Code-first approach ensures dollar signs in code stay literal
- 📦 **Zero Config** - Works out of the box with sensible defaults
- ⚡ **Blazing Fast** - Parses 1000 lines in under 1 second
- 🔒 **XSS Safe** - Automatically escapes HTML in code blocks
- 🌍 **Unicode Ready** - Full support for international characters and emoji

### 🎓 Perfect For:
- Scientific papers and research documents
- Chemistry lab reports and reactions
- Mathematical documentation and tutorials
- Technical blogs with code examples
- Educational content (Jupyter-style notebooks)
- API documentation with examples

---

## 📦 Installation

```bash
npm install advanced-markdown
```

Or with yarn:
```bash
yarn add advanced-markdown
```

---

## 🚀 Quick Start

### Basic Usage

```javascript
import { parse } from 'advanced-markdown';

const markdown = `
# Hello World

This is **bold** and this is *italic*.

Math equation: $E = mc^2$

Chemistry: $\\ce{H2O}$
`;

const html = parse(markdown);
console.log(html);
```

### With Options

```javascript
const html = parse(markdown, {
  enableMath: true,        // Enable KaTeX math rendering (default: true)
  enableChemistry: true,   // Enable mhchem chemistry notation (default: true)
  enableHighlight: true,   // Enable syntax highlighting (default: true)
  enableTypography: true   // Enable smart quotes and dashes (default: true)
});
```

### In React/Next.js

```tsx
'use client'; // For Next.js 13+

import { parse } from 'advanced-markdown';
import 'katex/dist/katex.min.css'; // Required for math rendering
import 'highlight.js/styles/github-dark.css'; // Optional: syntax highlighting theme

export default function MarkdownRenderer({ content }) {
  const html = parse(content);
  
  return (
    <div 
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
}
```

---

## 🎨 Features & Examples

### 📝 Standard Markdown

All your favorite Markdown features work perfectly:

```markdown
# Headers (H1-H6)
**Bold**, *Italic*, ***Both***, ~~Strikethrough~~

- Bullet lists
1. Numbered lists
- [x] Task lists

> Blockquotes with **formatting**

[Links](https://example.com) and ![Images](image.png)

| Tables | Are | Supported |
|--------|-----|-----------|
| Cell 1 | Cell 2 | Cell 3 |

---

Horizontal rules and `inline code`
```

### 🧮 Mathematical Equations

#### Inline Math
Write inline equations with single dollar signs:

```markdown
Einstein's equation: $E = mc^2$

Quadratic formula: $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$

Greek letters: $\alpha, \beta, \gamma, \Delta, \Omega$
```

**Renders as:** Einstein's equation: E = mc², Quadratic formula with proper formatting, etc.

#### Display Math
Use double dollar signs for centered display equations:

```markdown
$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$

$$\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}$$

$$\begin{pmatrix} a & b \\ c & d \end{pmatrix}$$
```

**Supports:**
- Integrals, summations, products
- Fractions, roots, exponents
- Matrices and arrays
- Greek letters and symbols
- All standard LaTeX math commands

### 🧪 Chemistry Notation

Write chemical formulas and reactions beautifully:

#### Simple Molecules
```markdown
Water: $\ce{H2O}$
Carbon dioxide: $\ce{CO2}$
Sulfuric acid: $\ce{H2SO4}$
```

#### Chemical Reactions
```markdown
Combustion: $\ce{CH4 + 2O2 -> CO2 + 2H2O}$

Equilibrium: $\ce{N2(g) + 3H2(g) <=> 2NH3(g)}$

Precipitation: $\ce{AgNO3(aq) + NaCl(aq) -> AgCl(s) v + NaNO3(aq)}$
```

**Features:**
- Automatic subscripts (H₂O)
- Reaction arrows (→, ⇌, ↔)
- States of matter: (s), (l), (g), (aq)
- Charges and oxidation states
- Complex ions and coordination compounds

### 💻 Code Blocks with Syntax Highlighting

Support for 190+ languages:

````markdown
```javascript
// JavaScript with syntax highlighting
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
```

```python
# Python example
def calculate_energy(mass):
    c = 299792458  # Speed of light
    return mass * c ** 2
```

```sql
SELECT compound, formula, molar_mass
FROM chemicals
WHERE state = 'liquid';
```
````

**Languages supported:** JavaScript, Python, TypeScript, Java, C++, Rust, Go, SQL, HTML, CSS, Bash, and 180+ more!

### 🛡️ Code Protection

**Smart parsing ensures dollar signs in code stay literal:**

````markdown
```javascript
const price = "$100.50";        // Stays literal
const formula = "$E = mc^2$";   // Not rendered as math
const chem = "$\ce{H2O}$";      // Not rendered as chemistry
```
````

Inline code also protected: `$x^2$` stays as literal text.

---

## 📚 API Reference

### `parse(markdown: string, options?: ParseOptions): string`

Parses markdown text and returns HTML string.

#### Parameters

- **markdown** (`string`, required) - The markdown text to parse
- **options** (`ParseOptions`, optional) - Configuration options

#### ParseOptions

```typescript
interface ParseOptions {
  enableMath?: boolean;        // Enable KaTeX math rendering (default: true)
  enableChemistry?: boolean;   // Enable mhchem chemistry notation (default: true)
  enableHighlight?: boolean;   // Enable code syntax highlighting (default: true)
  enableTypography?: boolean;  // Enable smart quotes and dashes (default: true)
}
```

#### Returns

Returns an HTML string that can be safely inserted into the DOM.

#### Example

```javascript
import { parse } from 'advanced-markdown';

const html = parse('# Hello $E=mc^2$', {
  enableMath: true,
  enableChemistry: true,
  enableHighlight: true
});

// Returns: '<h1 id="hello-emc2">Hello <span class="math-inline">...</span></h1>'
```

---

## 🎯 Real-World Examples

### Scientific Paper

```markdown
# Thermodynamics Study

## Gibbs Free Energy

The Gibbs free energy is defined as:
$$\Delta G = \Delta H - T\Delta S$$

Where $\Delta H$ is enthalpy change, $T$ is temperature, and $\Delta S$ is entropy change.

## Experimental Procedure

```python
def calculate_gibbs(delta_h, temp, delta_s):
    """Calculate Gibbs free energy
    
    Args:
        delta_h: Enthalpy change (J/mol)
        temp: Temperature (K)
        delta_s: Entropy change (J/mol·K)
    
    Returns:
        Gibbs free energy (J/mol)
    """
    return delta_h - temp * delta_s
```

## Results

The reaction $\ce{2H2(g) + O2(g) -> 2H2O(l)}$ has:
- $\Delta H = -286\,\text{kJ/mol}$
- $\Delta S = -163\,\text{J/mol·K}$
```

### Chemistry Lab Report

```markdown
# Acid-Base Titration

## Reaction
$$\ce{HCl(aq) + NaOH(aq) -> NaCl(aq) + H2O(l)}$$

## Data

| Trial | Volume HCl | Volume NaOH | Molarity |
|-------|-----------|-------------|----------|
| 1     | 25.0 mL   | 24.8 mL     | $0.992\,M$ |
| 2     | 25.0 mL   | 25.2 mL     | $1.008\,M$ |

## Conclusion

The balanced equation shows a **1:1 molar ratio** between $\ce{HCl}$ and $\ce{NaOH}$.
```

---

## 🎨 Styling Your Content

Advanced Markdown generates semantic HTML with CSS classes for easy styling:

```css
/* Math equations */
.math-inline { /* Inline math like $x^2$ */ }
.math-display { /* Display math like $$equations$$ */ }
.math-error { /* Math rendering errors */ }

/* Code blocks */
.code-header { /* Language label */ }
.code-language { /* Language name */ }
pre code { /* Code content */ }

/* Standard elements */
h1, h2, h3 { /* Headers */ }
table { /* Tables */ }
blockquote { /* Quotes */ }
```

**Recommended CSS frameworks:**
- [KaTeX CSS](https://katex.org/) (required for math)
- [Highlight.js themes](https://highlightjs.org/static/demo/) (for code highlighting)
- Tailwind Typography, GitHub Markdown CSS, or your custom styles

---

## ⚡ Performance

Advanced Markdown is optimized for speed:

- ✅ Parses **1000 lines in ~600ms**
- ✅ Handles large documents (10,000+ lines) without lag
- ✅ Efficient regex-based parsing
- ✅ Minimal bundle size (~15KB for ESM)

**Benchmark:**
```
Document Size    Parse Time
100 lines        ~60ms
1,000 lines      ~600ms
10,000 lines     ~6s
```

---

## 🔒 Security

Advanced Markdown takes security seriously:

- ✅ **XSS Protection** - HTML in code blocks is automatically escaped
- ✅ **Safe Rendering** - No `eval()` or `Function()` usage
- ✅ **Input Sanitization** - Malicious scripts are neutralized
- ✅ **No Remote Code Execution** - All processing is local

**Example:**
```markdown
```html
<script>alert('XSS')</script>
```
```

Renders safely as escaped HTML: `&lt;script&gt;alert('XSS')&lt;/script&gt;`

---

## 🌍 Browser & Node.js Support

### Browser Support
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ All modern browsers with ES2020 support

### Node.js Support
- ✅ Node.js 14+
- ✅ CommonJS and ES Modules
- ✅ TypeScript with full type definitions

---

## 📖 Documentation & Resources

- 📘 **[Live Demo](https://www.markdowntopdf.tech)** - Try it in your browser
- 📗 **[API Reference](#api-reference)** - Complete API documentation
- 📕 **[Examples](#real-world-examples)** - Real-world usage examples
- 📙 **[GitHub Repository](https://github.com/themrsami/markdowntopdf)** - Source code

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Report Bugs** - Open an issue on GitHub
2. **Suggest Features** - Share your ideas
3. **Submit PRs** - Fix bugs or add features
4. **Improve Docs** - Help make documentation better

### Development Setup

```bash
# Clone the repository
git clone https://github.com/themrsami/markdowntopdf.git
cd markdowntopdf/advanced-markdown

# Install dependencies
npm install

# Build the package
npm run build

# Run tests
npm test
```

---

## 📄 License

MIT © [Usama Nazir](https://github.com/themrsami)

---

## 🙏 Acknowledgments

Advanced Markdown is built on top of these amazing projects:

- **[KaTeX](https://katex.org/)** - Fast math rendering
- **[mhchem](https://mhchem.github.io/MathJax-mhchem/)** - Chemistry notation for KaTeX
- **[highlight.js](https://highlightjs.org/)** - Syntax highlighting

---

## ⭐ Star Us!

If you find Advanced Markdown useful, please consider giving it a star on [GitHub](https://github.com/themrsami/markdowntopdf)! ⭐

---

## 🔗 Related Projects

- **[MarkdownToPDF.tech](https://www.markdowntopdf.tech)** - Convert Markdown to beautiful PDFs online (powered by advanced-markdown!)
- Create your own amazing projects with advanced-markdown!

---

<div align="center">

**Made with ❤️ by [Usama Nazir](https://github.com/themrsami)**

[npm](https://www.npmjs.com/package/advanced-markdown) • [GitHub](https://github.com/themrsami/markdowntopdf) • [Website](https://www.markdowntopdf.tech)

</div>
