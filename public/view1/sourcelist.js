var v1 = angular.module('brainApp.view1');

v1.directive("sourcefilesDirective", ['SourceService', function(SourceService) {
    return {
        restrict : "AE",
        template:
        '<li>' +
        '<h6>{{file.stats.name}}</h6>' +
        '<span>' +
        '<img ng-src="http://www.thecompliancecenter.com/img-prod/labels/fullsize-images/pictograms/flammable_lg1.jpg" ng-click="select(file)" style="max-width: 220px; max-height: 100px;"/>' +
        '<button ng-click="remove(file)" class="btn btn-default">X</button>' +
        '</span>' +
        '</li>',

        link: function(scope, elem) {

            scope.select = function(file) {
                console.log(scope.getCurrentElement());
                if(scope.getCurrentElement() != 0) {
                    console.log('PREV');
                    scope.getCurrentElement().find('img').css('border-width', '0px');
                }
                elem.find('img').css('border-style', 'solid');
                elem.find('img').css('border-width', '10px');
                elem.find('img').css('border-color', '#483D8B');

                SourceService.file = file.file;
                scope.setCurrentElement(elem);

            };

        }
    }
}]);

v1.controller("SourceFileListController", function($scope, SourceService) {
    $scope.currentElem = 0;
    $scope.getCurrentElement = function () {
        return $scope.currentElem;
    };
    $scope.setCurrentElement = function(element) {
        $scope.currentElem = element;
    };
    $scope.sourceFiles = SourceService.sourceFiles;
    $scope.remove = function(file) {
        $scope.sourceFiles.splice($scope.sourceFiles.indexOf(file), 1);
        if ($scope.sourceFiles.length == 0) {
            //$scope.init_image();
            console.log('LIST IS EMPTY');
        }
    };
    /*
     $scope.select = function(file) {
     var currentFile =
     SourceService.file = $scope.sourceFiles[$scope.sourceFiles.indexOf(file)].file;
     //$scope.init_image(true);
     };*/
});