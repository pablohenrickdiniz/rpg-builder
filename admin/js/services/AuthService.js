app.factory('AuthService',['$http','Session',function($http,Session){
    var auth_service = {};

    auth_service.login = function(credentials,success,error){
        $http({
            method:'POST',
            url:'http://localhost:9090/users/login',
            data:credentials
        }).then(function(response){
            if(response.data.success){
                console.log(response.data.auth);
                Session.create(response.data.auth);
            }
            success();
        },error());
    };

    auth_service.isAuthorized = function(roles){
        console.log(roles);
        if(roles.indexOf('public') !== -1){
            return true;
        }
        return false;
    };


    return auth_service;
}]);