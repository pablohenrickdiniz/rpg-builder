app.controller('UserController',['$location','$rootScope','AuthService',function($location,$scope,AuthService){
    $scope.credentials = {
        username:'',
        password:''
    };
    $scope.sending = false;
    $scope.errors = {};
    $scope.response = {};
    $scope.auth = {};

    $scope.isAdmin = function(){
        return true;
    };

    $scope.init = function(){
        $scope.page.title = 'Efetuar Login';
    };

    var self = this;

    $scope.submit = function(){
        $scope.sending = true;
        AuthService.login($scope.credentials,function($auth){
            $scope.credentials = {};
            $scope.sending = false;
            $scope.auth = $auth;
        },function(){
            $scope.sending = false;
            $scope.errors.connectionError = true;
        });
    };
}]);