# AMK-WRAP

[![CircleCI](https://circleci.com/gh/amkjs/amk-wrap.svg?style=svg)](https://circleci.com/gh/amkjs/amk-wrap)
[![codecov](https://codecov.io/gh/amkjs/amk-wrap/branch/master/graph/badge.svg)](https://codecov.io/gh/amkjs/amk-wrap)
[![Known Vulnerabilities](https://snyk.io/test/github/amkjs/amk-wrap/badge.svg?targetFile=package.json)](https://snyk.io/test/github/amkjs/amk-wrap?targetFile=package.json)

function wrapper to catch errors in [express](https://expressjs.com/) controllers

## Usage

to install: `npm i amk-wrap`

on the router file:
```
const express = require('express');
const router = express.Router();
const wrap = require('amk-wrap');

module.exports = function (controller) {
	router.get('/', wrap(controller.get));
	return router;
}

```

on the index.js:
```
const wrap = require('amk-wrap');

// some other code

app.get('/', wrap(getFunction));
```
or
```
const wrap = require('amk-wrap');

// some other code

app.get('/', wrap((req, res) => {
	res.send('hello world');
}));
```

## Tests
1. install dependencies using `npm install`
2. run `npm test`

## Feedback

All bugs, feature requests, pull requests, feedback, etc., are welcome. [Create an issue](https://github.com/amkjs/amk-wrap/issues).

## License
[MIT](https://github.com/amkjs/amk-wrap/blob/master/LICENSE)
