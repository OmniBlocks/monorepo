jest.mock('cross-fetch', () => {
    const crossFetch = jest.requireActual('cross-fetch');
    const mockFetch = () => Promise.reject(new Error('Intentional error for testing'));
    return {
        ...crossFetch,
        default: mockFetch,
        fetch: mockFetch
    };
});

const FetchTool = require('../../src/FetchTool');

jest.setTimeout(15000);

test('get() returns a somewhat useful error message', async () => {
    const tool = new FetchTool();

    let error = null;
    try {
        await tool.get({
            url: 'https://something.turbowarp.org/1234.png'
        });
    } catch (e) {
        error = e;
    }

    expect(error.toString()).toMatch(
        /Storage request https:\/\/something.turbowarp.org\/1234.png failed: Error: Intentional error for testing/
    );
});
