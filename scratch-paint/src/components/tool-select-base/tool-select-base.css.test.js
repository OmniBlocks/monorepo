/**
 * Tests for tool-select-base.css
 * Test framework: Jest (configured in package.json via "unit": "jest --reporters=default").
 * These tests validate structure and key declarations using string/regex checks without introducing new deps.
 */

const fs = require('fs');
const path = require('path');

describe('tool-select-base.css', () => {
  const cssPath = path.join(__dirname, 'tool-select-base.css');
  let css;

  beforeAll(() => {
    // Ensure CSS file exists and load it
    expect(fs.existsSync(cssPath)).toBe(true);
    css = fs.readFileSync(cssPath, 'utf8');
  });

  describe('imports and variables', () => {
    test('imports expected dependency stylesheets', () => {
      expect(css).toMatch(/@import\s+['"]\.\.\/\.\.\/css\/colors\.css['"]\s*;/);
      expect(css).toMatch(/@import\s+['"]\.\.\/\.\.\/css\/units\.css['"]\s*;/);
      expect(css).toMatch(/@import\s+['"]\.\.\/\.\.\/css\/filters\.css['"]\s*;/);
    });

    test('declares $border-radius variable with rem value', () => {
      expect(css).toMatch(/^\s*\$border-radius:\s*\.25rem\s*;/m);
    });

    test('uses grid unit variable for margin and padding', () => {
      const matches = css.match(/\$grid-unit/g) || [];
      expect(matches.length).toBeGreaterThanOrEqual(2);
    });

    test('uses other expected variables', () => {
      expect(css).toContain('$looks-secondary');
      expect(css).toContain('$filter-icon-gray');
      expect(css).toContain('$full-size-paint');
    });
  });

  describe('.mod-tool-select base block', () => {
    test('declares the base selector block', () => {
      expect(css).toMatch(/\.mod-tool-select\s*{[^}]*}/s);
    });

    test('has expected base properties', () => {
      const re = /\.mod-tool-select\s*{([^}]*)}/s;
      const m = css.match(re);
      expect(m).toBeTruthy();
      const block = m[1];
      expect(block).toMatch(/display:\s*inline-block/);
      expect(block).toMatch(/margin:\s*\$grid-unit/);
      expect(block).toMatch(/border:\s*none/);
      expect(block).toMatch(/border-radius:\s*\$border-radius/);
      expect(block).toMatch(/outline:\s*none/);
      expect(block).toMatch(/background:\s*none/);
      expect(block).toMatch(/padding:\s*\$grid-unit/);
      expect(block).toMatch(/font-size:\s*0\.85rem/);
      expect(block).toMatch(/transition:\s*0\.2s/);
    });
  });

  describe('state and interaction selectors', () => {
    test('selected state applies background color variable', () => {
      expect(css).toMatch(/\.mod-tool-select\.is-selected\s*{[^}]*background-color:\s*\$looks-secondary\s*;/s);
    });

    test('focus state resets outline', () => {
      expect(css).toMatch(/\.mod-tool-select:focus\s*{[^}]*outline:\s*none\s*;/s);
    });
  });

  describe('tool-select icon rules', () => {
    test('base icon styles', () => {
      const re = /img\.tool-select-icon\s*{([^}]*)}/s;
      const m = css.match(re);
      expect(m).toBeTruthy();
      const block = m[1];
      expect(block).toMatch(/width:\s*2rem/);
      expect(block).toMatch(/height:\s*2rem/);
      expect(block).toMatch(/flex-grow:\s*1/);
      expect(block).toMatch(/vertical-align:\s*middle/);
      expect(block).toMatch(/filter:\s*\$filter-icon-gray/);
    });

    test('selected state icon uses brightness(0) invert(1)', () => {
      expect(css).toMatch(/\.mod-tool-select\.is-selected\s+\.tool-select-icon\s*{[^}]*filter:\s*brightness\(0\)\s*invert\(1\)\s*;/s);
    });

    test('includes explanatory comment for complex filter', () => {
      expect(css).toMatch(/\/\*[^*]*Make the tool icons white while selected[^*]*\*\//);
    });
  });

  describe('responsive rules', () => {
    test('media query for small screens sets margin to 0', () => {
      expect(css).toMatch(/@media\s+only\s+screen\s+and\s+\(max-width:\s*\$full-size-paint\)\s*{[^}]*\.mod-tool-select\s*{[^}]*margin:\s*0\s*;[^}]*}[^}]*}/s);
    });
  });

  describe('best practices and hygiene', () => {
    test('does not use \!important', () => {
      expect(css.toLowerCase()).not.toContain('\!important');
    });

    test('uses rem units where appropriate', () => {
      expect(css).toMatch(/\b\d*\.?\d+rem\b/);
    });

    test('contains expected selectors and naming patterns', () => {
      expect(css).toContain('.mod-tool-select');
      expect(css).toContain('.mod-tool-select.is-selected');
      expect(css).toContain(':focus');
      expect(css).toContain('img.tool-select-icon');
    });
  });
});