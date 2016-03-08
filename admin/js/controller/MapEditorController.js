app.controller('MapEditorController',['$location','$rootScope','$localStorage','ImageLoader','$timeout',function($location,$scope,$storage,ImageLoader,$timeout){
    var self = this;
    self.mapCanvas = null;
    self.tilesetCanvas = null;
    self.tilesetLayer = null;
    self.selectedInterval = null;
    self.map = null;

    $scope.currentLayer = 0;
    $scope.layers = [];
    $scope.storage = $storage;
    $scope.grid = {
        width:32,
        height:32,
        active:true
    };

    $scope.graphic = {
        gridColor:'#FFFFFF'
    };

    $scope.tilesetData = {
        graphic:{
            gridColor:'#FFFFFF',
            rows:1,
            cols:1,
            imageData:{
                url:''
            },
            image:null
        }
    };
    $scope.selectedTool = 'pencil';


    $scope.modalVisible = false;

    $scope.showModal = function(){
        $scope.modalVisible = true;
    };

    $scope.hideModal = function(){
        $scope.modalVisible = false;
    };

    $scope.init = function(){
        $scope.page.title = 'Editor de Mapas';
        $scope.initController();
    };

    $scope.initController = function(){
        var mapCanvas = self.getMapCanvas();
        var tilesetCanvas = self.getTilesetCanvas();
        var grid = new CE.EXT.AbstractGrid({
            sw:32,
            sh:32
        });

        var layer = mapCanvas.getGridLayer();
        layer.setGrid(grid);
        layer.set({
            opacity:0.3
        });
        layer.refresh();

        self.tilesetLayer = tilesetCanvas.createLayer({
            name:'tileset-layer'
        });

        layer = tilesetCanvas.getGridLayer();
        layer.set({
            opacity:0.8
        });

        layer.refresh();
        for(var i = 0; i < 10;i++){
            $scope.layers[i] = mapCanvas.createLayer();
        }

        mapCanvas.getMouseReader().onmousemove(function(){
            var reader = this;
            if(reader.right){
                var gridLayer =  mapCanvas.getGridLayer();
                gridLayer.refresh();
                self.getMap().draw($scope.layers,gridLayer.getVisibleArea());
            }
        });
    };

    $scope.changeGraphic = function(url){
        $scope.modalVisible = false;
        $scope.tilesetData.graphic.imageData.url = url;
    };

    $scope.changeMapWidth = function(width){
        var mapCanvas = self.getMapCanvas();
        var map  = self.getMap();
        map.width = width;
        mapCanvas.applyToLayers({
            width:map.tile_w*width
        });
        var gridLayer = mapCanvas.getGridLayer();
        gridLayer.getGrid().set({
            width:map.tile_w*width
        });
        gridLayer.refresh();
        map.draw($scope.layers,gridLayer.getVisibleArea());
    };

    $scope.changeMapHeight = function(height){
        var mapCanvas = self.getMapCanvas();
        var map = self.getMap();
        map.height = height;
        mapCanvas.applyToLayers({
            height:map.tile_h*height
        });

        var gridLayer = mapCanvas.getGridLayer();
        gridLayer.getGrid().set({
            height:map.tile_h*height
        });
        gridLayer.refresh();
        map.draw($scope.layers,gridLayer.getVisibleArea());
    };

    $scope.$watch('tilesetData.graphic.imageData.url',function(newVal, oldVal){
        $timeout(function(){
            if(newVal !== oldVal && self.tilesetLayer !== null){
                ImageLoader.load(newVal,function(img){
                    $scope.tilesetData.graphic.image = img;
                    var tilesetImage = self.getTilesetCanvas();

                    tilesetImage.set({
                        viewX:0,
                        viewY:0
                    });

                    tilesetImage.applyToLayers({
                        width:img.width,
                        height:img.height
                    });

                    self.tilesetLayer.clear().drawImage(img,0,0);
                    var tilesetGridLayer =  tilesetImage.getGridLayer();


                    tilesetGridLayer.getGrid().set({
                        width:img.width,
                        height:img.height,
                        sw:img.width,
                        sh:img.height
                    });
                    tilesetGridLayer.refresh();

                    $timeout(function(){
                        var rows = Math.floor(img.height/32);
                        var cols = Math.floor(img.width/32);
                        rows = rows < 1?1:rows;
                        cols = cols < 1?1:cols;
                        $scope.tilesetData.graphic.rows = rows;
                        $scope.tilesetData.graphic.cols = cols;
                        $scope.changeRows(rows);
                        $scope.changeCols(cols);
                    });

                });

            }
        });
    });

    $scope.changeRows = function(val){
        var image = $scope.tilesetData.graphic.image;
        if(image !== null){
            var layer = self.getTilesetCanvas().getGridLayer();
            layer.getGrid().set({
                sh:image.height/val
            });
            layer.refresh();
        }
    };

    $scope.changeCols = function(val){
        var image = $scope.tilesetData.graphic.image;
        if(image !== null){
            var layer = self.getTilesetCanvas().getGridLayer();
            layer.getGrid().set({
                sw:image.width/val
            });
            layer.refresh();
        }
    };

    $scope.changeLayer = function(layer){
        $scope.currentLayer = layer;
        $scope.layers.forEach(function(layer_tmp,index){
            if(index === layer){
                layer_tmp.set({
                    opacity:1
                });
            }
            else{
                layer_tmp.set({
                    opacity:0.3
                });
            }
        });
    };

    $scope.export = function(){
        console.log(self.getMap().toJSON());
    };

    /*Canvas onde o mapa é renderizado*/
    self.getMapCanvas = function(){
        if(self.mapCanvas === null){
            self.mapCanvas = CE.createEngine({
                container:'#canvas-map',
                width:600,
                height:600,
                draggable:true
            },CE.EXT.CanvasEngineGrid);


            var reader = self.mapCanvas.getMouseReader();

            reader.onmousedown(CE.MouseReader.LEFT,function(){
                var reader = this;

                var mapCanvas = self.getMapCanvas();
                var map = self.getMap();
                var i,j,x,y;
                var layer = $scope.layers[$scope.currentLayer];
                var pos = mapCanvas.getPosition(reader.lastDown.left);
                i = Math.floor(pos.y/map.tile_h);
                j = Math.floor(pos.x/map.tile_w);
                var tile = {
                    width:map.tile_w,
                    height:map.tile_h
                };


                switch($scope.selectedTool){
                    case 'pencil':
                        var image = $scope.tilesetData.graphic.image;
                        var interval = self.selectedInterval;
                        tile.sx = map.tile_w*interval.sj;
                        tile.sy = map.tile_h*interval.si;
                        tile.dx = map.tile_w*j;
                        tile.dy = map.tile_h*i;
                        tile.imagem = image;
                        layer.image(tile);
                        tile.layer = $scope.currentLayer;
                        map.setTile(i,j,tile);
                        break;
                    case 'eraser':
                        tile.x = map.tile_w*j;
                        tile.y = map.tile_h*i;
                        layer.clearRect(tile);
                        map.removeTile(i,j,$scope.currentLayer);
                }

            });

            reader.onmousemove(function(e){
                var reader = this;
                if(reader.left){
                    var mapCanvas = self.getMapCanvas();
                    var map = self.getMap();
                    var interval,area_interval,i,j,x,y,col,row;
                    var layer = $scope.layers[$scope.currentLayer];

                    switch($scope.selectedTool){
                        case 'pencil':
                            if(self.selectedInterval !== null){
                                var image = $scope.tilesetData.graphic.image;
                                interval = self.selectedInterval;
                                var area = mapCanvas.getDrawedArea();
                                area_interval = map.getAreaInterval(area);

                                for(i = area_interval.si,row=interval.si;i <= area_interval.ei;i++){
                                    for(j = area_interval.sj,col=interval.sj; j <= area_interval.ej;j++){
                                        x = j*map.tile_w;
                                        y = i*map.tile_h;

                                        var tile = {
                                            image:image,
                                            dWidth:map.tile_w,
                                            dHeight:map.tile_h,
                                            sWidth:map.tile_w,
                                            sHeight:map.tile_h,
                                            sx:col*map.tile_w,
                                            sy:row*map.tile_h,
                                            dx:x,
                                            dy:y,
                                            layer:$scope.currentLayer
                                        };

                                        layer.clearRect({
                                            x:x,
                                            y:y,
                                            width:map.tile_w,
                                            height:map.tile_h
                                        });

                                        layer.image(tile);
                                        map.setTile(i,j,tile);
                                        col++;
                                        if(col > interval.ej){
                                            col = interval.sj;
                                        }
                                    }
                                    row++;
                                    if(row > interval.ei){
                                        row = interval.si;
                                    }
                                }
                            }

                            break;
                        case 'eraser':
                            var pos = mapCanvas.getPosition(reader.lastMove);
                            area_interval = map.getAreaInterval({x:pos.x,y:pos.y,width:1,height:1});
                            for(i = area_interval.si;i <= area_interval.ei;i++){
                                for(j = area_interval.sj; j <= area_interval.ej;j++){
                                    x = j*map.tile_w;
                                    y = i*map.tile_h;

                                    layer.clearRect({
                                        x:x,
                                        y:y,
                                        width:map.tile_w,
                                        height:map.tile_h
                                    });
                                    map.removeTile(i,j,$scope.currentLayer);
                                }
                            }

                    }
                }
            });
        }
        return self.mapCanvas;
    };

    /*Tileset Canvas*/
    self.getTilesetCanvas = function(){
        if(self.tilesetCanvas === null){
            self.tilesetCanvas = CE.createEngine({
                container:'#tileset',
                width:520,
                height:520,
                selectable:true,
                draggable:true,
                multiSelect:true
            },CE.EXT.CanvasEngineGrid);


            self.tilesetCanvas.onAreaSelect(function(area,grid){
                var reader = this.getMouseReader();
                if(reader.left){
                    var rectSets = grid.getRectsFromArea(area);
                    var interval = grid.getAreaInterval(area);
                    grid.apply({
                        fillStyle:'transparent',
                        state:0
                    });
                    rectSets.forEach(function(rectSet){
                        rectSet.set({
                            fillStyle:'rgba(0,0,100,0.5)',
                            state:1
                        });
                    });
                    self.selectedInterval = interval;
                }
                else{
                    var rects = grid.getRectsFromArea(area);
                    if(rects.length > 0){
                        var rectSet = rects[0];
                        grid.apply({
                            fillStyle:'transparent'
                        },function(){
                            return this.state != 1;
                        });
                        rectSet.set({
                            fillStyle:'rgba(0,0,100,0.5)'
                        });
                    }
                }
            });
        }
        return self.tilesetCanvas;
    };

    self.getMap = function(){
        var self = this;
        if(self.map === null){
            var mapCanvas = self.getMapCanvas();
            self.map = new CE.EXT.Map({
                sw:32,
                sh:32,
                width:mapCanvas.getWidth()/32,
                height:mapCanvas.getHeight()/32
            });
        }
        return self.map;
    };

    $scope.selectTool = function(tool){
        $scope.selectedTool = tool;
    };
}]);
