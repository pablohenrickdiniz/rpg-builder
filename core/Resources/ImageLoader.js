define(['jquery'],function($){
    return {
        loadedSounds:[],
        loadAll:function(images,loaded,callback){
            var self = this;
            if(images.length > 0){
                var url = images.pop();
                self.load(url,function(img){
                    loaded.push(img);
                    self.loadAll(images,loaded,callback);
                });
            }
            else{
                callback(loaded);
            }
        },
        load:function(url,callback){
            var self = this;
            var a = document.createElement('a');
            a.href = url;
            url = $(a).prop('href');
            if(self.loadedSounds[url] == undefined){
                var img = new Image();
                img.src = url;
                img.onload = function(){
                    self.loadedSounds[url] = img;
                    callback(img);
                };
            }
            else{
                callback(self.loadedSounds[url]);
            }
        }
    };
});