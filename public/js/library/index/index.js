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
    $(".ether-cont").hide();
    $(".top-10").hide();
    $(".crypto-txns").hide();
    $('#chart-container').hide();
    $('.alert').hide();
    
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
        $('.total-cont').hide();
        $('.top-menu').fadeIn(800);
       
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
        $(".top-10").fadeIn(800);
        $(".crypto-txns").fadeIn(800);
        
    });
    
    $('#search-eth-again').on("click", function (){
        
        var address = $("#ethAddressAgain").val();
        
        $('.temp-loading').show();
        
        $(".ether-cont").hide();
        $(".ethereum-balance").hide();
        $('.alt-loader').hide();
        $('#chart-container').hide();
        $(".crypto-value").val("");
        $(".crypto-balance").html("");
        $(".txn-table tbody").empty();
        $(".table-sent tbody").empty();
        $(".table-received tbody").empty();
        $("#crypto-txns").hide();
        $('.top-10-sent').hide();
        $('.top-10-received').hide();
        $('.total-gas').html('');
        $('.total-failed').html('');
        $('.total-cont').hide();
        
        
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
          url: "/account/" + address + "/balance?handshake="+$('.handshake').val(),
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
        
        request.fail(function(msg){
            $('.alert-danger').fadeIn();
            $('.alert-danger').html('We are sorry there was a problem, please try again');
            $('.alert-danger').delay(5000).fadeOut(800);
        });
    }
        
    function getAltBalance(address, i){
                        
        timer = setTimeout(function(){
            
            $('.alt-loader-text').html('Searching for ' + tokens[i]['symbol'])
                        
            var request = $.ajax({
                url: "/account/" + address + "/token/" + tokens[i]['symbol'] + '/' + tokens[i]['address']+ "?handshake="+$('.handshake').val(),
                type: "GET"
              //  data: {id : menuId},
            });

            request.done(function(response) {
                
                var arrToken = JSON.parse(response);

                if(arrToken[0]['balance'] > 0){
                    var html = '<div class="crypto-cont"><div class="col-sm-6 text-right">' + arrToken[0]['symbol'].trim() + '</div><div class="col-sm-6 text-left">' + parseFloat(arrToken[0]['balance']).toFixed(2) + '</div></div>';
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
            url: "/account/" + address + "/txns/?handshake="+$('.handshake').val(),
            type: "GET"
          //  data: {id : menuId},
        });
        
        request.done(function(response) {

            var result = JSON.parse(response);

            var arrTxns = result['txns'];
            var fromTotals = result['totalFrom'];
            var toTotals = result['totalTo'];
            var gasTotal = result['totalGas'];
            var failedTotal = result['totalFailed'];
            
            var labels = [];
            var series = [];
            var counter = 0;
            
            $("#crypto-txns").fadeIn(800);
            $('.crypto-txns tbody').append('<tr></tr>');
            
            for(var i in arrTxns){
               
                var rowStyle = '';
                var fromAddress = arrTxns[i]['from'].toUpperCase();
                var toAddress = arrTxns[i]['to'].toUpperCase();
                address = address.toUpperCase();

                if(parseFloat(arrTxns[i]['value']) !== 0.00 && counter < 30){
                    if(address === fromAddress){
                        labels.push(arrTxns[i]['txnDate']);
                        series.push({meta: 'To: ' + toAddress, value: -Math.abs(arrTxns[i]['value'])});
                        rowStyle = 'bg-success';
                    }else if(address === toAddress){
                        labels.push(arrTxns[i]['txnDate']);
                        series.push({meta: 'From: ' + fromAddress, value: arrTxns[i]['value']});
                        rowStyle = 'bg-danger';
                    }
                    
                    counter ++;
                }
                //var html = "txn date: " + arrTxns[i]['txnDate'] + " from txn is " + arrTxns[i]['from'] + ", to is " + arrTxns[i]['to'] + ", value is " + arrTxns[i]['value'] + "<br />";
                $('.crypto-txns tr:last').after('<tr class="'+rowStyle+'"><td>' + arrTxns[i]['fullDate'] + '</td><td><a href="https://etherscan.io/tx/'+arrTxns[i]['hash']+'" target="_blank" data-toggle="tooltip" title="'+arrTxns[i]['hash']+'">' + arrTxns[i]['hash'].substring(0, 15) + '...<a/></td><td><a href="https://etherscan.io/address/' + arrTxns[i]['from'].toLowerCase() + '" target="_blank">' + arrTxns[i]['from'] + '</a></td><td><a href="https://etherscan.io/address/' + arrTxns[i]['to'].toLowerCase() + '" target="_blank">' + arrTxns[i]['to'] + '</a></td><td>' + arrTxns[i]['value'] + '</td><td>' + arrTxns[i]['gasUsed'] + '</td></tr>');
            }
            
            var fromCounter = 0;
            
            $('.top-10-received').fadeIn(800);
            $('.table-received tbody').append('<tr></tr>');
            
            for(var i in fromTotals){
                if(fromCounter < 11){           
                    $('.table-received tr:last').after('<tr><<td><a href="https://etherscan.io/address/' + fromTotals[i]['address'].toLowerCase() + '" target="_blank">' + fromTotals[i]['address'] + '</a></td><td>' + fromTotals[i]['value'] + '</td></tr>');
                    fromCounter ++;
                }  
            }
            
            var toCounter = 0;
            
            $('.top-10-sent').fadeIn(800);
            $('.table-sent tbody').append('<tr></tr>');
            
            for(var i in toTotals){
                if(toCounter < 11){
                    $('.table-sent tr:last').after('<tr><<td><a href="https://etherscan.io/address/' + toTotals[i]['address'].toLowerCase() + '" target="_blank">' + toTotals[i]['address'] + '</a></td><td>' + toTotals[i]['value'] + '</td></tr>');
                    toCounter ++;
                }  
            }
            
            $('.total-gas').html('<h4 class="text-center"> Total Gas Used <br /><br />'+gasTotal+'<h4>');
            $('.total-failed').html('<h4 class="text-center">Total Failed Txns <br /><br />'+failedTotal+'<h4>');
            
            var data = {
                // A labels array that can contain any sort of values
                labels: labels,
                // Our series array that contains series objects or in this case series data arrays
                series: [
                  series
                ]
            };
            
            $('#chart-container').fadeIn(800);
            $('.total-cont').fadeIn(800);
            
            drawGraph(data);
            
            $('.temp-loading').fadeOut();
            
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

