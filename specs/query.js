const {BFast} = require('../node/dist/bfast');

BFast.init({applicationId: 'ubongokids', projectId: 'ubongokids'});

BFast.database().domain('test')
    .query()
    .byId('e1cae34b-de05-4c6e-a3ca-6deb3f310776')
    .find()
    .then(console.log)
    .catch(console.error);
