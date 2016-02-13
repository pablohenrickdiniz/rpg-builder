app.directive('inputImage',function(){
    return {
        restrict:'A',
        templateUrl:'templates/Elements/input_image.html',
        scope:{
            title:'@title',
            multiple:'@multiple',
            ngAdd:'&'
        },
        replace:true,
        link:function(scope, element,attrs){
            var inputFile = element.find('input');
            var allowedExtensions = [
                'image/png',
                'image/jpeg',
                'image/gif'
            ];

            scope.files = [];
            scope.select = function(){
                inputFile[0].click();
            };

            inputFile.on('change',function(e){
                var files = e.target.files;
                var imageFiles = [];
                var URL =  window.URL || window.webkitURL;
                for(var i = 0; i < files.length;i++){
                    if(allowedExtensions.indexOf(files[i].type) !== -1){
                        var url = URL.createObjectURL(files[i]);
                        imageFiles.push({
                            url:url,
                            name:files[i].name
                        });
                    }
                }
                scope.files = imageFiles;
                scope.$apply();
            });

            scope.addImages = function(){
                scope.ngAdd()(scope.files);
                scope.files = [];
            };
        }
    };
});