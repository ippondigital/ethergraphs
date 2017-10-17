/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$( document ).ready(function() {
   
    $(".dashboard_main").hide();
    $(".dashboard_network").hide();
    $(".dashboard_txns").hide();
    $(".dashboard_tokens").hide();
   
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
    
    var address = $('#currentAddress').val();
    
    if(address !== ''){
                
        getEthBalance(address);
        getTxns(address);
        //clear the timeout if its running
        clearTimeout(timer);
        //get all balances
        $(".dashboard_main").fadeIn(800);
        getAltBalance(address, 0);
        
    }
    
    $('.dashboard-btn').on("click", function (){
        $(".dashboard_main").fadeIn(800);
        $(".dashboard_network").hide();
        $(".dashboard_txns").hide();
        $(".dashboard_tokens").hide();
    });
    
    $('.network-btn').on("click", function (){
        $(".dashboard_main").hide();
        $(".dashboard_network").fadeIn(800);
        $(".dashboard_txns").hide();
        $(".dashboard_tokens").hide();
    });
    
    $('.txns-btn').on("click", function (){
        $(".dashboard_main").hide();
        $(".dashboard_network").hide();
        $(".dashboard_txns").fadeIn(800);
        $(".dashboard_tokens").hide();
    });
    
    $('#search-eth-again').on("click", function (){
        var address = $("#ethAddressAgain").val();
        //update url
        window.location.href = '/dashboard/' + address;
    });
    
    $("#pagination-cont").on('click', '.pagination-button', function () {
        
        var page = $(this).val();
        if(page < 1){
            page = 1;
        }
        var base64 = document.getElementById('txn-stash').value;
        console.log(page);
        getTxnTable(base64,page);
        
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
                //address
                $(".eth-address").html(address);
                $(".eth-balance").html(numberWithCommas(parseFloat(balance).toFixed(2)));
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
            
            $('.alt-loader-text').html('Searching for ' + tokens[i]['symbol']);
            $('.alt-loader-text').fadeIn();
                        
            var request = $.ajax({
                url: "/account/" + address + "/token/" + tokens[i]['symbol'] + '/' + tokens[i]['address']+ "?handshake="+$('.handshake').val(),
                type: "GET"
              //  data: {id : menuId},
            });

            request.done(function(response) {
                
                var arrToken = JSON.parse(response);

                if(arrToken[0]['balance'] > 0){
                    var html = '<div class="dashboard"><div class="col-xs-6 text-center">' + arrToken[0]['symbol'].trim() + '</div><div class="col-xs-6 text-center">' + parseFloat(arrToken[0]['balance']).toFixed(2) + '</div></div>';
                    $(html).hide().appendTo(".crypto-balance").fadeIn(1000);
                }

            });
            
            // Call the slider function again
            i++;           
            getAltBalance(address, i);
            
        },2000);

        $('.alt-loader-text').fadeOut(1500);

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
            var base64 = btoa(response);
            document.getElementById('txn-stash').value = base64;
            var fromTotals = result['totalFrom'];
            var toTotals = result['totalTo'];
            var gasTotal = result['totalGas'];
            var failedTotal = result['totalFailed'];
            var grandTotalTo = result['grandTotalTo'];
            var grandTotalFrom = result['grandTotalFrom'];
            var totalTxns = result['totalTxns'];
            
            var labels = [];
            var series = [];
            var counter = 0;
            
            $("#crypto-txns").fadeIn(800);
            $('.crypto-txns tbody').append('<tr></tr>');
            
            for(var i in arrTxns){
               
                
                var fromAddress = arrTxns[i]['from'].toUpperCase();
                var toAddress = arrTxns[i]['to'].toUpperCase();
                address = address.toUpperCase();

                if(parseFloat(arrTxns[i]['value']) !== 0.00 && counter < 30){
                    if(address === fromAddress){
                        labels.push(arrTxns[i]['txnDate']);
                        series.push({meta: 'To: ' + toAddress, value: -Math.abs(arrTxns[i]['value'])});
                        //rowStyle = 'bg-danger';
                    }else if(address === toAddress){
                        labels.push(arrTxns[i]['txnDate']);
                        series.push({meta: 'From: ' + fromAddress, value: arrTxns[i]['value']});
                        //rowStyle = 'bg-success';
                    }
                    
                    counter ++;
                }
                //var html = "txn date: " + arrTxns[i]['txnDate'] + " from txn is " + arrTxns[i]['from'] + ", to is " + arrTxns[i]['to'] + ", value is " + arrTxns[i]['value'] + "<br />";
                //$('.crypto-txns tr:last').after('<tr class="'+rowStyle+'"><td>' + arrTxns[i]['fullDate'] + '</td><td><a href="https://etherscan.io/tx/'+arrTxns[i]['hash']+'" target="_blank" data-toggle="tooltip" title="'+arrTxns[i]['hash']+'">' + arrTxns[i]['hash'].substring(0, 15) + '...<a/></td><td><a href="https://etherscan.io/address/' + arrTxns[i]['from'].toLowerCase() + '" target="_blank">' + arrTxns[i]['from'] + '</a></td><td><a href="https://etherscan.io/address/' + arrTxns[i]['to'].toLowerCase() + '" target="_blank">' + arrTxns[i]['to'] + '</a></td><td>' + arrTxns[i]['value'] + '</td><td>' + arrTxns[i]['gasUsed'] + '</td></tr>');
            }
            
            var fromCounter = 1;
            var toCounter = 1;
            
            $('.table-received tbody').append('<tr></tr>');
            
            for(var i in fromTotals){
                if(fromCounter < 11){           
                    $('.table-received tr:last').after('<tr><td>'+fromCounter+'</td><td><a href="http://ethergraphs.com/dashboard/' + fromTotals[i]['address'].toLowerCase() + '" target="_blank">' + fromTotals[i]['address'] + '</a></td><td>' + fromTotals[i]['value'].toFixed(2) + '</td></tr>');
                    fromCounter ++;
                }  
            }
            
            $('.top-10-sent').fadeIn(800);
            $('.table-sent tbody').append('<tr></tr>');
            
            for(var i in toTotals){
                if(toCounter < 11){
                    $('.table-sent tr:last').after('<tr><td>'+toCounter+'</td><td><a href="http://ethergraphs.com/dashboard/' + toTotals[i]['address'].toLowerCase() + '" target="_blank">' + toTotals[i]['address'] + '</a></td><td>' + toTotals[i]['value'].toFixed(2) + '</td></tr>');
                    toCounter ++;
                }  
            }
            
            $('.total-txns').html(numberWithCommas(totalTxns));
            $('.total-gas').html(numberWithCommas(gasTotal));
            $('.total-failed').html(numberWithCommas(failedTotal));
            $('.grand-total-to').html(numberWithCommas(grandTotalTo.toFixed(2)));
            $('.grand-total-from').html(numberWithCommas(grandTotalFrom.toFixed(2)));

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
            
            //lets do some logic with the data
            // create an array with nodes
            var addressNodes = [];
            var connections = [];
            var counter = 1;
            var formattedData = [];
            for(var i in toTotals){
                
                if(counter == 1){
                    addressNodes.push({id : counter, label : address});
                }
                
                counter++;
                
                addressNodes.push({id : counter, label : toTotals[i]['address']});
                connections.push({from : 1, to : counter});
                
                //we need to format an aray for a click event
                formattedData[counter] = toTotals[i]['address'];
                
            }
            
            //drawNetwork(addressNodes,connections,formattedData,counter, address);
            
            $('.temp-loading').fadeOut();
            
            getTxnTable(base64,1);
            
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
    
    function drawNetwork(addressNodes,connections, formattedData, counter, address){
                
        var nodes = new vis.DataSet(addressNodes);
        // create an array with edges
        var edges = new vis.DataSet(connections);

        // create a network
        $('#network-container').html('');
        var container = document.getElementById('network-container');
        // provide the data in the vis format
        var data = {
            nodes: nodes,
            edges: edges
        };
        // these are all options in full.
        
        var options = {
            edges: {
                smooth: {
                    type: 'dynamic',
                    forceDirection: 'horizontal',
                    roundness: 0.1
                },
                color: {
                    color:'#848484',
                    highlight:'#848484',
                    hover: '#848484',
                    inherit: 'from',
                    opacity:1.0
                }
            },
            layout: {
                hierarchical: {
                levelSeparation: 400,
                nodeSpacing: 125,
                treeSpacing: 170,
                blockShifting: true,
                edgeMinimization: true,
                parentCentralization: true,
                direction: 'LR',        // UD, DU, LR, RL
                sortMethod: 'directed'   // hubsize, directed
              }
            },
            physics:false,
            interaction:{hover:true},
        };
        // initialize your network!
        var network = new vis.Network(container, data, options);
        
        network.on("click", function (params) {
            
            var nodeId = this.getNodeAt(params.pointer.DOM);
            var clickedAddress = formattedData[nodeId];
            
            var request = $.ajax({
                url: "/account/" + clickedAddress + "/txns/?handshake="+$('.handshake').val(),
                type: "GET"
              //  data: {id : menuId},
            });

            request.done(function(response) {

                var result = JSON.parse(response);
                var toTotals = result['totalTo'];
                var formattedData = [];
                
                for(var i in toTotals){

                    counter++;
                    
                    if(clickedAddress !== toTotals[i]['address']){
                        addressNodes.push({id : counter, label : toTotals[i]['address']});
                        connections.push({from : nodeId, to : counter});
                    }
                    //we need to format an aray for a click event
                    formattedData[counter] = toTotals[i]['address'];

                }

              drawNetwork(addressNodes,connections,formattedData,counter,address);

            });
            
        });
    }
    
    function getTxnTable(base64, page){
        
        var rowStyle = '';
        page = parseInt(page);
        var response = atob(base64);
        response = JSON.parse(response);  
        var arrTxns = response['txns'];
        var totalTxns = response['totalTxns'];
        var pages = Math.ceil(totalTxns/30);
        
        $(".all-txns > tbody").hide();
        $(".all-txns > tbody").html("<tr></tr>");
        
        if(totalTxns >= 30){
            
            var pagination = '<button id="pagination-button" class="btn btn-default pagination-button" type="button" value="'+(page-1)+'">Previous</button>';
            var i = 1;

            while(i <= pages){
                pagination += '<button class="btn btn-default pagination-button" type="button" value="'+i+'">'+i+'</button>';
                i++;
            }
            
            if(page === pages){
                pagination += '<button class="btn btn-default pagination-button" type="button" value="'+page+'">Next</button>';
            }else{
                pagination += '<button class="btn btn-default pagination-button" type="button" value="'+(page+1)+'">Next</button>';
            }
            
        }

        var counter = 1;        
        var endCounter = 30 * page;
        var startCounter = endCounter - 30;
           
        for(var i in arrTxns){
   
            var fromAddress = arrTxns[i]['from'].toUpperCase();
            var toAddress = arrTxns[i]['to'].toUpperCase();
            
            address = address.toUpperCase();

            if(counter >= startCounter && counter < endCounter){
                
                if(parseFloat(arrTxns[i]['value']) !== 0.00){
                    if(address === fromAddress){
                        rowStyle = 'bg-danger';
                    }else if(address === toAddress){
                        rowStyle = 'bg-success';
                    }
                }
                
                $('.crypto-txns tr:last').after('<tr class="'+rowStyle+'"><td>'+counter+'</td><td>' + arrTxns[i]['fullDate'] + '</td><td><a href="https://etherscan.io/tx/'+arrTxns[i]['hash']+'" target="_blank" data-toggle="tooltip" title="'+arrTxns[i]['hash']+'">' + arrTxns[i]['hash'].substring(0, 15) + '...<a/></td><td><a href="http://ethergraphs.com/dashboard/' + arrTxns[i]['from'].toLowerCase() + '" target="_blank">' + arrTxns[i]['from'] + '</a></td><td><a href="http://ethergraphs.com/dashboard/' + arrTxns[i]['to'].toLowerCase() + '" target="_blank">' + arrTxns[i]['to'] + '</a></td><td>' + arrTxns[i]['value'] + '</td><td>' + arrTxns[i]['gasUsed'] + '</td></tr>');
            } 
            
            counter ++;
        }

        $('#pagination-cont').html(pagination);
        $(".all-txns > tbody").fadeIn(800);
    }
    
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

});

