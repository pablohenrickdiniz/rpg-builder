define(function(){
    return {
        loadAll:function(images,callback){
            var self = this;
            if(images.length > 0){
                var url = images.pop();
                var img = document.createElement('img');
                img.src = url;
                img.onload = function(){
                    self.loadAll(images,callback);
                };
            }
            else{
                callback();
            }
        }
    };
});