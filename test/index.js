const wrap = require('../index');

const handleAssertError = (done, fn) => {
  try {
    fn();
    done();
  } catch (err) {
    done(err);
  }
};

describe('Wrapper function', async () => {
  let expect;
  // temporarily use this to import chai
  before(async () => {
    const chai = await import('chai');
    expect = chai.expect;
  });
  it('Should wrap the class method with the context, then execute normally', (done) => {
    const newValue= 2;
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
    let res = {value: 0};
    let req = {value: 0};
    fn(req, res, (err) => {
      handleAssertError(done, () => {
        expect(err).to.be.undefined;
        expect(req.value).to.be.equal(newValue);
        expect(res.value).to.be.equal(newValue);
      });
    });
  });
  it('Should catch the error when the class method throws an error', (done) => {
    class TestClass {
      async setValue() {
        throw new Error();
      }
    }

    const fn = wrap(new TestClass(), 'setValue');
    fn(null, null, (err) => {
      handleAssertError(done, () => {
        expect(err).to.be.instanceOf(Error);
      });
    });
  });
  it('Should also wrap a function',  (done) => {
    const req = {value: 0};
    const res = {value: 0};
    const newValue = 5;
    const someFunction = async () => {
      req.value = newValue;
      res.value = newValue;
    };

    const fn = wrap(someFunction);
    fn(req, res, (err) => {
      handleAssertError(done, () => {
        expect(err).to.be.undefined;
        expect(req.value).to.be.equal(newValue);
        expect(res.value).to.be.equal(newValue);
      });
    });
  });
  it('Should throw an error when input is not a Promise/Async function', (done) => {
    const fn = wrap(() => {});
    fn(null, null, (err) => {
      handleAssertError(done, () => {
        expect(err).to.be.instanceOf(TypeError);
      });
    });
  });
  it('Should throw an error when class method is not a Promise/Async function', (done) => {
    class TestClass {
      notAPromise() {}
    }
    const testClass = new TestClass();
    const fn = wrap(testClass, 'notAPromise');
    fn(null, null, (err) => {
      handleAssertError(done, () => {
        expect(err).to.be.instanceOf(TypeError);
      });
    });
  });
  it('Should throw an error if there are more the 2 arguments', (done) => {
    const fn = wrap(() => {}, () => {}, () => {});
    fn(null, null, (err) => {
      handleAssertError(done, () => {
        expect(err).to.be.instanceOf(TypeError);
        expect(err.message).to.be.equal('Invalid arguments');
      });
    });
  });
  it('Should throw an error if there are no arguments', (done) => {
    const fn = wrap();
    fn(null, null, (err) => {
      handleAssertError(done, () => {
        expect(err).to.be.instanceOf(TypeError);
        expect(err.message).to.be.equal('Invalid arguments');
      });
    });
  });
});