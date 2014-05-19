var spec = require('./test.js');
var calc = require('./calc.js');

// reuse add here

spec
	.given('two numbers', function (context) {
		context.a = 4;
		context.b = 4;
	})
	.when('add')

	.then('should return sum', function (context, expect) {
		expect().equal(8);
	})

	.then('should return sum 2', function (context, expect) {
		expect().equal(0);
	});

// start new context here

spec.
	when('mul', function (context) {
		context.result = calc.mul(context.a, context.b);
	});

spec
	.given('two numbers')

	.when('mul')

	.then('should multiply', function (context, expect) {
		expect().equal(16);
	});

module.exports = spec;