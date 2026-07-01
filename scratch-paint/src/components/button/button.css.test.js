/* eslint-env jest */
/**
 * Testing library/framework: Jest (v22) with default JSDOM environment.
 * Note: Enzyme is present in the repo but unnecessary here (we are validating CSS rules, not React components).
 *
 * This suite validates the CSS in src/components/button/button.css:
 * - Base .button styles (background, cursor, user-select)
 * - :active, .highlighted.button, .mod-disabled, and .mod-disabled:active rules
 * - Usage of $looks-transparent and its definition in colors.css
 * - Basic rule-ordering that ensures disabled active overrides general active
 */
const fs = require('fs');
const path = require('path');

let css;

const read = rel =>
  fs.readFileSync(path.resolve(__dirname, rel), 'utf8');

beforeAll(() => {
  css = read('button.css');
});

const escapeRegex = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const getBlock = (cssText, selector) => {
  const re = new RegExp(escapeRegex(selector) + '\\s*\\{([\\s\\S]*?)\\}', 'm');
  const m = cssText.match(re);
  return m ? m[1] : null;
};
const hasDecl = (block, prop, value) => {
  if (!block) return false;
  const valueRe = escapeRegex(String(value)).replace(/\s+/g, '\\s*');
  const re = new RegExp('\\b' + escapeRegex(prop) + '\\s*:\\s*' + valueRe + '\\s*;', 'i');
  return re.test(block);
};

describe('button.css', () => {
  test('includes import of colors.css', () => {
    expect(css).toMatch(/@import\s+["']\.\.\/\.\.\/css\/colors\.css["'];/);
  });

  test('base .button block exists and contains expected declarations', () => {
    const base = getBlock(css, '.button');
    expect(base).toBeTruthy();
    expect(hasDecl(base, 'background', 'none')).toBe(true);
    expect(hasDecl(base, 'cursor', 'pointer')).toBe(true);
    expect(hasDecl(base, 'user-select', 'none')).toBe(true);
  });

  test('.button:active uses $looks-transparent for background-color', () => {
    const active = getBlock(css, '.button:active');
    expect(active).toBeTruthy();
    expect(hasDecl(active, 'background-color', '$looks-transparent')).toBe(true);
  });

  test('.highlighted.button uses $looks-transparent for background-color', () => {
    const highlighted = getBlock(css, '.highlighted.button');
    expect(highlighted).toBeTruthy();
    expect(hasDecl(highlighted, 'background-color', '$looks-transparent')).toBe(true);
  });

  test('.mod-disabled sets cursor to auto and opacity to .5', () => {
    const disabled = getBlock(css, '.mod-disabled');
    expect(disabled).toBeTruthy();
    expect(hasDecl(disabled, 'cursor', 'auto')).toBe(true);
    expect(hasDecl(disabled, 'opacity', '.5')).toBe(true);
  });

  test('.mod-disabled:active forces background none', () => {
    const disabledActive = getBlock(css, '.mod-disabled:active');
    expect(disabledActive).toBeTruthy();
    expect(hasDecl(disabledActive, 'background', 'none')).toBe(true);
  });

  test('rule-order: .mod-disabled:active appears after .button:active (override applies)', () => {
    const posActive = css.indexOf('.button:active');
    const posDisabledActive = css.indexOf('.mod-disabled:active');
    expect(posActive).toBeGreaterThanOrEqual(0);
    expect(posDisabledActive).toBeGreaterThanOrEqual(0);
    expect(posDisabledActive).toBeGreaterThan(posActive);
  });

  test('colors.css defines $looks-transparent via CSS variable fallback', () => {
    const colorsCss = read('../../css/colors.css');
    // e.g., $looks-transparent: var(--paint-looks-transparent, hsla(...));
    expect(colorsCss).toMatch(/\$looks-transparent:\s*var\(--paint-looks-transparent,\s*[^)]+\);/);
  });
});