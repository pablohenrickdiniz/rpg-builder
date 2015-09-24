define(['CE','React','InputImage','InputControls'],function(CE,React,InputImage,InputControls){
    var AnimationEditor = {
        animationCanvas:null,
        animationImage:null,
        accordion:null,
        initialize:function(){
            var self = this;
            self.getAnimationCanvas();
            self.getAnimationImage();
            React.render(
                <InputImage title="Adicionar Gráfico" multiple="true" add={self.addGraphics}/>,
                document.getElementById('input-image-container')
            );
            React.render(
                <InputControls skin="black-skin" />,
                document.getElementById('controls-container')
            );
        },
        addGraphics:function(urls){


        },
        getAnimationCanvas:function(){
            var self = this;
            if(self.animationCanvas == null){
                self.animationCanvas = CE.createEngine({
                    container:'#canvas-container',
                    width:'100%',
                    height:600
                });
            }
            return self.animationCanvas;
        },
        getAnimationImage:function(){
            var self = this;
            if(self.animationImage == null){
                self.animationCanvas = CE.createEngine({
                    container:'#animations',
                    width:'100%',
                    height:600
                });
            }
            return self.animationImage;
        }
    };
    return AnimationEditor;
});