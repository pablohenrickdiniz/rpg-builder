define(['ImageSet','ImageLoader'],function(ImageSet,ImageLoader){
    return {
        paths:{
            Materials:'../../Data/Materials.json',
            Maps:'../../Data/Maps'
        },
        materials:null,
        maps:[],
        _loadImage:function(url,callback){
            var img = document.createElement('img');
            img.src = url;
            img.onload = function(){
                callback(img);
            };
        },
        loadMapFile:function(id,callback){
            var self = this;
            if(self.maps[id] == undefined){
                var url = self.paths.Maps+'/MAP-'+id+'.json';
                $.ajax({
                    url:url,
                    type:'get',
                    dataType:'json',
                    success:function(data){
                        self.maps[id] = data;
                        callback(self.maps[id]);
                    }
                });
            }
            else{
                callback(self.maps[id]);
            }
        },
        _loadMaterials:function(callback){
            var self = this;
            if(self.materials == null){
                $.ajax({
                    url:self.paths.Materials,
                    type:'get',
                    success:function(data){
                        self.materials = data;
                        callback(self.materials);
                    }
                });
            }
            else{
                callback(self.materials);
            }
        },
        loadImageSets:function(id,callback){
            var self = this;
            self.loadMapFile(id,function(data){
                var map = data.map;
                var image_sets = [];
                var tile_w = data.tile_w;
                var tile_h = data.tile_h;
                self._loadMaterials(function(materials){
                    var images = [];
                    for(var x = 0; x < map.length;x++){
                        for(var y = 0; y < map[x].length;y++){
                            for(var layer = 0; layer < map[x][y].length;layer++){
                                var tile_square = map[x][y][layer];
                                var ids = tile_square[0].split('-');
                                var image_id = ids[0];
                                var clipping_pos = ids[1].split('.');
                                clipping_pos[0] = parseInt(clipping_pos[0]);
                                clipping_pos[1] = parseInt(clipping_pos[1]);
                                var resource_image = materials.tilesets[image_id];

                                var image_set = new ImageSet({
                                    image:resource_image,
                                    x:tile_w*y,
                                    y:tile_h*x,
                                    sx:tile_w*clipping_pos[1],
                                    sy:tile_h*clipping_pos[0],
                                    width:tile_w,
                                    height:tile_h,
                                    layer:layer
                                });
                                image_sets.push(image_set);
                                images.push(resource_image);
                            }
                        }
                    }
                    ImageLoader.loadAll(images,function(){
                        callback(image_sets);
                    });
                });
            });
        }
    };
});