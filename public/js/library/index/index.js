/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */




$('#search-ens').on("click", function (){
    
    var address = $("#ensAddress").val();

    var request = $.ajax({
      url: "/account/" + address + "/balance",
      type: "GET",
    //  data: {id : menuId},
      dataType: "html"
    });

    request.done(function(msg) {

        var arrResponse = JSON.parse(msg);

        for(var i in arrResponse){
            $(".address-balance").append( "balance for " + arrResponse[i]['symbol'] + " is " + arrResponse[i]['balance'] + "<br />");
        }

        var request = $.ajax({
            url: "https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/14919a4872f482f7471b8956404eed720e6d6d75/tokens/tokens-eth.json",
            type: "GET"
          //  data: {id : menuId},
        });

        request.done(function(response) {

            var tokens = JSON.parse(response);

            for (var i in tokens){
                
                (function(tokens) {
                    
                    var request = $.ajax({
                        url: "/account/" + address + "/token/" + tokens[i]['symbol'] + '/' + tokens[i]['address'],
                        type: "GET"
                      //  data: {id : menuId},
                    });

                    request.done(function(response) {
                        var arrToken = JSON.parse(response);

                        if(arrToken[0]['balance'] > 0){
                            $(".address-balance").append( "balance for " + arrToken[0]['symbol'] + " is " + arrToken[0]['balance'] + "<br />");
                        }
                    });
                    
                })(tokens);
            }
            
        });
    
    });

});

function getTokenJson(){
          
    var request = $.ajax({
        url: "https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/14919a4872f482f7471b8956404eed720e6d6d75/tokens/tokens-eth.json",
        type: "GET"
      //  data: {id : menuId},
    });

    request.done(function(response) {
        
        var tokens = JSON.parse(response);

//        if(tokens === 'undefined'){
//            return false;
//        }
        
        return tokens;
    });
}

function getTokenBalance(address, symbol){
    
    var request = $.ajax({
        url: "/account/" + address + "/token/" + symbol,
        type: "GET"
      //  data: {id : menuId},
    });
    
    request.done(function(response) {
        response = JSON.parse(response);
        //fill this in later
        return response;
    });
    
}