const {expect, should} = require('chai')
const {init, database} = require('../../dist/bfast.node');
const {config, serverUrl, mongoRepSet} = require("../test.config");
const exp = require("constants");

describe('find', function () {
    before(async function () {
        await mongoRepSet().start();
        init({
            applicationId: config.applicationId,
            projectId: config.projectId,
            databaseURL: serverUrl,
            functionsURL: serverUrl,
        });
        await database().table('test').save([
            {item: 'xps', price: 1000, id: 'xpsid', createdAt: 'leo', updatedAt: 'leo'},
            {item: 'chrome', price: 3000, id: 'chm', createdAt: 'leo', updatedAt: 'leo'},
        ]);
    });

    describe('getAll', function () {
        it('should return all docs', async function () {
            const r = await database().table('test').getAll();
            should().exist(r);
            expect(r).length(2);
        });
        it('should return all docs version 2', async function () {
            const r = await database().table('test').query().find();
            should().exist(r);
            expect(r).length(2);
        });
        it('should return all docs with limit', async function () {
            const r = await database().table('test')
                .query()
                .size(1)
                .skip(1)
                .find();
            should().exist(r);
            expect(r).length(1);
        });
    });

    describe('equalTo', function () {
        it('should find a doc with equality query', async function () {
            const r = await database().table('test').query()
                .equalTo('item', 'xps')
                .find();
            should().exist(r);
            expect(r).eql([{
                item: 'xps',
                price: 1000,
                id: 'xpsid',
                createdAt: 'leo',
                updatedAt: 'leo',
                createdBy: null
            }]);
        });
        it('should find a doc with equality query for number', async function () {
            const r = await database().table('test').query()
                .equalTo('price', 1000)
                .find();
            should().exist(r);
            expect(r).eql([{
                item: 'xps',
                price: 1000,
                id: 'xpsid',
                createdAt: 'leo',
                updatedAt: 'leo',
                createdBy: null
            }]);
        });
        it('should return empty array when doc not available', async function () {
            const r = await database().table('test').query()
                .equalTo('item234', 'xps')
                .find();
            should().exist(r);
            expect(r).eql([]);
        });
    });

    describe('byId', function () {
        it('should return a doc for valid id', async function () {
            const r = await database()
                .table('test')
                .query()
                .byId('xpsid')
                .find();
            should().exist(r);
            expect(r).eql({
                item: 'xps',
                price: 1000,
                id: 'xpsid',
                createdAt: 'leo',
                updatedAt: 'leo',
                createdBy: null
            });
        });
        it('should return a doc for valid id direct', async function () {
            const r = await database()
                .table('test')
                .get('xpsid');
            should().exist(r);
            expect(r).eql({
                item: 'xps',
                price: 1000,
                id: 'xpsid',
                createdAt: 'leo',
                updatedAt: 'leo',
                createdBy: null
            });
        });
        it('should not return a doc for invalid id', async function () {
            const r = await database()
                .table('test')
                .query()
                .byId('9079886hkjhk')
                .find();
            should().not.exist(r);
        });
    });

    describe('count', function () {
        it('should count all docs with no filter', async function () {
            const total = await database().table('test')
                .query()
                .count(true)
                .find();
            should().exist(total);
            expect(total).equal(2);
        });
        it('should count all docs with filter', async function () {
            const total = await database().table('test')
                .query()
                .equalTo('item', 'xps')
                .count(true)
                .find();
            should().exist(total);
            expect(total).equal(1);
        });
    });

    describe('notEqual', function () {
        it('should find a doc with not equality query', async function () {
            const r = await database().table('test').query()
                .notEqualTo('item', 'xps')
                .find();
            should().exist(r);
            expect(r).eql([{
                item: 'chrome',
                price: 3000,
                id: 'chm',
                createdAt: 'leo',
                updatedAt: 'leo',
                createdBy: null
            }]);
        });
        it('should find a doc with equality query for number', async function () {
            const r = await database().table('test').query()
                .notEqualTo('price', 1000)
                .find();
            should().exist(r);
            expect(r).eql([{
                item: 'chrome',
                price: 3000,
                id: 'chm',
                createdAt: 'leo',
                updatedAt: 'leo',
                createdBy: null
            }]);
        });
        it('should return all', async function () {
            const r = await database().table('test').query()
                .notEqualTo('item', 'dell')
                .find();
            should().exist(r);
            expect(r).eql([
                {item: 'xps', price: 1000, id: 'xpsid', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                {item: 'chrome', price: 3000, id: 'chm', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
            ]);
        });
        it('should return no doc when query on non exist field', async function () {
            const r = await database().table('test').query()
                .notEqualTo('itemwwer', 'xps')
                .find();
            should().exist(r);
            expect(r).eql([]);
        });
    });

    describe('greaterThan',  function () {
        it('should return result for number', async function () {
            const r = await database().table('test')
                .query()
                .greaterThan('price', 2000)
                .find();
            should().exist(r);
            expect(r).eql([
                {item: 'chrome', price: 3000, id: 'chm', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
            ]);
        });
        it('should return result for string', async function () {
            const r = await database().table('test')
                .query()
                .greaterThan('item', 'chr')
                .find();
            should().exist(r);
            expect(r).eql([
                {item: 'xps', price: 1000, id: 'xpsid', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                {item: 'chrome', price: 3000, id: 'chm', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
            ]);
        });
    });
});
