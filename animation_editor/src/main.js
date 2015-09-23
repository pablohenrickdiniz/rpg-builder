requirejs(['./paths'],function(){
    require(['Jquery-Conflict','AnimationEditor','bootstrap'],function($,AnimationEditor){
        $(document).ready(function(){
            AnimationEditor.initialize();
        });
    });
});