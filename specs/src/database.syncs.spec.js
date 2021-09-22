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
    });

    describe('snapshot', function () {
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

        it('should receive current doc snapshot', function (done) {
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
            doc.onSnapshot(response => {
                if (response.body.info) {
                    return;
                }
                should().exist(response.body);
                should().exist(response.body.change);
                expect(typeof response.body.change).equal('string');
                console.log(response.body)
                done();
                doc.close();
            });
        });

    });
});
