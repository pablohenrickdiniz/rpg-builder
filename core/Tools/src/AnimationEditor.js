define(['CE','React','InputImage','InputControls','SequenceList','Select'],function(CE,React,InputImage,InputControls,SequenceList,Select){
    var AnimationEditor = {
        animationCanvas:null,
        animationImage:null,
        accordion:null,
        frameList:null,
        graphicLayer:null,
        graphicGrid:null,
        frames:[],
        graphics:[],
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
            self.getFrameList();
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
        },
        addGraphics:function(urls){
            var self = AnimationEditor;
            urls.forEach(function(url){
                self.graphics[url.name] = {
                    name:url.name,
                    value:url.url
                };
            });
            React.render(
                <Select options={self.graphics} onChange={self.changeGraphic}/>,
                document.getElementById('images-container')
            );
        },
        changeGraphic:function(){

        },
        frameSelect:function(id){


        },
        getGraphicLayer:function(){
            var self = this;
            if(self.graphicLayer == null){
                self.graphicLayer = self.getAnimationImage().createLayer({
                    zIndex:0
                });
            }
            return self.graphicLayer;
        },
        getGraphicGrid:function(){
            var self = this;
            if(self.graphicGrid == null){

            }
            return self.graphicGrid;
        },
        getFrameList:function(){
            var self = this;
            if(self.frameList == null){
                var getList = function(list){
                    self.frameList = list;
                };
                React.render(
                    <SequenceList callback={getList} onItemSelect={self.frameSelect} title="Frames"/>,
                    document.getElementById('list-container')
                );
                self.frameList.addItem('# Frame 1');
            }
            return self.frameList;
        }
    };
    return AnimationEditor;
});