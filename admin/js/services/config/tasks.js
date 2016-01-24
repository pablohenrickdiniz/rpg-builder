app.service('tasks',['TaskService','$http','URLS','$localStorage',function(TaskService,$http,URLS,$localStorage){
    return function(){
        TaskService.on('REMOVE_ANIMATION_RESOURCE',function(data,success,error){
            $http({
                method:'DELETE',
                url:URLS.BASE_URL+'animations/delete',
                params:{
                    id:data.id
                }
            }).then(function(response){
                if(response.data.success){
                    success();
                }
            },function(){
                error();
            });
        });

        TaskService.on('SINCRONIZE_ANIMATIONS',function(data,success,error){
            $http({
                method:'GET',
                url:URLS.BASE_URL+'animations/list'
            }).then(function(response){
                if(response.data.success){
                    $localStorage.resources.animations = response.data.animations;
                    success();
                }
                else{
                    error();
                }
            },function(){
                error();
            });
        });


        TaskService.initialize();
    };
}]);