app.run(['$rootScope','$state','$location','AuthService',function($rootScope,$state,$location,AuthService){
    $rootScope.isActive = function(url){
        var path = $location.path();
        var index_1 = path.indexOf('/');
        var index_2 = path.lastIndexOf('/');
        if(index_2 !== -1 && index_2 != index_1){
            path = path.substring(0,index_2);
        }
        return path === url;
    };

    $rootScope.page = {
        title :'Bem Vindo Ao Painel Administrativo do Rpg Builder!'
    };

    $rootScope.$on('$stateChangeStart', function (event, next,params) {
        if(next.redirectTo){
            event.preventDefault();
            $state.go(next.redirectTo,params);
        }
        else if(!AuthService.isAuthorized(next.data.authorizedRoles)){
            event.preventDefault();
            $state.go('login',params);
        }
    });
}]);