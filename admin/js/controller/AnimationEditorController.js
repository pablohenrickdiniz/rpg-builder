app.controller('AnimationEditorController',['$rootScope',function($scope){
    var self = this;
    self.init = function(){
        require(['AnimationEditor'],function(AnimationEditor){
            console.log('AnimationEditor module loaded...');
            AnimationEditor.initialize();
        });
        $scope.page.title = 'Editor de Animações';
    };
}]);

