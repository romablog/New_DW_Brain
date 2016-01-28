'use strict';

var v1 = angular.module('brainApp.view1',[
    'infinite-scroll']);

v1.controller('View1Controller', function($http, $interval, $scope, SourceService) {
    console.log("Controller scope", SourceService.sourceFiles);
   // $scope.file = SourceService.file;
    $scope.isAtInstruction = function(i) {
        return i == g_ip;
    };
    $scope.getInstruction = function() {return g_ip};
    $scope.getMemory = function() {return g_mp};
    $scope.$watch(function() {return g_ip}, function(n) {
        $('#edit_source')[0].selectionStart = n-1;
        $('#edit_source')[0].selectionEnd = n;
    });
    $scope.memory = g_memory;
    $scope.new = function() {
        var date = new Date();
        var newFile = {
            stats: {
                name: date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
            },
            text : $('#edit_source').val()
        };
        SourceService.sourceFiles.push(newFile);
        SourceService.file = newFile;
        console.log('SENDING', {fileName: SourceService.file.stats.name, fileText: SourceService.file.text});
        $http.post('/files', {fileName: SourceService.file.stats.name, fileText: SourceService.file.text});
    };
    $scope.save = function() {
        console.log('Значение до записи', SourceService.file);
        SourceService.file.text = $('#edit_source').val();
        console.log('Значение после записи', SourceService.file);
        $http.post('/files', {fileName: SourceService.file.stats.name, fileText: SourceService.file.text});
    };

    $scope.delete = function(file) {
        $http.delete('/files', {fileName: file.stats.name, fileText: file.text});
    };


    console.log("Controller scope", SourceService.sourceFiles[0]);
    $scope.loadMore = load;
    $scope.lines = lines;
    $interval(function(){},100);

    $scope.tochar = function(int) {
        if(int <32 || int > 127)
            return '.';
        return String.fromCharCode(int);
    };
});