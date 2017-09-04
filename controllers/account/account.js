/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


exports.getBalance = function(req,res){

    var address = req.params.address;
    var balance = web3.fromWei(web3.eth.getBalance(address),'ether').toString(10);    
    var response = {};
    
    response['balance'] = balance;
    response = JSON.stringify(response);

    res.send(response);

}