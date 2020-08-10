const {UpdateBuilderController} = require("../node/dist/controllers/UpdateBuilderController");
const {QueryBuilder} = require("../node/dist/controllers/QueryBuilder");
const {BFast} = require('../node/dist/bfast');
const http = require('http');

BFast.init({databaseURL: 'http://localhost:3003', applicationId: 'daas', projectId: 'daas', appPassword: 'daas'});

const changes = BFast.database().domain('test').changes(null,
    () => console.log('connect'), () => console.log('disconnect'));
changes.addListener(response => {
    console.log(response.body);
});

async function run() {
    await BFast.database().domain('test').save([{name: 'mambo'}, {age: 30}]);
    await BFast.database().domain('test').save({name: 'john'});
    const query = new QueryBuilder().equalTo('name', 'mambo');
    const query1 = new QueryBuilder().equalTo('name', 'john');
    const update = new UpdateBuilderController().set('name', 'ethan');
    await BFast.database().domain('test').update(query, update);
    await BFast.database().domain('test').delete(query1);
    await BFast.database().domain('test').save({name: 'xyz'});
}

run().catch();
