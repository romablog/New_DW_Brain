var v1 = angular.module('brainApp.view1');

v1.directive("dropDirective", ['$http', 'SourceService', function($http, SourceService) {
    return {
        restrict : "AE",
        link: function (scope, elem) {

            elem.bind('dragenter', function(event) {
                elem.textContent = '';
                event.stopPropagation();
                event.preventDefault();
            });
            elem.bind('dragover', function(event) {
                event.stopPropagation();
                event.preventDefault();
            });
            elem.bind('drop', function(event) {

                event.stopPropagation();
                event.preventDefault();
                var filesToSend = [{}];
                var dt = event.dataTransfer || (event.originalEvent && event.originalEvent.dataTransfer);
                var files = event.target.files || (dt && dt.files);
                console.log('FILES', files, files[0], files.length);
                for(var i = 0; i < files.length; i++) {
                    var reader = new FileReader();
                    reader.onload = (function(theFile) {
                        return function(e) {
                            var newFile = { name : theFile.name,
                                type : theFile.type,
                                size : theFile.size,
                                lastModifiedDate : theFile.lastModifiedDate
                            };

                            SourceService.sourceFiles.push({
                                stats: newFile,
                                text: e.target.result
                            });
                            scope.$apply();
                            console.log(newFile.name, e.target.result);
                            $http.post('/files', {fileName: newFile.name, fileText: e.target.result});
                           /* filesToSend.push({
                                fileName: newFile.name,
                                fileText: e.target.result
                            });*/
                        };
                    })(files[i]);
                    reader.readAsText(files[i]);

                    //console.log("Processed", files[i]);
                }

//                console.log('sendinf', filesToSend.length);

                SourceService.file = files[files.length - 1];
            });
        }
    }
}]);