module.exports = hits;

function hits(graph, epsilon = 1e-8, maxIterations) {
	let hitsGraph = initialize(graph);
	let hitsNodes = hitsGraph.nodes;
	let done = true;
	graph = undefined;
	let iteration = 0;
	do {
		let authorityChange = computeAuthorities(hitsNodes);
		let hubChange = computeHubs(hitsNodes);
		++iteration;
		console.log('---Hits %d iteration', iteration);
		done = authorityChange <= epsilon && hubChange <= epsilon;
		if(maxIterations && maxIterations <= iteration) {
			done = true;
		}
	} while (!done);

	return convertToSourceGraph( hitsGraph);
}

function convertToSourceGraph( hitsGraph) {
	let result = [];
	let nodeIdToIndex = hitsGraph.nodeIdToIndex;
	let hitsNodes = hitsGraph.nodes;

	hitsNodes.forEach(addHits);
	return result;

	function addHits(node, id) {
		let hitsNode = hitsNodes[nodeIdToIndex[id]];
		result[id] = {
			authority: hitsNode.authority,
			hub: hitsNode.hub,
			id,
		};
	}
}

function initialize(graph) {
	let hitsNodes = [];
	let totalNodes = graph.length;
	if (totalNodes === 0) {
		return {
			nodes: [],
			nodeIdToIndex: []
		}; // degenerate case of empty graph
	}
	const inEdges = [];
	(function computeInEdges() {
		graph.forEach((node, id) => {
			if(!inEdges[id]) {
				inEdges[id] = [];
			}
			node.forEach((edge) => {
				if(!inEdges[edge]) {
					inEdges[edge] = [];
				}
				inEdges[edge].push(id);
			});
		});
	}());
	// console.log('success');
	let nodeIdToIndex = Object.create(null);
	let idx = 0;

	graph.forEach(addHitsNode);
	console.log('---Hits--- Graph Init');
	return {
		nodes: hitsNodes,
		nodeIdToIndex: nodeIdToIndex,
	};

	function addHitsNode(node, id) {
		let hitsNode = new HitsNode(1);
		hitsNodes.push(hitsNode);
		nodeIdToIndex[id] = idx++;
		hitsNode.outEdges.push(...node);
		hitsNode.inEdges.push(...inEdges[id]);
	}
}

function computeHubs(nodes) {
	let maxHub = -1;
	for (let i = 0; i < nodes.length; ++i) {
		let node = nodes[i];
		let outEdges = node.outEdges;
		let hub = 0;
		for (let j = 0; j < outEdges.length; ++j) {
			hub += nodes[outEdges[j]].authority;
		}
		if (hub > maxHub) maxHub = hub;
		node.prevhub = node.hub;
		node.hub = hub;
	}

	return normalize(nodes, maxHub, 'hub');
}

function computeAuthorities(nodes) {
	let maxAuthority = -1;
	for (let i = 0; i < nodes.length; ++i) {
		let node = nodes[i];
		let inEdges = node.inEdges;
		let authority = 0;
		for (let j = 0; j < inEdges.length; ++j) {
			authority += nodes[inEdges[j]].hub;
		}
		if (authority > maxAuthority) maxAuthority = authority;
		node.prevauthority = node.authority;
		node.authority = authority;
	}

	return normalize(nodes, maxAuthority, 'authority');
}

function normalize(nodes, norm, attribute) {
	let dx = 0;
	let prevAttribute = 'prev' + attribute;
	for (let i = 0; i < nodes.length; ++i) {
		let node = nodes[i];
		node[attribute] /= norm;
		dx += Math.abs(node[attribute] - node[prevAttribute]);
	}

	return dx;
}

function HitsNode(norm) {
	// `prev` attribute is used only to compute exit criteria. This probably could
	// be done better to save more space.
	this.prevauthority = this.authority = norm;
	this.prevhub = this.hub = norm;
	this.inEdges = [];
	this.outEdges = [];
}