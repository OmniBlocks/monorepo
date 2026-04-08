const fs = require('fs');
const path = require('path');

describe('input.css', () => {
  let css;

  const getBlock = (selector) => {
    const esc = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(esc + '\\s*{([\\s\\S]*?)}', 'm');
    const m = css.match(re);
    return m ? m[1] : null;
  };

  const getRemWidthFromBlock = (block) => {
    if (!block) return null;
    const m = block.match(/\bwidth:\s*([0-9.]+)rem\b/);
    return m ? parseFloat(m[1]) : null;
  };

  beforeAll(() => {
    const cssPath = path.join(__dirname, 'input.css');
    css = fs.readFileSync(cssPath, 'utf8');
  });

  describe('File and imports', () => {
    test('file is non-empty', () => {
      expect(css).toBeTruthy();
      expect(css.length).toBeGreaterThan(0);
    });
    test('imports units.css and colors.css', () => {
      expect(css).toMatch(/@import\s+["']\.\.\/\.\.\/css\/units\.css["'];?/);
      expect(css).toMatch(/@import\s+["']\.\.\/\.\.\/css\/colors\.css["'];?/);
    });
  });

  describe('Documentation/comments', () => {
    test('contains DO NOT EDIT warning', () => {
      expect(css).toContain('DO NOT EDIT');
    });
    test('references shared library issue', () => {
      expect(css).toMatch(/https:\/\/github\.com\/LLK\/scratch-paint\/issues\/13/);
    });
    test('documents input-range-small addition', () => {
      expect(css).toContain('Edited to add input-range-small');
    });
    test('documents flexbox truncation bug/link', () => {
      expect(css).toMatch(/Min-width is for a bug/);
      expect(css).toMatch(/https:\/\/css-tricks\.com\/flexbox-truncated-text/);
    });
  });

  describe('.input-form base styles', () => {
    let base;
    beforeAll(() => {
      base = getBlock('.input-form');
      expect(base).toBeTruthy();
    });
    test('has height 2rem', () => {
      expect(base).toMatch(/\bheight:\s*2rem\b/);
    });
    test('has padding 0 0.75rem', () => {
      expect(base).toMatch(/\bpadding:\s*0\s+0\.75rem\b/);
    });
    test('font family includes "Helvetica Neue"', () => {
      expect(base).toMatch(/font-family:\s*"Helvetica Neue"/);
    });
    test('font size 0.75rem', () => {
      expect(base).toMatch(/\bfont-size:\s*0\.75rem\b/);
    });
    test('font weight bold', () => {
      expect(base).toMatch(/\bfont-weight:\s*bold\b/);
    });
    test('colors use variables', () => {
      expect(base).toMatch(/\bcolor:\s*\$text-primary\b/);
      expect(base).toMatch(/\bbackground-color:\s*\$input-background\b/);
    });
    test('border properties', () => {
      expect(base).toMatch(/\bborder-width:\s*1px\b/);
      expect(base).toMatch(/\bborder-style:\s*solid\b/);
      expect(base).toMatch(/\bborder-color:\s*\$form-border\b/);
      expect(base).toMatch(/\bborder-radius:\s*2rem\b/);
    });
    test('outline none with alternative focus indicator elsewhere', () => {
      const hasOutlineNone = /\boutline:\s*none\b/.test(base);
      if (hasOutlineNone) {
        expect(/\.input-form:focus\s*{/.test(css)).toBe(true);
      }
    });
    test('cursor text, transition, box-shadow none', () => {
      expect(base).toMatch(/\bcursor:\s*text\b/);
      expect(base).toMatch(/\btransition:\s*0\.25s\s+ease-out\b/);
      expect(base).toMatch(/\bbox-shadow:\s*none\b/);
    });
    test('overflow handling and min-width fix', () => {
      expect(base).toMatch(/\boverflow:\s*hidden\b/);
      expect(base).toMatch(/\btext-overflow:\s*ellipsis\b/);
      expect(base).toMatch(/\bwhite-space:\s*nowrap\b/);
      expect(base).toMatch(/\bmin-width:\s*0\b/);
    });
  });

  describe('Pseudo-classes', () => {
    test(':hover changes border color', () => {
      const hover = getBlock('.input-form:hover');
      expect(hover).toBeTruthy();
      expect(hover).toMatch(/\bborder-color:\s*\$looks-secondary\b/);
    });
    test(':focus changes border color and adds box-shadow', () => {
      const focus = getBlock('.input-form:focus');
      expect(focus).toBeTruthy();
      expect(focus).toMatch(/\bborder-color:\s*\$looks-secondary\b/);
      expect(focus).toMatch(/\bbox-shadow:\s*0\s+0\s+0\s+\$grid-unit\s+\$looks-transparent\b/);
    });
  });

  describe('.input-small and .input-small-range', () => {
    let small, smallRange;
    beforeAll(() => {
      small = getBlock('.input-small');
      smallRange = getBlock('.input-small-range');
      expect(small).toBeTruthy();
      expect(smallRange).toBeTruthy();
    });
    test('.input-small width and alignment', () => {
      expect(small).toMatch(/\bwidth:\s*3rem\b/);
      expect(small).toMatch(/\btext-align:\s*center\b/);
    });
    test('.input-small-range width and alignment', () => {
      expect(smallRange).toMatch(/\bwidth:\s*4rem\b/);
      expect(smallRange).toMatch(/\btext-align:\s*center\b/);
    });
    test('.input-small-range is wider than .input-small', () => {
      const wSmall = getRemWidthFromBlock(small);
      const wRange = getRemWidthFromBlock(smallRange);
      if (wSmall != null && wRange != null) {
        expect(wRange).toBeGreaterThan(wSmall);
      }
    });
  });

  describe('Best practices', () => {
    test('no !important used', () => {
      expect(css).not.toMatch(/!important/);
    });
    test('uses rem units somewhere', () => {
      const rems = css.match(/\b\d+(?:\.\d+)?rem\b/g);
      expect(rems).toBeTruthy();
      expect(rems.length).toBeGreaterThan(0);
    });
    test('no vendor prefixes present', () => {
      expect(css).not.toMatch(/-webkit-/);
      expect(css).not.toMatch(/-moz-/);
      expect(css).not.toMatch(/-ms-/);
    });
  });
});