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
        ]);
    });

    describe('changes', function () {
        describe('load', function () {
            this.timeout(5000);
            it('should upload data for syncs from tree', function (done) {
                let count = 0;
                const docs = [];
                const syncs = database().syncs('test');
                const changes = syncs.changes();
                changes.observe(r => {
                    // console.log(r, count,'*****');
                    count += 1;
                    docs.push(r.snapshot);
                    if (count === 2) {
                        // expect(docs).eql([
                        //     {
                        //         id: 'abc',
                        //         name: 'jack',
                        //         createdAt: 'leo',
                        //         createdBy: null,
                        //         updatedAt: 'leo',
                        //     },
                        //     {
                        //         id: 'abcde',
                        //         name: 'josh',
                        //         createdBy: null,
                        //         createdAt: 'leo',
                        //         updatedAt: 'leo'
                        //     }
                        // ]);
                        done();
                        changes.close();
                        changes.close();
                    }
                });
                syncs.upload();
            });
        });
        describe('doc', function () {
            this.timeout(8000);
            // it('should connect to a syncs data type', function (done) {
            //     const doc = database().syncs('test').changes(
            //         () => {
            //             done();
            //             doc.stop();
            //         }
            //     );
            // });
            // it('should disconnect to a syncs data type', function (done) {
            //     const doc = database().syncs('test').changes(
            //         () => {
            //             setTimeout(() => {
            //                 doc.close();
            //             }, 5000)
            //         },
            //         () => {
            //             done();
            //         }
            //     );
            // });
            // it('should receive info on connect', function (done) {
            //     const changes = database().syncs('test').changes();
            //     // doc.onSnapshot(response => {
            //     //     if (response?.body?.info) {
            //     //         expect(response.body).eql({
            //     //             info: 'start listening for syncs'
            //     //         });
            //     //         done();
            //     //         doc.close();
            //     //     }
            //     // });
            // });
            it('should observe doc changes', function (done) {
                const changes = database().syncs('test').changes();
                // () => {
                // }
                // );
                changes.observe(response => {
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
                    // if (response.snapshot.id === 'agex') {
                        done();
                        changes.close();
                    // }
                });
                changes.set({
                    age: 20,
                    createdAt: 'leo',
                    updatedAt: 'leo',
                    id: 'agex'
                });
            });
        });
        describe('set', function () {
            it('should not set the change if id not available in doc', function () {
                const changes = database().syncs('test').changes();
                try {
                    changes.set({
                        name: 'joshua'
                    });
                } catch (e) {
                    // console.log(e);
                    should().exist(e);
                    expect(e.message).equal('please doc must have id/_id field');
                    changes.close()
                }
            });
        });
    });
});
