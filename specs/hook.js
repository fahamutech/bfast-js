exports.mochaHooks = {
    async beforeAll() {
        console.log('________START__________');
    },
    async afterAll() {
        console.log('________END__________');
    }
};
