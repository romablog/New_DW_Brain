var File = require('../models/file').File;
exports.post = function(req, res, next) {
    var canvas = req.body.data;
};

exports.post = function(req, res, next){
    File.addFile(res.locals.user.username,req.body.fileName, req.body.fileText)
};


exports.get = function(req, res, next) {
    File.allUsersFile(res.locals.user.username,function(fileNames){
        if (fileNames == "No Link"){
            res.status(404).send("Fuck off!")
        }
        else{
            res.send(fileNames);
        }
    });
};