const {BFast} = require('../node/dist/bfast');

BFast.init({applicationId:'ubongokids', projectId:'ubongokids'});

BFast.database().domain('test').getAll().then(console.log).catch(console.error);
