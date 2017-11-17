const fs = require('fs');
const googleDataset = fs.readFileSync('./web-google.txt', 'utf-8').split('\r\n');
const nodes = [];


googleDataset.forEach((list, id) => {
	let [ node, out ] = list.split('\t');
	node = parseInt(node);
	out = parseInt(out);
	nodes[id] = [];
	if(!nodes[node]) {
		nodes[node] = [ out ];
	} else {
		nodes[node].push(out);
	}
});


fs.writeFileSync('./parsed.json', JSON.stringify(nodes, null, 2));