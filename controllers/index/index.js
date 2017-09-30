exports.start = function(req,res) {
    
    req.session.handshake = makeid();
    
    var pageData = {
        pageData : {
            handshake : req.session.handshake
        }
    };
    
    res.render('index/index', pageData);
};

function redirectPage(res, pageLocation){
    return res.redirect(pageLocation);
}


function renderPage(res, pageLocation, pageData){
    return res.render(pageLocation,pageData);
}

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 20; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}