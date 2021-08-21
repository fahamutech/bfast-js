const {expect, should} = require('chai')
const {init, database} = require('../../dist/bfast.node');
const {config, serverUrl, mongoRepSet} = require("../test.config");

describe('query', function () {
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
            {item: 'chrome', price: 3000, id: 'chm', createdAt: 'leo', updatedAt: 'leo'},
        ]);
    });

    describe('changes', function () {
        this.timeout(5000);
        it('should connect to a table', function (done) {
            const changes = database().table('test')
                .query()
                .changes(
                    () => {
                        done();
                        changes.close();
                    },
                    () => {

                    }
                );
        });
        it('should disconnect to a table', function (done) {
            const changes = database().table('test')
                .query()
                .changes(
                    () => {
                        changes.close();
                    },
                    () => {
                        done();
                    }
                );
        });

        it('should receive info on connect', function (done) {
            const changes = database().table('test')
                .query()
                .changes();
            changes.addListener(response => {
                expect(response.body).eql({
                    info: 'start listening for changes'
                });
                done();
                changes.close();
            });
        });

        it('should receive create event', function (done) {
            const changes = database().table('test')
                .query()
                .changes(
                    () => {
                        database().table('test').save({
                            age: 20,
                            createdAt: 'leo',
                            updatedAt: 'leo',
                            id: 'agex'
                        });
                    }
                );
            changes.addListener(response => {
                if (response.body.info){
                    return;
                }
                expect(response.body).eql({
                    change: {
                        name: 'create',
                        snapshot: {
                            age: 20,
                            createdAt: 'leo',
                            updatedAt: 'leo',
                            id: 'agex',
                            createdBy: null
                        }
                    }
                });
                done();
                changes.close();
            });
        });

        it('should receive update event', function (done) {
            const changes = database().table('test')
                .query()
                .changes(
                    () => {
                        database().table('test').query().byId('agex').updateBuilder().doc({
                            age: 10,
                            createdAt: 'leo',
                            updatedAt: 'leo',
                        }).update();
                    }
                );
            changes.addListener(response => {
                if (response.body.info){
                    return;
                }
                expect(response.body).eql({
                    change: {
                        name: 'update',
                        snapshot: {
                            age: 10,
                            createdAt: 'leo',
                            updatedAt: 'leo',
                            id: 'agex',
                            createdBy: null
                        }
                    }
                });
                done();
                changes.close();
            });
        });

        it('should receive delete event', function (done) {
            const changes = database().table('test')
                .query()
                .changes(
                    () => {
                        database().table('test').query().byId('agex').delete();
                    }
                );
            changes.addListener(response => {
                if (response.body.info){
                    return;
                }
                expect(response.body).eql({
                    change: {
                        name: 'delete',
                        snapshot: {
                            id: 'agex'
                        }
                    }
                });
                done();
                changes.close();
            });
        });
    });
});
