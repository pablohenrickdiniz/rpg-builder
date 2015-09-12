require(['paths'],function(){
    require(
        ['bootstrap','Jquery-Conflict','CE','RL','React','InputNumber','Grid','MouseReader','Map'],
        function(boot,$,CE,RL,React,InputNumber,Grid,MouseReader,Map){
            var GameEngine = CE.createEngine({
                container:"#canvas-container",
                width:'100%',
                height:700
            });


            var layer1 = GameEngine.createLayer({
                zIndex:0,
                width:300,
                height:300
            });


            var TilesetEngine = CE.createEngine({
                container:"#tileset-grid",
                width:'100%',
                height:665
            });


            var image_layer = TilesetEngine.createLayer({zIndex:0,name:'imagemTileset'});
            var grid_layer = TilesetEngine.createLayer({zIndex:1,name:'grade'});


            grid_layer.getMouseReader().onmousemove(function(e){
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
                    grid_layer.clear().drawGrid(grid);
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


                        grid_layer.clear().drawGrid(grid);
                    }
                }
            });


            var map = new Map();



            var sw = 32;
            var sh = 32;
            var width = 0;
            var height = 0;
            var img = null;
            var grid = new Grid();
            $("#tileset").change(function(){
                var url = $(this).val();
                RL.loadImage(url,function(tmp){
                    TilesetEngine.clearAllLayers();
                    img = tmp;
                    width = img.width;
                    height = img.height;

                    image_layer.set({
                        width:width,
                        height:height
                    }).drawImage(img,0,0);


                    grid.set({
                        sw:sw,
                        sh:sh,
                        width:width,
                        height:height
                    }).update();


                    grid_layer.set({
                        width:width,
                        height:height
                    }).drawGrid(grid);
                });
            });

            var largura_change = function(value){
                grid.set({
                    sw:value
                }).update();
                grid_layer.clear().drawGrid(grid);
            };

            var altura_change = function(value){
                grid.set({
                    sh:value
                }).update();
                grid_layer.clear().drawGrid(grid);
            };


            React.render(
                <div className="row">
                    <div className="col-md-6">
                        <label>Largura(px)</label>
                        <InputNumber min={32} value={32} max={100} onChange={largura_change}/>
                    </div>
                    <div className="col-md-6">
                        <label>Altura(px)</label>
                        <InputNumber min={32} value={32} max={100} onChange={altura_change}/>
                    </div>
                </div>,
                document.getElementById('input-container')
            );

            React.render(
                <div className="row">
                    <div className="col-md-6">
                        <label>Largura(steps)</label>
                        <InputNumber min={5} value={5} max={1000}/>
                    </div>
                    <div className="col-md-6">
                        <label>Altura(steps)</label>
                        <InputNumber min={5} value={5} max={1000}/>
                    </div>
                </div>,
                document.getElementById('canvas-input')
            );
        });
});

