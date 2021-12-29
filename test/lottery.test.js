const assert = require('assert') ;
const ganache = require('ganache-cli') ;
const Web3 = require('web3') ;


const web3 = new Web3(ganache.provider()) ;
const { abi , evm } = require('../compile') ;

let accounts ;
let lottery ;


 beforeEach(async () => {
 	accounts = await web3.eth.getAccounts() ;
 	lottery = await new web3.eth.Contract(abi).deploy({ data : evm.bytecode.object })
 			.send({ from : accounts[0], gas : '1000000'}) ;
 });

describe('Lottery Contract', () => {
	it('deployed successfully', () => {
		assert.ok(lottery.options.address) ;
	});

	it('able to enter a player' , async () => {
		await lottery.methods.enter().send({ from : accounts[0], value : web3.utils.toWei('0.02', 'ether')}) ;
		const players = await lottery.methods.getPlayers().call({ from : accounts[0] }) ;
		assert.equal(1, players.length) ; 
		assert.equal(accounts[0], players[0]) ;
	});

	it('can enter multiple accounts', async () => {
		await lottery.methods.enter().send({ from : accounts[0], value : web3.utils.toWei('0.03', 'ether')}) ;
		await lottery.methods.enter().send({ from : accounts[1], value : web3.utils.toWei('0.05', 'ether')}) ;
		
		const players = await lottery.methods.getPlayers().call({ from : accounts[0]}) ;
		assert.equal(2, players.length) ;	
		assert.equal(accounts[0], players[0]) ;
		assert.equal(accounts[1], players[1]) ;			
	});

	it('requires minimum amount of ether to enter', async () => {
		try{
			await lottery.method.enter().send({ from : accounts[0] , value : 100}) ;
			assert(false) ;
		} catch (err){
			assert(err) ;
		}
	});

	it('allows only manager to call pickWinner', async () => {
		try{
			await lottery.methods.pickWinner().send({ from : accounts[1] }) ;
			assert(false) ;
		} catch(err) {
			assert(err) ;
		}
	}); 

	it('sends the money to the winner & reset the lottery', async () => {
		await lottery.methods.enter().send({ from : accounts[1] , value : web3.utils.toWei('1', 'ether')}) ;
		
		const initialBalance = await web3.eth.getBalance(accounts[1]) ;
		await lottery.methods.pickWinner().send({ from : accounts[0]}) ;

		const finalBalance = await web3.eth.getBalance(accounts[1]) ;
		const diff = finalBalance - initialBalance ;

		assert(diff > web3.utils.toWei('0.8' , 'ether')) ;
		const players = await lottery.methods.getPlayers().call() ;
		assert(!players.length) ;
	});
});