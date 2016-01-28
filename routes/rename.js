var File = require('../models/file').File;

exports.post = function(req, res, next){
    console.log(res.locals.user.username,req.body.old, req.body.new);
    File.renameFile(res.locals.user.username,req.body.old, req.body.new);
};
