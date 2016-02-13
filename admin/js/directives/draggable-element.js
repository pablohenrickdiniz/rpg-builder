app.directive('draggableElement',['$document',function($document){
    return {
        restrict : 'A',
        scope:{
            ngParent:'@'
        },
        link:function(scope, element){
            var self = this;
            scope.mouse_down = false;
            self.min = {
                left:0,
                top:0
            };

            if(scope.ngParent !== undefined){
                scope.ngParent = $document.find(scope.ngParent);
                if(scope.ngParent.length === 1){
                    scope.min = scope.ngParent.offset();
                }
            }

            element.on('mousedown',function(e){
                scope.mouse_down = true;
                self.start_element = element.offset();
                self.start_mouse = {
                    x:e.originalEvent.pageX,
                    y:e.originalEvent.pageY
                };
            });

            var document = angular.element($document);


            document.on('contextmenu',function(){
                scope.mouse_down = false;
            });

            document.on('mouseup',function(){
                scope.mouse_down = false;
            });

            document.on('mousemove',function(e){
                e.preventDefault();
                if(scope.mouse_down){
                    var new_mouse = {
                        x:e.originalEvent.pageX,
                        y:e.originalEvent.pageY
                    };
                    var diff = {
                        x:e.originalEvent.pageX-self.start_mouse.x,
                        y:e.originalEvent.pageY-self.start_mouse.y
                    };



                    var left = Math.max(self.start_element.left+diff.x,scope.min.left);
                    var top =  Math.max(self.start_element.top+diff.y,scope.min.top);


                    element.css({
                        left:left,
                        top:top
                    });
                }
                return false;
            });

            element.css({
                zIndex:3
            });
        }
    };
}]);