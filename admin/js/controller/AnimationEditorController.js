app.controller('AnimationEditorController',['$rootScope','AnimationService',function($scope,AnimationService){
    /*scope*/
    $scope.init = function(){
        $scope.page.title = 'Editor de Animações';
    };

    $scope.initAnimation = function(){
        AnimationService.init();
    };

    $scope.data = {
        images:[],
        image:null
    };

    $scope.graphic = {
        rows:1,
        cols:1,
        gridColor:'#000000'
    };

    $scope.animation = {
        frames:[]
    };

    $scope.layers = {
        canvas:[],
        width:560,
        height:400,
        visible:null
    };

    $scope.changeRows = function(val){
        $scope.graphic.rows = val;
        AnimationService.changeRows(val);
    };

    $scope.changeCols = function(val){
        $scope.graphic.cols = val;
        AnimationService.changeCols(val);

    };

    $scope.addImages = function(images){
        $scope.data.images = $scope.data.images.concat(images);
    };

    $scope.changeGraphic = function(){
        AnimationService.changeGraphic($scope.data.image.url);
    };

    $scope.changeGridColor = function(color){
        $scope.graphic.gridColor = color;
        AnimationService.changeGridColor($scope.graphic.gridColor);
    };

    $scope.addFrame = function(){
        $scope.layers.visible = $scope.layers.canvas.length;
        $scope.layers.canvas.push({});
    };

    $scope.removeFrame = function(index){
        $scope.layers.canvas.splice(index,1);
    };

    $scope.selectFrame = function(frame){
        $scope.layers.visible = frame;
    };
}]);



