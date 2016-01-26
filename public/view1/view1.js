'use strict';

var v1 = angular.module('brainApp.view1',[]);

v1.controller('View1Controller', function($scope, SourceService) {
    console.log("Controller scope", SourceService.sourceFiles[0]);

    console.log("time1");
});