/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var erc20Abi = [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "balance",
        "type": "uint256"
      }
    ],
    "payable": false,
    "type": "function"
  }
];

exports.getBalance = function(req,res){

    var address = req.params.address;
    var balance = web3.fromWei(web3.eth.getBalance(address),'ether').toString(10);    
    var response = [];
    
    response.push({symbol : 'eth', balance : balance});
    
    response = JSON.stringify(response);
    res.send(response);

}

exports.getToken = function(req,res){

    var address = req.params.address;
    var token = req.params.token;
    var tokenAddress = req.params.tokenAddress;
    
    var arrReturn = [];
    
    var balance = getTokenBalance(address, tokenAddress);
                
    if(balance > 0){
        arrReturn.push({symbol : token, balance : balance});
    }else{
        arrReturn.push({symbol : token, balance : "0"});
    }

    console.log(token);
    console.log(tokenAddress);
    console.log("token balance is " + balance);

    var jsonResponse = JSON.stringify(arrReturn);
    res.send(jsonResponse);
}

function getTokenBalance(address, tokenAddress){
    
    var token = web3.eth.contract(erc20Abi).at(tokenAddress);
                
    var decimals = token.decimals();
    var balance = token.balanceOf(address);
    var divisor = new web3.BigNumber(10).toPower(decimals);

    balance = balance.div(divisor);
    
    return balance;
}

exports.getTxns = function(req,res){
    var address = req.params.address;
}
