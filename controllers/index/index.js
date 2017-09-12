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

