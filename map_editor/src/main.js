require(['paths'],function(){
    require(['bootstrap','MapEditor','jquery-conflict'],function(boot,MapEditor,$){
        $(document).ready(function(){
            MapEditor.initialize();
        });
    });
});

