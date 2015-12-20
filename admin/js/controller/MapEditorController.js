app.controller('MapEditorController',['$location','$rootScope',function($location,$scope){
    this.init = function(){
        require(['MapEditor'],function(MapEditor){
            console.log('MapEditor module loaded...');
            MapEditor.initialize();
        });
        $scope.page.title = 'Editor de Mapas';
    };
}]);
