var async = require('async');
var util = require('util');

var mongoose = require('../libs/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    username: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    fileText: {
        type: String,
   //     required: true
    }
});

schema.statics.allUsersFiles = function(username, callback) {
    var File = this;
    async.waterfall([
        function(callback) {
            File.find({username: username}, callback);
        },
        function(recordsByUser, callback) {
            if (recordsByUser) {
                callback(recordsByUser);
            } else {
                callback("No Text");
            }
        }
    ], callback);
};

schema.statics.addFile = function(username, fileName, fileText, callback) {
    var File = this;
    async.waterfall([
        function(callback) {
            File.findOne({username: username, fileName: fileName}, callback);
        },
        function(file, callback) {
                if (file) {
                File.remove(file, callback);
            }
            var newFile = new File({username: username, fileName: fileName, fileText: fileText});
            newFile.save(callback);
        }
    ], callback);
};

schema.statics.deleteFile = function(username, fileName, callback) {
    var File = this;
    async.waterfall([
        function(callback) {
            console.log({username: username, fileName: fileName});
            File.findOne({username: username, fileName: fileName}, callback);
        },
        function(file, callback) {
            if (file)
                File.remove(file, callback);
        }
    ], callback);
};

schema.statics.renameFile = function(username, newFileName, oldFileName, callback){
    var File = this;
    async.waterfall([
        function(callback) {
            File.findOne({username: username, fileName: oldFileName}, callback);
        },
        function(file, callback) {
            if (file){
                var newFile = new File({username: username, fileName: newFileName, fileText: file.fileText});
                File.remove(file, callback);
                newFile.save(callback);
            }
        }
    ], callback);
};


exports.File = mongoose.model('File', schema);