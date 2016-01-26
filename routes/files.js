var File = require('../models/file').File;

exports.post = function(req, res, next){
    File.addFile(res.locals.user.username,req.body.fileName, req.body.fileText);
};


exports.get = function(req, res, next) {
    File.allUsersFile(res.locals.user.username,function(fileNames){
        if (fileNames == "No Link"){
            res.status(404).send("Fuck off!");
        }
        else{
            res.send(fileNames);
        }
    });
};
/*exports.get = function(req, res, next) {
    File.addFile("my","check save3", "Just for work", function(){
        console.log("file added function work correctly");
        res.send("ok");
    });

    //File.allUsersFile(res.locals.user.username,function(p_link){
    //    if (p_link == "No Link"){
    //        res.status(404).send("Fuck off!")
    //    }
    //    else{
    //        res.send(p_link);
    //    }
    //});
};*/