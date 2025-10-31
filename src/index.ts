import katex from 'katex';
import hljs from 'highlight.js';

// Load mhchem extension for chemistry notation
// @ts-ignore - mhchem is a side-effect import
import 'katex/contrib/mhchem';

/**
 * Options for parsing markdown
 */
export interface ParseOptions {
  /**
   * Enable math rendering with KaTeX
   * @default true
   */
  enableMath?: boolean;
  
  /**
   * Enable chemistry notation support (requires mhchem extension)
   * @default true
   */
  enableChemistry?: boolean;
  
  /**
   * Enable code syntax highlighting with highlight.js
   * @default true
   */
  enableHighlight?: boolean;
  
  /**
   * Typography settings to apply during rendering
   */
  typography?: {
    /**
     * Font family to use
     */
    font?: string;
    /**
     * Line height multiplier
     */
    lineHeight?: number;
    /**
     * Base font size in pixels
     */
    bodySize?: number;
    /**
     * H1 font size in pixels
     */
    h1Size?: number;
    /**
     * H2 font size in pixels
     */
    h2Size?: number;
    /**
     * H3 font size in pixels
     */
    h3Size?: number;
    /**
     * H4 font size in pixels
     */
    h4Size?: number;
    /**
     * H5 font size in pixels
     */
    h5Size?: number;
    /**
     * H6 font size in pixels
     */
    h6Size?: number;
  };
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Parse markdown to HTML
 * 
 * @param markdown - The markdown string to parse
 * @param options - Parsing options
 * @returns HTML string
 * 
 * @example
 * ```typescript
 * import { parse } from 'advanced-markdown';
 * 
 * const html = parse('# Hello World\n\nThis is **bold** text with $E = mc^2$');
 * ```
 */
export function parse(markdown: string, options: ParseOptions = {}): string {
  const {
    enableMath = true,
    enableChemistry = true,
    enableHighlight = true
  } = options;

  let html = markdown;

  // Remove HTML comments
  html = html.replace(/<!--[\s\S]*?-->/g, '');

  // STEP 1: Extract code blocks FIRST to protect them from all other processing
  const codeBlocks: string[] = [];
  const inlineCode: string[] = [];
  
  // Store triple backtick code blocks
  html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
    const placeholder = `__CODEBLOCK_${codeBlocks.length}__`;
    // Split by newline to check for language
    const firstNewline = code.indexOf('\n');
    let lang = '';
    let codeContent = code;
    
    if (firstNewline > -1) {
      const firstLine = code.substring(0, firstNewline).trim();
      // Check if first line looks like a language identifier (no spaces, short)
      if (firstLine && firstLine.length < 20 && !/\s/.test(firstLine)) {
        lang = firstLine;
        codeContent = code.substring(firstNewline + 1);
      }
    }
    
    // Remove only leading/trailing newlines, keep all spaces/tabs
    const trimmedCode = codeContent.replace(/^\n+|\n+$/g, '');
    const languageClass = lang ? `language-${lang}` : '';
    const languageLabel = lang || 'code';
    
    // Apply syntax highlighting if enabled
    let highlightedCode = escapeHtml(trimmedCode);
    if (enableHighlight && lang) {
      try {
        const highlighted = hljs.highlight(trimmedCode, { 
          language: lang,
          ignoreIllegals: true 
        });
        highlightedCode = highlighted.value;
      } catch (e) {
        // If language not supported, fall back to escaped HTML
        highlightedCode = escapeHtml(trimmedCode);
      }
    }
    
    const codeBlock = `<pre><div class="code-header"><span class="code-language">${languageLabel}</span></div><code class="${languageClass}">${highlightedCode}</code></pre>`;
    codeBlocks.push(codeBlock);
    return placeholder;
  });
  
  // Store inline code (single backticks)
  html = html.replace(/`([^`\n]+?)`/g, (match, code) => {
    const placeholder = `__INLINECODE_${inlineCode.length}__`;
    inlineCode.push(`<code>${escapeHtml(code)}</code>`);
    return placeholder;
  });

  // STEP 2: Extract math blocks (now safe from code block interference)
  const displayMath: string[] = [];
  const inlineMath: string[] = [];
  
  if (enableMath) {
    // Display math blocks ($$...$$)
    html = html.replace(/\$\$([\s\S]+?)\$\$/g, (match, math) => {
      const placeholder = `__DISPLAYMATH_${displayMath.length}__`;
      displayMath.push(math);
      return placeholder;
    });
    
    // Inline math ($...$)
    html = html.replace(/\$([^\$\n]+?)\$/g, (match, math) => {
      const placeholder = `__INLINEMATH_${inlineMath.length}__`;
      inlineMath.push(math.trim());
      return placeholder;
    });
  }

  // Handle escape characters - protect escaped special characters
  const escapeMap: { [key: string]: string } = {};
  let escapeIndex = 0;
  html = html.replace(/\\([\\`*_{}\[\]()#+\-.!|~])/g, (match, char) => {
    const placeholder = `__ESCAPE_${escapeIndex}__`;
    escapeMap[placeholder] = char;
    escapeIndex++;
    return placeholder;
  });

  // Emoji shortcode support (:emoji:)
  const emojiMap: { [key: string]: string } = {
    ':smile:': '😊', ':heart:': '❤️', ':thumbsup:': '👍', ':fire:': '🔥',
    ':rocket:': '🚀', ':star:': '⭐', ':check:': '✅', ':cross:': '❌',
    ':warning:': '⚠️', ':info:': 'ℹ️', ':book:': '📖', ':bulb:': '💡',
    ':pencil:': '✏️', ':clipboard:': '📋', ':folder:': '📁', ':lock:': '🔒',
    ':unlock:': '🔓', ':key:': '🔑', ':hammer:': '🔨', ':wrench:': '🔧',
    ':gear:': '⚙️', ':chart:': '📊', ':mag:': '🔍', ':bell:': '🔔',
    ':email:': '📧', ':phone:': '📞', ':calendar:': '📅', ':clock:': '🕐',
    ':hourglass:': '⏳', ':checkmark:': '✓', ':cool:': '😎', ':tada:': '🎉'
  };
  html = html.replace(/:(\w+):/g, (match, name) => emojiMap[match] || match);

  // Store footnote definitions
  const footnotes: { [key: string]: string } = {};
  const footnoteRefs: string[] = [];

  // Extract footnote definitions [^1]: content
  html = html.replace(/^\[\^(\w+)\]:\s*(.+)$/gim, (match, id, content) => {
    footnotes[id] = content;
    return ''; // Remove from main content
  });

  // STEP 3: Now process all markdown formatting (code and math are protected)
  
  // Headers (order matters - longest first)
  // Helper function to generate slug from heading text
  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special chars except spaces and hyphens
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Remove consecutive hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };

  // Track slugs to ensure uniqueness
  const usedSlugs = new Map<string, number>();
  
  const addHeadingWithId = (match: string, text: string, level: number): string => {
    let slug = generateSlug(text);
    
    // Fallback for empty slugs (e.g., headings with only emojis)
    if (!slug) {
      slug = `heading-${usedSlugs.size + 1}`;
    }
    
    // Make slug unique if duplicate
    if (usedSlugs.has(slug)) {
      const count = usedSlugs.get(slug)! + 1;
      usedSlugs.set(slug, count);
      slug = `${slug}-${count}`;
    } else {
      usedSlugs.set(slug, 1);
    }
    
    return `<h${level} id="${slug}">${text}</h${level}>`;
  };

  html = html.replace(/^###### (.*$)/gim, (match, text) => addHeadingWithId(match, text, 6));
  html = html.replace(/^##### (.*$)/gim, (match, text) => addHeadingWithId(match, text, 5));
  html = html.replace(/^#### (.*$)/gim, (match, text) => addHeadingWithId(match, text, 4));
  html = html.replace(/^### (.*$)/gim, (match, text) => addHeadingWithId(match, text, 3));
  html = html.replace(/^## (.*$)/gim, (match, text) => addHeadingWithId(match, text, 2));
  html = html.replace(/^# (.*$)/gim, (match, text) => addHeadingWithId(match, text, 1));

  // Horizontal rules (must be on their own line with optional spaces)
  // Match exactly 3 or more dashes, asterisks, or underscores
  html = html.replace(/^[ \t]*-{3,}[ \t]*$/gm, '<hr>');
  html = html.replace(/^[ \t]*\*{3,}[ \t]*$/gm, '<hr>');
  html = html.replace(/^[ \t]*_{3,}[ \t]*$/gm, '<hr>');

  // Tables - Parse markdown tables with alignment
  // Handle tables with flexible spacing and trailing whitespace
  const tableRegex = /^\s*(\|.+\|)[ \t]*\r?\n\s*(\|[\s:|-]+\|)[ \t]*\r?\n((?:\s*\|.+\|[ \t]*\r?\n?)+)/gm;
  html = html.replace(tableRegex, (match, header, separator, rows) => {
    // Parse alignment from separator row
    const alignments = separator.split('|').filter((cell: string) => cell.trim()).map((cell: string) => {
      const trimmed = cell.trim();
      if (trimmed.startsWith(':') && trimmed.endsWith(':')) return 'center';
      if (trimmed.endsWith(':')) return 'right';
      if (trimmed.startsWith(':')) return 'left';
      return 'left';
    });
    
    // Parse header
    const headerCells = header.split('|').filter((cell: string) => cell.trim()).map((cell: string, index: number) => 
      `<th style="text-align: ${alignments[index] || 'left'}">${cell.trim()}</th>`
    ).join('');
    
    // Parse rows - split by newline and filter out empty lines
    const rowsHtml = rows.trim().split(/\r?\n/).filter((row: string) => row.trim() && row.includes('|')).map((row: string) => {
      const cells = row.split('|').filter((cell: string) => cell.trim()).map((cell: string, index: number) => 
        `<td style="text-align: ${alignments[index] || 'left'}">${cell.trim()}</td>`
      ).join('');
      return cells ? `<tr>${cells}</tr>` : '';
    }).filter(Boolean).join('\n');
    
    return `<table><thead><tr>${headerCells}</tr></thead><tbody>${rowsHtml}</tbody></table>`;
  });

  // Process definition lists
  html = html.replace(/^(.+)\n:\s+(.+)$/gm, '<dl><dt>$1</dt><dd>$2</dd></dl>');
  // Merge consecutive definition lists
  html = html.replace(/<\/dl>\n<dl>/g, '');

  // Process blockquotes and lists line by line BEFORE inline formatting
  const lines = html.split(/\r?\n/);
  const processed: string[] = [];
  const listStack: { type: string; indent: number }[] = [];
  const blockquoteStack: number[] = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Skip if already processed (headers, hrs)
    if (line.match(/^<(h[1-6]|hr)[\s>]/)) {
      // Close all open lists and blockquotes when structural element appears
      while (listStack.length > 0) {
        listStack.pop();
        processed.push('</ul>');
      }
      while (blockquoteStack.length > 0) {
        blockquoteStack.pop();
        processed.push('</blockquote>');
      }
      processed.push(line);
      continue;
    }
    
    // Check for blockquote
    const blockquoteMatch = line.match(/^((?:\s*>\s*)+)(.*)$/);
    if (blockquoteMatch) {
      // Close any open lists
      while (listStack.length > 0) {
        listStack.pop();
        processed.push('</ul>');
      }
      
      // Count blockquote depth (number of >)
      const depth = (blockquoteMatch[1].match(/>/g) || []).length;
      const content = blockquoteMatch[2];
      
      // Close deeper blockquotes
      while (blockquoteStack.length > depth) {
        blockquoteStack.pop();
        processed.push('</blockquote>');
      }
      
      // Open new blockquotes
      while (blockquoteStack.length < depth) {
        processed.push('<blockquote>');
        blockquoteStack.push(blockquoteStack.length + 1);
      }
      
      processed.push(content);
      continue;
    }
    
    // Calculate indentation (spaces or tabs) for lists
    const indentMatch = line.match(/^(\s*)/);
    const indent = indentMatch ? indentMatch[1].length : 0;
    
    // Remove leading whitespace for pattern matching
    const trimmedLine = line.trimStart();
    
    // Check for task list items
    const taskListMatch = trimmedLine.match(/^[-*]\s\[([ xX])\]\s(.*)$/);
    
    // Check for unordered list first (before emoji to avoid conflicts)
    const unorderedMatch = trimmedLine.match(/^[-*]\s(.*)$/);
    
    // Check for emoji bullets (emoji followed by space)
    // Use \p{Emoji} Unicode property to match any emoji
    const emojiMatch = !unorderedMatch ? trimmedLine.match(/^(\p{Emoji}(?:\uFE0F)?)\s+(.+)$/u) : null;
    
    const numericMatch = trimmedLine.match(/^(\d+)\.\s(.*)$/);
    const letterLowerMatch = trimmedLine.match(/^([a-z])\.\s(.*)$/);
    const letterUpperMatch = trimmedLine.match(/^([A-Z])\.\s(.*)$/);
    const romanLowerMatch = trimmedLine.match(/^(i{1,3}|iv|v|vi{0,3}|ix|x)\.\s(.*)$/i);

    if (taskListMatch || emojiMatch || numericMatch || letterLowerMatch || letterUpperMatch || romanLowerMatch || unorderedMatch) {
      // Close any open blockquotes
      while (blockquoteStack.length > 0) {
        blockquoteStack.pop();
        processed.push('</blockquote>');
      }
      
      let listType = '';
      let content = '';
      let dataAttr = '';

      if (taskListMatch) {
        listType = 'task';
        const checked = taskListMatch[1].toLowerCase() === 'x';
        content = taskListMatch[2];
        dataAttr = ` class="task-list-item"`;
        content = `<input type="checkbox" ${checked ? 'checked' : ''} disabled /><span>${content}</span>`;
      } else if (emojiMatch) {
        listType = 'emoji';
        const emoji = emojiMatch[1];
        content = emojiMatch[2];
        dataAttr = ` data-emoji="${emoji}" class="emoji-list-item"`;
        content = `<span class="emoji-bullet">${emoji}</span> ${content}`;
      } else if (numericMatch) {
        listType = 'decimal';
        content = numericMatch[2];
        dataAttr = ` data-number="${numericMatch[1]}"`;
      } else if (letterLowerMatch) {
        listType = 'lower-alpha';
        content = letterLowerMatch[2];
        dataAttr = ` data-letter="${letterLowerMatch[1]}"`;
      } else if (letterUpperMatch) {
        listType = 'upper-alpha';
        content = letterUpperMatch[2];
        dataAttr = ` data-letter="${letterUpperMatch[1]}"`;
      } else if (romanLowerMatch && romanLowerMatch[1].length <= 10) {
        listType = 'lower-roman';
        content = romanLowerMatch[2];
        dataAttr = ` data-roman="${romanLowerMatch[1]}"`;
      } else if (unorderedMatch) {
        listType = 'disc';
        content = unorderedMatch[1];
      }

      // Close lists deeper than current indent
      while (listStack.length > 0 && listStack[listStack.length - 1].indent >= indent) {
        listStack.pop();
        processed.push('</ul>');
      }

      // Open new list if needed
      if (listStack.length === 0 || listStack[listStack.length - 1].indent < indent) {
        processed.push(`<ul class="list-${listType}">`);
        listStack.push({ type: listType, indent });
      } else if (listStack[listStack.length - 1].type !== listType) {
        // Change list type at same level
        processed.push('</ul>');
        listStack.pop();
        processed.push(`<ul class="list-${listType}">`);
        listStack.push({ type: listType, indent });
      }

      processed.push(`<li${dataAttr}>${content}</li>`);
    } else {
      // Close all open lists when non-list content appears (unless empty line)
      if (line.trim() !== '') {
        while (listStack.length > 0) {
          listStack.pop();
          processed.push('</ul>');
        }
        // Close all blockquotes on non-blockquote, non-empty content
        while (blockquoteStack.length > 0) {
          blockquoteStack.pop();
          processed.push('</blockquote>');
        }
      }
      processed.push(line);
    }
  }

  // Close any remaining open lists and blockquotes
  while (listStack.length > 0) {
    listStack.pop();
    processed.push('</ul>');
  }
  while (blockquoteStack.length > 0) {
    blockquoteStack.pop();
    processed.push('</blockquote>');
  }

  html = processed.join('\n');

  // NOW apply inline formatting (bold, italic, strikethrough, links, images, code, footnotes)
  // Bold + Italic (*** must be processed before ** and *)
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Strikethrough ~~text~~
  html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>');

  // Images (must come before links) - ![alt](url)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

  // Autolinks <url> and <email>
  html = html.replace(/<(https?:\/\/[^>]+)>/g, '<a href="$1">$1</a>');
  html = html.replace(/<([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})>/g, '<a href="mailto:$1">$1</a>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Footnote references [^1]
  html = html.replace(/\[\^(\w+)\]/g, (match, id) => {
    if (!footnoteRefs.includes(id)) {
      footnoteRefs.push(id);
    }
    const index = footnoteRefs.indexOf(id) + 1;
    return `<sup class="footnote-ref"><a href="#fn-${id}" id="fnref-${id}">[${index}]</a></sup>`;
  });

  // Process paragraphs more intelligently
  const paragraphLines = html.split('\n');
  const paragraphs: string[] = [];
  let currentParagraph: string[] = [];

  for (const line of paragraphLines) {
    const trimmed = line.trim();
    
    // Check if line is a structural element
    const isStructural = trimmed.match(/^<(h[1-6]|hr|blockquote|ul|\/ul|li)[\s>\/]/);
    
    if (isStructural || trimmed === '') {
      // Flush current paragraph
      if (currentParagraph.length > 0) {
        paragraphs.push('<p>' + currentParagraph.join(' ') + '</p>');
        currentParagraph = [];
      }
      // Add structural element
      if (trimmed !== '') {
        paragraphs.push(line);
      }
    } else {
      // Add to current paragraph
      currentParagraph.push(line);
    }
  }
  
  // Flush any remaining paragraph
  if (currentParagraph.length > 0) {
    paragraphs.push('<p>' + currentParagraph.join(' ') + '</p>');
  }

  html = paragraphs.join('\n');

  // STEP 4: Restore all placeholders in reverse order (code → math → escapes)
  
  // Restore code blocks
  codeBlocks.forEach((codeHtml, index) => {
    const placeholder = `__CODEBLOCK_${index}__`;
    // Escape $ in replacement string to prevent it being interpreted as backreference
    const escapedHtml = codeHtml.replace(/\$/g, '$$$$');
    html = html.replace(new RegExp(`<p>${placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</p>`, 'g'), escapedHtml);
    html = html.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), escapedHtml);
  });
  
  // Restore inline code
  inlineCode.forEach((codeHtml, index) => {
    const placeholder = `__INLINECODE_${index}__`;
    const escapedHtml = codeHtml.replace(/\$/g, '$$$$');
    html = html.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), escapedHtml);
  });
  
  // Restore math blocks as placeholders for now (will be rendered by KaTeX in browser)
  html = html.replace(/__DISPLAYMATH_(\d+)__/g, (match, index) => {
    const math = displayMath[parseInt(index)];
    if (enableMath) {
      try {
        // Render with KaTeX, enable chemistry if requested
        const rendered = katex.renderToString(math, { 
          displayMode: true, 
          throwOnError: false,
          trust: enableChemistry, // Enable \ce{} chemistry commands
          strict: false
        });
        return `<div class="math-display">${rendered}</div>`;
      } catch (e) {
        // Fallback on error
        return `<div class="math-display math-error" title="KaTeX error: ${String(e)}">$$${escapeHtml(math)}$$</div>`;
      }
    }
    return `<div class="math-display" data-math="${escapeHtml(math)}">$$${escapeHtml(math)}$$</div>`;
  });
  
  html = html.replace(/__INLINEMATH_(\d+)__/g, (match, index) => {
    const math = inlineMath[parseInt(index)];
    if (enableMath) {
      try {
        // Render with KaTeX, enable chemistry if requested
        const rendered = katex.renderToString(math, { 
          displayMode: false, 
          throwOnError: false,
          trust: enableChemistry, // Enable \ce{} chemistry commands
          strict: false
        });
        return `<span class="math-inline">${rendered}</span>`;
      } catch (e) {
        // Fallback on error
        return `<span class="math-inline math-error" title="KaTeX error: ${String(e)}">$${escapeHtml(math)}$</span>`;
      }
    }
    return `<span class="math-inline" data-math="${escapeHtml(math)}">$${escapeHtml(math)}$</span>`;
  });
  
  // Remove paragraph wrapping from math blocks
  html = html.replace(/<p>(<div class="math-display">[\s\S]*?<\/div>)<\/p>/g, '$1');

  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>\s*<\/p>/g, '');

  // Add footnotes section at the end if there are any
  if (footnoteRefs.length > 0) {
    let footnotesHtml = '<hr><div class="footnotes"><ol>';
    footnoteRefs.forEach((id, index) => {
      const content = footnotes[id] || 'Missing footnote content';
      footnotesHtml += `<li id="fn-${id}">${content} <a href="#fnref-${id}" class="footnote-backref">↩</a></li>`;
    });
    footnotesHtml += '</ol></div>';
    html += footnotesHtml;
  }

  // Restore escaped characters
  Object.keys(escapeMap).forEach(placeholder => {
    html = html.replace(new RegExp(placeholder, 'g'), escapeMap[placeholder]);
  });

  return html;
}
