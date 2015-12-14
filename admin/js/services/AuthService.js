app.factory('AuthService',['$http','Session',function($http,Session){
    var auth_service = {};

    auth_service.login = function(){

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