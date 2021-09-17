const {expect, should} = require('chai')
const {init, database} = require('../../dist/bfast.node');
const {config, serverUrl, mongoRepSet} = require("../test.config");
const Hash = require('ipfs-only-hash');

describe('query', function () {
    const datas = [
        {item: 'chrome', price: 3000, id: 'chm', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
        {item: 'xps', price: 1000, id: 'xpsid', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
    ];
    before(async function () {
        await mongoRepSet().start();
        init({
            applicationId: config.applicationId,
            projectId: config.projectId,
            databaseURL: serverUrl,
            functionsURL: serverUrl,
        });
        await database().table('test').save(datas);
    });
    describe('find', function () {
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
                    {item: 'chrome', price: 3000, id: 'chm', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                    {item: 'xps', price: 1000, id: 'xpsid', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
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

        describe('greaterThan', function () {
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
                    {item: 'chrome', price: 3000, id: 'chm', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                    {item: 'xps', price: 1000, id: 'xpsid', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                ]);
            });
            it('should return empty result for non match', async function () {
                const r = await database().table('test')
                    .query()
                    .greaterThan('price', 100000)
                    .find();
                should().exist(r);
                expect(r).eql([]);
            });
        });

        describe('greaterThanOrEqual', function () {
            it('should return result for number', async function () {
                const r = await database().table('test')
                    .query()
                    .greaterThanOrEqual('price', 3000)
                    .find();
                should().exist(r);
                expect(r).eql([
                    {item: 'chrome', price: 3000, id: 'chm', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                ]);
            });
            it('should return result for string', async function () {
                const r = await database().table('test')
                    .query()
                    .greaterThanOrEqual('item', 'chrome')
                    .find();
                should().exist(r);
                expect(r).eql([
                    {item: 'chrome', price: 3000, id: 'chm', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                    {item: 'xps', price: 1000, id: 'xpsid', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                ]);
            });
            it('should return empty result for non match', async function () {
                const r = await database().table('test')
                    .query()
                    .greaterThanOrEqual('price', 100000)
                    .find();
                should().exist(r);
                expect(r).eql([]);
            });
        });

        describe('lessThan', function () {
            it('should return result for number', async function () {
                const r = await database().table('test')
                    .query()
                    .lessThan('price', 3000)
                    .find();
                should().exist(r);
                expect(r).eql([
                    {item: 'xps', price: 1000, id: 'xpsid', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                ]);
            });
            it('should return result for string', async function () {
                const r = await database().table('test')
                    .query()
                    .lessThan('item', 'z')
                    .find();
                should().exist(r);
                expect(r).eql([
                    {item: 'chrome', price: 3000, id: 'chm', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                    {item: 'xps', price: 1000, id: 'xpsid', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                ]);
            });
            it('should return empty result for non match', async function () {
                const r = await database().table('test')
                    .query()
                    .lessThan('price', 20)
                    .find();
                should().exist(r);
                expect(r).eql([]);
            });
        });

        describe('lessThanOrEqual', function () {
            it('should return result for number', async function () {
                const r = await database().table('test')
                    .query()
                    .lessThanOrEqual('price', 1000)
                    .find();
                should().exist(r);
                expect(r).eql([
                    {item: 'xps', price: 1000, id: 'xpsid', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                ]);
            });
            it('should return result for string', async function () {
                const r = await database().table('test')
                    .query()
                    .lessThanOrEqual('item', 'xps')
                    .find();
                should().exist(r);
                expect(r).eql([
                    {item: 'chrome', price: 3000, id: 'chm', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                    {item: 'xps', price: 1000, id: 'xpsid', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                ]);
            });
            it('should return empty result for non match', async function () {
                const r = await database().table('test')
                    .query()
                    .lessThanOrEqual('price', 20)
                    .find();
                should().exist(r);
                expect(r).eql([]);
            });
        });

        describe('includesIn', function () {
            it('should return result for number list', async function () {
                const r = await database().table('test')
                    .query()
                    .includesIn('price', [3000, 1000])
                    .find();
                should().exist(r);
                expect(r).eql([
                    {item: 'chrome', price: 3000, id: 'chm', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                    {item: 'xps', price: 1000, id: 'xpsid', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                ]);
            });
            it('should return result for string', async function () {
                const r = await database().table('test')
                    .query()
                    .includesIn('item', ['xps'])
                    .find();
                should().exist(r);
                expect(r).eql([
                    {item: 'xps', price: 1000, id: 'xpsid', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                ]);
            });
            it('should return empty result for non match', async function () {
                const r = await database().table('test')
                    .query()
                    .greaterThanOrEqual('price', [100000, 8, 8000])
                    .find();
                should().exist(r);
                expect(r).eql([]);
            });
        });

        describe('notIncludesIn', function () {
            it('should return result for number list', async function () {
                const r = await database().table('test')
                    .query()
                    .notIncludesIn('price', [7, 90])
                    .find();
                should().exist(r);
                expect(r).eql([
                    {item: 'chrome', price: 3000, id: 'chm', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                    {item: 'xps', price: 1000, id: 'xpsid', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                ]);
            });
            it('should return result for string', async function () {
                const r = await database().table('test')
                    .query()
                    .notIncludesIn('item', ['chrome'])
                    .find();
                should().exist(r);
                expect(r).eql([
                    {item: 'xps', price: 1000, id: 'xpsid', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                ]);
            });
            it('should return empty result', async function () {
                const r = await database().table('test')
                    .query()
                    .notIncludesIn('price', [1000, 3000])
                    .find();
                should().exist(r);
                expect(r).eql([]);
            });
        });

        describe('exists', function () {
            it('should return result for number list', async function () {
                const r = await database().table('test')
                    .query()
                    .exists('price')
                    .find();
                should().exist(r);
                expect(r).eql([
                    {item: 'chrome', price: 3000, id: 'chm', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                    {item: 'xps', price: 1000, id: 'xpsid', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                ]);
            });
            it('should return result for string', async function () {
                const r = await database().table('test')
                    .query()
                    .exists('item')
                    .find();
                should().exist(r);
                expect(r).eql([
                    {item: 'chrome', price: 3000, id: 'chm', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                    {item: 'xps', price: 1000, id: 'xpsid', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                ]);
            });
            it('should return empty result for non match', async function () {
                const r = await database().table('test')
                    .query()
                    .exists('age')
                    .find();
                should().exist(r);
                expect(r).eql([]);
            });
        });

        describe('searchByRegex', function () {
            it('should return result for number list', async function () {
                const r = await database().table('test')
                    .query()
                    .searchByRegex('price', '000')
                    .find();
                should().exist(r);
                expect(r).eql([
                    {item: 'chrome', price: 3000, id: 'chm', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                    {item: 'xps', price: 1000, id: 'xpsid', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                ]);
            });
            it('should return result for string', async function () {
                const r = await database().table('test')
                    .query()
                    .searchByRegex('item', 'ch')
                    .find();
                should().exist(r);
                expect(r).eql([
                    {item: 'chrome', price: 3000, id: 'chm', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                ]);
            });
            it('should return empty result for non match', async function () {
                const r = await database().table('test')
                    .query()
                    .searchByRegex('item', 'ethan')
                    .find();
                should().exist(r);
                expect(r).eql([]);
            });
            it('should return empty result for non exist field', async function () {
                const r = await database().table('test')
                    .query()
                    .searchByRegex('detail', 'better')
                    .find();
                should().exist(r);
                expect(r).eql([]);
            });
        });

        describe('raw', function () {
            it('should return result for number list', async function () {
                const r = await database().table('test')
                    .query()
                    .raw({
                        price: 1000
                    });
                should().exist(r);
                expect(r).eql([
                    {item: 'xps', price: 1000, id: 'xpsid', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                ]);
            });
            it('should return result for string', async function () {
                const r = await database().table('test')
                    .query()
                    .raw({
                        item: 'chrome'
                    });
                should().exist(r);
                expect(r).eql([
                    {item: 'chrome', price: 3000, id: 'chm', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                ]);
            });
            it('should return empty result for non match', async function () {
                const r = await database().table('test')
                    .query()
                    .raw({
                        item: 'ethan'
                    });
                should().exist(r);
                expect(r).eql([]);
            });
            it('should return empty result for non exist field', async function () {
                const r = await database().table('test')
                    .query()
                    .raw({
                        detail: 'better'
                    });
                should().exist(r);
                expect(r).eql([]);
            });
        });

        describe('and operation query', function () {
            it('should return result', async function () {
                const r = await database().table('test')
                    .query()
                    .greaterThanOrEqual('price', 1000)
                    .equalTo('item', 'xps')
                    .find();
                should().exist(r);
                expect(r).eql([
                    {item: 'xps', price: 1000, id: 'xpsid', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                ]);
            });
            it('should not return result', async function () {
                const r = await database().table('test')
                    .query()
                    .equalTo('price', 1000)
                    .equalTo('item', 'chrome')
                    .find();
                should().exist(r);
                expect(r).eql([]);
            });
        });

        describe('or operation query', function () {
            before(async function () {
                await database().table('test')
                    .save({
                        id: 'ff',
                        createdAt: 'leo',
                        updatedAt: 'leo',
                        name: 'tt project',
                        pid: 'tt',
                        members: [
                            {email: 'e@e.e'}
                        ],
                        users: {
                            email: 'e@e.e'
                        }
                    });
            });
            it('should return result', async function () {
                const r = await database().table('test')
                    .query()
                    .raw([
                        {
                            item: 'xps'
                        },
                        {
                            item: 'chrome'
                        }
                    ]);
                should().exist(r);
                expect(r).eql([
                    {item: 'xps', price: 1000, id: 'xpsid', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                    {item: 'chrome', price: 3000, id: 'chm', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                ]);
            });
            it('should not return result', async function () {
                const r = await database().table('test')
                    .query()
                    .raw([
                        {
                            item: 'hp'
                        },
                        {
                            item: 'josh'
                        }
                    ]);
                should().exist(r);
                expect(r).eql([]);
            });
            it('should return result for complex embedded doc', async function () {
                const r = await database().table('test')
                    .query()
                    .raw({
                        pid: 'tt',
                        users: {
                            email: 'e@e.e'
                        },
                        members: {
                            email: 'e@e.e'
                        }
                    });
                should().exist(r);
                expect(r).eql([{
                    id: 'ff',
                    createdAt: 'leo',
                    updatedAt: 'leo',
                    name: 'tt project',
                    pid: 'tt',
                    members: [
                        {email: 'e@e.e'}
                    ],
                    users: {
                        email: 'e@e.e'
                    },
                    createdBy: null
                }]);
            });
            it('should return result for complex embedded doc target array field', async function () {
                const r = await database().table('test')
                    .query()
                    .raw([
                        {
                            pid: 'ttpp',
                            users: {
                                email: 'e@e.e'
                            }
                        },
                        {
                            members: {
                                email: 'e@e.e'
                            }
                        }
                    ]);
                should().exist(r);
                expect(r).eql([{
                    id: 'ff',
                    createdAt: 'leo',
                    updatedAt: 'leo',
                    name: 'tt project',
                    pid: 'tt',
                    members: [
                        {email: 'e@e.e'}
                    ],
                    users: {
                        email: 'e@e.e'
                    },
                    createdBy: null
                }]);
            });
        });

        describe('cids', async function () {
            let cids = [];
            before(async function () {
                let _datas = JSON.parse(JSON.stringify(datas));
                _datas = _datas.map(async x => {
                    x._id = x.id;
                    delete x.id;
                    delete x.return;
                    return await Hash.of(JSON.stringify(x));
                });
                cids = await Promise.all(_datas);
            })
            it('should return all cids when told so in getAll', async function () {
                const r = await database().table('test').getAll({
                    cids: true
                });
                should().exist(r);
                expect(r).to.include.members(cids);
            });
            it('should return all cids when told so in query mode', async function () {
                const r = await database().table('test')
                    .query()
                    .cids(true)
                    .find();
                should().exist(r);
                expect(r).to.include.members(cids);
            });
        });

        describe('orderBy', async function () {
            it('should order result asc on specified field', async function () {
                const r = await database().table('test')
                    .query()
                    .lessThan('price', 4000)
                    .orderBy('price', 'asc');
                should().exist(r);
                expect(r).eql([
                    {item: 'xps', price: 1000, id: 'xpsid', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                    {item: 'chrome', price: 3000, id: 'chm', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                ]);
            });
            it('should order result desc on specified field', async function () {
                const r = await database().table('test')
                    .query()
                    .lessThan('price', 4000)
                    .orderBy('price', 'desc');
                should().exist(r);
                expect(r).eql([
                    {item: 'chrome', price: 3000, id: 'chm', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                    {item: 'xps', price: 1000, id: 'xpsid', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                ]);
            });
            it('should order result asc when specify orderBy only', async function () {
                const r = await database().table('test')
                    .query()
                    .orderBy('price', 'asc');
                should().exist(r);
                expect(r).eql([
                    {item: 'xps', price: 1000, id: 'xpsid', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                    {item: 'chrome', price: 3000, id: 'chm', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                ]);
            });
            it('should order result desc when specify orderBy only', async function () {
                const r = await database().table('test')
                    .query()
                    .orderBy('price', 'desc');
                should().exist(r);
                expect(r).eql([
                    {item: 'chrome', price: 3000, id: 'chm', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                    {item: 'xps', price: 1000, id: 'xpsid', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                ]);
            });
            it('should order result desc when specify orderBy only and obey limit', async function () {
                const r = await database().table('test')
                    .query()
                    .orderBy('price', 'desc', {
                        limit: 1
                    });
                should().exist(r);
                expect(r).eql([
                    {item: 'chrome', price: 3000, id: 'chm', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                ]);
            });
            it('should order result desc when specify orderBy only and obey skip', async function () {
                const r = await database().table('test')
                    .query()
                    .orderBy('price', 'desc', {
                        skip: 1
                    });
                should().exist(r);
                expect(r).eql([
                    {item: 'xps', price: 1000, id: 'xpsid', createdAt: 'leo', updatedAt: 'leo', createdBy: null},
                ]);
            });
        });

    });
});
