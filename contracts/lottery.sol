// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9 ;

contract Lottery{
    address public manager ;
    address[] public players ;
    uint public pool ;

    constructor(){
        manager = msg.sender ;
        pool = 0 ;
    }

    function enter() public payable{

        require(msg.value > 0.01 ether) ;

        addPlayer(msg.sender) ;
        pool = pool + msg.value ;
    }

    function random() private view returns(uint){
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players))) ;
    }

    function addPlayer(address player) private{
        players.push(player) ;
    }

    function pickWinner() public restricted{
        uint index = random() % players.length ;
        payable(players[index]).transfer(pool) ;
        players = new address[](0) ;        // RESETTING THE PLAYERS ARRAY
    }

    function getPlayers() public view returns(address[] memory){
        return players ;
    }

    modifier restricted{
        require(manager == msg.sender) ;
        _; 
    }
}