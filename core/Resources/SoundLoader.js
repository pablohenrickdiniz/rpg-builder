define(function(){
    return {
        loadedSounds:[],
        loadAll:function(sounds,callback){
            var self = this;
            if(sounds.length > 0){
                var url = sounds.pop();
                self.load(url,function(){
                    self.loadAll(sounds,callback);
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
            if(self.loadedSounds[url] == undefined){
                var audio = document.createElement('audio');
                audio.src = url;
                audio.addEventListener('canplaythrough', function(){
                    self.loadedSounds[url] = audio;
                    callback(audio);
                }, false);
            }
            else{
                callback(self.loadedSounds[url]);
            }
        }
    }
});