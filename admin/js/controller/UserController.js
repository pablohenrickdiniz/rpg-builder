app.controller('UserController',['$location','$rootScope','AuthService','$state',function($location,$scope,AuthService,$state){
    $scope.sending = false;
    $scope.errors = {};

    $scope.isAdmin = function(){
        return true;
    };

    $scope.init = function(){
        $scope.page.title = 'Efetuar Login';
        $scope.credentials = {
            username:'',
            password:''
        };
    };

    $scope.submit = function(){
        $scope.sending = true;
        AuthService.login($scope.credentials,function($user){
            $scope.setCurrentUser($user);
            $state.go('panel');
            $scope.sending = false;
        },function(){
            $scope.sending = false;
        });
    };
}]);
