const { isPromise, isAsyncFunction } = require('util/types');

/*
 * Wrapper for async functions to catch errors and pass them to the next middleware
 *
 * @param {Object} arg1 - The context of the function
 * @param {Function} arg2 - The function to be wrapped
 *
 * or
 *
 * @param {Function} arg1 - The function to be wrapped
 */
module.exports = function (arg1, arg2) {
  const { length } = arguments;
  return (req, res, next) => {
    let fn;
    if (length === 2) {
      fn = arg1[arg2].bind(arg1)(req, res);
    } else if (length === 1) {
      fn = arg1(req, res);
    } else {
      return next(new TypeError('Invalid arguments'));
    }
    if (isPromise(fn) || isAsyncFunction(fn)) {
      fn.then(() => next())
        .catch(err => next(err));
    } else {
      return next(new TypeError('not a promise/async function'));
    }
  };
};