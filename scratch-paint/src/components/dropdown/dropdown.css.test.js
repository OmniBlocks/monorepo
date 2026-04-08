/**
 * Unit tests for dropdown.css
 * Testing framework/library: Jest 22.x (configured in package.json with jsdom setup files)
 * Strategy: Read raw CSS and assert presence/structure of selectors and properties without adding dependencies.
 */

'use strict';

const fs = require('fs');
const path = require('path');

describe('dropdown.css', () => {
  let css;
  let lines;

  beforeAll(() => {
    const cssPath = path.join(__dirname, 'dropdown.css');
    css = fs.readFileSync(cssPath, 'utf8');
    lines = css.split('\n');
  });

  describe('File structure and imports', () => {
    it('includes colors import', () => {
      expect(css).toContain("@import '../../css/colors.css'");
    });

    it('defines $arrow-border-width variable to 14px', () => {
      expect(css).toMatch(/\$arrow-border-width:\s*14px\s*;/);
    });

    it('is not empty and ends with newline', () => {
      expect(css.length).toBeGreaterThan(0);
      expect(css.endsWith('\n')).toBe(true);
    });

    it('has no trailing whitespace on any line', () => {
      lines.forEach(line => expect(line).not.toMatch(/\s+$/));
    });
  });

  describe('.dropdown', () => {
    it('declares the .dropdown rule', () => {
      expect(css).toMatch(/\.dropdown\s*{/);
    });

    it('has a solid 1px border using $form-border', () => {
      expect(css).toMatch(/\.dropdown\s*{[^}]*border:\s*1px\s+solid\s+\$form-border\s*;/);
    });

    it('has 5px border-radius', () => {
      expect(css).toMatch(/\.dropdown\s*{[^}]*border-radius:\s*5px\s*;/);
    });

    it('sets overflow to visible', () => {
      expect(css).toMatch(/\.dropdown\s*{[^}]*overflow:\s*visible\s*;/);
    });

    it('sets min-width to 3.5rem', () => {
      expect(css).toMatch(/\.dropdown\s*{[^}]*min-width:\s*3\.5rem\s*;/);
    });

    it('sets color from $looks-secondary', () => {
      expect(css).toMatch(/\.dropdown\s*{[^}]*color:\s*\$looks-secondary\s*;/);
    });

    it('applies padding of .5rem', () => {
      expect(css).toMatch(/\.dropdown\s*{[^}]*padding:\s*\.5rem\s*;/);
    });
  });

  describe('.mod-open', () => {
    it('declares the .mod-open rule', () => {
      expect(css).toMatch(/\.mod-open\s*{/);
    });

    it('sets background-color using $form-border', () => {
      expect(css).toMatch(/\.mod-open\s*{[^}]*background-color:\s*\$form-border\s*;/);
    });
  });

  describe('.dropdown-icon', () => {
    it('declares the .dropdown-icon rule', () => {
      expect(css).toMatch(/\.dropdown-icon\s*{/);
    });

    it('is square: width and height are both .5rem', () => {
      const width = css.match(/\.dropdown-icon\s*{[^}]*width:\s*([\d.]+rem)/);
      const height = css.match(/\.dropdown-icon\s*{[^}]*height:\s*([\d.]+rem)/);
      expect(width).toBeTruthy();
      expect(height).toBeTruthy();
      expect(width[1]).toBe('.5rem');
      expect(height[1]).toBe('.5rem');
      expect(width[1]).toBe(height[1]);
    });

    it('aligns vertically to middle', () => {
      expect(css).toMatch(/\.dropdown-icon\s*{[^}]*vertical-align:\s*middle\s*;/);
    });

    it('has padding-bottom of .2rem', () => {
      expect(css).toMatch(/\.dropdown-icon\s*{[^}]*padding-bottom:\s*\.2rem\s*;/);
    });
  });

  describe('Directional styles (LTR/RTL)', () => {
    it('defines LTR-specific rule for .dropdown-icon', () => {
      expect(css).toMatch(/\[dir="ltr"\]\s*\.dropdown-icon\s*{[^}]*margin-left:\s*\.5rem\s*;/);
    });

    it('defines RTL-specific rule for .dropdown-icon', () => {
      expect(css).toMatch(/\[dir="rtl"\]\s*\.dropdown-icon\s*{[^}]*margin-right:\s*\.5rem\s*;/);
    });

    it('uses the same spacing value for LTR and RTL margins', () => {
      const ltr = css.match(/\[dir="ltr"\]\s*\.dropdown-icon\s*{[^}]*margin-left:\s*([\d.]+rem)/);
      const rtl = css.match(/\[dir="rtl"\]\s*\.dropdown-icon\s*{[^}]*margin-right:\s*([\d.]+rem)/);
      expect(ltr).toBeTruthy();
      expect(rtl).toBeTruthy();
      expect(ltr[1]).toBe(rtl[1]);
    });

    it('does not use left/right margins outside dir selectors', () => {
      const stripped = css.replace(/\[dir="(ltr|rtl)"\][\s\S]*?}/g, '');
      expect(stripped).not.toMatch(/margin-left\s*:/);
      expect(stripped).not.toMatch(/margin-right\s*:/);
    });
  });

  describe('.mod-caret-up', () => {
    it('declares the .mod-caret-up rule', () => {
      expect(css).toMatch(/\.mod-caret-up\s*{/);
    });

    it('rotates caret by 180deg', () => {
      expect(css).toMatch(/\.mod-caret-up\s*{[^}]*transform:\s*rotate\(180deg\)\s*;/);
    });

    it('sets padding-bottom to 0', () => {
      expect(css).toMatch(/\.mod-caret-up\s*{[^}]*padding-bottom:\s*0\s*;/);
    });

    it('sets padding-top to .2rem and matches the base icon bottom padding', () => {
      const base = css.match(/\.dropdown-icon\s*{[^}]*padding-bottom:\s*([\d.]+rem)/);
      const top = css.match(/\.mod-caret-up\s*{[^}]*padding-top:\s*([\d.]+rem)/);
      expect(top).toBeTruthy();
      expect(top[1]).toBe('.2rem');
      if (base) {
        expect(base[1]).toBe(top[1]);
      }
    });
  });

  describe('Consistency and conventions', () => {
    it('uses rem units where applicable', () => {
      const rems = css.match(/[\d.]+rem/g) || [];
      expect(rems.length).toBeGreaterThan(0);
    });

    it('uses pixel units only for borders/variables declaration', () => {
      const px = css.match(/(\d+)px/g) || [];
      expect(px.length).toBeGreaterThanOrEqual(1); // 1px border, 14px variable
    });

    it('has no duplicate class rule declarations', () => {
      ['.dropdown', '.mod-open', '.dropdown-icon', '.mod-caret-up'].forEach(cls => {
        const re = new RegExp(`\\${cls}\\s*{`, 'g');
        const matches = css.match(re) || [];
        expect(matches.length).toBe(1);
      });
    });

    it('follows 4-space indentation for indented lines', () => {
      const indented = lines.filter(l => /^\s+/.test(l));
      indented.forEach(l => {
        const m = l.match(/^(\s+)/);
        if (m) expect(m[1].length % 4).toBe(0);
      });
    });

    it('does not contain debug statements or TODOs', () => {
      expect(css).not.toMatch(/console\./);
      expect(css).not.toMatch(/TODO|FIXME/i);
    });
  });

  describe('Behavioral expectations', () => {
    it('enforces a positive minimum width', () => {
      const m = css.match(/min-width:\s*([\d.]+)rem/);
      expect(m).toBeTruthy();
      expect(parseFloat(m[1])).toBeGreaterThan(0);
    });

    it('ensures overflow is visible for dropdown', () => {
      expect(css).toMatch(/\.dropdown\s*{[^}]*overflow:\s*visible\s*;/);
    });

    it('ensures transform uses degrees', () => {
      const m = css.match(/rotate\((\d+)deg\)/);
      expect(m).toBeTruthy();
      expect(parseInt(m[1], 10)).toBe(180);
    });
  });
});