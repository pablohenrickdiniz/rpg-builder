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