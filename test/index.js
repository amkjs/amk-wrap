
const { expect } = require('chai');
const wrap = require('../index');

describe('Wrapper function', () => {
	it('Should catch the error when the async function throws an error', (done) => {

		const errorFunction = async () => {
			throw new Error();
		};

		const fn = wrap(errorFunction);

		fn(null, null, (err) => {
			expect(err).to.be.instanceOf(Error);
			done();
		});

	});
	it('Should execute normally when no error is thrown', async () => {

		const someFunction = async (req, res) => {
			req.value++;
			res.value++;
		};

		const fn = wrap(someFunction);
		const i = { value: 1 };
		const j = { value: 1 };

		await fn(i, j, (err) => { expect(err).to.be.undefined; });

		expect(i.value).to.be.equal(2);
		expect(j.value).to.be.equal(2);
	});
});
