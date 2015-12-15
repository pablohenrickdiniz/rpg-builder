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
    };
});

app.directive('loginForm',function(){
    return {
        restrict:'E',
        templateUrl:'templates/Elements/login_form.html'
    };
});

