define(['CE','React','Accordion','InputImage'],function(CE,React,Accordion,InputImage){
    return {
        animationCanvas:null,
        accordion:null,
        graphics:[],
        initialize:function(){
            var self = this;
            React.render(
                <InputImage title="Adicionar Gráfico" multiple="true" add={self.addGraphics}/>,
                document.getElementById('input-image-container')
            );
        },
        addGraphics:function(images){
            var accordion = self.getAccordion();

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
        getAccordion:function(){
            var self = this;
            if(self.accordion == null){
                var getAccordion = function(accordion){
                    self.accordion = accordion;
                };

                React.render(
                    <Accordion callback={getAccordion}/>,
                    document.getElementById('animations')
                );
            }

            return self.accordion;
        }
    }
});