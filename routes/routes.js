module.exports = function(app){  
    
    var index = require('../controllers/index/index.js');
    var account = require('../controllers/account/account.js');
    
    //index
    app.get('/', index.start);
    app.post('/', index.searchEns);
    
    app.get('/account/:address/balance', account.getBalance);
    
}


