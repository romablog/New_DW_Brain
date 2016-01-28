var File = require('../models/file').File;

exports.post = function(req, res, next){
    File.renameFile(res.locals.user.username,req.body.old, req.body.new);
};
