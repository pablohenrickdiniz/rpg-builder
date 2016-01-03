app.controller('AnimationEditorController',['$rootScope','AnimationService','$document',function($scope,AnimationService,$document){
    /*scope*/
    $scope.init = function(){
        $scope.page.title = 'Editor de Animações';
    };

    $scope.animationData = {
        animation:{
            frames:[]
        },
        layers:{
            canvas:[],
            width:560,
            height:400,
            visible:null
        },
        graphic:{
            rows:1,
            cols:1,
            gridColor:'#000000',
            images:[],
            image:null
        },
        functions:{
            initAnimation:function(){
                AnimationService.init();
            },
            addElement:function(element){
                AnimationService.addFrame(element);
            }
        }
    };


    $scope.changeRows = function(val){
        $scope.animationData.graphic.rows = val;
        AnimationService.changeRows(val);
    };

    $scope.changeCols = function(val){
        $scope.animationData.graphic.cols = val;
        AnimationService.changeCols(val);

    };

    $scope.addImages = function(images){
        $scope.animationData.graphic.images = $scope.animationData.graphic.images.concat(images);
    };

    $scope.changeGraphic = function(){
        AnimationService.changeGraphic($scope.animationData.graphic.image.url);
    };

    $scope.changeGridColor = function(color){
        $scope.graphic.gridColor = color;
        AnimationService.changeGridColor($scope.animationData.graphic.gridColor);
    };

    $scope.addFrame = function(){
        $scope.animationData.layers.visible = $scope.animationData.layers.canvas.length;
        $scope.animationData.layers.canvas.push({});
    };

    $scope.removeFrame = function(index){
        $scope.animationData.layers.canvas.splice(index,1);
        AnimationService.removeFrame(index);
    };

    $scope.selectFrame = function(frame){
        $scope.animationData.layers.visible = frame;
    };
}]);



