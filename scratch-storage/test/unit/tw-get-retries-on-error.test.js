jest.mock('cross-fetch', () => {
    const crossFetch = jest.requireActual('cross-fetch');

    let attempt = 0;
    const mockFetch = () => {
        attempt++;
        if (attempt === 1) {
            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject('Intentional error for testing');
        }
        return Promise.resolve({
            ok: true,
            arrayBuffer: () => Promise.resolve(new Uint8Array([100, 101, 102, 103]).buffer)
        });
    };

    return {
        ...crossFetch,
        default: mockFetch,
        fetch: mockFetch
    };
});

const FetchTool = require('../../src/FetchTool');

test('get() retries on error', async () => {
    const tool = new FetchTool();
    const result = await tool.get({url: 'url'});
    expect(new Uint8Array(result)).toStrictEqual(new Uint8Array([
        100, 101, 102, 103
    ]));
});
