app.controller('UserController',['$location','$rootScope','$http',function($location,$scope,$http){
    $scope.username = '';
    $scope.password = '';
    $scope.sending = false;
    $scope.errors = {};

    $scope.isAdmin = function(){
        return true;
    };

    $scope.init = function(){
        $scope.page.title = 'Efetuar Login';
    };

    $scope.submit = function(){
        $scope.sending = true;
        $http({
            method:'post',
            url:'http://localhost:9090/users/login',
            data:{
                username:$scope.username,
                password:$scope.password
            }
        }).then(function(response){
            $scope.errors = {};
        },function(response){
            $scope.errors.connectionError = true;
            $scope.sending = false;
        });
    };
}]);