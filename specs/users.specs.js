// const {BFast} = require('../node/dist/bfast_node');
// const fs = require('fs');
// BFast.init({projectId: 'smartstock', applicationId: 'smartstock_lb', appPassword: 'smartstockfahamutech'});
// BFast.database().collection(BFast.utils.USER_DOMAIN_NAME).query().find({
//     filter: {verified: true},
//     size: 10000000
// }, {useMasterKey: true}).then(users => {
//     fs.writeFileSync('smartstockusers.json', JSON.stringify(users));
//     console.log('done write', users.length);
// }).catch(console.log);
