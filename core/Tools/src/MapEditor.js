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
                            <InputNumber min={32} value={32} max={100} onChange={self.widthGridChange}/>
                        </div>
                        <div className="col-md-6">
                            <label>Altura(px)</label>
                            <InputNumber min={32} value={32} max={100} onChange={self.heightGridChange}/>
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
                            <label>Mostrar Grade</label>
                            <input type="checkbox" className="form-control" onChange={self.showGrid}/>
                        </div>
                    </div>,
                    document.getElementById('canvas-input')
                );

                self.getGameEngine().renderMap(self.getMap());
            },
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

                MapEditor.getAbstractGridLayer().clear().drawAbstractGrid(grid);
                MapEditor.fixPos();
            },
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
                MapEditor.getAbstractGridLayer().clear().drawAbstractGrid(grid);
                MapEditor.fixPos();
            },
            showGrid:function(e){
                console.log('MapEditor show grid...');
                if($(e.target).is(':checked')){
                    MapEditor.getAbstractGridLayer().show();
                }
                else{
                    MapEditor.getAbstractGridLayer().hide();
                }
            },
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
            getTilesetGrid:function(){
                console.log('MapEditor get tileset grid...');
                var self = this;
                if(self.tilesetGrid == null){
                    self.tilesetGrid = new Grid();
                }
                return self.tilesetGrid;
            },
            widthGridChange:function(value){
                console.log('MapEditor width grid change...');
                var grid = MapEditor.getTilesetGrid();
                grid.set({
                    sw:value
                });

                MapEditor.getTilesetGridLayer().clear().drawGrid(grid);
            },

            heightGridChange:function(value){
                console.log('MapEditor height grid change...');
                var grid = MapEditor.getTilesetGrid();
                grid.set({
                    sh:value
                });
                MapEditor.getTilesetGridLayer().clear().drawGrid(grid);
            },
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
            getTilesetImageLayer:function(){
                console.log('MapEditor get tileset image layer...');
                var self = this;
                if(self.tilesetImageLayer == null){
                    self.tilesetImageLayer = self.getTilesetEngine().createLayer({zIndex:0,name:'tileset'});
                }
                return self.tilesetImageLayer;
            },
            getTilesetGridLayer:function(){
                console.log('MapEditor get tileset grid layer...');
                var self = this;
                if(self.tilesetGridLayer == null){
                    self.tilesetGridLayer = self.getTilesetEngine().createLayer({zIndex:1,name:'gride'});
                }
                return self.tilesetGridLayer;
            },
            getTilesetEngine:function(){
                console.log('MapEditor get tileset engine...');
                var self = this;
                if(self.tilesetEngine == null){
                    self.tilesetEngine = CE.createEngine({
                        container:"#tileset-grid",
                        width:'100%',
                        height:665
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
                            var rects = grid.getRectsFromArea(self.lastMove);
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
            getDrawedArea:function(engine){
                var self = this;
                var translate = {x:Math.abs(engine.viewX),y:Math.abs(engine.viewY)};
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
            getGameEngine:function(){
                console.log('MapEditor get game engine...');
                var self = this;
                if(self.gameEngine == null){
                    self.gameEngine = CE.createEngine({
                        container:"#canvas-container",
                        width:'100%',
                        height:700
                    });
                    var engine = self.gameEngine;
                    var editor = self;


                    engine.getMouseReader().onmousedown(3,function(){
                        editor.lastView = {
                            x:engine.viewX,
                            y:engine.viewY
                        };
                    });

                    engine.getMouseReader().onmousemove(function(e){
                        var self = this;
                        if(self.right){
                            var pa = self.lastDown.right;
                            var pb = self.lastMove;
                            var p = Math.vmv(pa,pb);
                            var view = editor.lastView;
                            var grid_layer = engine.createLayer({zIndex:10});
                            var x =view.x-p.x;
                            var y = view.y-p.y;

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
                                zIndex:MapEditor.activeLayer
                            });



                            for(var i = area_interval.si,row=interval.si;i <= area_interval.ei;i++){
                                for(var j = area_interval.sj,col=interval.sj; j <= area_interval.ej;j++){
                                    var imageSet = new ImageSet({
                                        url:image,
                                        width:map.tile_w,
                                        height:map.tile_h,
                                        sx:col*map.tile_w,
                                        sy:row*map.tile_h,
                                        x:j*map.tile_w,
                                        y:i*map.tile_h
                                    });


                                    layer.clearRect(imageSet.x, imageSet.y, imageSet.width, imageSet.height);
                                    layer.drawImageSet(imageSet);

                                    images_sets.push(imageSet);

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

                            /*

                            var map = MapEditor.getMap();
                            var image = MapEditor.tilesetImage;
                            var interval = MapEditor.selectedInterval;
                            var area = MapEditor.getDrawedArea.apply(self,[engine]);
                            var area_interval = map.getAreaInterval(area);
                            var images_sets = [];

                            for(var i = area_interval.si; i < area_interval.ei;i++){
                                for(var j = area_interval.sj;j < area_interval.ej;j++){
                                    var imageSet = {
                                        url:image,
                                        width:map.tile_w,
                                        height:map.tile_h,
                                        x:map.tile_w*j,
                                        y:map.tile_h*i,
                                        sx:
                                    };
                                }
                            }*/
                        }
                    });

                }
                return self.gameEngine;
            },
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