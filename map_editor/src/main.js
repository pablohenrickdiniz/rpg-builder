require(['paths'],function(){
    require(
        ['bootstrap','Jquery-Conflict','CE','RL','React','InputNumber','Grid','MouseReader'],
        function(boot,$,CE,RL,React,InputNumber,Grid,MouseReader){
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

                }
                else{
                    var rectSet = grid.getRectFrom(self.lastMove);
                    if(rectSet != null){
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


            grid_layer.getMouseReader().onmousedown(MouseReader.LEFT,function(e){
                console.log(this.lastDown.left);
            });


            var map = {
                map:[],
                tile_w:32,
                tile_h:32
            };

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
                        <InputNumber min={16} value={32} max={100} onChange={largura_change}/>
                    </div>
                    <div className="col-md-6">
                        <label>Altura(px)</label>
                        <InputNumber min={16} value={32} max={100} onChange={altura_change}/>
                    </div>
                </div>,
                document.getElementById('input-container')
            );
        });
});

