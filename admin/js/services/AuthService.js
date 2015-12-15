app.factory('AuthService',['$http','Session',function($http,Session){
    var auth_service = {};

    auth_service.login = function(credentials,success,error){
        $http({
            method:'POST',
            url:'http://localhost:9090/users/login',
            data:credentials
        }).then(function(response){
            if(response.data.success){
                Session.create(response.data.auth);
            }
            success(response.data.auth);
        },error);
    };

    auth_service.isAuthorized = function(roles){
        console.log(roles);
        if(roles.indexOf('public') !== -1){
            return true;
        }
        return false;
    };

    auth_service.logout = function(){
        Session.destroy();
    };

    auth_service.isAuthenticated = function(){
        return Session.userId !== null;
    };


    return auth_service;
}]);