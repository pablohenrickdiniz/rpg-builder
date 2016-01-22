app.controller('AnimationsController',['$rootScope','$http','$timeout','URLS','$cacheFactory',function($scope,$http,$timeout,URLS,$cacheFactory){
    $scope.animations = [];
    $scope.modalVisible = false;
    $scope.page = 1;
    $scope.searching = false;

    $scope.showModal = function(){
        $scope.modalVisible = true;
        $scope.animation = null;
    };

    $scope.hideModal = function(){
        $scope.modalVisible = false;
    };

    $scope.remove = function(index) {
        $scope.animations.splice(index,1);
    };

    $scope.changePage = function(page){
        $scope.page = page;
    };

    var self = this;

    self.list = function(success,error){
        console.log('loading from server...');
        $http({
            method:'GET',
            url:URLS.BASE_URL+'animations/list'
        }).then(function(response){
            if(response.data.success){
                success(response.data);
            }
            else{
                error();
            }
        },function(){
            error();
        });
    };
}]);