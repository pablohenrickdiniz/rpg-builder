app.factory('ImageLoader',function(){
    var loader = {
        loadedImages:[],
        loadAll:function(images,callback){
            loadAll(images,[],callback);
        },
        load:function(url,callback){
            var self = this;
            var a = document.createElement('a');
            a.href = url;
            url = angular.element(a).prop('href');
            if(self.loadedImages[url] === undefined){
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
        },
        toDataURL:function(img,callback){
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img,0,0);
            var dataUrl = canvas.toDataURL();
            callback(dataUrl);
            canvas = null;
        }
    };

    var loadAll = function(images,loaded,callback){
        loaded = loaded === undefined?[]:loaded;
        if(images.length > 0){
            var url = images.shift();
            loader.load(url,function(img){
                loaded.push(img);
                loadAll(images,loaded,callback);
            });
        }
        else if(typeof callback === 'function'){
            callback(loaded);
        }
    };

    return loader;
});