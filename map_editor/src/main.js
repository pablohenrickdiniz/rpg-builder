require(['paths'],function(){
    require(['bootstrap','Jquery-Conflict','CE','RL','React','InputNumber'],function(boot,$,CE,RL,React,InputNumber){
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
                });
                grid_layer.set({
                    width:width,
                    height:height
                });

                image_layer.drawImage(img,0,0);
                grid_layer.drawGrid(0,0,sw,sh,width,height);
            });
        });

        var largura_change = function(value){
            sw = value;
            grid_layer.clear();
            grid_layer.drawGrid(0,0,sw,sh,width,height);
        };

        var altura_change = function(value){
            sh = value;
            grid_layer.clear();
            grid_layer.drawGrid(0,0,sw,sh,width,height);
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

