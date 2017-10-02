module.exports = function(app){  
    
    var index = require('../controllers/index/index.js');
    var account = require('../controllers/account/account.js');
    var dashboard = require('../controllers/dashboard/dashboard.js');
    
    //index
    app.get('/', index.start);
    
    app.get('/dashboard/:address', dashboard.getDashboard);
    
    app.get('/account/:address/balance', account.getBalance);
    app.get('/account/:address/txns', account.getTxns);
    app.get('/account/:address/token/:token/:tokenAddress', account.getToken);
    
}


