const {BFast} = require('../node-config/dist/bfast_node');
BFast.init({applicationId: 'smartstock_lb', projectId: 'smartstock'});
// BFast.database().collection('stocks').query().find({size: 1}).then(console.log);
BFast.cache().set('name','joshua').then(console.log);
console.log(BFast.functions().onHttpRequest('/',request => {}));
console.log(BFast.functions().onEvent('/',data => {}));
