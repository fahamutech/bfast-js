const {expect, should} = require('chai')
const {init, database} = require('../../dist/bfast.node');
const {config, serverUrl, mongoRepSet} = require("../test.config");

describe('update', function () {
    before(async function () {
        await mongoRepSet().start();
        init({
            applicationId: config.applicationId,
            projectId: config.projectId,
            databaseURL: serverUrl,
            functionsURL: serverUrl,
        });
        await database().table('test').save([
            {item: 'xps', price: 1000, id: 'xido', createdAt: 'leo', updatedAt: 'leo'},
            {item: 'chrome', price: 3000, id: 'chm', createdAt: 'leo', updatedAt: 'leo'},
        ]);
    });

    describe('updateBuilder', function () {
        describe('$set', function () {
            it('should update a doc field by id', async function () {
                const r = await database().table('test')
                    .query()
                    .byId('xido')
                    .updateBuilder()
                    .set('item', 'dell')
                    .set('updatedAt','leo')
                    .update();
                should().exist(r);
                expect(r).eql({
                    item: 'dell',
                    price: 1000,
                    id: 'xido',
                    createdAt: 'leo',
                    updatedAt: 'leo',
                    createdBy: null
                });
            });
            it('should not update a doc field by id', async function () {
                const r = await database().table('test')
                    .query()
                    .byId('xido45r')
                    .updateBuilder()
                    .set('item', 'dell')
                    .set('updatedAt','leo')
                    .update();
                should().not.exist(r);
                expect(r).eql(null);
            });
            it('should upsert a doc by id when told so', async function () {
                const r = await database().table('test')
                    .query()
                    .byId('xido45r')
                    .updateBuilder()
                    .upsert(true)
                    .set('item', 'andr')
                    .set('updatedAt','leo')
                    .set('createdAt','leo')
                    .update();
                should().exist(r);
                expect(r).eql({
                    id: 'xido45r',
                    item: 'andr',
                    updatedAt: 'leo',
                    createdAt: 'leo'
                });
            });
            it('should update a doc field by query filter', async function () {
                const r = await database().table('test')
                    .query()
                    .equalTo('item','dell')
                    .updateBuilder()
                    .set('item', 'xps2')
                    .set('updatedAt','leo')
                    .update();
                should().exist(r);
                expect(r).eql([{
                    item: 'xps2',
                    price: 1000,
                    id: 'xido',
                    createdAt: 'leo',
                    updatedAt: 'leo',
                    createdBy: null
                }]);
            });
            it('should not update a doc field by query filter', async function () {
                const r = await database().table('test')
                    .query()
                    .equalTo('item','myself')
                    .updateBuilder()
                    .set('item', 'xps2')
                    .set('updatedAt','leo')
                    .update();
                should().exist(r);
                expect(r).eql([]);
            });
            it('should upsert a doc field by query filter when told so', async function () {
                const r = await database().table('test')
                    .query()
                    .byId('xpn')
                    .updateBuilder()
                    .upsert(true)
                    .set('item', 'xps9')
                    .set('updatedAt','leo')
                    .set('createdAt','leo')
                    .update();
                should().exist(r);
                expect(r).eql({
                    id: 'xpn',
                    item: 'xps9',
                    updatedAt: 'leo',
                    createdAt: 'leo'
                });
            });
            it('should creat non exist field', async function () {
                const r = await database().table('test')
                    .query()
                    .byId('xido')
                    .updateBuilder()
                    .set('detail', 'old')
                    .set('updatedAt','leo')
                    .update();
                should().exist(r);
                expect(r).eql({
                    item: 'xps2',
                    price: 1000,
                    detail:'old',
                    id: 'xido',
                    createdAt: 'leo',
                    updatedAt: 'leo',
                    createdBy: null
                });
            });
            it('should creat non exist field when use query filter', async function () {
                const r = await database().table('test')
                    .query()
                    .equalTo('item','xps2')
                    .updateBuilder()
                    .set('tag', 'brand')
                    .set('updatedAt','leo')
                    .update();
                should().exist(r);
                expect(r).eql([{
                    item: 'xps2',
                    price: 1000,
                    detail:'old',
                    tag: 'brand',
                    id: 'xido',
                    createdAt: 'leo',
                    updatedAt: 'leo',
                    createdBy: null
                }]);
            });
        });
        describe('$inc', function () {
            it('should increment a doc field by id', async function () {
                const r = await database().table('test')
                    .query()
                    .byId('xido')
                    .updateBuilder()
                    .increment('price', 10)
                    .set('updatedAt','leo')
                    .update();
                should().exist(r);
                expect(r).eql({
                    item: 'xps2',
                    price: 1010,
                    id: 'xido',
                    detail: 'old',
                    tag: 'brand',
                    createdAt: 'leo',
                    updatedAt: 'leo',
                    createdBy: null
                });
            });
            it('should not increment a doc field by id', async function () {
                const r = await database().table('test')
                    .query()
                    .byId('xido45roo')
                    .updateBuilder()
                    .increment('price', 90)
                    .set('updatedAt','leo')
                    .update();
                should().not.exist(r);
                expect(r).eql(null);
            });
            // it('should increment a doc field by query filter', async function () {
            //     const r = await database().table('test')
            //         .query()
            //         .equalTo('item','dell')
            //         .updateBuilder()
            //         .increment('price', 10)
            //         .set('updatedAt','leo')
            //         .update();
            //     should().exist(r);
            //     expect(r).eql([{
            //         item: 'xps2',
            //         price: 1020,
            //         id: 'xido',
            //         detail: 'old',
            //         tag: 'brand',
            //         createdAt: 'leo',
            //         updatedAt: 'leo',
            //         createdBy: null
            //     }]);
            // });
            it('should upsert and increment a doc field by id when told so', async function () {
                const r = await database().table('test')
                    .query()
                    .byId('josh')
                    .updateBuilder()
                    .upsert(true)
                    .increment('qty', 10)
                    .set('id','josh')
                    .set('updatedAt','leo')
                    .update();
                should().exist(r);
                expect(r).eql({
                    qty: 10,
                    id: 'josh',
                    updatedAt: 'leo'
                });
            });
            it('should upsert and increment a doc field by filter when told so', async function () {
                const r = await database().table('test')
                    .query()
                    .byId('josh3')
                    // .equalTo('loc','man')
                    .updateBuilder()
                    .upsert(true)
                    .increment('qty', 10)
                    // .set('id','josh3')
                    .set('updatedAt','leo')
                    .update();
                should().exist(r);
                expect(r).eql({
                    qty: 10,
                    id: 'josh3',
                    // loc: 'man',
                    updatedAt: 'leo'
                });
            });
            // it('should decrement a doc field by id', async function () {
            //     const r = await database().table('test')
            //         .query()
            //         .byId('xido')
            //         .updateBuilder()
            //         .decrement('price', 10)
            //         .set('updatedAt','leo')
            //         .update();
            //     should().exist(r);
            //     expect(r).eql({
            //         item: 'xps2',
            //         price: 1010,
            //         id: 'xido',
            //         detail: 'old',
            //         tag: 'brand',
            //         createdAt: 'leo',
            //         updatedAt: 'leo',
            //         createdBy: null
            //     });
            // });
            it('should upsert and decrement a doc field by id when told so', async function () {
                const r = await database().table('test')
                    .query()
                    .byId('joshxido')
                    .updateBuilder()
                    .upsert(true)
                    .decrement('qty', 10)
                    .set('id','joshxido')
                    .set('updatedAt','leo')
                    .update();
                should().exist(r);
                expect(r).eql({
                    qty: -10,
                    id: 'joshxido',
                    updatedAt: 'leo'
                });
            });
        });
    });
});
