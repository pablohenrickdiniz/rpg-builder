app.service('tasks',['TaskService','$http','URLS','$localStorage',function(TaskService,$http,URLS,$localStorage){
    return function(){
        TaskService.on('REMOVE_GRAPHIC',function(data,success,error){
            $http({
                method:'DELETE',
                url:URLS.BASE_URL+'graphics/delete',
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

        TaskService.on('SINCRONIZE_RESOURCES',function(data,success,error){
            $http({
                method:'GET',
                url:URLS.BASE_URL+data.name+'/list'
            }).then(function(response){
                if(response.data.success){
                    $localStorage.resources[data.name] = response.data[data.name];
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