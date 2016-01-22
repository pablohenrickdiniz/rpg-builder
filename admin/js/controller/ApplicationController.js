app.controller('ApplicationController',['$rootScope','USER_ROLES','AuthService','URLS',function($scope,USER_ROLES,AuthService,URLS){
    $scope.currentUser = null;
    $scope.USER_ROLES = USER_ROLES;
    $scope.isAuthorized = AuthService.isAuthorized;
    $scope.isLogged = AuthService.isLogged;

    $scope.setCurrentUser = function(currentUser){
        console.log(currentUser);
        $scope.currentUser = currentUser;
    };

    $scope.logout = AuthService.logout;
    $scope.baseUrl = URLS.BASE_URL;
}]);


