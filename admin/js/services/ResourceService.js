app.service('ResourceService',['$localStorage','$http','URLS','TaskService','ImageLoader',function($localStorage,$http,URLS,TaskService,ImageLoader){
    var self = this;
    self.names = [
        'animations',
        'tilesets',
        'characters'
    ];

    this.loadResources = function(callback){
        self.load(0,callback);
    };

    this.load = function(pos,callback,only){
        if(pos < self.names.length){
            var name = self.names[pos];
            if(!$localStorage.resources){
                $localStorage.resources = {};
            }

            if(!$localStorage.resources[name]){
                $http({
                    method:'GET',
                    url:URLS.BASE_URL+'graphics/list',
                    params:{
                        type:name
                    }
                }).then(function(response){
                    if(response.data.success){
                        console.log(response.data.graphics);
                        $localStorage.resources[name] = response.data.graphics;
                    }
                }).finally(function(){
                    if(!only){
                        self.load(pos+1,callback);
                    }
                    else if(typeof callback === 'function'){
                        callback();
                    }
                });
            }
            else{
                if(!only){
                    self.load(pos+1,callback);
                }
                else if(typeof callback === 'function'){
                    callback();
                }
            }
        }
        else if(typeof callback === 'function'){
            callback();
        }
    };

    this.loadResourcePage = function(name,page,limit,callback){
        var index = self.names.indexOf(name);
        if(index !== -1 ){
            self.load(index,function(){
                var resources = $localStorage.resources[name].slice((page-1)*limit,(limit*page));
                callback(resources);
            },true);
        }
    };

    this.findResourceIndexById = function(name,id){
        var i = 0;
        var size = $localStorage.resources[name].length;
        for(i = 0; i < size;i++){
            if($localStorage.resources[name][i]._id == id){
                return i;
            }
        }
        return -1;
    };

    this.remove = function(name,id){
        var index = this.findResourceIndexById(name,id);
        if(index !== -1){
            var resource = $localStorage.resources[name][index];
            $localStorage.resources[name].splice(index,1);
            var task = {
                data:{id:id},
                date:new Date(),
                action:'REMOVE_GRAPHIC',
                priority:1
            };
            TaskService.add(task);
        }
    };

    this.add = function(name,data,success,error){
        var fd = new FormData();
        fd.append('file',data.file);
        Object.keys(data.fields).forEach(function(index){
            fd.append(index,data.fields[index]);
        });
        $http({
            method:'POST',
            url:URLS.BASE_URL+'graphics/upload',
            data:fd,
            withCredentials:true,
            transformRequest:angular.identity,
            headers:{'Content-Type':undefined}
        }).then(function(response){
            if(response.data.success){
                $localStorage.resources[name].unshift(response.data[name]);
                success();
            }
            else{
                error();
            }
        },function(){
            error();
        });
    };
}]);