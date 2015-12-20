app.factory('AuthService',['$http','Session',function($http,Session){
    var auth_service = {};

    auth_service.login = function(credentials,success,error){
        $http({
            method:'POST',
            url:'http://localhost:9090/users/login',
            data:credentials,
            withCredentials:true
        }).then(function(response){
            if(response.data.success){
                var auth = response.data.auth;
                Session.create(
                    auth.sessionId,
                    auth.user._id,
                    auth.user.role,
                    auth.accessToken
                );
            }
            success(response.data.auth.user);
        },error);
    };

    auth_service.isAuthorized = function(roles){
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