app.controller('AnimationsController',['$rootScope',function($scope){
    $scope.animations = [];
    $scope.modalVisible = false;
    $scope.animation = {
        imagem:''
    };
    $scope.images = [];

    $scope.showModal = function(){
        $scope.modalVisible = true;
        $scope.animation = null;
    };

    $scope.hideModal = function(){
        $scope.modalVisible = false;
    };

    $scope.submit = function(){

    };

    $scope.imageChange = function(e){
        console.log($scope.tileset);
    };

    $scope.import = function(images){
        $scope.images = images;
    };

    $scope.uploadFiles = function(){

    };
}]);