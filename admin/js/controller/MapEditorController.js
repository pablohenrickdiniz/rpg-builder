app.controller('MapEditorController',['$location','$rootScope','$localStorage','ImageLoader','$timeout',function($location,$scope,$storage,ImageLoader,$timeout){
    var self = this;
    self.mapCanvas = null;
    self.tilesetCanvas = null;
    self.tilesetLayer = null;
    self.selectedInterval = null;
    self.map = null;
    self.layers = [];
    self.currentLayer = 0;

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
            self.layers[i] = mapCanvas.createLayer();
        }

        mapCanvas.getMouseReader().onmousemove(function(){
            var reader = this;
            if(reader.right){
                mapCanvas.getGridLayer().refresh();
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
        mapCanvas.applyToLayers({
            width:map.tile_w*width
        });
        var gridLayer = mapCanvas.getGridLayer();
        gridLayer.getGrid().set({
            width:map.tile_w*width
        });
        gridLayer.refresh();
    };

    $scope.changeMapHeight = function(height){
        var mapCanvas = self.getMapCanvas();
        var map = self.getMap();
        mapCanvas.applyToLayers({
            height:map.tile_h*height
        });

        var gridLayer = mapCanvas.getGridLayer();
        gridLayer.getGrid().set({
            height:map.tile_h*height
        });
        gridLayer.refresh();
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

    /*Canvas onde o mapa é renderizado*/
    self.getMapCanvas = function(){
        if(self.mapCanvas === null){
            self.mapCanvas = CE.createEngine({
                container:'#canvas-map',
                width:600,
                height:600,
                draggable:true
            },CE.EXT.CanvasEngineGrid);

            self.mapCanvas.getMouseReader().onmousemove(function(){
                var reader = this;
                if(reader.left && self.selectedInterval !== null){
                    var mapCanvas = self.getMapCanvas();
                    var map = self.getMap();
                    var image = $scope.tilesetData.graphic.image;
                    var interval = self.selectedInterval;
                    var area = mapCanvas.getDrawedArea();
                    var area_interval = map.getAreaInterval(area);
                    var layer = mapCanvas.getLayer(self.currentLayer);
                    for(var i = area_interval.si,row=interval.si;i <= area_interval.ei;i++){
                        for(var j = area_interval.sj,col=interval.sj; j <= area_interval.ej;j++){
                            var x = j*map.tile_w;
                            var y = i*map.tile_h;

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
                                layer:self.currentLayer
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
            self.map = new CE.Map({
                sw:32,
                sh:32,
                width:mapCanvas.getWidth()/32,
                height:mapCanvas.getHeight()/32
            });
        }
        return self.map;
    };
}]);
