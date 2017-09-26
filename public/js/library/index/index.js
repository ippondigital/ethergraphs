/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$( document ).ready(function() {
    
    $('.start-page').hide().delay(800);
    $('.start-page').fadeIn(800);
    $('.top-menu').hide();
    $('.crypto-results').hide();
    $('.alt-loader').hide();
    
    var timer;
    var tokens;
    
    var request = $.ajax({
        url: "https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/14919a4872f482f7471b8956404eed720e6d6d75/tokens/tokens-eth.json",
        type: "GET"
      //  data: {id : menuId},
    });

    request.done(function(response) {
        tokens = JSON.parse(response);
    });
    
      
    $('#search-eth').on("click", function (){
        
        var address = $("#ethAddress").val();
        
        $('.start-page').hide();
        $('.top-menu').fadeIn(800);
        $(".ether-cont").hide();

        getEthBalance(address);
        getTxns(address);

        //clear the timeout if its running
        clearTimeout(timer);
        //get all balances
        getAltBalance(address, 0);
        
        $('.crypto-results').fadeIn(800);
        $(".ether-cont").fadeIn(800);
        $(".ethereum-balance").fadeIn(800);
        $('.alt-loader').fadeIn(800);
        
    });
    
    $('#search-eth-again').on("click", function (){
        
        var address = $("#ethAddressAgain").val();
        
        $(".ether-cont").hide();
        $(".ethereum-balance").hide();
        $('.alt-loader').hide();
        
        $(".crypto-value").val("");
        $(".crypto-balance").html("");
        
        $("#crypto-txns").html("")
        
        getEthBalance(address);
        getTxns(address);
        //clear the timeout if its running
        clearTimeout(timer);
        //get all balances
        $(".crypto-balance").fadeIn();
        
        getAltBalance(address, 0);
        
        $(".ether-cont").fadeIn(800);
        $(".ethereum-balance").fadeIn(800);
        $('.alt-loader').fadeIn(800);
        
        

    });
    
    function getEthBalance(address){
        
        var request = $.ajax({
          url: "/account/" + address + "/balance",
          type: "GET",
        //  data: {id : menuId},
          dataType: "html"
        });

        request.done(function(msg) {

            var arrResponse = JSON.parse(msg);

            for(var i in arrResponse){
                var balance = arrResponse[i]['balance'];
                $(".ethereum-balance").html(address +'<br />ETH Balance: '+ parseFloat(balance).toFixed(2));
            }
 
        });
    }
        
    function getAltBalance(address, i){
                        
        timer = setTimeout(function(){
                        
            var request = $.ajax({
                url: "/account/" + address + "/token/" + tokens[i]['symbol'] + '/' + tokens[i]['address'],
                type: "GET"
              //  data: {id : menuId},
            });

            request.done(function(response) {
                
                var arrToken = JSON.parse(response);

                if(arrToken[0]['balance'] > 0){
                    var html = '<div class="crypto-cont"><div class="col-sm-3 text-left">' + arrToken[0]['symbol'].trim() + '</div><div class="col-sm-9 text-right">' + parseFloat(arrToken[0]['balance']).toFixed(2) + '</div></div>';
                    $(html).hide().appendTo(".crypto-balance").fadeIn(1000);
                }

            });
            
            // Call the slider function again
            i++;
                       
            getAltBalance(address, i);
            
        },5000);

     }
     
    function getTxns(address){
        var request = $.ajax({
            url: "/account/" + address + "/txns/",
            type: "GET"
          //  data: {id : menuId},
        });
        
        request.done(function(response) {

            var result = JSON.parse(response);
console.log(response);
return true;
            var arrTxns = result['txns'];
            
            var labels = [];
            var series = [];
            var counter = 0;
            for(var i in arrTxns){
                
                var fromAddress = arrTxns[i]['from'].toUpperCase();
                var toAddress = arrTxns[i]['to'].toUpperCase();
                address = address.toUpperCase();
                
                if(parseInt(arrTxns[i]['value']) !== 0 && counter < 25){
                    if(address === fromAddress){
                        labels.push(arrTxns[i]['txnDate']);
                        series.push({meta: 'To: ' + toAddress, value: -Math.abs(arrTxns[i]['value'])});
                    }else if(address === toAddress){
                        labels.push(arrTxns[i]['txnDate']);
                        series.push({meta: 'From: ' + fromAddress, value: arrTxns[i]['value']});
                    }
                    
                    counter ++;
                }
      
                var html = "txn date: " + arrTxns[i]['txnDate'] + " from txn is " + arrTxns[i]['from'] + ", to is " + arrTxns[i]['to'] + ", value is " + arrTxns[i]['value'] + "<br />";
                $(".crypto-txns").append(html);
            }
            
            var data = {
                // A labels array that can contain any sort of values
                labels: labels,
                // Our series array that contains series objects or in this case series data arrays
                series: [
                  series
                ]
            };
            
            console.log(data);
            
            drawGraph(data);
            // As options we currently only set a static size of 300x200 px. We can also omit this and use aspect ratio containers
            // as you saw in the previous example
            
            //$(".crypto-txns").html(arrTxns);
            //$(".crypto-txns").fadeIn();

//            if(arrToken[0]['balance'] > 0){
//                var html = '<div class="crypto-cont"><div class="col-sm-5"><h4 class = "crypto-title">' + arrToken[0]['symbol'].trim() + '</h4></div><div class="col-sm-7"><h3 class = "crypto-value">' + parseFloat(arrToken[0]['balance']).toFixed(2) + '</h3></div></div>';
//                $(html).hide().appendTo(".crypto-balance").fadeIn(1000);
//            }

        });
    }
    
    
    function drawGraph(data){
        
        new Chartist.Bar('#chart-container', data, {
            fullWidth: true,
            height: 400,
            plugins: [
              Chartist.plugins.tooltip()
            ]
        });

    }

});

