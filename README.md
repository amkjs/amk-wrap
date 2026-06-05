# AMK-WRAP

[![Github Actions](https://github.com/amkjs/amk-wrap/actions/workflows/node.js.yml/badge.svg)](https://github.com/amkjs/amk-wrap/actions/workflows/node.js.yml)
[![codecov](https://codecov.io/github/amkjs/amk-wrap/graph/badge.svg?token=bgxufudUco)](https://codecov.io/github/amkjs/amk-wrap)

function wrapper to catch errors in [express](https://expressjs.com/) controllers

## Usage

to install: `npm i amk-wrap`

can pass a function or a class method. Supports both CommonJS (`require`) and ESM (`import`).

**The wrapped function must return a `Promise`** (e.g., be `async` or return a Promise manually). Non-Promise return values will be rejected with a `TypeError`.

### CommonJS

on the router file:
```js
const express = require('express');
const router = express.Router();
const wrap = require('amk-wrap');

class Controller {
  constructor() {
    this.something = "something"
  }
  async get(req, res) {
    this.something; // access this
    res.send('hello world');
  }
}
const controller = new Controller();
module.exports = function (controller) {
  router.get('/', wrap(controller, 'get')); // pass a class method
  return router;
}
```

on the index.js:
```js
const wrap = require('amk-wrap');

// some other code

app.get('/', wrap(getFunction)); // pass a function
```
or
```js
const wrap = require('amk-wrap');

// some other code

app.get('/', wrap(async (req, res) => {
	res.send('hello world');
}));
```

### ESM

```js
import wrap from 'amk-wrap';

// some other code

app.get('/', wrap(getFunction)); // pass a function
```
or
```js
import wrap from 'amk-wrap';

// some other code

app.get('/', wrap(async (req, res) => {
	res.send('hello world');
}));
```

### TypeScript

`amk-wrap` ships with first-party type declarations. No additional `@types/` package is required.

```ts
import wrap from 'amk-wrap';
import { Request, Response } from 'express';

app.get('/', wrap(async (req: Request, res: Response) => {
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
