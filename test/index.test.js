const { sanitizeCodeRabbitPing } = require('../src/index');
const assert = require('assert');

function testSanitization() {
    const cases = [
        {
            input: 'Hello @CodeRabbit',
            expected: 'Hello `@coderabbitai`'
        },
        {
            input: 'Hello C[]()o[]()de[]()Rabbit',
            expected: 'Hello `@coderabbitai`'
        },
        {
            input: 'Code block: `don\'t touch @CodeRabbit`',
            expected: 'Code block: `don\'t touch @CodeRabbit`'
        },
        {
            input: 'Fenced code: ```\n@CodeRabbit\n```',
            expected: 'Fenced code: ```\n@CodeRabbit\n```'
        },
        {
            input: 'Obfuscated in text: C[]()o[]()de[]()Rabbit',
            expected: 'Obfuscated in text: `@coderabbitai`'
        },
        {
            input: 'Both: @CodeRabbit and C[]()o[]()de[]()Rabbit',
            expected: 'Both: `@coderabbitai` and `@coderabbitai`'
        },
        {
            input: 'Mixed: @coderabbitai, @CodeRabbit, C[]()o[]()de[]()Rabbit',
            expected: 'Mixed: @coderabbitai, `@coderabbitai`, `@coderabbitai`'
        }
    ];

    for (const testCase of cases) {
        const result = sanitizeCodeRabbitPing(testCase.input);
        console.log(`Testing input: "${testCase.input.substring(0, 30)}..."`);
        assert.strictEqual(result, testCase.expected, `Failed: Expected "${testCase.expected}" but got "${result}"`);
    }
    console.log('All tests passed!');
}

testSanitization();
