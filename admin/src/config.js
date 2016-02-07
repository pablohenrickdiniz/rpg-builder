(function(){
    Object.defineProperty(window,'ENVIRONMENT',{
        value:'PRODUCTION'
    });

    var $_console = window.console;
    Object.defineProperty(window,'console',{
        get:function(){
            return $_console;
        }
    });
})();