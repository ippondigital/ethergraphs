exports.start = function(req,res) {
    res.render('index/index', {});
};

exports.searchEns = function(req,res){
        
    console.log('**** index/search ens ****');
    
    var address = req.body.ensAddress;
    
    console.log('block number');
    console.log(web3.eth.blockNumber);
    
    console.log(address);
    
//    var address = registrar.getAddress(ensDomain);
//    
//    console.log(address);
    
    var balance = web3.fromWei(web3.eth.getBalance(address),'ether').toString(10);    
    
    renderPage(
            res,
            'index/index',
            {
                pageData: {
                    response: "balance is " + balance,
                    pClass: "red"
                }
            }
        );    
    
};


function redirectPage(res, pageLocation){
    return res.redirect(pageLocation);
}


function renderPage(res, pageLocation, pageData){
    return res.render(pageLocation,pageData);
}

function getTransactionsByAccount(myaccount, startBlockNumber, endBlockNumber) {
  if (endBlockNumber == null) {
    endBlockNumber = web3.eth.blockNumber;
    console.log("Using endBlockNumber: " + endBlockNumber);
  }
  if (startBlockNumber == null) {
    startBlockNumber = endBlockNumber - 1000;
    console.log("Using startBlockNumber: " + startBlockNumber);
  }
  console.log("Searching for transactions to/from account \"" + myaccount + "\" within blocks "  + startBlockNumber + " and " + endBlockNumber);

  for (var i = startBlockNumber; i <= endBlockNumber; i++) {
    if (i % 1000 == 0) {
      console.log("Searching block " + i);
    }
    var block = web3.eth.getBlock(i, true);
    if (block != null && block.transactions != null) {
      block.transactions.forEach( function(e) {
        if (myaccount == "*" || myaccount == e.from || myaccount == e.to) {
          console.log("  tx hash          : " + e.hash + "\n"
            + "   nonce           : " + e.nonce + "\n"
            + "   blockHash       : " + e.blockHash + "\n"
            + "   blockNumber     : " + e.blockNumber + "\n"
            + "   transactionIndex: " + e.transactionIndex + "\n"
            + "   from            : " + e.from + "\n" 
            + "   to              : " + e.to + "\n"
            + "   value           : " + e.value + "\n"
            + "   time            : " + block.timestamp + " " + new Date(block.timestamp * 1000).toGMTString() + "\n"
            + "   gasPrice        : " + e.gasPrice + "\n"
            + "   gas             : " + e.gas + "\n"
            + "   input           : " + e.input);
        }
      });
    }
  }
}

