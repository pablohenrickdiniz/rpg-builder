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
        link:function(scope,element){
            scope.interval = null;
            scope.value = parseInt(scope.ngModel);

            scope.change = function(){
                if(isNaN(scope.value)){
                    scope.value = 0;
                }


                if(min !== null && min > scope.value){
                    scope.value = min;
                }

                if(max !== null && max < scope.value){
                    scope.value =  max;
                }

                    scope.ngModel = scope.value;


                if(typeof scope.ngChange() === 'function'){
                    $timeout(function(){
                        scope.ngChange()(scope.ngModel);
                    });
                }
            };


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


            element.find('input').on('change',function(){
                scope.value = parseInt(this.value);
                scope.change();
            });
        }
    };
}]);
