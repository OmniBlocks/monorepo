/**
 * Testing library/framework:
 * - Jest (v22.x as per package.json) with default jsdom environment
 * 
 * Scope:
 * - Unit tests for CSS in src/components/color-picker/color-picker.css
 * - Validates presence of selectors, declarations, and key behaviors (LTR/RTL, visual effects)
 * - String/regex based checks to avoid introducing new dependencies
 */

const fs = require('fs');
const path = require('path');

describe('color-picker.css', () => {
  const cssPath = path.join(__dirname, 'color-picker.css');
  let cssContent = '';

  beforeAll(() => {
    expect(fs.existsSync(cssPath)).toBe(true);
    cssContent = fs.readFileSync(cssPath, 'utf8');
  });

  const getBlockBody = (selectorPattern) => {
    const re = new RegExp(`${selectorPattern}\\s*\\{([\\s\\S]*?)\\}`, 'm');
    const m = cssContent.match(re);
    return m ? m[1] : null;
  };

  describe('imports', () => {
    test('includes required imports', () => {
      expect(cssContent).toContain('@import "../../css/colors"');
      expect(cssContent).toContain('@import "../../css/units"');
      expect(cssContent).toContain('@import "../../css/filters.css"');
    });

    test('colors import appears exactly twice (duplicate intended)', () => {
      const m = cssContent.match(/@import\s+["']\.\.\/\.\.\/css\/colors["']/g) || [];
      expect(m.length).toBe(2);
    });
  });

  describe('Popover styles', () => {
    test('body :global(.Popover) has z-index and color-scheme', () => {
      const bodyPopover = getBlockBody('body\\s+:global\\(\\.Popover\\)');
      expect(bodyPopover).toBeTruthy();
      expect(bodyPopover).toMatch(/z-index:\s*500/);
      expect(bodyPopover).toMatch(/color-scheme:\s*light/);
    });

    test(':global(.Popover-body) defines surface styling and duplicate padding', () => {
      const body = getBlockBody(':global\\(\\.Popover-body\\)');
      expect(body).toBeTruthy();
      expect(body).toMatch(/color:\s*\$text-primary/);
      expect(body).toMatch(/background:\s*\$popover-background/);
      expect(body).toMatch(/border:\s*1px\s+solid\s+\$ui-pane-border/);
      expect(body).toMatch(/border-radius:\s*4px/);
      expect(body).toMatch(/box-shadow:\s*0px 0px 8px 1px \$ui-pane-border/);
      const paddings = body.match(/padding:\s*4px/g) || [];
      expect(paddings.length).toBe(2);
    });

    test(':global(.Popover-tipShape) has fill and stroke', () => {
      const tip = getBlockBody(':global\\(\\.Popover-tipShape\\)');
      expect(tip).toBeTruthy();
      expect(tip).toMatch(/fill:\s*\$popover-background/);
      expect(tip).toMatch(/stroke:\s*\$ui-pane-border/);
    });
  });

  describe('utility classes', () => {
    test('.clickable sets pointer cursor', () => {
      const block = getBlockBody('\\.clickable');
      expect(block).toBeTruthy();
      expect(block).toMatch(/cursor:\s*pointer/);
    });

    test('.divider border and margin', () => {
      const block = getBlockBody('\\.divider');
      expect(block).toBeTruthy();
      expect(block).toMatch(/border-top:\s*1px\s+solid\s+\$ui-pane-border/);
      expect(block).toMatch(/margin:\s*8px/);
    });
  });

  describe('swatch styles', () => {
    test('.swatch-row flex layout', () => {
      const block = getBlockBody('\\.swatch-row');
      expect(block).toBeTruthy();
      expect(block).toMatch(/display:\s*flex/);
      expect(block).toMatch(/flex-direction:\s*row/);
      expect(block).toMatch(/justify-content:\s*space-between/);
    });

    test('.row-header typography', () => {
      const block = getBlockBody('\\.row-header');
      expect(block).toBeTruthy();
      expect(block).toMatch(/font-family:\s*"Helvetica Neue", Helvetica, sans-serif/);
      expect(block).toMatch(/font-size:\s*0\.65rem/);
      expect(block).toMatch(/margin:\s*8px 8px 0 8px/);
    });

    test('.label-name bold', () => {
      const block = getBlockBody('\\.label-name');
      expect(block).toBeTruthy();
      expect(block).toMatch(/font-weight:\s*bold/);
    });

    test('.swatches margin', () => {
      const block = getBlockBody('\\.swatches');
      expect(block).toBeTruthy();
      expect(block).toMatch(/margin:\s*8px/);
    });

    test('.swatch dimensions, border, and alignment', () => {
      const block = getBlockBody('\\.swatch');
      expect(block).toBeTruthy();
      expect(block).toMatch(/width:\s*1\.5rem/);
      expect(block).toMatch(/height:\s*1\.5rem/);
      expect(block).toMatch(/border:\s*1px\s+solid\s+\$ui-pane-border/);
      expect(block).toMatch(/border-radius:\s*4px/);
      expect(block).toMatch(/box-sizing:\s*content-box/);
      expect(block).toMatch(/display:\s*flex/);
      expect(block).toMatch(/align-items:\s*center/);
    });

    test('.large-swatch and .large-swatch-icon', () => {
      const large = getBlockBody('\\.large-swatch');
      expect(large).toBeTruthy();
      expect(large).toMatch(/width:\s*2rem/);
      expect(large).toMatch(/height:\s*2rem/);
      const icon = getBlockBody('\\.large-swatch-icon');
      expect(icon).toBeTruthy();
      expect(icon).toMatch(/width:\s*1\.75rem/);
      expect(icon).toMatch(/margin:\s*auto/);
    });

    test('.active-swatch border and halo', () => {
      const block = getBlockBody('\\.active-swatch');
      expect(block).toBeTruthy();
      expect(block).toMatch(/border:\s*1px\s+solid\s+\$looks-secondary/);
      expect(block).toMatch(/box-shadow:\s*0px 0px 0px 3px \$looks-transparent/);
    });

    test('.swatch-icon dimensions', () => {
      const block = getBlockBody('\\.swatch-icon');
      expect(block).toBeTruthy();
      expect(block).toMatch(/width:\s*1\.5rem/);
      expect(block).toMatch(/height:\s*1\.5rem/);
    });
  });

  describe('icons and filters', () => {
    test('.picker-icon uses gray filter token', () => {
      const block = getBlockBody('\\.picker-icon');
      expect(block).toBeTruthy();
      expect(block).toMatch(/filter:\s*\$filter-icon-gray/);
    });

    test('.inactive-gradient desaturates', () => {
      const block = getBlockBody('\\.inactive-gradient');
      expect(block).toBeTruthy();
      expect(block).toMatch(/filter:\s*saturate\(0%\)/);
    });
  });

  describe('gradient picker row', () => {
    test('base layout and UX', () => {
      const block = getBlockBody('\\.gradient-picker-row');
      expect(block).toBeTruthy();
      expect(block).toMatch(/align-items:\s*center/);
      expect(block).toMatch(/display:\s*flex/);
      expect(block).toMatch(/flex-direction:\s*row/);
      expect(block).toMatch(/justify-content:\s*center/);
      expect(block).toMatch(/margin:\s*8px/);
      expect(block).toMatch(/user-select:\s*none/);
    });

    test('LTR image spacing uses calc with grid unit', () => {
      const block = getBlockBody('\\[dir="ltr"\\]\\s+\\.gradient-picker-row\\s*>\\s*img\\s*\\+\\s*img');
      expect(block).toBeTruthy();
      expect(block).toMatch(/margin-left:\s*calc\(2\s*\*\s*\$grid-unit\)/);
    });

    test('RTL image spacing uses calc with grid unit', () => {
      const block = getBlockBody('\\[dir="rtl"\\]\\s+\\.gradient-picker-row\\s*>\\s*img\\s*\\+\\s*img');
      expect(block).toBeTruthy();
      expect(block).toMatch(/margin-right:\s*calc\(2\s*\*\s*\$grid-unit\)/);
    });

    test('RTL gradient-swatches-row reverses order', () => {
      const block = getBlockBody('\\[dir="rtl"\\]\\s+\\.gradient-swatches-row');
      expect(block).toBeTruthy();
      expect(block).toMatch(/flex-direction:\s*row-reverse/);
    });
  });

  describe('picker row', () => {
    test('.picker-row layout, spacing, width', () => {
      const block = getBlockBody('\\.picker-row');
      expect(block).toBeTruthy();
      expect(block).toMatch(/display:\s*flex/);
      expect(block).toMatch(/margin:\s*8px/);
      expect(block).toMatch(/margin-top:\s*12px/);
      expect(block).toMatch(/width:\s*150px/);
      expect(block).toMatch(/align-items:\s*center/);
    });

    test('.picker-row .picker-color declarations (including overridden padding)', () => {
      const block = getBlockBody('\\.picker-row\\s+\\.picker-color');
      expect(block).toBeTruthy();
      expect(block).toMatch(/border:\s*none/);
      expect(block).toMatch(/border-radius:\s*0/);
      // both initial and overriding padding declarations present
      expect(block).toMatch(/padding:\s*0\s+0\.2rem/);
      expect(block).toMatch(/padding:\s*0\s*;?/);
      expect(block).toMatch(/width:\s*3rem/);
      expect(block).toMatch(/box-sizing:\s*border-box/);
      expect(block).toMatch(/cursor:\s*pointer/);
      expect(block).toMatch(/margin:\s*0/);
    });

    test('.picker-row .picker-text base and directional radii', () => {
      const base = getBlockBody('\\.picker-row\\s+\\.picker-text');
      expect(base).toBeTruthy();
      expect(base).toMatch(/box-sizing:\s*border-box/);
      expect(base).toMatch(/width:\s*100%/);
      const ltr = getBlockBody('\\[dir="ltr"\\]\\s+\\.picker-row\\s+\\.picker-text');
      expect(ltr).toBeTruthy();
      expect(ltr).toMatch(/border-top-left-radius:\s*0/);
      expect(ltr).toMatch(/border-bottom-left-radius:\s*0/);
      const rtl = getBlockBody('\\[dir="rtl"\\]\\s+\\.picker-row\\s+\\.picker-text');
      expect(rtl).toBeTruthy();
      expect(rtl).toMatch(/border-top-right-radius:\s*0/);
      expect(rtl).toMatch(/border-bottom-right-radius:\s*0/);
    });
  });

  describe('tokens, units, and effects', () => {
    test('uses color/filter/unit tokens', () => {
      expect(cssContent).toMatch(/\$text-primary/);
      expect(cssContent).toMatch(/\$popover-background/);
      expect(cssContent).toMatch(/\$ui-pane-border/);
      expect(cssContent).toMatch(/\$looks-secondary/);
      expect(cssContent).toMatch(/\$looks-transparent/);
      expect(cssContent).toMatch(/\$filter-icon-gray/);
      expect(cssContent).toMatch(/\$grid-unit/);
    });

    test('uses common rem sizes', () => {
      expect(cssContent).toContain('1.5rem');
      expect(cssContent).toContain('1.75rem');
      expect(cssContent).toContain('2rem');
      expect(cssContent).toContain('0.65rem');
      expect(cssContent).toContain('3rem');
    });

    test('calc() present for directional spacing', () => {
      const calcMatches = cssContent.match(/calc\([^)]+\)/g) || [];
      expect(calcMatches.length).toBeGreaterThanOrEqual(2);
    });

    test('consistent 8px spacing used in multiple places', () => {
      const m = cssContent.match(/8px/g) || [];
      expect(m.length).toBeGreaterThanOrEqual(5);
    });

    test('box-shadows for surface and selection halo', () => {
      expect(cssContent).toContain('box-shadow: 0px 0px 8px 1px $ui-pane-border');
      expect(cssContent).toContain('box-shadow: 0px 0px 0px 3px $looks-transparent');
    });

    test('avoids universal selectors for performance', () => {
      expect(cssContent).not.toContain('* {');
      expect(cssContent).not.toContain('*::before');
      expect(cssContent).not.toContain('*::after');
    });
  });
});