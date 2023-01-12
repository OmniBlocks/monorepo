/* eslint-env jest */

import {makeAlphaComponent, colorToHex} from '../../src/lib/tw-color-utils';

test('makeAlphaComponent', () => {
    expect(makeAlphaComponent(0)).toBe('00');
    expect(makeAlphaComponent(1 / 255)).toBe('01');
    expect(makeAlphaComponent(254 / 255)).toBe('fe');
    expect(makeAlphaComponent(1)).toBe('ff');
});

test('colorToHex', () => {
    expect(colorToHex('#abcdef')).toBe('#abcdef');
    expect(colorToHex('rgb(25, 80, 250)')).toBe('#1950fa');
});
