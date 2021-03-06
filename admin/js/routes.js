app.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
    $urlRouterProvider.otherwise('/');

    $stateProvider.state('panel',{
        url:'/panel',
        templateUrl:'templates/Panel/index.html',
        controller:'PanelController as Panel',
        data:{
            authorizedRoles:['admin']
        }
    }).state('resources', {
        url: '/resources',
        templateUrl: 'templates/Pages/resources.html',
        data:{
            authorizedRoles:['admin']
        }
    }).state('tasks',{
        url:'/tasks',
        templateUrl: 'templates/Pages/tasks.html',
        data:{
            authorizedRoles:['admin']
        }
    }).state('tilesets',{
        url:'/resources/tilesets',
        templateUrl:'templates/Pages/tilesets.html',
        controller:'TilesetsController',
        data:{
            authorizedRoles:['admin']
        }
    }).state('animations',{
        url:'/resources/animations',
        templateUrl:'templates/Pages/animations.html',
        controller:'AnimationsController',
        data:{
            authorizedRoles:['admin']
        }
    }).state('map-editor', {
        url: '/map-editor',
        templateUrl: 'templates/Pages/map-editor.html',
        controller: 'MapEditorController as MapEditorCtrl',
        data:{
            authorizedRoles:['admin']
        }
    }).state('animation-editor', {
        url: '/animation-editor',
        templateUrl: 'templates/Pages/animation-editor.html',
        controller: 'AnimationEditorController',
        data:{
            authorizedRoles:['admin']
        }
    }).state('login',{
        url:'/login',
        templateUrl:'templates/Elements/login_form.html',
        controller:'UserController',
        data:{
            authorizedRoles:['public']
        }
    }).state('init',{
        url:'/',
        redirectTo:'panel'
    });
}]);
