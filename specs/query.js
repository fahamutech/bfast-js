const {BFast} = require('../node-config/dist/bfast_node');

BFast.init({applicationId:'ubongokids', projectId:'ubongokids'});

BFast.database().domain('category').getAll().then(console.log).catch(console.error);
