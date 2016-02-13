app.directive('inputImagePreview',['ImageLoader','UploadService',function(ImageLoader,UploadService){
    return {
        restrict:'A',
        templateUrl:'templates/Elements/input_image_preview.html',
        scope:{
            title:'@title',
            multiple:'@multiple',
            url:'@url',
            afterEach:'&'
        },
        replace:true,
        link:function(scope, element,attrs){
            var inputFile = element.find('input');
            var allowedExtensions = [
                'image/png',
                'image/jpeg',
                'image/gif'
            ];
            var self = this;

            scope.files = scope.files === undefined?[]:scope.files;
            scope.images = scope.images === undefined?[]:scope.images;
            scope.sending = false;
            scope.count = 0;
            inputFile.on('change',function(e){
                if(!scope.sending){
                    scope.files = [];
                    var files = e.target.files;
                    var imageFiles = [];
                    var URL =  window.URL || window.webkitURL;
                    var urls = [];
                    for(var i = 0; i < files.length;i++){
                        if(allowedExtensions.indexOf(files[i].type) !== -1){
                            scope.files.push(files[i]);
                            var url = URL.createObjectURL(files[i]);
                            urls.push(url);
                        }
                    }

                    ImageLoader.loadAll(urls,function(loaded){
                        loaded.forEach(function(img,index){
                            imageFiles.push({
                                url:img.src,
                                name:scope.files[index].name,
                                state:null,
                                width:img.width,
                                height:img.height
                            });
                        });
                        scope.images = imageFiles;
                        scope.$apply();
                    });
                }
            });

            scope.sendFiles = function(){
                var files = scope.files;
                if(scope.onStart){
                    scope.onStart()();
                }
                scope.sending = true;
                self.upload(files);
            };

            self.upload = function(files){
                scope.count = 0;
                files.forEach(function(file,index){
                    var img = scope.images[index];
                    var fields = {
                        file:file,
                        width:img.width,
                        height:img.height,
                        created:new Date()
                    };
                    UploadService.queue({
                        fields:fields,
                        url:scope.url,
                        success:function(data){
                            scope.images[index].state = true;
                            scope.afterEach()(data);
                            scope.count++;
                            if(scope.count >= files.length){
                                scope.sending = false;
                                scope.count = 0;
                            }
                        },
                        error:function(data){
                            scope.images[index].state = false;
                            scope.afterEach(data);
                            scope.count++;
                            if(scope.count >= files.length){
                                scope.sending = false;
                                scope.count = 0;
                            }
                        }
                    });
                });
            };
        }
    };
}]);