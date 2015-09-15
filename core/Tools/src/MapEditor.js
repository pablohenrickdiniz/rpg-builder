define(['CE','Grid','Map','Jquery-Conflict','ImageLoader','InputNumber','React','Math','AbstractGrid'],
    function(CE,Grid,Map,$,ImageLoader,InputNumber,React,Math,AbstractGrid){
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
            initialize:function(){
                var self = this;
                var sw = 32;
                var sh = 32;
                var width = 0;
                var height = 0;
                var img = null;
                debugger;
                $("#tileset").change(function(){
                    var url = $(this).val();
                    ImageLoader.load(url,function(tmp){
                        self.getTilesetEngine().clearAllLayers();
                        img = tmp;
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
                var self = this;
                MapEditor.getMap().set({
                    width:value
                });
                MapEditor.getMapAbstractGrid().set({
                    width:value
                });

                MapEditor.fixPos();
            },
            heightMapChange:function(value){
                var self = this;
                MapEditor.getMap().set({
                    height:value
                });
                self.getMapAbstractGrid().set({
                    height:value
                });
                MapEditor.fixPos();
            },
            showGrid:function(e){
                var self = MapEditor;
                if($(e.target).is(':checked')){
                    self.getAbstractGridLayer().show();
                }
                else{
                    self.getAbstractGridLayer().hide();
                }
            },
            getAbstractGridLayer:function(){
                var self = this;
                if(self.abstractGridLayer == null){
                    var map = self.getMap();
                    self.getGameEngine().createLayer({
                        zIndex:10,
                        width:map.width*map.tile_w,
                        height:map.height*map.tile_h
                    }).drawAbstractGrid(self.getMapAbstractGrid()).hide();
                }

                return self.abstractGridLayer;
            },
            getTilesetGrid:function(){
                var self = this;
                if(self.tilesetGrid == null){
                    self.tilesetGrid = new Grid();
                }
                return self.tilesetGrid;
            },
            widthGridChange:function(value){
                var grid = MapEditor.getTilesetGrid();
                grid.set({
                    sw:value
                });

                MapEditor.getTilesetGridLayer().clear().drawGrid(grid);
            },

            heightGridChange:function(value){
                var grid = MapEditor.getTilesetGrid();
                grid.set({
                    sh:value
                });
                MapEditor.getTilesetGridLayer().clear().drawGrid(grid);
            },
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
            getTilesetImageLayer:function(){
                var self = this;
                if(self.tilesetImageLayer == null){
                    self.tilesetImageLayer = self.getTilesetEngine().createLayer({zIndex:0,name:'tileset'});
                }
                return self.tilesetImageLayer;
            },
            getTilesetGridLayer:function(){
                var self = this;
                if(self.tilesetGridLayer == null){
                    var tilesetGridLayer =  self.getTilesetEngine().createLayer({zIndex:1,name:'gride'});
                    var grid = self.getTilesetGrid();
                    tilesetGridLayer.getMouseReader().onmousemove(function(e){
                        var self = this;
                        if(self.left){
                            var pa = self.lastDown.left;
                            var pb = self.lastMove;
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

                            var rectSets = grid.getRectsFromArea(area);
                            grid.apply({
                                fillStyle:'transparent'
                            });
                            /*
                            rectSets.forEach(function(rectSet){
                                rectSet.set({
                                    fillStyle:'rgba(0,0,100,0.5)'
                                });
                            });
                            tilesetGridLayer.clear().drawGrid(grid);*/
                        }
                        else{
                            var rects = grid.getRectsFromArea(self.lastMove);
                            if(rects.length > 0){
                                var rectSet = rects[0];
                                grid.apply({
                                    fillStyle:'transparent'
                                });
                                rectSet.set({
                                    fillStyle:'rgba(100,0,0,0.5)'
                                });

                                tilesetGridLayer.clear().drawGrid(grid);
                            }
                        }
                    });
                    self.tilesetGridLayer = tilesetGridLayer;
                }
                return self.tilesetGridLayer;
            },
            getTilesetEngine:function(){
                var self = this;
                if(self.tilesetEngine == null){
                    self.tilesetEngine = CE.createEngine({
                        container:"#tileset-grid",
                        width:'100%',
                        height:665
                    })
                }
                return self.tilesetEngine;
            },
            getGameEngine:function(){
                var self = this;
                if(self.gameEngine == null){
                    self.gameEngine = CE.createEngine({
                        container:"#canvas-container",
                        width:'100%',
                        height:700
                    });
                    var engine = self.gameEngine;
                    var editor = self;


                    engine.getMouseReader().onmousedown(1,function(){
                        editor.lastView = {
                            x:engine.viewX,
                            y:engine.viewY
                        };
                    });

                    engine.getMouseReader().onmousemove(function(e,pb){
                        var self = this;
                        if(self.left){
                            var pa = self.lastDown.left;
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
                        }
                    });

                }
                return self.gameEngine;
            },
            fixPos:function(){
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
                var self = this;
                if(self.map == null){
                    self.map = new Map();
                }
                return self.map;
            }
        };

        return MapEditor;
    });