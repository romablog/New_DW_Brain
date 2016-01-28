var v1 = angular.module('brainApp.view1');

v1.directive("sourcefilesDirective", ['$http', 'SourceService', function($http, SourceService) {
    return {
        restrict : "AE",
        template:
        '<li>' + '<style> .selected { opacity : 0.7 ; }</style>' +
            '<button  ng-dblclick="rename(file)" ng-click="select(file);" ng-disabled="is_debug" class="btn btn-default btn-xs" style="margin: 10px 5px 0px 10px">{{file.stats.name}}</button><br>'+
            '<span>' +
            //    '<img  style="margin: 0px 0px 10px 10px" height="40px" width="40px" ng-class="{selected : isSelected($index)}" ng-src="http://www.thecompliancecenter.com/img-prod/labels/fullsize-images/pictograms/flammable_lg1.jpg" ng-click="selectFile($index);select(file)" style="max-width: 220px; max-height: 100px;"/>' +
                //'<button ng-click="rename(file);"  ng-disabled="is_debug" class="btn btn-default btn-xs btn-danger">ren</button>' +
            '</span>' +
        '</li>',

        link: function(scope, elem) {

            scope.select = function(file) {
                console.log('before SELECT', SourceService.file);
                SourceService.file = file;

                $('#edit_source').val(SourceService.file.text);
              //  $('#edit_source').text('1');
                console.log('after SELECT', SourceService.file);
               // $('#edit_source').value = SourceService.file.text;
            };

        }
    }
}]);

v1.controller("SourceFileListController", function($http, $scope, SourceService) {
    $scope.selected = Number.MAX_VALUE;
    $scope.selectFile = function(selected) {
        console.log(selected);
        $scope.selected = selected;
    };
    $scope.isSelected = function(selected) {
        return $scope.selected == selected;
    };

    $scope.remove = function(file) {
        $scope.sourceFiles.splice($scope.sourceFiles.indexOf(file), 1);
        if ($scope.sourceFiles.length == 0) {
            console.log('LIST IS EMPTY');
        }
        $scope.delete(file);
    };
    $scope.rename = function(file) {
        console.log('RENAME');
        var newName = window.prompt("Введите новое имя", file.stats.name);
        if (newName) {
            console.log(newName);
            console.log('RENAME PROM');

            $http.post('/rename', {new: newName, old: file.stats.name});
            file.stats.name = newName;
        }
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