define(['Jquery-Conflict'],function($){
    return {
        loadedImages:[],
        loadAll:function(images,callback){
            var self = this;
            if(images.length > 0){
                var url = images.pop();
                self.load(url,function(){
                    self.loadAll(images,callback);
                });
            }
            else{
                callback();
            }
        },
        load:function(url,callback){
            var self = this;
            var a = document.createElement('a');
            a.href = url;
            url = $(a).prop('href');
            if(self.loadedImages[url] == undefined){
                var img = new Image();
                img.src = url;
                img.onload = function(){
                    self.loadedImages[url] = img;
                    callback(img);
                };
            }
            else{
                callback(self.loadedImages[url]);
            }
        }
    };
});