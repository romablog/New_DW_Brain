var v1 = angular.module('brainApp.view1');

v1.directive("dropDirective", ['SourceService', function(SourceService) {
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
                                file: theFile
                            });
                            scope.$apply();
                        };
                    })(files[i]);
                    reader.readAsArrayBuffer(files[i]);


                    //console.log("Processed", files[i]);
                }
                SourceService.file = files[files.length - 1];
            });
        }
    }
}]);