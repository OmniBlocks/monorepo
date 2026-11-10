jest.mock('cross-fetch', () => {
    const crossFetch = jest.requireActual('cross-fetch');

    const mockFetch = () => Promise.resolve({
        // This is what fetch() resolves with in a WKWebView when requesting a file: URL from a file: URL.
        ok: false,
        status: 0,
        arrayBuffer: () => Promise.resolve(new Uint8Array([10, 20, 30, 40]).buffer)
    });

    return {
        ...crossFetch,
        default: mockFetch,
        fetch: mockFetch
    };
});

const FetchTool = require('../../src/FetchTool');

test('get() returns success for status: 0, ok: false', async () => {
    const tool = new FetchTool();
    const result = await tool.get({url: 'url'});
    expect(new Uint8Array(result)).toStrictEqual(new Uint8Array([
        10, 20, 30, 40
    ]));
});
