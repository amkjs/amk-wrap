const { describe, it } = require('node:test');
const { expect } = require('expect');
const wrap = require('../index');

describe('Wrapper function', () => {
  it('Should wrap the class method with the context, then execute normally', async () => {
    const newValue = 2;
    class TestClass {
      constructor() {
        this.value = newValue;
      }

      async setValue(req, res) {
        req.value = this.value;
        res.value = this.value;
      }
    }

    const testClass = new TestClass();
    const fn = wrap(testClass, 'setValue');
    const res = { value: 0 };
    const req = { value: 0 };
    const err = await new Promise((resolve) => fn(req, res, resolve));
    expect(err).toBeUndefined();
    expect(req.value).toBe(newValue);
    expect(res.value).toBe(newValue);
  });

  it('Should catch the error when the class method throws an error', async () => {
    class TestClass {
      async setValue() {
        throw new Error();
      }
    }

    const fn = wrap(new TestClass(), 'setValue');
    const err = await new Promise((resolve) => fn(null, null, resolve));
    expect(err).toBeInstanceOf(Error);
  });

  it('Should also wrap a function', async () => {
    const req = { value: 0 };
    const res = { value: 0 };
    const newValue = 5;
    const someFunction = async () => {
      req.value = newValue;
      res.value = newValue;
    };

    const fn = wrap(someFunction);
    const err = await new Promise((resolve) => fn(req, res, resolve));
    expect(err).toBeUndefined();
    expect(req.value).toBe(newValue);
    expect(res.value).toBe(newValue);
  });

  it('Should throw an error when input is not a Promise/Async function', async () => {
    const fn = wrap(() => {});
    const err = await new Promise((resolve) => fn(null, null, resolve));
    expect(err).toBeInstanceOf(TypeError);
  });

  it('Should throw an error when class method is not a Promise/Async function', async () => {
    class TestClass {
      notAPromise() {}
    }
    const testClass = new TestClass();
    const fn = wrap(testClass, 'notAPromise');
    const err = await new Promise((resolve) => fn(null, null, resolve));
    expect(err).toBeInstanceOf(TypeError);
  });

  it('Should throw an error if there are more than 2 arguments', async () => {
    const fn = wrap(() => {}, () => {}, () => {});
    const err = await new Promise((resolve) => fn(null, null, resolve));
    expect(err).toBeInstanceOf(TypeError);
    expect(err.message).toBe('Invalid arguments');
  });

  it('Should throw an error if there are no arguments', async () => {
    const fn = wrap();
    const err = await new Promise((resolve) => fn(null, null, resolve));
    expect(err).toBeInstanceOf(TypeError);
    expect(err.message).toBe('Invalid arguments');
  });
});
