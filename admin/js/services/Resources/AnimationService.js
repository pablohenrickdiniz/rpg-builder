app.service('AnimationService',['$localStorage','$http','URLS','TaskService','ImageLoader',function($localStorage,$http,URLS,TaskService,ImageLoader){
    var self = this;

    this.load = function(callback){
        if(!$localStorage.resources){
            $localStorage.resources = {};
        }
        if(!$localStorage.resources.animations){
            $http({
                method:'GET',
                url:URLS.BASE_URL+'animations/list'
            }).then(function(response){
                if(response.data.success){
                    $localStorage.resources.animations = response.data.animations;
                    if(callback){
                        callback();
                    }
                }
            });
        }
        else if(callback){
            callback();
        }
    };

    this.loadPage = function(page,limit,callback){
        self.load(function(){
            var animations = $localStorage.resources.animations.slice((page-1)*limit,(limit*page));
            callback(animations);
        });
    };

    this.remove = function(index){
        if($localStorage.resources.animations[index] !== undefined){
            var animation = $localStorage.resources.animations[index];
            $localStorage.resources.animations.splice(index,1);
            var task = {
                data:{
                    id:animation._id
                },
                date:new Date(),
                action:'REMOVE_ANIMATION_RESOURCE',
                priority:1
            };
            TaskService.add(task);
        }
    };

    this.add = function(data,success,error){
        var fd = new FormData();
        fd.append('file',data.file);
        Object.keys(data.fields).forEach(function(index){
            fd.append(index,data.fields[index]);
        });
        $http({
            method:'POST',
            url:URLS.BASE_URL+'animations/upload',
            data:fd,
            withCredentials:true,
            transformRequest:angular.identity,
            headers:{'Content-Type':undefined}
        }).then(function(response){
            if(response.data.success){
                $localStorage.resources.animations.unshift(response.data.animation);
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