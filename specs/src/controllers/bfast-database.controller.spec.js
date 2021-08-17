const {bfast} = require("../../../node/dist/bfast");
const {HttpClientMock} = require("../../mocks/http-client.mock");
bfast.init({
    projectId: 'ffc5ea2c-bd2a-42c9-b3c5-3901a445973e',
    applicationId: '180841b4-fc74-4609-bce8-48c130947252',
    adapters: {
        // http: _ => new HttpClientMock()
    }
});
describe('Database', function () {
    describe('Delete', function () {
        it('should delete when ids supplied in filter field', async function (a) {
            this.timeout(10000000000000000);
            const r = await bfast.database()
                .table('stocks')
                .query()
                .includesIn('id', ['0a1d5a2942314a7e64bc3b3e7d0bc525d9e8e31b3726bebf44b32e4e475731f5'])
                .delete();
            console.log('+++++++++=')
            console.log(r, '*******');
        });
    });
});
