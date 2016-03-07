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

                var gridLayer =   scope.engine.getGridLayer();

                gridLayer.getGrid().set({
                    width:scope.engine.width,
                    height:scope.engine.height,
                    sw:scope.gridWidth,
                    sh:scope.gridHeight
                });
                gridLayer.set({
                    opacity:scope.gridActive?0.1:0
                });

                gridLayer.refresh();

                scope.engine.layers.forEach(function(layer,index){
                    if(!(layer instanceof CE.EXT.GridLayer)){
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
                    var layer = scope.engine.getGridLayer();
                    layer.getGrid().set({
                        width:scope.engine.width,
                        height:scope.engine.height,
                        sw:sw,
                        sh:sh
                    });
                    layer.set({
                        opacity:0.1
                    });
                    layer.refresh();
                }
            });

            scope.$watch('gridActive',function(newVal, oldVal){
                if(newVal !== oldVal){
                    var layer = scope.engine.getGridLayer();
                    layer.set({
                        opacity:newVal?0.1:0
                    });
                    layer.refresh();
                }
            });
        }
    };
}]);