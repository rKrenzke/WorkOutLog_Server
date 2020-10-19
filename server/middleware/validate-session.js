let jwt = require('jsonwebtoken');
let sequelize = require('../db');
let User = require('../models/user')(sequelize, require("sequelize"));

module.exports = function(req, res, next){
    if(req.method == 'OPTIONS'){
        next();
    }else{
        console.log(req.headers);
        let sessionToken = req.headers.authorization;
        console.log(sessionToken)
        if(!sessionToken) return res.status(403).send({auth: false, message: 'No Token Provided.'});
        else{
            jwt.verify(sessionToken, process.env.JWT_SECRET, (err, decoded) => {
                if(decoded){
                    User.findOne({where: { id: decoded.id}}).then(user => {
                        req.user = user;
                        next();
                    },
                    function(){
                        res.status(401).send({error: 'Not authorized'});
                    });
                }else{
                    res.status(400).send({error: 'Not authorized'});
                }
            });
        }
    }
}