"use strict";


module.exports = function (nodeMatrix, linkProb, tolerance, callback, debug) {
	if (!nodeMatrix || !linkProb || !tolerance || !callback) {
		throw new Error("Provide 4 arguments: "+
				"nodeMatrix, link probability, tolerance, callback");
	}
	if (!debug) {
		debug=false;
	}
	return new Pagerank(nodeMatrix, linkProb, tolerance, callback, debug);
};

function Pagerank(nodeMatrix, linkProb, tolerance, callback, debug) {

	this.outgoingNodes = nodeMatrix;
	this.linkProb = linkProb;
	this.tolerance = tolerance;
	this.callback = callback;
	this.pageCount = Object.keys(this.outgoingNodes).length;
	this.coeff = (1-linkProb)/this.pageCount;
	this.probabilityNodes = !(nodeMatrix instanceof Array) ? {} : [];
	this.incomingNodes = !(nodeMatrix instanceof Array) ? {} : [];
	this.debug=debug;

	this.startRanking();
}


Pagerank.prototype.startRanking = function () {

	let initialProbability = 1/this.pageCount,
			outgoingNodes = this.outgoingNodes, i, a, index;
	for (i in outgoingNodes) {
		this.probabilityNodes[i]=initialProbability;
		for (a in outgoingNodes[i]) {
			index = outgoingNodes[i][a];
			if (!this.incomingNodes[index]) {
				this.incomingNodes[index]=[];
			}
			this.incomingNodes[index].push(i);
		}
	}

	if (this.debug) this.reportDebug(1);

	this.iterate(1);
};


Pagerank.prototype.reportDebug = function (count) {
	console.log("____ITERATION "+count+"____");
	console.log("Pages: " + Object.keys(this.outgoingNodes).length);
	console.log("outgoing %j", this.outgoingNodes);
	console.log("incoming %j",this.incomingNodes);
	console.log("probability %j",this.probabilityNodes);
};


Pagerank.prototype.iterate = function(count) {
	let result = [];
	let resultHash={};
	let prob, ct, b, a, sum, res, max, min;
	console.log('---PageRank %d iteration', count);

	for (b in this.probabilityNodes) {
		sum = 0;
		if( this.incomingNodes[b] ) {
			for ( a=0; a<this.incomingNodes[b].length; a++) {
				prob = this.probabilityNodes[ this.incomingNodes[b][a] ];
				ct = this.outgoingNodes[ this.incomingNodes[b][a] ].length;
				sum += (prob/ct) ;
			}
		}
		res = this.coeff+this.linkProb*sum;
		max = this.probabilityNodes[b]+this.tolerance;
		min = this.probabilityNodes[b]-this.tolerance;

		if (min <= res && res<= max) {
			resultHash[b]=res;
			result.push(res);
		}

		this.probabilityNodes[b]=res;
	}

	if (result.length === this.pageCount) {
		if( !(this.outgoingNodes instanceof Array)) {
			return this.callback(null, resultHash);
		}
		return this.callback(null, result);
	}

	if (this.debug) {
		this.reportDebug(count);
	}

	++count;
	return this.iterate(count);
};
