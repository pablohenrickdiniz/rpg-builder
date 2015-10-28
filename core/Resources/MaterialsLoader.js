define(['jquery'],function($){
    return {
        materials:[],
        load:function(url,callback){
            var self = this;
            var a = document.createElement('a');
            a.href = url;
            url = $(a).prop('href');
            var context = url.substring(0,url.lastIndexOf('/'));
            if(self.materials[url] == undefined){
                console.log('loading materials...');
                $.ajax({
                    url:url,
                    type:'get',
                    dataType:'json',
                    success:function(data){
                        console.log('materials loaded...');
                        self.materials[url] = data;
                        callback(self.materials[url],context);
                    }
                });
            }
            else{
                callback(self.materials[url]);
            }
        }
    };
});