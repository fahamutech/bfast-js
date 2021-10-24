const {expect, should} = require('chai')
const {init, database} = require('../../dist/bfast.node');
const {config, serverUrl} = require("../test.config");
const {sales} = require('../sales');

describe('save', function () {
    before(function () {
        init({
            applicationId: config.applicationId,
            projectId: config.projectId,
            databaseURL: serverUrl,
            functionsURL: serverUrl,
        });
    });
    it('should save a single doc data', async function () {
        const doe = await database().table('test').save({
            name: 'john',
            age: 20
        });
        should().exist(doe);
        expect(doe.name).equal('john');
        expect(doe.age).equal(20);
    });
    it('should save a single doc data with id and date metadata', async function () {
        const date = new Date().toDateString();
        const doe = await database().table('test').save({
            name: 'john',
            age: 20,
            id: 'josh',
            createdAt: date,
            updatedAt: date
        });
        should().exist(doe);
        expect(doe).eql({
            name: 'john',
            age: 20,
            id: 'josh',
            createdAt: date,
            createdBy: null,
            updatedAt: date
        });
    });
    it('should save many docs', async function () {
        const date = new Date().toDateString();
        const doe = await database().table('test').save([
            {
                name: 'john',
                age: 20,
                id: 'josh2',
                createdAt: date,
                updatedAt: date
            },
            {
                name: 'hey',
                age: 20,
                id: 'hey',
                createdAt: date,
                updatedAt: date
            }
        ]);
        should().exist(doe);
        expect(doe).eql([
            {
                name: 'john',
                age: 20,
                id: 'josh2',
                createdAt: date,
                createdBy: null,
                updatedAt: date
            },
            {
                name: 'hey',
                age: 20,
                id: 'hey',
                createdBy: null,
                createdAt: date,
                updatedAt: date
            }
        ]);
    });
    // it('should save on already exist doc', async function () {
    //     await database().table('test').save({
    //         id: 'dd',
    //     });
    //     const doe = await database().table('test').save({
    //         id: 'dd',
    //     });
    //     should().exist(doe);
    //     expect(doe.id).equal('dd');
    // });
    it('should only return specified returns when save', async function () {
        const doe = await database().table('test').save({
            name: 'john',
            id: '1234',
            age: 20
        }, {
            returnFields: ['age']
        });
        should().exist(doe);
        should().not.exist(doe.name);
        expect(doe.age).equal(20);
        expect(doe.id).equal('1234');
    });
    it('should throw errors when app unknown', async function () {
        try {
            const r = await database('doe')
                .table('test')
                .save({
                    g: 23
                });
            should().not.exist(r);
        } catch (e) {
            should().exist(e);
            expect(e.toString()).equal('Error: The app -> doe is not initialized');
        }
    });
    it('should throw errors when server not reachable', async function () {
        init({
            databaseURL: 'http://localhost:897979',
            functionsURL: ''
        }, '_no_');
        try {
            const r = await database('_no_')
                .table('test')
                .save({
                    g: 23
                });
            should().not.exist(r);
        } catch (e) {
            should().exist(e);
        }
    });
    it('should save large data with many nodes', async function(){
        const s = await database().table('sales').save(sales);
        should().exist(s);
        expect(s).length(sales.length);
    });
});
