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

  var response = JSON.parse(msg);
  console.log(response['balance']);
  $(".address-balance").html( "balance is " + response['balance'] );
});

request.fail(function(jqXHR, textStatus) {
  //alert( "Request failed: " + textStatus );
});


});

