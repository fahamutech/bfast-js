// import {HttpClientMock} from "../mocks/http-client.mock.js";
// import bfastnode from '../../node/dist/bfast';
//
// const {bfast} = bfastnode;

const {bfast} = require("../../node/dist/bfast");
const {HttpClientMock} = require("../mocks/http-client.mock");
describe('Database controller tests', function () {
    before(function () {
        bfast.init({
            projectId: 'test',
            applicationId: 'test',
            adapters: {
                http: config => new HttpClientMock()
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
