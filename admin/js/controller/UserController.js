app.controller('UserController',['$location','$rootScope','AuthService',function($location,$scope,AuthService){
    var self = this;
    self.username  ='';
    self.password = '';
    $scope.sending = false;
    $scope.errors = {};
    $scope.response = {};

    $scope.isAdmin = function(){
        return true;
    };

    $scope.init = function(){
        $scope.page.title = 'Efetuar Login';
    };

    $scope.submit = function(){
        $scope.sending = true;
        AuthService.login({
            username:self.username,
            password:self.password
        },function(){
            self.username = '';
            self.password = '';
            $scope.sending = false;
        },function(){
            $scope.sending = false;
            $scope.errors.connectionError = true;
        });
    };
}]);