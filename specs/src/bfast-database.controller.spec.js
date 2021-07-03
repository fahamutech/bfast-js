const {bfast} = require("../../node/dist/bfast");
const {HttpClientMock} = require("../mocks/http-client.mock");
describe('Database controller tests', function () {
    before(function () {
        bfast.init({
            projectId: 'test',
            applicationId: 'test',
            adapters: {
                http: _ => new HttpClientMock()
            }
        });
    });

    it('should save data', function () {
        bfast.database().table('test').save({
            name: 'josh',
            age: 20
        });
    });
});
