app.controller('TilesetsController',['$rootScope',function($scope){
    $scope.tilesets = [];
    $scope.modalVisible = false;
    $scope.tileset = {
        imagem:''
    };

    $scope.showModal = function(){
        $scope.modalVisible = true;
    };

    $scope.hideModal = function(){
        $scope.modalVisible = false;
    };

    $scope.submit = function(){

    };

    $scope.imageChange = function(e){
        console.log($scope.tileset);
    };
}]);