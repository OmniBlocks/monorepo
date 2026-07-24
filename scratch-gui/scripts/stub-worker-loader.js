// worker extension is incompatible with newer webpack (and rspack)
module.exports = function stubWorkerLoader() {
    return 'module.exports = function () { throw new Error("worker sandbox mode is not supported in this build"); };';
};
