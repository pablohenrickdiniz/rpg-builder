app.controller('AnimationEditorController',['$rootScope',function($scope){
    $scope.AnimationEditor = null;
    $scope.rows = 1;
    $scope.cols = 1;

    $scope.data = {
        images:[],
        image:null
    };


    $scope.init = function(){
        require(['AnimationEditor'],function(AnimationEditor){
            $scope.AnimationEditor = AnimationEditor;
            $scope.$apply();
            $scope.AnimationEditor.initialize();
        });
        $scope.page.title = 'Editor de Animações';
    };

    $scope.changeRows = function(val){
        $scope.rows = val;
        $scope.AnimationEditor.rowsChange(val);
    };

    $scope.changeCols = function(val){
        $scope.cols = val;
        $scope.AnimationEditor.colsChange(val);
    };

    $scope.addImages = function(images){
        $scope.data.images = $scope.data.images.concat(images);
    };

    $scope.changeGraphic = function(){
        $scope.AnimationEditor.changeGraphic($scope.data.image.url);
    };
}]);



