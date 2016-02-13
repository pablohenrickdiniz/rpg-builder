app.directive('resourceMiniature',['$window',function($window){
    return {
        restrict:'E',
        templateUrl:'templates/Elements/resource_miniature.html',
        replace:true,
        scope:{
            ngAction:'&',
            image:'=',
            rects:'=',
            gridColor:'='
        },
        link:function(scope, element){
            scope.click = function(){
                if(typeof scope.ngAction() === 'function'){
                    scope.ngAction()();
                }
            };

            scope.image_width = 0;
            scope.image_height = 0;
            scope.image_element =  null;

            scope.refresh = function(){
                if(scope.image_element === null){
                    var image =  element.find('img');
                    if(image !== undefined){
                        scope.image_element = image;
                        angular.element(image).on('load',function(){
                            scope.refresh();
                        });
                    }
                }
                else{
                    scope.image_width = scope.image_element.width();
                    scope.image_height = scope.image_element.height();
                }
            };
            angular.element($window).on('resize',scope.refresh);
            scope.refresh();

        }
    };
}]);