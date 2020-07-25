# BFast::Cloud | Web Client SDK

Sdk library to be used in a client-side web like (Angular, React) and plain javascript.

## Get Started

You can use `https://www.unpkg.com/bfastjs` to add it as a `<script src="https://www.unpkg.com/bfastjs"></script>` direct to your 
 html file. Or you can install it direct from npm.

```shell script
john@pc:~/Desktop/my-project$ npm install --save bfastjs
```

***Note***
For bfastjs < 3.x.x work with bfast-daas < 1.x.x and bfast-faas < 1.x.x

## SetUp

Before you call any API you need to initialize your SDK

```javascript
const {BFast} = require('bfastjs');

BFast.init({
    applicationId: 'your-bfast-project-applicationId', // required if you connect to bfast cloud project [ optional if you have a bfast cloud project]
    projectId: 'your-bfast-project-projectId', // required if you connect to bfast cloud project [ optional if you have a bfast cloud project]
    appPassword: 'your-bfast-project-password', // this is the master-key to override any authorization from bfast cloud, you get it from from bfast cloud project [ optional if you have a bfast cloud project]
    functionsURL: 'a url to your FaaS engine', // if you have a faas engine served in your servers other that bfast cloud
    databaseURL: 'a url to your DaaS engine', // if you have a daas engine served in your servers other than bfast cloud
    cache: {
        collection: 'any name',
        ttlCollection: 'any name',
        enable: false // default is false
    } // this is optional if you need to override a default cache configuration
}, 'your-app-name');
```

if you don't supply app name DEFAULT_APP name will be used. That all you need to set up a bfast sdk.
You will only call this once in your app just before you use any api this sdk.

## Database

You can manipulate a database instance from bfast cloud project or the instance you deploy in your own infrastructure.







