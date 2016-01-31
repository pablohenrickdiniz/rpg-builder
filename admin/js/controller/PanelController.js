app.controller('PanelController',['$rootScope',function($scope){
    var self = this;
    self.init = function(){
        $scope.page.title = 'Bem Vindo Ao Painel Administrativo do Rpg Builder!'
    };
}]);
