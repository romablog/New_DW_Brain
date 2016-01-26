var File = require('../models/file').File;
exports.post = function(req, res, next) {
    var canvas = req.body.data;
};

exports.get = function(req, res, next) {
    File.allUsersFile(res.locals.user.username,function(p_link){
        if (p_link == "No Link"){
            res.status(404).send("Fuck off!")
        }
        else{
            res.send(p_link);
        }
    });
};