app.factory('AuthService',['$rootScope','$http','Session','$state','URLS',function($scope,$http,Session,$state,URLS){
    return {
        loaded:false,
        login:function(credentials,success,error){
            var self = this;
            $http({
                method:'POST',
                url:URLS.BASE_URL+'users/login',
                data:credentials,
                withCredentials:true
            }).then(function(response){
                if(response.data.success){
                    var auth = response.data.auth;
                    self.createSession(auth);
                    $scope.setCurrentUser(auth.user);
                }
                else{
                    error();
                }
            },error);
        },
        isAuthorized:function(){
            var roles = [];
            for(var i = 0; i < arguments.length;i++){
                roles = roles.concat(arguments[i]);
            }

            if(roles.indexOf('public') !== -1 || roles.indexOf(Session.role) !== -1){
                return true;
            }
          //  return false;
            return true;
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
            $scope.setCurrentUser(null);
            $http({
                method:'GET',
                url:URLS.BASE_URL+'users/logout',
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
                url:URLS.BASE_URL+'users/load-session',
                withCredentials:true
            }).then(function(response){
                if(response.data.success){
                    var auth = response.data.auth;
                    self.createSession(auth);
                    $scope.setCurrentUser(auth.user);
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