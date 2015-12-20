app.controller('ApplicationController',['$rootScope','USER_ROLES','AuthService',function($scope,USER_ROLES,AuthService){
    $scope.currentUser = null;
    $scope.USER_ROLES = USER_ROLES;
    $scope.isAuthorized = AuthService.isAuthorized;
    $scope.isLogged = AuthService.isLogged;

    $scope.setCurrentUser = function(currentUser){
        $scope.currentUser = currentUser;
    };

    $scope.logout = AuthService.logout;
}]);


