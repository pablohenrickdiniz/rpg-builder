app.controller('AnimationsController',['$rootScope','$http','$timeout','SERVERS',function($scope,$http,$timeout,SERVERS){
    $scope.animations = [];
    $scope.count = 0;
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

    $scope.list = function(page,old){
        if(!$scope.searching){
            $scope.searching = true;
            page = page === undefined?$scope.page:page;
            old = old === undefined?page:old;
            $http({
                method:'GET',
                url:SERVERS.builder+'animations/list',
                params:{
                    page:page
                }
            }).then(function(response){
                if(response.data.success){
                    $scope.animations = response.data.animations;
                    $scope.count = response.data.count;
                }
                else{
                    $scope.page = old;
                }
            },function(){
                $scope.page = old;
            }).finally(function(){
                $scope.searching = false;
            });
        }
    };

    $scope.remove = function(index){
        if(!$scope.searching){
            $scope.searching = true;
            var animation = $scope.animations[index];
            $http({
                method:'DELETE',
                url:SERVERS.builder+'animations/delete',
                params:{
                    id:animation._id
                }
            }).then(function(response) {
                if (response.data.success) {
                    $timeout(function(){
                        $scope.list();
                    });
                }
            }).finally(function(){
                $scope.searching = false;
            });
        }
    };
}]);