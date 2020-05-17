const {BFast} = require('../node-config/dist/bfast_js');
BFast.init({applicationId: 'smartstock_lb', projectId: 'smartstock'});
// BFast.database().collection('stocks').query().find({size: 1}).then(console.log);
BFast.cache().set('name','joshua').then(console.log);
