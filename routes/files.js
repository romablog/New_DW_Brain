var File = require('../models/file').File;
exports.post = function(req, res, next) {
    var canvas = req.body.data;
};

exports.post = function(req, res, next){
    var files = req.body.files;
    console.log('FILES', files);
    //console.log(res.locals.user.username,req.body.files[0].fileName, req.body.files[0].fileText);
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