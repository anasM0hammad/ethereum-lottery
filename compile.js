const path = require('path') ;
const fs = require('fs') ;
const solc = require('solc') ;

const lotteryPath = path.resolve(__dirname, 'contracts' , 'lottery.sol') ;
const source = fs.readFileSync(lotteryPath, 'utf8') ;

const input = {
	language : 'Solidity',
	sources : {
		'lottery.sol' : {
			content : source,
		},
	},
	settings : {
		outputSelection : {
			'*' : {
				'*' : ['*'],
			},
		},
	},
};


// console.log(JSON.parse(solc.compile(JSON.stringify(input))).contracts) ;

module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts['lottery.sol'].Lottery ;