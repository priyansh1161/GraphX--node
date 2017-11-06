const should = require('should')
		, fs = require('fs')
		, Pagerank = require('../index');

describe('Page rank', function () {
	this.timeout(0);
	const linkProb = 0.85;
	const tolerance = 0.0001;

	const nodeMatrix = [
		[1],[0,2],[0,3,4],[4,5],[2,6],[0,6],[3]
	];

	const expectedResponse = [
		0.1751523680914745,
		0.17030808430632474,
		0.1505779562978131,
		0.1633947196406794,
		0.13353508156024055,
		0.09087132727586017,
		0.11680129518391424
	];

	it('correctly ranks nodes', function (done) {

		Pagerank(nodeMatrix, linkProb, tolerance, function (err, res) {

			should.not.exist(err);
			should.exist(res);
			res.should.be.instanceof(Array).and.have.lengthOf(7);
			res.should.eql(expectedResponse)
		});

		done()
	});

});