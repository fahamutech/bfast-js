const {loadEnv,initialize} = require('bfast-database-core');
const bfast = require("../../dist/bfast.node");
const {config} = require("../test.config");
let myConfig = loadEnv();
myConfig = Object.assign(myConfig, config)
const webService = initialize(myConfig);

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

module.exports.fp = bfast.functions().onPostHttpRequest(
    '/fp',
    (request, response) => {
        response.send('fp');
    }
);
module.exports.fpe = bfast.functions().onPostHttpRequest(
    '/fpe',
    (request, response) => {
        response.status(400).json({message:'fpe'});
    }
);
module.exports.fg = bfast.functions().onGetHttpRequest(
    '/fg',
    (request, response) => {
        response.send('fg');
    }
);

module.exports.fd = bfast.functions().onDeleteHttpRequest(
    '/fd',
    (request, response) => {
        response.send('fd');
    }
);

module.exports.fput = bfast.functions().onPutHttpRequest(
    '/fpt',
    (request, response) => {
        response.send('fpt');
    }
);
