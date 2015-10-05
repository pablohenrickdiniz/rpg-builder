(function(){
    var app = angular.module('rpgAdmin',['ngRoute','ngAnimate']);

    app.config(['$routeProvider',function($routeProvider){
        $routeProvider.when('/panel',{
            templateUrl:'templates/Panel/index.html',
            controller:'PanelController',
            controllerAs:'Panel'
        }).when('/',{
            redirectTo:'/panel'
        }).when('/map-editor',{
            templateUrl:'templates/Pages/map-editor.html',
            controller:'MapEditorController',
            controllerAs:'MapEditorCtrl'
        }).when('/animation-editor',{
            templateUrl:'templates/Pages/animation-editor.html',
            controller:'AnimationEditorController',
            controllerAs:'AnimEditorCtrl'
        }).otherwise({
            redirectTo:'/'
        });
    }]);

    app.run(function($rootScope,$location){
        $rootScope.isActive = function(url){
            var path = $location.path();
            var index_1 = path.indexOf('/');
            var index_2 = path.lastIndexOf('/');
            if(index_2 != -1 && index_2 != index_1){
                path = path.substring(0,index_2);
            }

            return path == url;
        };

        $rootScope.page = {
            title :'Bem Vindo Ao Painel Administrativo do Rpg Builder!'
        };
    });

    app.directive('adminSidebar',function(){
        return {
            restrict:'E',
            templateUrl:'templates/Elements/admin_sidebar.html'
        };
    });

    app.directive('adminHeader',function(){
        return {
            restrict:'E',
            templateUrl:'templates/Elements/admin_header.html'
        }
    });

    app.controller('PanelController',['$rootScope',function($scope){
        var self = this;
        self.init = function(){
            $scope.page.title = 'Bem Vindo Ao Painel Administrativo do Rpg Builder!'
        };
    }]);

    app.controller('MapEditorController',['$location','$rootScope',function($location,$scope){
        this.init = function(){
            require(['MapEditor'],function(MapEditor){
                MapEditor.initialize();
            });
            $scope.page.title = 'Editor de Mapas';
        };
    }]);


    app.controller('AnimationEditorController',['$rootScope',function($scope){
        var self = this;
        self.init = function(){
            require(['AnimationEditor'],function(AnimationEditor){
                AnimationEditor.initialize();
            });
            $scope.page.title = 'Editor de Animações';
        };
    }]);
})();

