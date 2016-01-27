'use strict';

var v1 = angular.module('brainApp.view1',[
    'infinite-scroll']);

v1.controller('View1Controller', function($http, $scope, SourceService) {
    console.log("Controller scope", SourceService.sourceFiles);
   // $scope.file = SourceService.file;


    $scope.save = function() {
        console.log('Значение до записи', SourceService.file);
        SourceService.file.text = $('#edit_source').val();
        console.log('Значение после записи', SourceService.file);
        $http.post('/files', {fileName: SourceService.file.stats.name, fileText: SourceService.file.text});
    };

    $scope.delete = function(file) {
        $http.delete('/files', {fileName: file.stats.name, fileText: file.text});
    };

    console.log("time1");
    console.log("Controller scope", SourceService.sourceFiles[0]);
    $scope.loadMore = load;
    console.log($scope.loadMore);
    $scope.lines = lines;
    console.log($scope.lines);
});