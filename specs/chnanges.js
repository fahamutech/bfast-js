const UpdateBuilderController = require("../src/controllers/UpdateBuilderController").UpdateBuilderController;

const QueryBuilder = require("../src/controllers/QueryBuilder").QueryBuilder;

const {BFast} = require('../node-config/dist/bfast_node');

BFast.init({databaseURL: 'http://localhost:3003', applicationId: 'daas', projectId: 'daas', appPassword: 'daas'});

const changes = BFast.database().domain('test').changes(null,
    () => console.log('connect'), () => console.log('disconnect'));
// console.log(changes);
changes.open();
changes.listener(response => {
    console.log(response.body);
});

BFast.database().domain('test').save({name: 'mambo'});
// BFast.database().domain('test').update(new QueryBuilder().equalTo('name', 'mambo'), new UpdateBuilderController().set('name', 'joshua'));
