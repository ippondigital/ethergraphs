/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$( document ).ready(function() {
      
    $('#search-eth').on("click", function (){
        
        var address = $("#ethAddress").val();
        //update url
        window.location.href = '/dashboard/' + address;

    });
    
});