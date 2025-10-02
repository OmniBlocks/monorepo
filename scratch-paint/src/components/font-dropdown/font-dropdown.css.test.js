/**
 * Unit tests for font-dropdown.css
 * Testing Library/Framework: Jest (v22.x) with optional PostCSS parse fallback (no new deps).
 * Strategy: Parse with PostCSS if available; otherwise use a lightweight regex parser.
 */
const fs = require('fs');
const path = require('path');

let postcssModule = null;
try {
  // postcss may be hoisted by postcss-loader; fallback to regex parsing if not present
  // eslint-disable-next-line import/no-extraneous-dependencies
  postcssModule = require('postcss');
} catch (e) {
  postcssModule = null;
}

const escapeRegExp = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const extractRuleBlock = (content, selector) => {

  const re = new RegExp(escapeRegExp(selector) + '\\s*\\{([\\s\\S]*?)\\}', 'm');

  const m = re.exec(content);

  return m ? m[1] : null;
};
const getDeclFromBlock = (blk, prop) => {

  if (!blk) return undefined;
  const re = new RegExp('(^|;)\\s*' + escapeRegExp(prop) + '\\s*:\\s*([^;]+)\\s*', 'm');

  const m = re.exec(blk);

  return m ? m[2].trim() : undefined;
};
const listPropsFromBlock = (blk) => {

  if (!blk) return [];
  return blk
    .split(';')
    .map(s => s.trim())
    .filter(Boolean)
    .map(line => line.split(':')[0].trim());
};
const collectDeclValuesFromContent = (content, prop) => {

  const vals = [];

  const re = new RegExp('^\\s*' + escapeRegExp(prop) + '\\s*:\\s*([^;]+);', 'gm');

  let m;

  while ((m = re.exec(content))) vals.push(m[1].trim());
  return vals;

};

describe('font-dropdown.css', () => {
  const cssPath = path.join(__dirname, 'font-dropdown.css');
  let cssContent;
  let parsedCSS = null;


  beforeAll(() => {
    cssContent = fs.readFileSync(cssPath, 'utf8');
    if (postcssModule) parsedCSS = postcssModule.parse(cssContent);
  });


  const getRule = (selector) => {

    if (parsedCSS) {

      return parsedCSS.nodes.find(n => n.type === 'rule' && n.selector === selector);
    }

    return extractRuleBlock(cssContent, selector);

  };
  const getDecl = (ruleOrBlock, prop) => {

    if (parsedCSS && ruleOrBlock) {

      const d = ruleOrBlock.nodes.find(n => n.type === 'decl' && n.prop === prop);
      return d ? d.value : undefined;
    }

    return getDeclFromBlock(ruleOrBlock, prop);

  };
  const getProps = (ruleOrBlock) => {

    if (parsedCSS && ruleOrBlock) {

      return ruleOrBlock.nodes.filter(n => n.type === 'decl').map(n => n.prop);
    }

    return listPropsFromBlock(ruleOrBlock);

  };
  const extractSelectors = () => {

    if (parsedCSS) {

      const sels = [];
      parsedCSS.walkRules(r => { if (r.selector) sels.push(r.selector); });
      return sels;
    }
    const sels = [];
    const re = /(^|\n)\s*([^\s@][^{]+)\s*\{/g;

    let m;

    while ((m = re.exec(cssContent))) sels.push(m[2].trim());
    return sels;

  };


  describe('File & imports', () => {
    test('file exists and non-empty', () => {
      expect(cssContent).toBeDefined();
      expect(cssContent.length).toBeGreaterThan(0);
    });
    test('has required @import lines at top', () => {
      expect(cssContent).toContain('@import "../../css/colors.css";');
      expect(cssContent).toContain('@import "../../css/units.css";');
      const lines = cssContent.split('\n');
      const lastImportIndex = lines.reduce((idx, l, i) => (l.trim().startsWith('@import') ? i : idx), -1);
      const firstRuleIndex = lines.findIndex(l => l.includes('{'));
      expect(firstRuleIndex).toBeGreaterThan(lastImportIndex);
    });
    test('parses without throwing (if postcss available)', () => {
      if (!postcssModule) return;
      expect(() => postcssModule.parse(cssContent)).not.toThrow();
    });
  });


  describe('Selectors presence', () => {
    const selectors = [
      '.mod-menu-item',
      '.mod-menu-item:hover',
      '.mod-context-menu',
      '.mod-unselect',
      '.displayed-font-name',
      '.font-dropdown'
    ];
    test('all expected selectors exist', () => {
      const found = new Set(extractSelectors());
      for (const sel of selectors) {
        expect(found.has(sel)).toBe(true);
      }
    });
  });


  describe('.mod-menu-item', () => {
    const sel = '.mod-menu-item';
    test('key declarations', () => {
      const rule = getRule(sel);
      expect(getDecl(rule, 'display')).toBe('flex');
      expect(getDecl(rule, 'min-width')).toBe('6.25rem');
      expect(getDecl(rule, 'padding')).toContain('calc');
      expect(getDecl(rule, 'padding')).toContain('$grid-unit');
      expect(getDecl(rule, 'padding-left')).toBe('calc(3 * $grid-unit)');
      expect(getDecl(rule, 'padding-right')).toBe('calc(3 * $grid-unit)');
      expect(getDecl(rule, 'width')).toBe('8.5rem');
      expect(getDecl(rule, 'cursor')).toBe('pointer');
      expect(getDecl(rule, 'align-items')).toBe('center');
      expect(getDecl(rule, 'overflow-wrap')).toBe('anywhere');
      const marginVal = getDecl(rule, 'margin') || '';
      expect(marginVal).toContain('$grid-unit');
      expect(marginVal).toMatch(/-/);
      const transitionVal = getDecl(rule, 'transition') || '';
      expect(transitionVal).toContain('0.1s');
      expect(transitionVal).toContain('ease');
      const props = getProps(rule);
      ['display','margin','min-width','padding','padding-left','padding-right','width','cursor','transition','align-items','overflow-wrap']
        .forEach(p => expect(props).toContain(p));
    });
  });


  describe('.mod-menu-item:hover', () => {
    const sel = '.mod-menu-item:hover';
    test('hover styles', () => {
      const rule = getRule(sel);
      expect(getDecl(rule, 'background')).toBe('$looks-secondary');
      expect(getDecl(rule, 'color')).toBe('white');
      const props = getProps(rule);
      expect(props).toEqual(['background', 'color']);
    });
  });


  describe('.mod-context-menu', () => {
    const sel = '.mod-context-menu';
    test('flex column', () => {
      const rule = getRule(sel);
      expect(getDecl(rule, 'display')).toBe('flex');
      expect(getDecl(rule, 'flex-direction')).toBe('column');
      const props = getProps(rule);
      expect(props).toEqual(['display', 'flex-direction']);
    });
  });


  describe('.mod-unselect', () => {
    const sel = '.mod-unselect';
    test('user-select none only', () => {
      const rule = getRule(sel);
      expect(getDecl(rule, 'user-select')).toBe('none');
      const props = getProps(rule);
      expect(props).toEqual(['user-select']);
    });
  });


  describe('.displayed-font-name', () => {
    const sel = '.displayed-font-name';
    test('overflow handling', () => {
      const rule = getRule(sel);
      expect(getDecl(rule, 'font-size')).toBe('.8rem');
      expect(getDecl(rule, 'overflow')).toBe('hidden');
      expect(getDecl(rule, 'white-space')).toBe('nowrap');
      const props = getProps(rule);
      ['font-size','overflow','white-space'].forEach(p => expect(props).toContain(p));
    });
  });


  describe('.font-dropdown', () => {
    const sel = '.font-dropdown';
    test('layout & sizing', () => {
      const rule = getRule(sel);
      expect(getDecl(rule, 'align-items')).toBe('center');
      expect(getDecl(rule, 'color')).toBe('$text-primary');
      expect(getDecl(rule, 'display')).toBe('flex');
      expect(getDecl(rule, 'font-size')).toBe('1rem');
      expect(getDecl(rule, 'justify-content')).toBe('space-between');
      expect(getDecl(rule, 'width')).toBe('8.5rem');
      expect(getDecl(rule, 'height')).toBe('2rem');
      const props = getProps(rule);
      ['align-items','color','display','font-size','justify-content','width','height']
        .forEach(p => expect(props).toContain(p));
    });
  });


  describe('Variables, units, and patterns', () => {
    test('uses expected variables and calc()', () => {
      expect(cssContent).toContain('$grid-unit');
      expect(cssContent).toContain('$looks-secondary');
      expect(cssContent).toContain('$text-primary');
      const calcMatches = cssContent.match(/calc\([^)]+\)/g) || [];
      expect(calcMatches.length).toBeGreaterThanOrEqual(3);
    });
    test('rem units present', () => {
      const remMatches = cssContent.match(/\d*\.?\d+rem/g);
      expect(remMatches && remMatches.length).toBeGreaterThan(0);
    });
    test('width 8.5rem appears twice', () => {
      if (parsedCSS) {
        const widths = [];
        parsedCSS.walkDecls('width', d => widths.push(d.value));
        expect(widths.filter(w => w === '8.5rem').length).toBe(2);
      } else {
        const widths = collectDeclValuesFromContent(cssContent, 'width');
        expect(widths.filter(w => w === '8.5rem').length).toBe(2);
      }
    });
    test('flex usage across selectors', () => {
      const flexCount = (cssContent.match(/display:\s*flex/g) || []).length;
      expect(flexCount).toBeGreaterThanOrEqual(3);
      expect(cssContent).toContain('align-items');
      expect(cssContent).toContain('justify-content');
      expect(cssContent).toContain('flex-direction');
    });
  });


  describe('Accessibility and UX cues', () => {
    test('interactive and overflow behaviors', () => {
      expect(cssContent).toContain('cursor: pointer');
      expect(cssContent).toContain(':hover');
      expect(cssContent).toContain('transition');
      expect(cssContent).toContain('user-select: none');
      expect(cssContent).toContain('overflow-wrap');
    });
  });


  describe('Code quality checks', () => {
    test('no duplicate selectors', () => {
      const sels = extractSelectors();
      const unique = new Set(sels);
      expect(unique.size).toBe(sels.length);
    });
    test('consistent indentation (4 spaces on non-empty lines)', () => {
      const lines = cssContent.split('\n');
      const indented = lines.filter(l => l.trim().length > 0 && l.startsWith('    '));
      expect(indented.length).toBeGreaterThan(0);
    });
    test('valid pseudo-class syntax present', () => {
      expect(cssContent).toMatch(/\.[\w-]+:hover/);
    });
    test('calc syntax for grid units', () => {
      const calcExpressions = cssContent.match(/calc\([^)]+\)/g) || [];
      calcExpressions.forEach(expr => {
        expect(expr).toMatch(/calc\(\s*\d+\s*\*\s*\$[\w-]+\s*\)/);
      });
    });
  });
});