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

//schema.statics.findFile = function(username, fileName, callback) {
//    var File = this;
//    async.waterfall([
//        function(callback) {
//            File.findOne({username: username, fileName: fileName}, callback);
//        },
//        function(file, callback) {
//            if (file) {
//                callback(file.fileText);
//            } else {
//                callback("No Text");
//            }
//        }
//    ], callback);
//};

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

exports.File = mongoose.model('File', schema);