/**
 * Testing library/framework: Jest (v22.x as configured in package.json).
 * These tests validate paint-editor.css structure and rules changed in the PR.
 * We avoid adding new runtime deps; assertions are string/regex based.
 */
/* eslint-env jest */
const fs = require('fs');
const path = require('path');

describe('paint-editor.css', () => {
  const cssPath = path.join(__dirname, 'paint-editor.css');
  let css = '';

  const count = (re) => {
    const m = css.match(re);
    return m ? m.length : 0;
  };

  beforeAll(() => {
    css = fs.readFileSync(cssPath, 'utf8');
    expect(css.length).toBeGreaterThan(0);
  });

  describe('imports and variables', () => {
    test('includes required @import statements', () => {
      expect(css).toContain('@import "../../css/colors.css";');
      expect(css).toContain('@import "../../css/units.css";');
      expect(css).toContain('@import "../../css/filters.css";');
    });
    test('declares and uses $border-radius variable', () => {
      expect(css).toMatch(/\$border-radius:\s*0\.25rem\s*;/);
      expect(css).toMatch(/border-(top|bottom)-(left|right)-radius:\s*\$border-radius/);
    });
    test('uses design tokens', () => {
      expect(count(/\$grid-unit/g)).toBeGreaterThanOrEqual(15);
      expect(count(/\$ui-pane-border/g)).toBeGreaterThanOrEqual(5);
      expect(css).toContain('$looks-secondary');
      expect(css).toContain('$filter-icon-gray');
    });
  });

  describe('layout containers', () => {
    test('.editor-container is flex column and full-size', () => {
      expect(css).toMatch(/\.editor-container\s*{[^}]*display:\s*flex[^}]*}/s);
      expect(css).toMatch(/\.editor-container\s*{[^}]*flex-direction:\s*column[^}]*}/s);
      expect(css).toMatch(/\.editor-container\s*{[^}]*width:\s*100%[^}]*}/s);
      expect(css).toMatch(/\.editor-container\s*{[^}]*height:\s*100%[^}]*}/s);
    });
    test('.row is horizontal flex with centered items', () => {
      expect(css).toMatch(/\.row\s*{[^}]*display:\s*flex[^}]*}/s);
      expect(css).toMatch(/\.row\s*{[^}]*flex-direction:\s*row[^}]*}/s);
      expect(css).toMatch(/\.row\s*{[^}]*align-items:\s*center[^}]*}/s);
    });
    test('adjacent rows have top margin via calc()', () => {
      expect(css).toMatch(/\.row\s*\+\s*\.row\s*{[^}]*margin-top:\s*calc\(/s);
    });
    test('.controls-container fills and grows', () => {
      expect(css).toMatch(/\.controls-container\s*{[^}]*width:\s*100%[^}]*}/s);
      expect(css).toMatch(/\.controls-container\s*{[^}]*display:\s*flex[^}]*}/s);
      expect(css).toMatch(/\.controls-container\s*{[^}]*flex-grow:\s*1[^}]*}/s);
    });
    test('.canvas-container sizing and border', () => {
      expect(css).toMatch(/\.canvas-container\s*{[^}]*width:\s*100%[^}]*}/s);
      expect(css).toMatch(/\.canvas-container\s*{[^}]*flex-grow:\s*1[^}]*}/s);
      expect(css).toMatch(/\.canvas-container\s*{[^}]*min-width:\s*402px[^}]*}/s);
      expect(css).toMatch(/\.canvas-container\s*{[^}]*border:\s*1px\s+solid\s+\$ui-pane-border[^}]*}/s);
      expect(css).toMatch(/\.canvas-container\s*{[^}]*position:\s*relative[^}]*}/s);
      expect(css).toMatch(/\.canvas-container\s*{[^}]*overflow:\s*visible[^}]*}/s);
    });
  });

  describe('LTR/RTL rules', () => {
    test('has directional dashed border paddings', () => {
      expect(css).toMatch(/\[dir="ltr"\]\s*\.mod-dashed-border\s*{[^}]*border-right:[^}]*}/s);
      expect(css).toMatch(/\[dir="rtl"\]\s*\.mod-dashed-border\s*{[^}]*border-left:[^}]*}/s);
    });
    test('button-group directional borders/radii', () => {
      expect(css).toMatch(/\[dir="ltr"\]\s*\.button-group-button\s*{[^}]*border-left:\s*none[^}]*}/s);
      expect(css).toMatch(/\[dir="rtl"\]\s*\.button-group-button\s*{[^}]*border-right:\s*none[^}]*}/s);
      expect(css).toMatch(/\[dir="ltr"\]\s*\.button-group-button:first-of-type\s*{[^}]*border-left:\s*1px[^}]*}/s);
      expect(css).toMatch(/\[dir="rtl"\]\s*\.button-group-button:first-of-type\s*{[^}]*border-right:\s*1px[^}]*}/s);
      expect(css).toMatch(/\[dir="ltr"\]\s*\.button-group-button:last-of-type\s*{[^}]*border-top-right-radius:\s*\$border-radius[^}]*}/s);
      expect(css).toMatch(/\[dir="rtl"\]\s*\.button-group-button:last-of-type\s*{[^}]*border-top-left-radius:\s*\$border-radius[^}]*}/s);
    });
    test('bitmap icon margins reflect direction', () => {
      expect(css).toMatch(/\[dir="ltr"\]\s*\.bitmap-button-icon\s*{[^}]*margin-right:[^}]*}/s);
      expect(css).toMatch(/\[dir="rtl"\]\s*\.bitmap-button-icon\s*{[^}]*margin-left:[^}]*}/s);
    });
    test('directional selector formatting is correct', () => {
      expect(count(/\[dir="(ltr|rtl)"\][^{]*/g)).toBeGreaterThanOrEqual(10);
      const all = css.match(/\[dir="(ltr|rtl)"\][^{]*/g) || [];
      all.forEach(sel => expect(sel).toMatch(/\[dir="(ltr|rtl)"\]\s*\.|\[dir="(ltr|rtl)"\]\./));
    });
  });

  describe('buttons and controls', () => {
    test('button-group-button base styles', () => {
      expect(css).toMatch(/\.button-group-button\s*{[^}]*display:\s*inline-block[^}]*}/s);
      expect(css).toMatch(/\.button-group-button\s*{[^}]*border:\s*1px\s+solid\s+\$ui-pane-border[^}]*}/s);
      expect(css).toMatch(/\.button-group-button\s*{[^}]*border-radius:\s*0[^}]*}/s);
    });
    test('button-group-button-icon sizing and filter', () => {
      expect(css).toMatch(/\.button-group-button-icon\s*{[^}]*width:\s*1\.25rem[^}]*}/s);
      expect(css).toMatch(/\.button-group-button-icon\s*{[^}]*height:\s*1\.25rem[^}]*}/s);
      expect(css).toMatch(/\.button-group-button-icon\s*{[^}]*vertical-align:\s*middle[^}]*}/s);
      expect(css).toMatch(/\.button-group-button-icon\s*{[^}]*filter:\s*\$filter-icon-gray[^}]*}/s);
    });
    test('bitmap-button prominent styles', () => {
      expect(css).toMatch(/\.bitmap-button\s*{[^}]*display:\s*flex[^}]*}/s);
      expect(css).toMatch(/\.bitmap-button\s*{[^}]*border-radius:\s*5px[^}]*}/s);
      expect(css).toMatch(/\.bitmap-button\s*{[^}]*background-color:\s*\$looks-secondary[^}]*}/s);
      expect(css).toMatch(/\.bitmap-button\s*{[^}]*color:\s*white[^}]*}/s);
      expect(css).toMatch(/\.bitmap-button\s*{[^}]*font-weight:\s*bold[^}]*}/s);
    });
  });

  describe('other components', () => {
    test('mode-selector and zoom-controls use flex', () => {
      expect(css).toMatch(/\.mode-selector\s*{[^}]*display:\s*flex[^}]*}/s);
      expect(css).toMatch(/\.zoom-controls\s*{[^}]*display:\s*flex[^}]*}/s);
      expect(css).toMatch(/\.zoom-controls\s*{[^}]*flex-direction:\s*row-reverse[^}]*}/s);
    });
    test('color-picker-wrapper is absolute and full-size', () => {
      expect(css).toMatch(/\.color-picker-wrapper\s*{[^}]*position:\s*absolute[^}]*}/s);
      expect(css).toMatch(/\.color-picker-wrapper\s*{[^}]*top:\s*0[^}]*}/s);
      expect(css).toMatch(/\.color-picker-wrapper\s*{[^}]*left:\s*0[^}]*}/s);
      expect(css).toMatch(/\.color-picker-wrapper\s*{[^}]*pointer-events:\s*none[^}]*}/s);
      expect(css).toMatch(/\.color-picker-wrapper\s*{[^}]*width:\s*100%[^}]*}/s);
      expect(css).toMatch(/\.color-picker-wrapper\s*{[^}]*height:\s*100%[^}]*}/s);
    });
    test('canvas-controls are flex with fixed height', () => {
      expect(css).toMatch(/\.canvas-controls\s*{[^}]*display:\s*flex[^}]*}/s);
      expect(css).toMatch(/\.canvas-controls\s*{[^}]*height:\s*36px[^}]*}/s);
      expect(css).toMatch(/\.canvas-controls\s*{[^}]*justify-content:\s*space-between[^}]*}/s);
    });
    test('text-area hidden but accessible properties set', () => {
      expect(css).toMatch(/\.text-area\s*{[^}]*display:\s*none[^}]*}/s);
      expect(css).toMatch(/\.text-area\s*{[^}]*position:\s*absolute[^}]*}/s);
      expect(css).toMatch(/\.text-area\s*{[^}]*opacity:\s*\.8[^}]*}/s);
      expect(css).toMatch(/\.text-area\s*{[^}]*-webkit-text-fill-color:\s*transparent[^}]*}/s);
      expect(css).toMatch(/\.text-area\s*{[^}]*text-fill-color:\s*transparent[^}]*}/s);
    });
    test('button-text prevents wrapping', () => {
      expect(css).toMatch(/\.button-text\s*{[^}]*width:\s*100%[^}]*}/s);
      expect(css).toMatch(/\.button-text\s*{[^}]*white-space:\s*nowrap[^}]*}/s);
    });
  });

  describe('responsive rules', () => {
    test('has max-width media query for full-size paint', () => {
      expect(css).toMatch(/@media\s+only\s+screen\s+and\s+\(max-width:\s*\$full-size-paint\)/);
    });
    test('media query adjusts editor padding and layout', () => {
      const mqBlock = css.match(/@media[^{]+\{([\s\S]*?)\}\s*$/m);
      expect(mqBlock).toBeTruthy();
      if (mqBlock) {
        expect(mqBlock[1]).toContain('.editor-container');
        expect(mqBlock[1]).toContain('padding: calc(3 * $grid-unit) $grid-unit;');
        expect(mqBlock[1]).toContain('.mode-selector');
        expect(mqBlock[1]).toContain('flex-direction: column');
        expect(mqBlock[1]).toContain('.controls-container');
      }
    });
  });

  describe('general consistency', () => {
    test('uses calc() extensively with $grid-unit', () => {
      expect(count(/calc\([^)]+\)/g)).toBeGreaterThanOrEqual(10);
      const all = css.match(/calc\(([^)]+)\)/g) || [];
      all.forEach(c => expect(c).toMatch(/\$grid-unit/));
    });
    test('reasonable number of flex displays', () => {
      expect(count(/display:\s*flex/g)).toBeGreaterThanOrEqual(8);
    });
    test('uses rem units in multiple places', () => {
      // Match 1.25rem, 0.25rem, 7.5rem, etc. (Note: ".25rem" not counted here)
      expect(count(/\d+\.?\d*rem/g)).toBeGreaterThanOrEqual(5);
    });
    test('no duplicate base class definitions before media queries', () => {
      const base = css.split('@media')[0];
      ['.editor-container', '.row', '.controls-container', '.canvas-container', '.button-group-button']
        .forEach(cls => {
          const re = new RegExp(`\\${cls}\\s*{`, 'g');
          const n = (base.match(re) || []).length;
          expect(n).toBeLessThanOrEqual(1);
        });
    });
  });
});