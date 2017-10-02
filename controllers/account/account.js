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

    var response = [];
    var address = req.params.address;
    var status = 200;
    var handshake = req.query.handshake;

    if(checkToken(req,handshake) === false){
        response.push({error : 'tokens do not match'});
        status = 400;
    }else{
        var balance = web3.fromWei(web3.eth.getBalance(address),'ether').toString(10);    
        response.push({symbol : 'eth', balance : balance});
    }

    response = JSON.stringify(response);
    res.status(status);
    res.send(response);

}

exports.getToken = function(req,res){

    var address = req.params.address;
    var token = req.params.token;
    var tokenAddress = req.params.tokenAddress;
    var handshake = req.query.handshake;
    
    var response = [];
    
    if(checkToken(req,handshake) === false){
        response.push({error : 'tokens do not match'});
        status = 400;
    }else{
        var balance = getTokenBalance(address, tokenAddress);
                
        if(balance > 0){
            response.push({symbol : token, balance : balance});
        }else{
            response.push({symbol : token, balance : "0"});
        }
    }
    
    var jsonResponse = JSON.stringify(response);
    res.status(200);
    res.send(jsonResponse);
}


exports.getTxns = function(req,res){
    
    var address = req.params.address.toUpperCase();
    var response = [];
    var handshake = req.query.handshake;
    
    Date.prototype.monthNames = [
        "January", "February", "March",
        "April", "May", "June",
        "July", "August", "September",
        "October", "November", "December"
    ];

    Date.prototype.getMonthName = function() {
        return this.monthNames[this.getMonth()];
    };
    Date.prototype.getShortMonthName = function () {
        return this.getMonthName().substr(0, 3);
    };
    
    if(checkToken(req,handshake) === false){
        response.push({error : 'tokens do not match'});
        status = 400;
        var jsonResponse = JSON.stringify(response);
        res.status(400);
        res.send(jsonResponse);
    }else{
        requestPromise({
            method: 'POST',
            uri: 'http://api.etherscan.io/api?module=account&action=txlist&address='+address+'&startblock=0&endblock=99999999&sort=asc&apikey=TEC67NXQJ73I6X6U1QMRV4U5QWH1Z8SQX9',
        }).then(function (parsedBody) {
        
            parsedBody = JSON.parse(parsedBody);
            parsedBody = parsedBody['result'];

            var txns = [];
            var totalFrom = [];
            var grandTotalFrom = 0;
            var grandTotalTo = 0;
            var totalTo = [];
            var totalGas = 0;
            var totalFailed = 0;
            var totalTxns = 0;

            for (var i in parsedBody){
                
                totalTxns++;

    //            { blockNumber: '3737706',
    //              timeStamp: '1495280035',
    //              hash: '0xbb706b8519b83b0f6973a79e3c760c7276b244d476242a38d5b8b5881f8131b1',
    //              nonce: '0',
    //              blockHash: '0x1ead616c5459a1437b1779d5dbc585295c2d33948f871c6c74485693f9e37fe2',
    //              transactionIndex: '24',
    //              from: '0xda5e00827ae142e398083a76f76b130bbd1b2271',
    //              to: '0x853028d51ab903a5c5814fb4d0b939820f3cd7ff',
    //              value: '10000000000000000',
    //              gas: '90000',
    //              gasPrice: '20000000000',
    //              isError: '0',
    //              input: '0x',
    //              contractAddress: '',
    //              cumulativeGasUsed: '1086648',
    //              gasUsed: '21000',
    //              confirmations: '579253' }


                var balance = parsedBody[i]['value'];
                var divisor = new web3.BigNumber(10).toPower(18);
                var timestamp = parseInt(parsedBody[i]['timeStamp']);
                var humanDate = new Date( timestamp*1000);

                //var theDate =  humanDate.getDay() + '/' + humanDate.getMonth();

                var fromAddress = parsedBody[i]['from'].toUpperCase();
                var toAddress = parsedBody[i]['to'].toUpperCase();

                balance = (balance/divisor).toFixed(2);

                txns.push({
                    timestamp : parsedBody[i]['timestamp'],
                    fullDate : ISODateString(humanDate),
                    hash : parsedBody[i]['hash'],
                    from : fromAddress, 
                    to: toAddress, 
                    value : balance, 
                    txnDate : ISODayMonthString(humanDate),
                    gasUsed: parsedBody[i]['gasUsed']
                });

                totalGas += parseFloat(parsedBody[i]['gasUsed']);

                if(balance > 0 && parsedBody[i]['isError'] === '0'){

                    if(address === fromAddress){
                        if(typeof totalTo[toAddress] !== 'undefined'){
                            totalTo[toAddress] += parseFloat(balance);
                        }else{
                            totalTo[toAddress] = parseFloat(balance);
                        }
                        
                        grandTotalTo += parseFloat(balance);
                        
                    }else{
                        if(typeof totalFrom[fromAddress] !== 'undefined'){
                            totalFrom[fromAddress] += parseFloat(balance);
                        }else{
                            totalFrom[fromAddress] = parseFloat(balance);
                        }
                        
                        grandTotalFrom += parseFloat(balance);
                    }
                }else{
                    if(parsedBody[i]['isError'] !== '0'){
                        totalFailed++;
                    }
                }

            }

            var newTotalFrom = [];
            var newTotalTo = [];

            for(i in totalFrom){
                newTotalFrom.push({address: i, value : totalFrom[i]})
            }

            for(i in totalTo){
                newTotalTo.push({address: i, value : totalTo[i]})
            }

            newTotalFrom = newTotalFrom.sort(function(a, b) {
                return parseFloat(b.value) - parseFloat(a.value);
            });

            newTotalTo = newTotalTo.sort(function(a, b) {
                return parseFloat(b.value) - parseFloat(a.value);
            });

            var arrRtn = {};        
            arrRtn['txns'] = txns;
    //        arrRtn['totalFrom'] = Object.assign({},totalFrom);
    //        arrRtn['totalTo'] = Object.assign({},totalTo);
            arrRtn['totalFrom'] = newTotalFrom;
            arrRtn['totalTo'] = newTotalTo;
            arrRtn['totalGas'] = totalGas;
            arrRtn['totalFailed'] = totalFailed;
            arrRtn['grandTotalTo'] = grandTotalTo;
            arrRtn['grandTotalFrom'] = grandTotalFrom;
            arrRtn['totalTxns'] = totalTxns;

            var jsonResponse = JSON.stringify(arrRtn);

            res.status(200);
            res.send(jsonResponse);

        })
        .catch(function (err) {
            console.log(err);
            // POST failed...
        });
    }
}

function checkToken(req,handshake){
    
    if(handshake === req.session.handshake){
        return true;
    }
    
    return false;
}

function getTokenBalance(address, tokenAddress){
    
    var token = web3.eth.contract(erc20Abi).at(tokenAddress);
                
    var decimals = token.decimals();
    var balance = token.balanceOf(address);
    var divisor = new web3.BigNumber(10).toPower(decimals);

    balance = balance.div(divisor);
    
    return balance;
}

function ISODateString(d){
    function pad(n){return n<10 ? '0'+n : n}
    return d.getUTCFullYear()+'-'
    + pad(d.getUTCMonth()+1)+'-'
    + pad(d.getUTCDate())+' '
    + pad(d.getUTCHours())+':'
    + pad(d.getUTCMinutes())+':'
    + pad(d.getUTCSeconds());
}

function ISODayMonthString(d){
    function pad(n){return n<10 ? '0'+n : n}
    return pad(d.getUTCDate())+'/'
    + pad(d.getUTCMonth()+1);
}