# AMK-WRAP

function wrapper to catch errors in [express](https://expressjs.com/) controllers

## Usage

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
