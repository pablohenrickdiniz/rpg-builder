require(['paths'],function(){
    require(['bootstrap','MapEditor','Jquery-Conflict'],function(boot,MapEditor,$){
        $(document).ready(function(){
            MapEditor.initialize();
        });
    });
});

