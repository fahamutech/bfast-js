const {expect, should} = require('chai')
const {init, storage, functions} = require('../../dist/bfast.node');
const {config, serverUrl, mongoRepSet} = require("../test.config");
const {Readable} = require("stream");
const {createReadStream} = require("fs");

describe('storage', function () {
    before(async function () {
        await mongoRepSet().start();
        init({
            applicationId: config.applicationId,
            projectId: config.projectId,
            databaseURL: serverUrl,
            functionsURL: serverUrl,
        });
    });

    describe('save', function () {
        it('should upload a file', async function () {
            const r = await storage().save({
                data: createReadStream(__dirname+'/../hello.txt'),
                filename: 'hello.txt',
            }, progress => {
                console.log(progress);
            });
            should().exist(r);
            expect(r.toString().startsWith('http://localhost')).equal(true);
            expect(r.toString().endsWith('hello.txt')).equal(true);
        });
        it('should upload a file with preserve mode', async function () {
            const r = await storage().save({
                data: Readable.from(Buffer.from('joshua')),
                filename: 'josh.txt',
                pn: true
            }, progress => {
                console.log(progress);
            });
            should().exist(r);
            expect(r).equal('http://localhost:3111/v2/storage/bfast_test/file/josh.txt');
        });
    });

    describe('list', function () {
        it('should list files with auto size', async function () {
            const r = await storage().list();
            should().exist(r);
            expect(r).length(2);
        });
    });

    describe('getUrl', function () {
        it('should get a file Url', function () {
            const url = storage().getUrl('josh.txt');
            should().exist(url);
            expect(url.toString().endsWith('/storage/bfast_test/file/josh.txt')).equal(true)
        });
    });

    describe('get', function () {
        it('should get a file content', async function () {
            const f = await functions().request(storage().getUrl('josh.txt')).get();
            expect(f).equal('joshua');
        });
    });
});
