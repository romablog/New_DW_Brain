'use strict';

var v1 = angular.module('brainApp.view1',[
    'infinite-scroll']);

v1.controller('View1Controller', function($scope, SourceService) {
    console.log("Controller scope", SourceService.sourceFiles[0]);
    $scope.loadMore = load;
    console.log($scope.loadMore);
    $scope.lines = lines;
    console.log($scope.lines);
});