const device = require("browser-or-node");

export const isNode = function () {
    return device.isNode && !device.isBrowser;
};

export const isElectron = function () {
    return device.isNode && device.isBrowser;
}
