define(['CE','Grid','Map','Jquery-Conflict','ImageLoader','InputNumber','React','Math','AbstractGrid','ImageSet'],
    function(CE,Grid,Map,$,ImageLoader,InputNumber,React,Math,AbstractGrid,ImageSet){
        var MapEditor = {
            currentLayer:0,
            gameEngine:null,
            tilesetEngine:null,
            tilesetGridLayer:null,
            tilesetImageLayer:null,
            tilesetGrid:null,
            mapAbstractGrid:null,
            abstractGridLayer:null,
            map:null,
            tilesetImage:null,
            selectedInterval:[],
            activeLayer:0,
            /*
                Inicializa o editor de mapas
             */
            initialize:function(){
                console.log('MapEditor initialize...');
                var self = this;
                var sw = 32;
                var sh = 32;
                var width = 0;
                var height = 0;

                $("#tileset").change(function(){
                    var url = $(this).val();
                    ImageLoader.load(url,function(img){
                        self.tilesetImage = url;
                        self.getTilesetEngine().clearAllLayers();
                        width = img.width;
                        height = img.height;

                        self.getTilesetImageLayer().set({
                            width:width,
                            height:height
                        }).drawImage(img,0,0);

                        var grid = self.getTilesetGrid();

                        grid.set({
                            sw:sw,
                            sh:sh,
                            width:width,
                            height:height
                        });


                        self.getTilesetGridLayer().set({
                            width:width,
                            height:height
                        }).drawGrid(grid);
                    });
                });

                $("#layer").change(function(){
                    self.activeLayer = $(this).val();
                    var gameEngine = self.getGameEngine();
                    self.gameEngine.createLayer({
                        zIndex:self.activeLayer,
                        opacity:1
                    });
                    self.gameEngine.applyToLayers({
                        opacity:0.5
                    },function(){
                        return this.zIndex != self.activeLayer
                    });
                });

                $("#tileset").change();
                $("#layer").change();

                React.render(
                    <div className="row">
                        <div className="col-md-6">
                            <label>Largura(px)</label>
                            <InputNumber min={32} value={32} max={1000} onChange={self.widthGridChange}/>
                        </div>
                        <div className="col-md-6">
                            <label>Altura(px)</label>
                            <InputNumber min={32} value={32} max={1000} onChange={self.heightGridChange}/>
                        </div>
                    </div>,
                    document.getElementById('input-container')
                );

                React.render(
                    <div className="row">
                        <div className="col-md-6">
                            <div className="col-md-6">
                                <label>Largura(steps)</label>
                                <InputNumber min={5} value={5} max={1000} onChange={self.widthMapChange}/>
                            </div>
                            <div className="col-md-6">
                                <label>Altura(steps)</label>
                                <InputNumber min={5} value={5} max={1000} onChange={self.heightMapChange}/>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="col-md-6">
                                <label>Mostrar Grade</label>
                                <input type="checkbox" className="form-control" onChange={self.showGrid}/>
                            </div>
                            <div className="col-md-6">
                                <button className="btn btn-default" onClick={self.showLayers}>Mostrar Camadas</button>
                            </div>
                        </div>
                    </div>,
                    document.getElementById('canvas-input')
                );

                self.getGameEngine().renderMap(self.getMap());
                $(window).resize(function(){
                    self.fixPos();
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
            widthMapChange:function(value){
                console.log('MapEditor width map change...');
                var self = this;
                var map = MapEditor.getMap();
                var grid = MapEditor.getMapAbstractGrid();
                map.set({
                    width:value
                });

                grid.set({
                    width:map.width*map.tile_w
                });

                MapEditor.fixPos();
                MapEditor.getGameEngine().renderMap(map);
                MapEditor.getAbstractGridLayer().clear().drawAbstractGrid(grid);
            },
            //void : heightMapChange(int height) altera a altura do mapa
            heightMapChange:function(value){
                console.log('MapEditor height map change...');
                var grid = MapEditor.getMapAbstractGrid();
                var map =MapEditor.getMap();
                map.set({
                    height:value
                });

                grid.set({
                    height:map.height*map.tile_h
                });
                MapEditor.fixPos();
                MapEditor.getGameEngine().renderMap(map);
                MapEditor.getAbstractGridLayer().clear().drawAbstractGrid(grid);
            },
            /*
                void: show grid(Event e) mostra ou esconde a grade do mapa
             */
            showGrid:function(e){
                console.log('MapEditor show grid...');
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
                console.log('MapEditor get abstract grid layer...');
                var self = this;
                if(self.abstractGridLayer == null){
                    var map = self.getMap();
                    self.abstractGridLayer = self.getGameEngine().createLayer({
                        zIndex:10,
                        width:map.width*map.tile_w,
                        height:map.height*map.tile_h
                    }).drawAbstractGrid(self.getMapAbstractGrid());
                }

                return self.abstractGridLayer;
            },
            /*
                Grid: getTilesetGrid() Obtém instância da grade que
                cobre os tilesets
             */
            getTilesetGrid:function(){
                console.log('MapEditor get tileset grid...');
                var self = this;
                if(self.tilesetGrid == null){
                    self.tilesetGrid = new Grid();
                }
                return self.tilesetGrid;
            },
            /*
                void: widthGridChange(int value) altera a largura da
                grade que cobre os tilesets
             */
            widthGridChange:function(value){
                console.log('MapEditor width grid change...');
                var grid = MapEditor.getTilesetGrid();
                grid.set({
                    sw:value
                });

                MapEditor.getTilesetGridLayer().clear().drawGrid(grid);
            },
            /*
                void: heightGridChange(int value) altera a altura da
                grade que cobre os tilesets
             */
            heightGridChange:function(value){
                console.log('MapEditor height grid change...');
                var grid = MapEditor.getTilesetGrid();
                grid.set({
                    sh:value
                });
                MapEditor.getTilesetGridLayer().clear().drawGrid(grid);
            },
            /*
                obtém a instância de uma grade Abstrata
             */
            getMapAbstractGrid:function(){
                console.log('MapEditor get map abstract grid...');
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
             obtém a instância da camada canvas que desenha os tilesets
             */
            getTilesetImageLayer:function(){
                console.log('MapEditor get tileset image layer...');
                var self = this;
                if(self.tilesetImageLayer == null){
                    self.tilesetImageLayer = self.getTilesetEngine().createLayer({zIndex:0,name:'tileset'});
                }
                return self.tilesetImageLayer;
            },
            /*
                obtém a instância da camada canvas que desenha a grade sobre os tilesets
             */
            getTilesetGridLayer:function(){
                console.log('MapEditor get tileset grid layer...');
                var self = this;
                if(self.tilesetGridLayer == null){
                    self.tilesetGridLayer = self.getTilesetEngine().createLayer({zIndex:1,name:'gride'});
                }
                return self.tilesetGridLayer;
            },
            /*
             instanciação e configuração do objeto Game Engine, que renderiza
             os elementos canvas dos tilesets
             */
            getTilesetEngine:function(){
                console.log('MapEditor get tileset engine...');
                var self = this;
                if(self.tilesetEngine == null){
                    self.tilesetEngine = CE.createEngine({
                        container:"#tileset-grid",
                        width:'100%',
                        height:665,
                        draggable:true
                    });
                    var engine = self.tilesetEngine;
                    var tilesetGridLayer = self.getTilesetGridLayer();
                    var grid = self.getTilesetGrid();

                    self.tilesetEngine.getMouseReader().onmousedown(1,function(){
                        var self = this;
                        var translate = {x:Math.abs(engine.viewX),y:Math.abs(engine.viewY)};
                        var pa = Math.vpv(self.lastDown.left,translate);
                        var area = {
                            x:pa.x,
                            y:pa.y
                        };

                        var rectSets = grid.getRectsFromArea(area);
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
                        MapEditor.selectedInterval = grid.getAreaInterval(area);
                        tilesetGridLayer.clear().drawGrid(grid);
                    });

                    self.tilesetEngine.getMouseReader().onmousemove(function(e){
                        console.log('mouse move...');
                        var self = this;
                        if(self.left){
                            var area = MapEditor.getDrawedArea.apply(self,[engine]);
                            var rectSets = grid.getRectsFromArea(area);
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
                            MapEditor.selectedInterval = grid.getAreaInterval(area);
                            tilesetGridLayer.clear().drawGrid(grid);
                        }
                       else{
                            var area = Math.vpv(self.lastMove,{x:-engine.viewX,y:-engine.viewY});
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

                                tilesetGridLayer.clear().drawGrid(grid);
                            }
                        }
                    });



                }
                return self.tilesetEngine;
            },
            /*
                retorna a regigão retangular da distáncia entre o último clique com o botão
                esquerdo e a posição atual do mouse
             */
            getDrawedArea:function(engine){
                var self = this;
                var translate = {x:-engine.viewX,y:-engine.viewY};
                var pa = Math.vpv(self.lastDown.left,translate);
                var pb = Math.vpv(self.lastMove,translate);
                var width = Math.abs(pb.x-pa.x);
                var height = Math.abs(pb.y-pa.y);

                var area = {
                    x:pa.x,
                    y:pa.y,
                    width:width,
                    height:height
                };

                area.x = pa.x > pb.x?area.x-width:area.x;
                area.y = pa.y > pb.y?area.y-height:area.y;
                return area;
            },
            /*
                instanciação e configuração do objeto Game Engine, que renderiza
                os elementos canvas do mapa
             */
            getGameEngine:function(){
                console.log('MapEditor get game engine...');
                var self = this;
                if(self.gameEngine == null){
                    self.gameEngine = CE.createEngine({
                        container:"#canvas-container",
                        width:'100%',
                        height:700,
                        draggable:true,
                        scalable:false
                    });
                    var engine = self.gameEngine;
                    var editor = self;


                    engine.getMouseReader().onmousemove(function(e){
                        var self = this;
                        if(self.right){
                            MapEditor.getAbstractGridLayer().clear().drawAbstractGrid(MapEditor.getMapAbstractGrid());
                        }
                        else if(self.left){
                            var map = MapEditor.getMap();
                            var image = MapEditor.tilesetImage;
                            var interval = MapEditor.selectedInterval;
                            var area = MapEditor.getDrawedArea.apply(self,[engine]);
                            var area_interval = map.getAreaInterval(area);
                            var images_sets = [];


                            var layer = engine.createLayer({
                                zIndex:MapEditor.activeLayer,
                                width:map.width*map.tile_w,
                                height:map.height*map.tile_h
                            });



                            for(var i = area_interval.si,row=interval.si;i <= area_interval.ei;i++){
                                if(images_sets[i] == undefined){
                                    images_sets[i] = [];
                                }
                                for(var j = area_interval.sj,col=interval.sj; j <= area_interval.ej;j++){
                                    var imageSet = new ImageSet({
                                        url:image,
                                        width:map.tile_w,
                                        height:map.tile_h,
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
                    });

                }
                return self.gameEngine;
            },
            //corrige a posição viewX,viewY quando o mapa é redimensionado
            fixPos:function(){
                console.log('MapEditor fix pos...');
                var engine = this.getGameEngine();
                var x = engine.viewX;
                var y = engine.viewY;
                var grid_layer = engine.createLayer({zIndex:10});
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
                console.log('MapEditor get map...');
                var self = this;
                if(self.map == null){
                    self.map = new Map();
                }
                return self.map;
            }
        };

        return MapEditor;
    });