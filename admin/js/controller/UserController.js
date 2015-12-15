app.controller('UserController',['$location','$rootScope','AuthService',function($location,$scope,AuthService){
    $scope.sending = false;
    $scope.errors = {};
    $scope.response = {};
    $scope.auth = {};

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

    var self = this;

    $scope.submit = function(){
        $scope.sending = true;
        AuthService.login($scope.credentials,function($auth){
            $scope.sending = false;
            $scope.auth = $auth;
            $scope.errors = {};
        },function(){
            $scope.sending = false;
            $scope.errors.connectionError = true;
        });
    };
}]);
