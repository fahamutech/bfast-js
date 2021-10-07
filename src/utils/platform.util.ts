const _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj: any) {
    return typeof obj;
} : function (obj: any) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};
export const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
export const isWebWorker = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) === 'object' && self.constructor && self.constructor.name === 'DedicatedWorkerGlobalScope';
export const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

// @ts-ignore
export const isElectron = (typeof window !=='undefined' && typeof window.process !=="undefined" && typeof window.process.type!=="undefined");

export const isBrowserLike = (isElectron || isBrowser || isWebWorker)
