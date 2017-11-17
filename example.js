const Pagerank = require('./src/pageRank');
const Hits = require('./src/hits');
const fs = require('fs');
const linkProb = 0.85;
const tolerance = 0.0001;

const nodes = require('./parsed.json');
console.log('---Sample Size---', nodes.length);
const beforePR = Date.now();
// let hitsResult = Hits(nodes, 0.0001, 10);

Pagerank(nodes, linkProb, tolerance, function (err, res) {
	const afterPR = Date.now();
	console.log('Time Taken By PR %d sec', (afterPR - beforePR)/1000);
	if (err) throw new Error(err);
	let formattedPageRank = res.map((pageRank, id) => {
		return {
			id,
			pageRank,
		}
	}).sort((a, b) => {
		return b.pageRank - a.pageRank;
	});
	res = undefined;
	const top10Page = formattedPageRank.slice(0, 10);
	fs.writeFileSync('./pageRank-result.json', JSON.stringify(top10Page, null, 2));
	formattedPageRank = undefined;
	const beforeHits = Date.now();
	let hitsResult = Hits(nodes, tolerance, 3);
	const afterHits = Date.now();
	console.log('Time Taken By Hits %d sec', (afterHits - beforeHits)/1000);

	let authorityWiseSorted = hitsResult.sort((a, b) => {
		return b.authority - a.authority;
	});
	const top10authority = authorityWiseSorted.slice(0, 10);
	fs.writeFileSync('./authority-result.json', JSON.stringify(top10authority, null, 2));
	authorityWiseSorted = undefined;
	let hubWiseSorted = hitsResult.sort((a, b) => {
		return b.hub - a.hub;
	});
	const top10hubs = hubWiseSorted.slice(0, 10);
	fs.writeFileSync('./hub-result.json', JSON.stringify(top10hubs, null, 2));
	hubWiseSorted = undefined;
	hitsResult = undefined;
	console.log('-------Top Pages-----');
	console.log(JSON.stringify(top10Page, null, 2));
	console.log('------Top Authorities-----');
	console.log(JSON.stringify(top10authority, null, 2));
	console.log('-------Top Hubs---------');
	console.log(JSON.stringify(top10hubs, null, 2));
	const result = {
		pageToAuthority: [],
		pageToHub: [],
	};
	for(let i = 0; i<10; i++) {
		for(let j = 0; j< 10; j++) {
			if(top10Page[i].id == top10authority[j].id) {
				result.pageToAuthority.push(top10Page[i].id);
			}
		}
		for(let j = 0; j< 10; j++) {
			if(top10Page[i].id == top10hubs[j].id) {
				result.pageToAuthority.push(top10Page[i].id);
			}
		}
	}
	fs.writeFileSync('./result.json', JSON.stringify(result, null, 2));
	console.log('------------Comparision Results--------------');
	console.log(JSON.stringify(result, null, 2))
});
//
