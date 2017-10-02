
exports.getDashboard = function(req,res) {
    
    var address = req.params.address;

    var pageData = {
        pageData : {
            address : address,
            handshake : req.session.handshake
        }
    };

    res.render('dashboard/dashboard', pageData);
};

function redirectPage(res, pageLocation){
    return res.redirect(pageLocation);
}


function renderPage(res, pageLocation, pageData){
    return res.render(pageLocation,pageData);
}
