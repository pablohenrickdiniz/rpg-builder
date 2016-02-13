app.directive('inputColor',function(){
    return {
        restrict:'A',
        templateUrl:'templates/Elements/input_color.html',
        scope:{
            ngChange:'&',
            value:'@value',
            title:'@title',
            class:'@class'
        },
        replace:true,
        link:function(scope, element){
            var inputColor = element.find('input');
            inputColor.on('change',function(e){
                scope.value = e.target.value;
                scope.change();
            });

            scope.change = function(){
                console.log(scope.value);
                scope.ngChange()(scope.value);
            };
        }
    };
});