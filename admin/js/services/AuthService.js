app.factory('AuthService',['$http','Session','$state',function($http,Session,$state){
    return {
        loaded:false,
        login:function(credentials,success,error){
            var self = this;
            $http({
                method:'POST',
                url:'http://localhost:9090/users/login',
                data:credentials,
                withCredentials:true
            }).then(function(response){
                if(response.data.success){
                    var auth = response.data.auth;
                    self.createSession(auth);
                }
                success(response.data.auth.user);
            },error);
        },
        isAuthorized:function(roles){
            if(roles.indexOf('public') !== -1 || roles.indexOf(Session.role) !== -1){
                return true;
            }
            return false;
        },
        createSession:function(auth){
            Session.create(
                auth.sessionId,
                auth.user._id,
                auth.user.role,
                auth.accessToken
            );
        },
        logout: function(){
            Session.destroy();
            $http({
                method:'GET',
                url:'http://localhost:9090/users/logout',
                withCredentials:true
            }).then(function(response){
                if(response.data.success){
                    console.log('User session destroyed');
                }
            });
            $state.go('login');
        },
        isLogged:function(){
            return Session.userId !== null;
        },
        loadSession:function(callback){
            callback = callback === undefined?function(){}:callback;
            var self = this;
            $http({
                method:'GET',
                url:'http://localhost:9090/users/load-session',
                withCredentials:true
            }).then(function(response){
                if(response.data.success){
                    self.createSession(response.data.auth);
                    callback(true);
                }
                else{
                    callback(false);
                }
                self.loaded = true;
            },function(){
                self.loaded = true;
                callback(false);
            });
        }
    };
}]);