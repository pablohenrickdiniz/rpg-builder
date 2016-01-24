app.controller('ResourcesController',['$rootScope','$localStorage',function($scope,$localStorage){
    $scope.store = $localStorage;
}]);