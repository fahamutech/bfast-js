const {expect, should} = require('chai')
const {init,getConfig} = require('../../dist/bfast.node');

describe('init', function () {
    it('should initialize default app', function () {
        init({
            applicationId: 'joshua',
            projectId: 'joshua',
            appPassword: 'joshua'
        });
        const configs = getConfig('DEFAULT').credential('DEFAULT');
        should().exist(configs);
        expect(configs).eql({
            applicationId: 'joshua',
            projectId: 'joshua',
            appPassword: 'joshua'
        });
    });
    it('should initialize named app', function () {
        init({
            applicationId: 'ethan',
            projectId: 'ethan',
            appPassword: 'ethan'
        },'joshua');
        const configs = getConfig('joshua').credential('joshua');
        should().exist(configs);
        expect(configs).eql({
            applicationId: 'ethan',
            projectId: 'ethan',
            appPassword: 'ethan'
        });
    });
});
