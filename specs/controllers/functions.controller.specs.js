const {describe, it} = require('mocha');
const {BFast} = require('../../node/dist/bfast');
const assert = require('assert');

describe('Jobs functions', function () {
    it('should create job schedule function', function () {
        const job = BFast.functions().onJob({second: '*/1'}, _ => {
          //  console.log("run after every 1");
            return "run after every 1"
        });
        assert(job !== undefined);
        assert(job.onJob !== undefined);
        assert(job.onJob(null) === "run after every 1");
        assert(job.rule === '*/1 * * * * *');
        assert(typeof job.onJob === 'function');
        assert(typeof job.rule === 'string');
    });
});
