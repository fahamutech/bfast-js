const {expect, should} = require('chai')
const {init, database} = require('../../dist/bfast.node');
const {config, serverUrl, mongoRepSet} = require("../test.config");

describe('bulk', function () {
    before(async function () {
        await mongoRepSet().start();
        init({
            applicationId: config.applicationId,
            projectId: config.projectId,
            databaseURL: serverUrl,
            functionsURL: serverUrl,
        });
        await database().table('test').save([
            {item: 'xps', price: 1000, id: 'xid', createdAt: 'leo', updatedAt: 'leo'},
            {item: 'xps', price: 1000, id: 'xid2', createdAt: 'leo', updatedAt: 'leo'},
        ]);
    });

    it('should perform a bulk operation', async function () {
        const r = await database().bulk()
            .create('users', {
                name: 'doe',
                id: 'doeid',
                createdAt: 'leo',
                updatedAt: 'leo'
            })
            .update('test', {
                query: {
                    id: 'xid'
                },
                update: {
                    $set: {
                        price: 500,
                        updatedAt: 'leo'
                    }
                }
            })
            .delete('test', {
                query: {
                    id: 'xid2'
                }
            })
            .commit();
        should().exist(r);
        expect(r).eql({
            createusers: {
                id: 'doeid',
                name: 'doe',
                createdAt: 'leo',
                updatedAt: 'leo',
            },
            updatetest: {
                item: 'xps',
                price: 500,
                id: 'xid',
                createdAt: 'leo',
                updatedAt: 'leo',
                createdBy: null
            },
            deletetest: [
                {
                    id: 'xid2'
                }
            ]
        })
    });
});
