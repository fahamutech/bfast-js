const {bfast} = require('../node/dist/bfast');
const {ReadStream} = require('fs');

bfast.init({
    applicationId: 'smartstock_lb',
    projectId: 'smartstock',
});
const b = bfast.storage().save({
    filename: 'hello.txt',
    data: ReadStream.from('Hello world!'),
    pn: true
}, progress => console.log(progress));

b.then(value => {
    console.log(value);
}).catch(reason => {
    console.log(reason && reason.response ? reason.response.data : reason.toString());
});
