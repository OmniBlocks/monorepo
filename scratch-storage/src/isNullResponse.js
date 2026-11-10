/**
 * @param {Response} response the response from fetch()
 * @returns {boolean} true if the response is a "null response" where we successfully talked to the
 * source, but the source has no data for us.
 */
const isNullResponse = response => (
    // can't access, eg. due to expired/missing project token
    response.status === 403 ||

    // assets does not exist
    // assets.scratch.mit.edu also returns 503 for missing assets
    response.status === 404 ||
    response.status === 503
);

module.exports = isNullResponse;
