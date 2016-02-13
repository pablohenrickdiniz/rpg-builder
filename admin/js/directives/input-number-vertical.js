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
