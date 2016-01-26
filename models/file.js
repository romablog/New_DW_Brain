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
        required: true
    }
});

schema.statics.allUsersFile = function(username, callback) {
    var File = this;
    async.waterfall([
        function(callback) {
            File.find({username: username}, callback);
        },
        function(recordsByUser, callback) {
            if (recordsByUser) {
                 var fileNames = recordsByUser.map(function(record){
                     return record.fileName;
                 });
                callback(fileNames);
            } else {
                callback("No Text");
            }
        }
    ], callback);
};

schema.statics.findFile = function(username, fileName, callback) {
    var File = this;
    async.waterfall([
        function(callback) {
            File.findOne({username: username, fileName: fileName}, callback);
        },
        function(file, callback) {
            if (file) {
                callback(file.fileText);
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
            console.log("hello i am here,", username, fileName, fileText);
            File.findOne({username: username, fileName: fileName}, callback);
        },
        function(file, callback) {
            if (file) {
                console.log("file in system");
                File.remove(file, callback);
            }
            console.log("no file in system");

            var newFile = new File({username: username, fileName: fileName, fileText: fileText});
            console.log(newFile);
            newFile.save(callback);
            console.log("saved")
        }
    ], callback);
};

exports.File = mongoose.model('File', schema);