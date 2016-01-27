var File = require('../models/file').File;

exports.post = function(req, res, next){
    File.addFile(res.locals.user.username,req.body.fileName, req.body.fileText);
};


exports.get = function(req, res, next) {
    File.allUsersFiles(res.locals.user.username,function(records){
        if (records == "No Link"){
            res.status(404).send("Fuck off!");
        }
        else{
            res.send({files: records});
        }
    });
};

exports.delete = function(req, res, next) {
    File.deleteFile(res.locals.user.username, req.body.fileName, function(records){
        if (records == "No Link"){
            res.status(404).send("Fuck off!");
        }
    });
};