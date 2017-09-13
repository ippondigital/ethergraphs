/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$.ajaxQ = (function(){
    var id = 0, Q = {};

    $(document).ajaxSend(function(e, jqx){
      jqx._id = ++id;
      Q[jqx._id] = jqx;
    });
    $(document).ajaxComplete(function(e, jqx){
      delete Q[jqx._id];
    });

    return {
      abortAll: function(){
        var r = [];
        $.each(Q, function(i, jqx){
          r.push(jqx._id);
          jqx.abort();
        });
        return r;
      }
    };

})();


//$( document ).ready(function() {
    
    $('.start-page').hide().delay(800);
    $('.start-page').fadeIn(800);
    $('.top-menu').hide();
    $('.crypto-results').hide();
    
    
    $('#search-eth').on("click", function (){

        $.ajaxQ.abortAll();
        
        $(".address-balance").html();
        
        var address = $("#ethAddress").val();

        var request = $.ajax({
          url: "/account/" + address + "/balance",
          type: "GET",
        //  data: {id : menuId},
          dataType: "html"
        });

        request.done(function(msg) {

            $('.start-page').hide();
            $('.top-menu').fadeIn(800);
            $('.crypto-results').fadeIn(800);
            
            var arrResponse = JSON.parse(msg);

            for(var i in arrResponse){
                var balance = arrResponse[i]['balance'];
                $(".ethereum-balance").html('<h3 class = "crypto-value">'+ parseFloat(balance).toFixed(2) + '</h3>');
            }

            var request = $.ajax({
                url: "https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/14919a4872f482f7471b8956404eed720e6d6d75/tokens/tokens-eth.json",
                type: "GET"
              //  data: {id : menuId},
            });

            request.done(function(response) {

                var tokens = JSON.parse(response);

                for (var i in tokens){

                    //(function(tokens) {

                        var request = $.ajax({
                            url: "/account/" + address + "/token/" + tokens[i]['symbol'] + '/' + tokens[i]['address'],
                            type: "GET"
                          //  data: {id : menuId},
                        });

                        request.done(function(response) {
                            var arrToken = JSON.parse(response);

                            if(arrToken[0]['balance'] > 0){
                                var html = '<div class="crypto-cont"><div class="col-sm-5"><h3 class = "crypto-title">' + arrToken[0]['symbol'].trim() + '</h3></div><div class="col-sm-7"><h3 class = "crypto-value">' + parseFloat(arrToken[0]['balance']).toFixed(2) + '</h3></div></div>';
                                $(html).hide().appendTo(".crypto-balance").fadeIn(1000);
                            }
                        });

                    //})(tokens);
                }
            });
        });
    });

//});

