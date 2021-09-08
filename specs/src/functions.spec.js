const {expect, should} = require('chai')
const {init, storage, functions} = require('../../dist/bfast.node');
const {config, serverUrl, mongoRepSet} = require("../test.config");

describe('functions', function () {
    before(async function () {
        await mongoRepSet().start();
        init({
            applicationId: config.applicationId,
            projectId: config.projectId,
            databaseURL: serverUrl,
            functionsURL: serverUrl,
        });
    });
    describe('post', function () {
        it('should send a post request', async function () {
            const r = await functions().request('/fp').post();
            expect(r).equal('fp');
        });
    });
    describe('put', function () {
        it('should send a put request', async function () {
            const r = await functions().request('/fpt').put();
            expect(r).equal('fpt');
        });
    });
    describe('get', function () {
        it('should send a get request', async function () {
            const r = await functions().request('/fg').get();
            expect(r).equal('fg');
        });
    });
    describe('delete', function () {
        it('should send a delete request', async function () {
            const r = await functions().request('/fd').delete();
            expect(r).equal('fd');
        });
    });
});
