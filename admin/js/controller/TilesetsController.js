app.controller('TilesetsController',['$rootScope','$http','$timeout','URLS','ResourceService','$localStorage','TaskService',function($scope,$http,$timeout,URLS,ResourceService,$localStorage,TaskService){
    $scope.modalVisible = false;
    $scope.pagination = {
        current:1
    };

    $scope.tilesets = [];
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
        ResourceService.remove('tilesets',id);
        $scope.changePage($scope.pagination.current);
    };

    $scope.load = function(){
        ResourceService.loadResourcePage('tilesets',1,8,function(tilesets){
            $scope.tilesets = tilesets;
        });
    };

    $scope.changePage = function(page){
        ResourceService.loadResourcePage('tilesets',page,8,function(tilesets){
            $scope.tilesets = tilesets;
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
                name:'tilesets'
            }
        };
        TaskService.add(task);
    };

    $scope.storage = $localStorage;
}]);