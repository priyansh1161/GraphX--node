const Pagerank = require('./index');
const nodes = [[1,2],[],[0,1,4],[4,5],[3,5],[3]];
const linkProb = 0.85;
const tolerance = 0.0001;

Pagerank(nodes, linkProb, tolerance, function (err, res) {
	if (err) throw new Error(err)

	//otherwise use the result (res)
}, true);