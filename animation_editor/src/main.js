requirejs(['./paths'],function(){
    require(['jquery','AnimationEditor','bootstrap'],function($,AnimationEditor){
        $(document).ready(function(){
            AnimationEditor.initialize();
        });
    });
});