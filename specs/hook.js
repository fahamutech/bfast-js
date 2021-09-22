const {config} = require('./test.config');
const {BfastFunctions} = require('bfast-function');
const bfastFs = new BfastFunctions({
    port: config.port,
    functionsConfig: {
        functionsDirPath: __dirname + '/functions',
        bfastJsonPath: __dirname + '/functions/bfast.json'
    }
});

global.WebSocket = require('ws');

exports.mochaHooks = {
    async beforeAll() {
        process.env.APPLICATION_ID = config.applicationId;
        process.env.PROJECT_ID = config.projectId;
        process.env.MASTER_KEY = config.masterKey;
        process.env.PORT = config.port.toString();
        process.env.MONGO_URL = config.mongoDbUri;
        process.env.TAARIFA_TOKEN = config.taarifaToken;
        process.env.RSA_PUBLIC_KEY = JSON.stringify(config.rsaPublicKeyInJson);
        process.env.RSA_KEY = JSON.stringify(config.rsaKeyPairInJson);
        console.log('________START__________');
        await bfastFs.start()
    },
    async afterAll() {
        console.log('________END__________');
    }
};
