var router = require('express').Router();
var sequelize = require('../db');
var User = require('../models/user')(sequelize, require("sequelize"));
let Log = require('../models/log')(sequelize, require("sequelize"));
let validateSession = require('../middleware/validate-session');

// GET ALL LOGS FOR INDIVIDUAL USER
router.get('/log/', validateSession, function(req, res){
    var userid = req.user.id;

    Log
    .findAll({
        where: {owner_id: userid}
    })
    .then(
        function findAllSuccess(data){
            res.json(data);
        },
        function findAllError(err){
            res.send(500, err.message);
        }
    );
});

// GET SINGLE LOG FOR INDIVIDUAL USER
router.get('/log/:id', validateSession, function(req, res){
    var data = req.params.id;
    var userid = req.user.id;

    Log
    .findOne({
        where: {id: data, owner_id: userid}
    }).then(
        function findOneSuccess(data){
            res.json(data);
        },
        function findOneError(err){
            res.send(500, err.message);
        }
    );
});

// CREATE A WORKOUT LOG
router.post('/log/', validateSession, function(req, res){
    var owner_id = req.body.log.owner_id;
    var description = req.body.log.description;
    var definition = req.body.log.definition;
    var result = req.body.log.result;

    Log
    .create({
        description: description,
        definition: definition,
        result: result,
        owner_id: owner_id
    })
    .then(
        function createSuccess(data){
            res.json(data);
        },
        function createError(err){
            res.send(500, err.message);
        }
    );
});

// UPDATE LOG FOR INDIVIDUAL USER
router.put('/log/:id', function(req, res){
    var data = req.params.id;
    var description = req.body.log.description;
    var definition = req.body.log.definition;
    var result = req.body.log.result;

    Log
    .update({
        description: description,
        definition: definition,
        result: result
    },
    {where: {id: data}}
    ).then(
        function updateSuccess(updatedLog){
            res.send(`Log ${data} updated!`);
        },
        function updateError(err){
            res.send(500, err.message);
        }
    )
});


// DELETE LOG FOR INDIVIDUAL USER
router.delete('/log/:id', validateSession, function(req, res){
    var data = req.params.id;
    var userid = req.user.id;

    Log
        .destroy({
            where: {id: data, owner_id: userid}
        }).then(
            function deleteLogSuccess(data){
                res.send("you removed a log");
            },
            function deleteLogError(err){
                res.send(500, err.message);
            }
        );
});



module.exports = router;