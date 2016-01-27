var v1 = angular.module('brainApp.view1');

v1.directive("sourcefilesDirective", ['$http', 'SourceService', function($http, SourceService) {
    return {
        restrict : "AE",
        template:
        '<li>' +
            '<h6>{{file.stats.name}}</h6>' +
            '<span>' +
                '<img height="50px" width="50px" ng-src="http://www.thecompliancecenter.com/img-prod/labels/fullsize-images/pictograms/flammable_lg1.jpg" ng-click="select(file)" style="max-width: 220px; max-height: 100px;"/>' +
                '<button ng-click="remove(file)" class="btn btn-default">X</button>' +
            '</span>' +
        '</li>',

        link: function(scope, elem) {

            scope.select = function(file) {
                console.log('before SELECT', SourceService.file);
                elem.find('img').css('border-style', 'solid');
                elem.find('img').css('border-width', '10px');
                elem.find('img').css('border-color', '#483D8B');

                SourceService.file = file;
               // console.log(scope.file === file);
               // console.log(scope.getCurrentElement());
                if(scope.getCurrentElement() === elem) {
                    console.log('PREV');
                    //scope.getCurrentElement().find('img').css('border-width', '0px');
                    return;
                }
                if(scope.getCurrentElement() !=0) {
                    console.log('PREV');
                    scope.getCurrentElement().find('img').css('border-width', '0px');
                }

                scope.setCurrentElement(elem);
                //console.log($('#edit_source'));
                $('#edit_source').val(SourceService.file.text);
              //  $('#edit_source').text('1');
                console.log('after SELECT', SourceService.file);
               // $('#edit_source').value = SourceService.file.text;


            };
        }
    }
}]);

v1.controller("SourceFileListController", function($http, $scope, SourceService) {
    $scope.currentElem = 0;
    $scope.getCurrentElement = function () {
        return $scope.currentElem;
    };
    $scope.setCurrentElement = function(element) {
        $scope.currentElem = element;
    };



    $scope.remove = function(file) {
        $scope.sourceFiles.splice($scope.sourceFiles.indexOf(file), 1);
        if ($scope.sourceFiles.length == 0) {
            console.log('LIST IS EMPTY');
        }
        $scope.delete(file);
    };



    $http.get('/files').then(function(response) {
        SourceService.sourceFiles = response.data.files.map(function(file){
            return {stats: {name: file.fileName}, text: file.fileText}
        });
       //
        // console.log('RESP', response.data.files, response);
        $scope.sourceFiles = SourceService.sourceFiles;
       // $scope.select($scope.sourceFiles[0]);
    }, function() {
        console.log("MEAN THINGS");
    });
    /*
     $scope.select = function(file) {
     var currentFile =
     SourceService.file = $scope.sourceFiles[$scope.sourceFiles.indexOf(file)].file;
     //$scope.init_image(true);
     };*/
});