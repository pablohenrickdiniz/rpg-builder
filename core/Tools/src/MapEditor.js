define(['CE','Grid','Map','Jquery-Conflict','ImageLoader','InputNumber','React'],function(CE,Grid,Map,$,ImageLoader,InputNumber,React){
    var MapEditor = {
        currentLayer:0,
        gameEngine:null,
        tilesetEngine:null,
        tilesetGridLayer:null,
        tilesetImageLayer:null,
        tilesetGrid:null,
        map:null,
        initialize:function(){
            var self = this;
            var sw = 32;
            var sh = 32;
            var width = 0;
            var height = 0;
            var img = null;

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
            MapEditor.getMap().set({
                width:value
            });

        },
        heightMapChange:function(value){
            MapEditor.getMap().set({
                height:value
            });
        },
        showGrid:function(e){
            var self = MapEditor;
            if($(e.target).is(':checked')){
                self.getMap().showGrid();
            }
            else{
                self.getMap().hideGrid();
            }
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
                        rectSets.forEach(function(rectSet){
                            rectSet.set({
                                fillStyle:'rgba(0,0,100,0.5)'
                            });
                        });
                        tilesetGridLayer.clear().drawGrid(grid);
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
            }
            return self.gameEngine;
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