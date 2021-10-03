const {expect, should} = require('chai')
const {init, database} = require('../../dist/bfast.node');
const {config, serverUrl, mongoRepSet} = require("../test.config");

describe('syncs', function () {
    before(async function () {
        await mongoRepSet().start();
        init({
            applicationId: config.applicationId,
            projectId: config.projectId,
            databaseURL: serverUrl,
            functionsURL: serverUrl,
        });
        await database().table('test').save([
            {
                id: 'abc',
                name: 'jack',
                createdAt: 'leo',
                createdBy: null,
                updatedAt: 'leo',
            },
            {
                id: 'abcde',
                name: 'josh',
                createdBy: null,
                createdAt: 'leo',
                updatedAt: 'leo'
            }
        ])
    });

    // describe('setSnapshot', function () {
    //     // this.timeout(5000);
    //     // it('should save the snapshot of syncs data and return it', async function () {
    //     //     const cid = await database().syncs('test').setSnapshot([
    //     //         {
    //     //             id: 'abc',
    //     //             name: 'jack'
    //     //         },
    //     //         {
    //     //             id: 'abcde',
    //     //             name: 'josh'
    //     //         }
    //     //     ], false);
    //     //     expect(cid).eql({
    //     //         docs: {
    //     //             abc: {id: 'abc', name: 'jack'},
    //     //             abcde: {id: 'abcde', name: 'josh'}
    //     //         },
    //     //         createdAt: 'n/a',
    //     //         updatedAt: 'n/a',
    //     //         id: 'test'
    //     //     })
    //     // });
    //     // it('should save the snapshot of syncs data and return cid', async function () {
    //     //     const cid = await database().syncs('test').setSnapshot([
    //     //         {
    //     //             id: 'abc',
    //     //             name: 'jack'
    //     //         },
    //     //         {
    //     //             id: 'abcde',
    //     //             name: 'josh'
    //     //         }
    //     //     ], true);
    //     //     expect(typeof cid).equal('string');
    //     // });
    // });
    //
    // describe('getSnapshot', function () {
    //     this.timeout(5000);
    //     it('should get the snapshot of syncs data', async function () {
    //         const cid = await database().syncs('test').snapshot(false);
    //         expect(cid).eql([
    //             {
    //                 id: 'abc',
    //                 name: 'jack',
    //                 createdAt: 'leo',
    //                 createdBy: null,
    //                 updatedAt: 'leo',
    //             },
    //             {
    //                 id: 'abcde',
    //                 name: 'josh',
    //                 createdBy: null,
    //                 createdAt: 'leo',
    //                 updatedAt: 'leo'
    //             }
    //         ]);
    //     });
    //     // it('should get the snapshot of syncs data and return cid', async function () {
    //     //     const cid = await database().syncs('test').snapshot(true);
    //     //     expect(typeof cid).equal('string');
    //     // });
    // })

    describe('doc', function () {
        this.timeout(5000);
        it('should connect to a syncs data type', function (done) {
            const doc = database().syncs('test').doc(
                () => {
                    done();
                    doc.stop();
                }
            );
        });
        it('should disconnect to a syncs data type', function (done) {
            const doc = database().syncs('test').doc(
                () => {
                    doc.stop();
                },
                () => {
                    done();
                }
            );
        });
        it('should receive info on connect', function (done) {
            const doc = database().syncs('test').doc();
            doc.onSnapshot(response => {
                if (response?.body?.info) {
                    expect(response.body).eql({
                        info: 'start listening for syncs'
                    });
                    done();
                    doc.close();
                }
            });
        });
        it('should observe doc changes or when syncs', function (done) {
            const doc = database().syncs('test').doc(
                () => {
                    doc.set({
                        age: 20,
                        createdAt: 'leo',
                        updatedAt: 'leo',
                        id: 'agex'
                    });
                }
            );
            const r = doc.observe(response => {
                // console.log(response);
                should().exist(response.name);
                should().exist(response.snapshot);
                // expect(response.name).equal('create');
                // expect(response.snapshot).equal('create');
                // expect(response.snapshot).eql({
                //     age: 20,
                //     createdAt: 'leo',
                //     updatedAt: 'leo',
                //     id: 'agex'
                // });
                // done();
                if (response.snapshot.id === 'agex'){
                    done();
                    r.close();
                }
            });
        });
    });

});
