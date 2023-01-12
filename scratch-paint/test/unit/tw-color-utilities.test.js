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
    expect(colorToHex('#12345ffF')).toBe('#12345f');
    expect(colorToHex('#347AA1fe')).toBe('#347aa1fe');
    expect(colorToHex('#abcdef00')).toBe('#abcdef00');
    expect(colorToHex('#00000000')).toBe('#00000000');
    expect(colorToHex('#aB0')).toBe('#aabb00');
    expect(colorToHex('#bb3f')).toBe('#bbbb33');
    expect(colorToHex('#0000')).toBe('#00000000');
    expect(colorToHex('rgb(25, 80, 250)')).toBe('#1950fa');
    expect(colorToHex('something invalid')).toBe('#00000000');
    expect(colorToHex('red')).toBe('#ff0000');
});
