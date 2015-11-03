define(
    [
        'CE',
        'Grid',
        'Map',
        'jquery',
        'ImageLoader',
        'InputNumberVertical',
        'react',
        'reactDom',
        'Math',
        'AbstractGrid',
        'ImageSet'
    ],
    function(
        CE,
        Grid,
        Map,
        $,
        ImageLoader,
        InputNumberVertical,
        React,
        ReactDom,
        Math,
        AbstractGrid,
        ImageSet
    ){
        'use strict';
        var MapEditor = {
            currentLayer:0,
            gameEngine:null,
            tilesetEngine:null,
            tilesetImageLayer:null,
            mapAbstractGrid:null,
            abstractGridLayer:null,
            map:null,
            tilesetImage:null,
            selectedInterval:[],
            activeLayer:0,
            /*
             Inicializa o editor de mapas
             */
            reset:function(){
                var self = this;
                self.currentLayer=0;
                self.gameEngine=null;
                self.tilesetEngine=null;
                self.tilesetImageLayer=null;
                self.mapAbstractGrid=null;
                self.abstractGridLayer=null;
                self.map=null;
                self.tilesetImage=null;
                self.selectedInterval=[];
                self.activeLayer=0;
            },
            initialize:function(){
                console.log('MapEditor initialize...');
                var self = this;
                self.reset();
                var sw = 32;
                var sh = 32;
                var width = 0;
                var height = 0;

                var tilesetEngine = self.getTilesetEngine();
                var gameEngine = self.getGameEngine();
                self.tilesetImageLayer = tilesetEngine.createLayer({
                    name:'tileset'
                });
                self.tilesetGridLayer = tilesetEngine.createLayer({
                    name:'grid'
                });

                for(var i = 0; i < 10;i++){
                    gameEngine.createLayer({
                        name:'layer-'+i
                    });
                }

                $("#tileset").change(function(){
                    var url = $(this).val();
                    ImageLoader.load(url,function(img){
                        self.tilesetImage = url;
                        tilesetEngine.clearAllLayers();
                        width = img.width;
                        height = img.height;
                        tilesetEngine.applyToLayers({
                            width:width,
                            height:height
                        });

                        self.tilesetImageLayer.drawImage(img,0,0);

                        tilesetEngine.updateGrid({
                            sw:sw,
                            sh:sh,
                            width:width,
                            height:height
                        });
                    });
                });

                $("#tileset").change();
                ReactDom.render(
                    <div className="row">
                        <div className="col-md-6">
                            <label>Largura(px)</label>
                            <InputNumberVertical min={32} value={32} max={1000} onChange={self.widthGridChange}/>
                        </div>
                        <div className="col-md-6">
                            <label>Altura(px)</label>
                            <InputNumberVertical min={32} value={32} max={1000} onChange={self.heightGridChange}/>
                        </div>
                    </div>,
                    document.getElementById('input-container')
                );

                var map_width = Math.ceil(gameEngine.getWidth()/32);
                var map_height = Math.ceil(gameEngine.getHeight()/32);

                ReactDom.render(
                    <div className="row">
                        <div className="col-md-12">
                            <div className="col-md-4">
                                <label>Largura(steps)</label>
                                <InputNumberVertical min={5} value={map_width} max={1000} onChange={self.widthMapChange}/>
                            </div>
                            <div className="col-md-4">
                                <label>Altura(steps)</label>
                                <InputNumberVertical min={5} value={map_height} max={1000} onChange={self.heightMapChange}/>
                            </div>
                            <div className="col-md-4">
                                <label>Camada</label>
                                <InputNumberVertical min={1} value={1} max={10} onChange={self.changeLayer}/>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="col-md-4">
                                <div className="checkbox">
                                    <label>
                                        <input type="checkbox" onChange={self.showGrid}/>Mostrar Grade
                                    </label>
                                </div>
                                <div className="checkbox">
                                    <label>
                                        <input type="checkbox" onChange={self.showLayers}/>Mostrar Camadas
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.getElementById('canvas-input')
                );

                gameEngine.renderMap(self.getMap());
                $(window).resize(function(){
                    self.fixPos();
                });

                gameEngine.updateGrid({
                    sw:32,
                    sh:32,
                    width:gameEngine.getWidth(),
                    height:gameEngine.getHeight(),
                    opacity:0.1
                });
            },
            /*
             void: changeLayer
             Altera a camada de edição
             */
            changeLayer:function(value){
                var self = MapEditor;
                self.activeLayer = value;
                var gameEngine = self.getGameEngine();
                var layer = self.gameEngine.getLayer(value);
                layer.set({
                    opacity:1
                });
                self.gameEngine.applyToLayers({
                    opacity:0.5
                },function(){
                    return this.zIndex != self.activeLayer
                });
            },
            /*
             void: showLayers()
             mostra todas as camadas
             */
            showLayers:function(){
                MapEditor.getGameEngine().applyToLayers({
                    opacity:1
                });
            },
            // void : widthMapChange(int width) altera a largura do mapa
            widthMapChange:function(width){
                var self = this;
                var map = MapEditor.getMap();
                var grid = MapEditor.getMapAbstractGrid();
                var gameEngine = MapEditor.getGameEngine();
                /*
                 map.set({
                 width:width
                 });*/

                gameEngine.applyToLayers({
                    width:width*map.tile_w
                });

                MapEditor.fixPos();
                gameEngine.renderMap(map);
                MapEditor.getAbstractGridLayer().clear().drawAbstractGrid(grid);
            },
            //void : heightMapChange(int height) altera a altura do mapa
            heightMapChange:function(height){
                var grid = MapEditor.getMapAbstractGrid();
                var map =MapEditor.getMap();
                var gameEngine = MapEditor.getGameEngine();
                /*
                 map.set({
                 height:height
                 });*/

                gameEngine.applyToLayers({
                    height:height*map.tile_h
                });

                MapEditor.fixPos();
                MapEditor.getGameEngine().renderMap(map);
                MapEditor.getAbstractGridLayer().clear().drawAbstractGrid(grid);
            },
            /*
             void: show grid(Event e) mostra ou esconde a grade do mapa
             */
            showGrid:function(e){
                if($(e.target).is(':checked')){
                    MapEditor.getAbstractGridLayer().show();
                }
                else{
                    MapEditor.getAbstractGridLayer().hide();
                }
            },

            /*
             AbstractGrid : getAbstractGrid() Obtém instância da grade que
             cobre o mapa
             */
            getAbstractGridLayer:function(){
                var self = this;
                if(self.abstractGridLayer == null){
                    var map = self.getMap();
                    self.abstractGridLayer = self.getGameEngine().getGridLayer();
                    self.abstractGridLayer.set({
                        width:map.width*map.tile_w,
                        height:map.height*map.tile_h
                    }).drawAbstractGrid(self.getMapAbstractGrid());
                }
                return self.abstractGridLayer;
            },
            /*
             void: widthGridChange(int value) altera a largura da
             grade que cobre os tilesets
             */
            widthGridChange:function(value){
                var self = this;
                MapEditor.getTilesetEngine().updateGrid({
                    sw:value
                });
            },
            /*
             void: heightGridChange(int value) altera a altura da
             grade que cobre os tilesets
             */
            heightGridChange:function(value){
                var self = this;
                MapEditor.getTilesetEngine().updateGrid({
                    sh:value
                });
            },
            /*
             obtém a instância de uma grade Abstrata
             */
            getMapAbstractGrid:function(){
                var self = this;
                if(self.mapAbstractGrid == null){
                    var map = self.getMap();
                    self.mapAbstractGrid = new AbstractGrid({
                        width:map.width*map.tile_w,
                        height:map.height*map.tile_h,
                        sw:map.tile_w,
                        sh:map.tile_h
                    });
                }
                return self.mapAbstractGrid;
            },
            /*
             instanciação e configuração do objeto Game Engine, que renderiza
             os elementos canvas dos tilesets
             */
            getTilesetEngine:function(){
                var self = this;
                if(self.tilesetEngine === null){
                    self.tilesetEngine = CE.createEngine({
                        container:"#tileset-grid",
                        width:'100%',
                        height:665,
                        draggable:true,
                        selectable:true,
                        multiSelect:true,
                        scalable:true
                    });

                    /*
                     Prepara o callback de tileset Engine para
                     leitura e visualização da área selecionada
                     */
                    self.tilesetEngine.onAreaSelect(function(area,grid){
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
                return self.tilesetEngine;
            },

            /*
             instanciação e configuração do objeto Game Engine, que renderiza
             os elementos canvas do mapa
             */
            getGameEngine:function(){
                var self = this;
                if(self.gameEngine == null){
                    self.gameEngine = CE.createEngine({
                        container:"#canvas-container",
                        width:'100%',
                        height:700,
                        draggable:true,
                        scalable:true
                    });
                    var engine = self.gameEngine;
                    var editor = self;

                    var mousemovecallback = function(e){
                        var reader = this;
                        if(reader.right){
                            MapEditor.getAbstractGridLayer().clear().drawAbstractGrid(MapEditor.getMapAbstractGrid());
                        }
                        else if(reader.left){
                            var map = MapEditor.getMap();
                            var image = MapEditor.tilesetImage;
                            var interval = MapEditor.selectedInterval;
                            var area = engine.getDrawedArea();
                            var area_interval = map.getAreaInterval(area);
                            var images_sets = [];

                            var layer = engine.getLayer(MapEditor.activeLayer);

                            for(var i = area_interval.si,row=interval.si;i <= area_interval.ei;i++){
                                if(images_sets[i] == undefined){
                                    images_sets[i] = [];
                                }
                                for(var j = area_interval.sj,col=interval.sj; j <= area_interval.ej;j++){
                                    var imageSet = new ImageSet({
                                        url:image,
                                        width:map.tile_w,
                                        height:map.tile_h,
                                        sWidth:map.tile_w,
                                        sHeight:map.tile_h,
                                        sx:col*map.tile_w,
                                        sy:row*map.tile_h,
                                        x:j*map.tile_w,
                                        y:i*map.tile_h,
                                        layer:MapEditor.activeLayer
                                    });

                                    layer.clearRect(imageSet.x, imageSet.y, imageSet.width, imageSet.height);
                                    layer.drawImageSet(imageSet);

                                    images_sets[i][j] = imageSet;

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

                            images_sets.forEach(function(row,i){
                                row.forEach(function(imageSet,j){
                                    map.setTile(i,j,imageSet);
                                });
                            });
                        }
                    };

                    engine.getMouseReader().onmousemove(mousemovecallback);
                }
                return self.gameEngine;
            },
            //corrige a posição viewX,viewY quando o mapa é redimensionado
            fixPos:function(){
                var engine = this.getGameEngine();
                var x = engine.viewX;
                var y = engine.viewY;
                var grid_layer = engine.getGridLayer();
                var min_x = engine.getWidth()-grid_layer.width;
                var min_y = engine.getHeight()-grid_layer.height;
                min_x = min_x>0?0:min_x;
                min_y = min_y>0?0:min_y;
                x = Math.min(Math.max(x,min_x),0);
                y = Math.min(Math.max(y,min_y),0);

                engine.set({
                    viewX:x,
                    viewY:y
                });
            },
            //instanciação do objeto map
            getMap:function(){
                var self = this;
                if(self.map == null){
                    var gameEngine = self.getGameEngine();
                    self.map = new Map({
                        sw:32,
                        sh:32,
                        width:gameEngine.getWidth()/32,
                        height:gameEngine.getHeight()/32
                    });
                }
                return self.map;
            }
        };

        return MapEditor;
    });