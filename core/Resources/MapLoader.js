define(['Map','jquery','MaterialsLoader','ImageSet','ImageLoader'],function(Map,$,MaterialsLoader,ImageSet,ImageLoader){
    return {
        maps:[],
        load:function(url,callback){
            var self = this;
            var a = document.createElement('a');
            a.href = url;
            url = $(a).prop('href');
            var context = url.substring(0,url.lastIndexOf('/'));
            if(self.maps[url] == undefined){
                console.log('loading map '+url);
                $.ajax({
                    url:url,
                    type:'get',
                    dataType:'json',
                    success:function(data){
                        console.log('map loaded...');
                        self.createMapObject(data,callback,context);
                    }
                });
            }
            else{
                callback(self.maps[url]);
            }
        },
        createMapObject:function(data,callback,context){
            console.log('creating map object...');
            context = context == undefined?'':context;
            var map = new Map({
                tile_w:data.tile_w,
                tile_h:data.tile_h
            });
            var materials_url = context+'/'+data.materials;
            MaterialsLoader.load(materials_url,function(materials,context){
                var image_sets = [];
                var images = [];
                var width = 0;
                var height = data.map.length;
                for(var x = 0; x < height;x++) {
                    if(image_sets[x] == undefined){
                        image_sets[x] = [];
                    }
                    var length =  data.map[x].length;
                    width = Math.max(width,length);
                    for (var y = 0; y < length; y++) {
                        if(image_sets[x][y] == undefined){
                            image_sets[x][y] = [];
                        }
                        for (var layer = 0; layer < data.map[x][y].length; layer++) {
                            var tile_square = data.map[x][y][layer];
                            var ids = tile_square[0].split('-');
                            var image_id = ids[0];
                            var clipping_pos = ids[1].split('.');
                            clipping_pos[0] = parseInt(clipping_pos[0]);
                            clipping_pos[1] = parseInt(clipping_pos[1]);
                            var resource_image = context +'/'+ materials.tilesets[image_id];

                            image_sets[x][y][layer] = new ImageSet({
                                url: resource_image,
                                x: map.tile_w * y,
                                y: map.tile_h * x,
                                sx: map.tile_w * clipping_pos[1],
                                sy: map.tile_h * clipping_pos[0],
                                width: map.tile_w,
                                height: map.tile_h,
                                layer: layer
                            });
                            images.push(resource_image);
                        }
                    }
                }


                ImageLoader.loadAll(images,function(){
                    map.set({
                        width:width,
                        height:height,
                        imageSets:image_sets
                    });
                    callback(map);
                });
            });
        }
    }
});