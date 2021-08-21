const {expect, should} = require('chai')
const {init, auth} = require('../../dist/bfast.node');
const {config, serverUrl, mongoRepSet} = require("../test.config");

describe('auth', function () {
    before(async function () {
        await mongoRepSet().start();
        init({
            applicationId: config.applicationId,
            projectId: config.projectId,
            databaseURL: serverUrl,
            functionsURL: serverUrl,
        });
    });
    describe('signUp', function () {
        it('should register a new user', async function () {
            const r = await auth().signUp(
                'john',
                'doe',
                {
                    age: 30,
                    email: 'doe@doe.com'
                }
            );
            should().exist(r);
            expect(r.age).equal(30);
            expect(r.username).equal('john');
            expect(r.email).equal('doe@doe.com');
            should().exist(r.token);
            should().exist(r.id);
        });
        it('should not register twice', async function () {
            try {
                const r = await auth().signUp(
                    'john',
                    'doe',
                    {
                        age: 30,
                        email: 'doe@doe.com'
                    }
                );
                should().not.exist(r);
            } catch (e) {
                should().exist(e);
                expect(e.message).equal('User already exist');
            }
        });
    });

    describe('logIn', function () {
        it('should logIn if user exist', async function () {
            const r = await auth().logIn(
                'john',
                'doe'
            );
            should().exist(r);
            expect(r.age).equal(30);
            expect(r.username).equal('john');
            expect(r.email).equal('doe@doe.com');
            should().exist(r.token);
            should().exist(r.id);
        });
        it('should not logIn if username not exist', async function () {
            try{
                const r = await auth().logIn(
                    'john37',
                    'doe'
                );
                should().not.exist(r);
            }catch (e){
                should().exist(e);
                expect(e.message).equal('Username is not valid')
            }
        });
        it('should not logIn if password is invalid', async function () {
            try{
                const r = await auth().logIn(
                    'john',
                    'doe89'
                );
                should().not.exist(r);
            }catch (e){
                should().exist(e);
                expect(e.message).equal('Password is not valid')
            }
        });
    });

    describe('', function () {
        
    });
});
