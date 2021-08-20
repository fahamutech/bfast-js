const {BfastDatabaseCore, EnvUtil} = require('bfast-database-core');
const bfast = require("../../dist/bfast.node");
const {config} = require("../test.config");
const envUtil = new EnvUtil();
let myConfig = envUtil.loadEnv();
myConfig = Object.assign(myConfig, config)
const bfd = new BfastDatabaseCore();
const webService = bfd.init(myConfig, true);

bfast.init({
    applicationId: myConfig.applicationId,
    projectId: myConfig.projectId,
    appPassword: myConfig.masterKey,
    databaseURL: `http://localhost:${myConfig.port}`,
    functionsURL: `http://localhost:${myConfig.port}`
});

module.exports.rests = webService.rest().rules;
module.exports.restsjwk = webService.rest().jwk;
module.exports.changes = webService.realtime(myConfig).changes;
for (const fR of Object.keys(webService.storage())) {
    module.exports[fR] = webService.storage()[fR];
}
