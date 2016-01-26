var v1 = angular.module('brainApp.view1');

v1.directive("sourcefilesDirective", ['SourceService', function(SourceService) {
    return {
        restrict : "AE",
        template:
        '<li>' +
            '<h6>{{file.stats.name}}</h6>' +
            '<span>' +
                //'<img ng-src="{{image.URL}}" ng-click="select(file)" style="max-width: 220px; max-height: 100px;"/>' +
                '<button ng-click="remove(file)" class="btn btn-default">X</button>' +
            '</span>' +
        '</li>',

        link: function(scope, elem) {}
    }
}]);

v1.controller("SourceFileListController", function($scope, SourceService) {
    $scope.sourceFiles = SourceService.sourceFiles;
    $scope.remove = function(file) {
        $scope.sourceFiles.splice($scope.sourceFiles.indexOf(file), 1);
        if ($scope.sourceFiles.length == 0) {
            //$scope.init_image();
            console.log('LIST IS EMPTY');
        }
    };
    $scope.select = function(file) {
        SourceService.file = $scope.sourceFiles[$scope.sourceFiles.indexOf(file)].file;
        //$scope.init_image(true);
    };
});