app.controller('AnimationsController',['$rootScope','$http','$timeout','URLS','AnimationService','$localStorage','TaskService',function($scope,$http,$timeout,URLS,AnimationService,$localStorage,TaskService){
    $scope.modalVisible = false;
    $scope.pagination = {
        current:1
    };

    $scope.animations = [];
    $scope.metadata = {
        files:[],
        images:[]
    };

    $scope.showModal = function(){
        $scope.modalVisible = true;
        $scope.animation = null;
    };

    $scope.hideModal = function(){
        $scope.modalVisible = false;
    };

    $scope.remove = function(index) {
        index = (($scope.pagination.current-1)*8)+index;
        AnimationService.remove(index);
        $scope.changePage($scope.pagination.current);
    };

    $scope.load = function(){
        AnimationService.loadPage(1,8,function(animations){
            $scope.animations = animations;
        });
    };

    $scope.changePage = function(page){
        AnimationService.loadPage(page,8,function(animations){
            $scope.animations = animations;
        });
    };

    $scope.afterEach = function(data){
        if(data.success){
            $scope.storage.resources.animations.unshift(data.animation);
            $scope.changePage($scope.pagination.current);
        }
    };

    $scope.sincronize = function(){
        var task = {
            action:'SINCRONIZE_ANIMATIONS'
        };
        TaskService.add(task);
    };

    $scope.storage = $localStorage;
}]);