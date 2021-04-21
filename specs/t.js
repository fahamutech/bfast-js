const {bfast} = require('../node/dist/bfast');
const {ReadStream} = require('fs');

bfast.init({
    applicationId: 'ffc5ea2c-bd2a-42c9-b3c5-3901a445973e',
    projectId: '180841b4-fc74-4609-bce8-48c130947252',
});
// bfast.database().table('test').save({name: 'test', id: 'test'}).then(value => {
//     return bfast.database().table('test').save({id: 'test', name: 'test'});
// }).then(value => {
//     console.log(value);
// }).catch(reason => {
//     console.log(reason, 'error');
// });

bfast.database().transaction()
    .create('test', {name: 'test', id: 'test'})
    .commit().then(value => {
        console.log(value, 'jibu');
}).catch(reason => {
    console.log(reason);
});
// const b = bfast.storage().save({
//     filename: 'hello.txt',
//     data: ReadStream.from('Hello world!'),
//     pn: true
// }, progress => console.log(progress));
//
// b.then(value => {
//     console.log(value);
// }).catch(reason => {
//     console.log(reason && reason.response ? reason.response.data : reason.toString());
// });
