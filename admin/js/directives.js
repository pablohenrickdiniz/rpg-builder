app.directive('adminSidebar',function(){
    return {
        restrict:'E',
        templateUrl:'templates/Elements/admin_sidebar.html'
    };
});

app.directive('adminHeader',function(){
    return {
        restrict:'E',
        templateUrl:'templates/Elements/admin_header.html'
    };
});

app.directive('loginForm',function(){
    return {
        restrict:'E',
        templateUrl:'templates/Elements/login_form.html'
    };
});

app.directive('inputNumberVertical',['$interval','$document',function($interval,$document){
    return {
        restrict:'A',
        templateUrl:'templates/Elements/input_number_vertical.html',
        scope:{
            min:'@min',
            max:'@max',
            ngChange:'&'
        },
        replace:true,
        link:function(scope){
            scope.value = 0;
            scope.interval = null;

            var min = isNaN(scope.min)?null:parseFloat(scope.min);
            var max = isNaN(scope.max)?null:parseFloat(scope.max);

            scope.change = function(){
                if(min !== null && min > scope.value){
                    scope.value = min;
                }

                if(max !== null && max < scope.value){
                    scope.value =  max;
                }
                scope.ngChange()(scope.value);
            };

            scope.increment = function(){
                if(scope.interval === null){
                    scope.interval = $interval(function(){
                        if(max === null || max >= scope.value+1){
                            scope.value = scope.value+1;
                        }
                        scope.change();
                    },50);
                }
            };

            scope.decrement = function(){
                if(scope.interval === null){
                    scope.interval = $interval(function(){
                        if(min === null || min <= scope.value-1){
                            scope.value = scope.value-1;
                        }
                        scope.change();
                    },50);
                }
            };

            scope.stop = function(){
                $interval.cancel(scope.interval);
                scope.interval = null;
            };

            $document.on('mouseup',function(){
                scope.stop();
            });


            scope.change();
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
            value:'@value'
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

app.directive('framePlayer',function(){
    return {
        restrict:'E',
        templateUrl:'templates/Elements/frame_player.html',
        scope:{
            title:'@title',
            ngAdd:'&',
            ngSelect:'&',
            ngRemove:'&'
        },
        link:function(scope){
            scope.frames = [];
            scope.selected = null;
            scope.add = function(){
                var frame =  scope.ngAdd()();
                scope.frames.push(frame);
                scope.selected = scope.frames.length-1;
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
        }
    };
});

app.directive('animationCanvas',function(){
    return {
        restrict:'E',
        templateUrl:'templates/Elements/animation_canvas.html',
        scope:{
            data:'=data'
        },
        link:function(scope, element){
            scope.initializeCanvas = function(index){
                var canvas = element.find('canvas[data-type=default]')[index];
                scope.data.functions.addElement(canvas);
            };
        }
    };
});