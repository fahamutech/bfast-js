const {BFast} = require('./dist/bfast/bundles/bfastjs.umd');

// BFast.init({applicationId: 'ubongokids', projectId: 'ubongokids'});

const changes = BFast.database().domain('test')
    .query()
    .changes(() => console.log('connect'), () => console.log('disconnect'));
changes.addListener(response => {
    console.log(response.body);
});

async function run() {
    const result = await BFast.database().domain('test').save([{name: 'mambo'}, {age: 30}]);
    // await BFast.database().domain('test').save({name: 'john'});
    await BFast.database().domain('test')
        .query().equalTo('name', 'mambo')
        .updateBuilder().set('name', 'ethan')
        .update()
    await BFast.database().domain('test').query().equalTo('name', 'john').delete();
    await BFast.database().domain('test').save({name: 'xyz'});
}

run().catch();
