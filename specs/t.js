const {bfast} = require('../node/dist/bfast');
const {ReadStream} = require('fs');

bfast.init({
    applicationId: 'YQDG4Qm3j9vW',
    projectId: '0UTYLQKeifrk',
});
bfast.auth().signUp('eyah2', '1234', {email: 'e@e.e'}).then(console.log).catch(console.log);
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
