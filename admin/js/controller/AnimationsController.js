app.controller('AnimationsController',['$rootScope','$http','$timeout','URLS','$localStorage',function($scope,$http,$timeout,URLS,$localStorage){
    $scope.storage = $localStorage;
    $scope.modalVisible = false;
    $scope.page = 1;

    $scope.showModal = function(){
        $scope.modalVisible = true;
        $scope.animation = null;
    };

    $scope.hideModal = function(){
        $scope.modalVisible = false;
    };

    $scope.remove = function(index) {
        $scope.storage.animations.splice(index,1);
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

    $scope.loadData = function(){
        if(!$scope.storage.animations){
            self.list(function(data){
                $scope.storage.animations = data.animations;
            });
        }
    };

    $scope.loadResponse = function(responses){
        responses.forEach(function(response){
            if(response.success){
                console.log(response);
                $scope.storage.animations.push(response.animation);
            }
        });
    };

    $scope.changePage = function(page){
        $scope.page = page;
    };
}]);