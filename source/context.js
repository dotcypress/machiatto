var Test = require('./test');
var tree = require('./tree');

function Context(specName) {
	this.specName = specName;
	this.arranges = {};
	this.asserts = [];
	this.root = tree();
	this.curr = null;
}

Context.prototype.lookup = function (name) {
	return this.arranges[name];
};

Context.prototype.establish = function (name, fn) {
	fn = fn || this.lookup(name);

	if (!fn) {
		throw new Error('missing function for ' + name);
	}

	this.curr = this.root.add({name: name, fn: fn});
	this.arranges[name] = fn;

	return this;
};

Context.prototype.arrange = function (name, fn) {
	if (!this.curr) {
		throw new Error('context in not established, make sure `.when()` is called before');
	}

	fn = fn || this.lookup(name);

	if (!fn) {
		throw new Error('missing function for ' + name);
	}

	this.curr = this.curr.add({name: name, fn: fn});
	this.arranges[name] = fn;

	return this;
};

Context.prototype.assert = function (name, fn) {
	var assert = this.curr.add({name: name, fn: fn});
	this.asserts.push(assert);

	return this;
};

Context.prototype.run = function (runner) {
	var specName = this.specName;

	runner.emit('start');

	this.asserts.forEach(function (assert) {
		var context = {};
		var path = assert.path({includeSelf: false});

		path.forEach(function (node) {
			var fn = node.model && node.model.fn;
			fn && fn(context);
		});

		run(context, assert.model.fn, runner, new Test(assert.name, specName));
		runner.emit('test end');
	});

	runner.emit('end');

	function run(context, should, runner, test) {
		try {
			should(context);
		} catch (err) {
			return fail(err);
		}

		return pass();

		function pass() {
			runner.emit('pass', test);
		}

		function fail(err) {
			runner.emit('fail', test, err);
		}
	}
};

module.exports = Context;