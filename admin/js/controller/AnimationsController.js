app.controller('AnimationsController',['$rootScope','$http','$timeout','URLS','ResourceService','$localStorage','TaskService',function($scope,$http,$timeout,URLS,ResourceService,$localStorage,TaskService){
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

    $scope.remove = function(id) {
        ResourceService.remove('animations',id);
        $scope.changePage($scope.pagination.current);
    };

    $scope.load = function(){
        ResourceService.loadResourcePage('animations',1,8,function(animations){
            $scope.animations = animations;
        });
    };

    $scope.changePage = function(page){
        ResourceService.loadResourcePage('animations',page,8,function(animations){
            $scope.animations = animations;
        });
    };

    $scope.afterEach = function(data){
        if(data.success){
            $scope.storage.resources[data.type].unshift(data.doc);
            $scope.changePage($scope.pagination.current);
        }
    };

    $scope.sincronize = function(){
        var task = {
            action:'SINCRONIZE_RESOURCES',
            date:new Date(),
            priority:2,
            data:{
                name:'animations'
            }
        };
        TaskService.add(task);
    };

    $scope.storage = $localStorage;
}]);