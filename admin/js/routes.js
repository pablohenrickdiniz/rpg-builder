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
        url: '/resources-center',
        templateUrl: 'templates/Pages/resources.html',
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
        controller: 'AnimationEditorController as AnimEditorCtrl',
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
