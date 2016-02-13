app.directive('progressBar',function(){
    return {
        restrict:'E',
        templateUrl:'templates/Elements/progress_bar.html',
        replace:true,
        scope:{
            progress:'=progress'
        }
    };
});