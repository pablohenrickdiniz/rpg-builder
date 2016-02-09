app.directive('adminSidebar',function(){
    return {
        restrict:'E',
        templateUrl:'templates/Elements/admin_sidebar.html',
        replace:true
    };
});

app.directive('adminHeader',function(){
    return {
        restrict:'E',
        templateUrl:'templates/Elements/admin_header.html',
        replace:true
    };
});

app.directive('loginForm',function(){
    return {
        restrict:'E',
        templateUrl:'templates/Elements/login_form.html'
    };
});

app.directive('inputNumberVertical',['$interval','$document','$timeout',function($interval,$document,$timeout){
    return {
        restrict:'A',
        templateUrl:'templates/Elements/input_number_vertical.html',
        scope:{
            min:'@min',
            max:'@max',
            ngChange:'&',
            ngModel:'=',
            ngDisabled:'='
        },
        replace:true,
        link:function(scope){
            scope.interval = null;
            var value = parseInt(scope.ngModel);

            scope.change = function(){
                if(min !== null && min > scope.value){
                    scope.value = min;
                }

                if(max !== null && max < scope.value){
                    scope.value =  max;
                }

                if(scope.ngModel !== undefined){
                    scope.ngModel = scope.value;
                }

                if(typeof scope.ngChange() === 'function'){
                    $timeout(function(){
                        scope.ngChange()(scope.ngModel);
                    });
                }
            };

            if(isNaN(value)){
                scope.value = 0;
            }
            else{
                scope.value = value;
                scope.change();
            }

            var min = isNaN(scope.min)?null:parseFloat(scope.min);
            var max = isNaN(scope.max)?null:parseFloat(scope.max);

            scope.increment = function(){
                if(scope.interval === null){
                    scope.interval = $interval(function(){
                        if(max === null || max >= scope.value+1){
                            scope.value = scope.value+1;
                        }
                    },50);
                }
            };

            scope.decrement = function(){
                if(scope.interval === null){
                    scope.interval = $interval(function(){
                        if(min === null || min <= scope.value-1){
                            scope.value = scope.value-1;
                        }
                    },50);
                }
            };

            scope.stop = function(){
                $interval.cancel(scope.interval);
                scope.interval = null;
                scope.change();
            };

            $document.on('mouseup',function(){
                if(scope.interval !== null){
                    scope.stop();
                }
            });


            scope.$watch('ngModel',function(newVal, oldVal){
                if(newVal !== oldVal){
                    scope.value = newVal;
                }
            });

            scope.change();
        }
    };
}]);


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

app.directive('inputColor',function(){
    return {
        restrict:'A',
        templateUrl:'templates/Elements/input_color.html',
        scope:{
            ngChange:'&',
            value:'@value',
            title:'@title',
            class:'@class'
        },
        replace:true,
        link:function(scope, element){
            var inputColor = element.find('input');
            inputColor.on('change',function(e){
                scope.value = e.target.value;
                scope.change();
            });

            scope.change = function(){
                console.log(scope.value);
                scope.ngChange()(scope.value);
            };
        }
    };
});

app.directive('framePlayer',['$timeout',function($timeout){
    return {
        restrict:'E',
        templateUrl:'templates/Elements/frame_player.html',
        scope:{
            title:'@title',
            ngAdd:'&',
            ngSelect:'&',
            ngRemove:'&',
            playCallback:'&',
            pauseCallback:'&',
            stopCallback:'&'
        },
        link:function(scope){
            scope.frames = [];
            scope.selected = null;
            scope.add = function(){
                scope.frames.push(scope.frames.length);
                scope.selected = scope.frames.length-1;
                $timeout(function(){
                    scope.ngAdd()(scope.selected);
                });
            };

            scope.remove = function(index){
                scope.frames.splice(index,1);
                scope.ngRemove()(index);
            };

            scope.select = function(index){
                var frame = scope.frames[index];
                scope.selected = index;
                scope.ngSelect()(index);
            };

            scope.play = function(){
                if(typeof scope.playCallback() === 'function'){
                    scope.playCallback()();
                }
            };

            scope.pause = function(){
                if(typeof scope.pauseCallback() === 'function'){
                    scope.pauseCallback()();
                }
            };

            scope.stop = function(){
                if(typeof scope.stopCallback() === 'function'){
                    scope.stopCallback()();
                }
            };
        }
    };
}]);

app.directive('canvasContainer',['$timeout',function($timeout){
    return {
        restrict:'E',
        templateUrl:'templates/Elements/canvas_container.html',
        scope:{
            engine:'=',
            ngInitialize:'&',
            refresh:'=',
            gridWidth:'=',
            gridHeight:'=',
            gridActive:'='
        },
        link:function(scope, element){
            var self = this;
            var grid_width = parseInt(scope.gridWidth);
            var grid_height = parseInt(scope.gridHeight);
            grid_width = isNaN(grid_width)?32:grid_width;
            grid_height = isNaN(grid_height)?32:grid_height;
            scope.gridWidth = grid_width;
            scope.gridHeight = grid_height;


            scope.init = function(){
                scope.ngInitialize()();
            };

            scope.$watch('engine.layers.length',function(newValue,oldValue){
                $timeout(function(){
                    if(oldValue !== newValue){
                        scope.refresh();
                    }
                });
            },true);


            scope.refresh = function(){
                scope.engine.clearAllLayers();
                var canvas = element.find('canvas');

                for(var i = 0; i < canvas.length;i++){
                    var layer = scope.engine.getLayer(i);
                    layer.context = null;
                    layer.element = canvas[i];
                }

                scope.engine.updateGrid({
                    width:scope.engine.width,
                    height:scope.engine.height,
                    sw:scope.gridWidth,
                    sh:scope.gridHeight,
                    opacity:scope.gridActive?0.1:0
                });

                scope.engine.layers.forEach(function(layer,index){
                    if(!(layer instanceof CE.GridLayer)){
                        self.redrawLayer(index);
                    }
                });
            };


            self.redrawLayer = function(index){
                var layer = scope.engine.getLayer(index);
                if(layer !== null && layer instanceof CE.ObjectLayer){
                    layer.clear();
                    layer.objects.forEach(function(object){
                        layer.image(object);
                    });
                }
            };

            scope.$watchGroup(['gridWidth','gridHeight'],function(newValues, oldValues){
                if(newValues[0] !== oldValues[0] || newValues[1] !== oldValues[1]){
                    var sw = newValues[0];
                    var sh = newValues[1];
                    scope.engine.updateGrid({
                        width:scope.engine.width,
                        height:scope.engine.height,
                        sw:sw,
                        sh:sh,
                        opacity:0.1
                    });
                }
            });

            scope.$watch('gridActive',function(newVal, oldVal){
                if(newVal !== oldVal){
                    scope.engine.updateGrid({
                        opacity:newVal?0.1:0
                    });
                }
            });
        }
    };
}]);

app.directive('progressBar',function(){
    return {
        restrict:'E',
        templateUrl:'templates/Elements/progress_bar.html',
        replace:true,
        scope:{
            progress:'=progress'
        }
    };
});