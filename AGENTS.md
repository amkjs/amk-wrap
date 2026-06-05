# AMK-Wrap Agent Guide

## Project Overview

`amk-wrap` is a tiny Node.js utility package that wraps async functions and class methods so errors are automatically caught and forwarded to Express's `next()` middleware. It prevents unhandled promise rejections in Express controllers by converting rejected promises into calls to `next(err)`.

- **Repository**: https://github.com/amkjs/amk-wrap
- **License**: MIT
- **Author**: heinrich10
- **Version**: 1.0.0

## Technology Stack

- **Runtime**: Node.js (CommonJS)
- **Supported Node versions**: 22.x, 24.x, 26.x (per CI matrix)
- **Module system**: Dual-mode CommonJS + ESM (`"type": "commonjs"` in package.json, with `index.mjs` for ESM consumers)
- **Language level**: ECMAScript 2023
- **TypeScript support**: First-party `.d.ts` declarations (`lib/wrapper.d.ts`); no build step required
- **No runtime dependencies**

### Dev Dependencies

- `@eslint/js` ~10.0.1 — ESLint core rules
- `@types/express` ~5.0.6 — type definitions for the `.d.ts` declaration file
- `c8` ~11.0.0 — code coverage (not currently wired into CI due to Node 26 incompatibility)
- `eslint` ~10.4.1 — linting
- `expect` ~30.4.1 — assertion library (used with Node.js built-in test runner)
- `globals` ~17.6.0 — global identifiers for ESLint
- `typescript` ~6.0.3 — used to validate type declarations during development

## Project Structure

```
├── index.js          # Main CJS entry point; re-exports lib/wrapper.js
├── index.mjs         # ESM entry point; re-exports lib/wrapper.js
├── lib/
│   ├── wrapper.js    # Core wrapper implementation (CJS)
│   └── wrapper.d.ts  # TypeScript declarations
├── test/
│   └── index.js      # Node.js test runner suite
├── package.json      # Package manifest and npm scripts
├── eslint.config.mjs # ESLint configuration
├── .c8rc.json        # c8 (coverage) configuration
├── .gitignore        # Paths ignored by Git
└── .github/
    ├── workflows/
    │   └── node.js.yml  # GitHub Actions CI workflow
    └── pull_request_template.md
```

## Build and Test Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm test` | Run the full test suite (`node --test`) |
| `npm run lint` | Run ESLint over the project |

### Coverage Configuration (`.c8rc.json`)

- Reporters: `lcov`, `text-summary`
- `all: true`

## Code Style Guidelines

- **ESLint**: extends `eslint:recommended`
- **Environment**: `node`
- **Parser options**: `ecmaVersion: 2023`, `sourceType: commonjs`
- **Semicolons are required** (`semi: 1` — warning)
- Keep the code minimal; the entire library is a single small function.

## How the Wrapper Works

The module exported by `lib/wrapper.js` accepts two call signatures:

1. `wrap(fn)` — wrap a standalone async function.
2. `wrap(context, methodName)` — wrap a class method, preserving `this` context.

It returns an Express middleware function with signature `(req, res, next)`:

- Invokes the wrapped function.
- Checks whether the return value is a `Promise` using `util/types.isPromise`.
- If it is a promise, attaches `.then(() => next()).catch(err => next(err))`.
- If it is **not** a promise-returning function, calls `next(new TypeError('not a promise-returning function'))`.
- If the argument count is invalid (not 1 or 2), calls `next(new TypeError('Invalid arguments'))`.
- Synchronous throws during handler invocation are caught and forwarded to `next(err)`.

**Important:** The wrapped function or method must return a `Promise` (i.e., be `async` or otherwise return a Promise). Non-Promise return values are rejected at runtime with a `TypeError`.

## Testing Instructions

Tests live in `test/index.js` and are run with the Node.js built-in test runner (`node --test`). Assertions use the `expect` package:

### Test Coverage

The suite validates:
- Wrapping a class method with context (normal execution)
- Catching errors thrown by a wrapped class method
- Wrapping a standalone async function
- Rejecting non-promise inputs with `TypeError`
- Rejecting invalid argument counts (0 or >2) with `TypeError`
- Catching synchronous throws from a wrapped handler

## CI / Deployment Process

GitHub Actions workflow (`.github/workflows/node.js.yml`):

- **Trigger**: push and pull requests to `main`
- **Runner**: `ubuntu-24.04`
- **Matrix**: Node.js 22.x, 24.x, and 26.x
- **Steps**:
  1. Checkout code
  2. Setup Node.js with npm caching
  3. `npm ci`
  4. `npm run lint`
  5. `npm test`
  6. Upload coverage to Codecov via `codecov/codecov-action@v6` (only on Node 24.x matrix job)

There is no dedicated build or compilation step; the package ships JavaScript source directly.

> **Note:** The `codecov` npm script was removed from `package.json`; coverage is not currently generated during CI runs because `c8` is incompatible with Node.js 26.x. The Codecov action step remains in the workflow for when this is resolved.

## Security Considerations

- This is a very small, focused utility. No I/O, no network calls, no eval.
- It relies on Node.js built-in `util/types` for type checking.
- Keep dependencies minimal and review any additions carefully.

## Notes for Agents

- The project supports both CommonJS and ESM consumers via conditional `exports` in `package.json`.
- TypeScript consumers get first-class type support via `lib/wrapper.d.ts`; no build step or additional runtime dependencies are required.
- Maintain minimal footprint; the value of this package is its simplicity.
