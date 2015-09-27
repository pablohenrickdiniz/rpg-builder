define(
    ['CE','React','InputImage','InputControls','SequenceList','Select','ImageLoader','Jquery-Conflict','InputNumber','Frame','ImageSet','Animation'],
    function(CE,React,InputImage,InputControls,SequenceList,Select,ImageLoader,$,InputNumber,Frame,ImageSet,Animation){
    var AnimationEditor = {
        animationCanvas:null,
        animationImage:null,
        accordion:null,
        frameList:null,
        graphicLayer:null,
        graphicGrid:null,
        frameLayers:[],
        currentFrame:0,
        graphics:[],
        image:null,
        croppedImage:null,
        animation:null,
        playing:false,
        rows:1,
        cols:1,
        initialize:function(){
            var self = this;
            self.getAnimationCanvas();
            self.getAnimationImage();
            self.getFrameList();
            $('#grid-color').change(function(){
                var color = $(this).val();
                var canvas = self.getAnimationImage();
                var grid = canvas.getGrid();
                grid.apply({
                    strokeStyle:color
                });
                canvas.redrawGrid();
            });
            React.render(
                <InputImage title="Adicionar Gráfico" multiple="true" add={self.addGraphics}/>,
                document.getElementById('input-image-container')
            );
            React.render(
                <InputControls skin="black-skin" onPlay={self.playAnimation} onPause={self.pauseAnimation} onStop={self.stopAnimation}/>,
                document.getElementById('controls-container')
            );
            React.render(
                <div className="row">
                    <div className="col-md-6">
                        <label>Linhas</label>
                        <InputNumber min={1} max={1000} onChange={self.rowsChange} value={1}/>,
                    </div>
                    <div className="col-md-6">
                        <label>Colunas</label>
                        <InputNumber min={1} max={1000} onChange={self.colsChange} value={1}/>,
                    </div>
                </div>,
                document.getElementById('size-container')
            );
        },
        playAnimation:function(){
            console.log('Playing animation...');
            AnimationEditor.playing = true;
            AnimationEditor.getAnimation().execute();
        },
        pauseAnimation:function(){
            console.log('Animation paused!');
            AnimationEditor.playing = false;
            AnimationEditor.getAnimation().pause();
        },
        stopAnimation:function(){
            console.log('Animation stoped!');
            AnimationEditor.playing = false;
            AnimationEditor.getAnimation().stop();
        },
        rowsChange:function(rows){
            var self = AnimationEditor;
            if(self.image != null){
                self.getAnimationImage().updateGrid({
                    sh:self.image.height/rows
                });
            }
            self.rows = rows;
        },
        colsChange:function(cols){
            var self = AnimationEditor;
            if(self.image != null){
                self.getAnimationImage().updateGrid({
                    sw:self.image.width/cols
                });
            }
            self.cols = cols;
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
                self.animationImage = CE.createEngine({
                    container:'#animations',
                    width:'100%',
                    height:600,
                    selectable:true,
                    draggable:true,
                    scalable:true
                });
                self.animationImage.onAreaSelect(function(area,grid){
                    var reader = self.animationImage.getMouseReader();
                    var rects = grid.getRectsFromArea(area);

                    if(reader.left){
                        grid.apply({
                            fillStyle:'transparent'
                        });
                        rects.forEach(function(rect){
                            rect.set({
                                fillStyle:'rgba(0,0,150,0.5)',
                                state:1
                            });
                        });
                    }
                    else{
                        grid.apply({
                            fillStyle:'transparent'
                        },function(){
                            return this.state != 1;
                        });
                        rects.forEach(function(rect){
                            if(rect.state != 1){
                                rect.set({
                                    fillStyle:'rgba(0,0,150,0.5)',
                                    state:0
                                });
                            }
                        });
                    }
                    if(rects.length > 0){
                        var rect = rects[0];
                        var canvas = self.getAnimationCanvas();
                        self.croppedImage = new ImageSet({
                            url:self.image.src,
                            sx:rect.x,
                            sy:rect.y,
                            x:(canvas.getWidth()/2)-(rect.width/2),
                            y:(canvas.getHeight()/2)-(rect.height/2),
                            width:rect.width,
                            height:rect.height
                        });
                    }
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
        changeGraphic:function(url){
            ImageLoader.load(url,function(img){
                AnimationEditor.image = img;
                AnimationEditor.getGraphicLayer().set({
                    width:img.width,
                    height:img.height
                }).clear().drawImage(img,0,0);
                AnimationEditor.getAnimationImage().updateGrid({
                    width:img.width,
                    height:img.height,
                    sw:img.width/AnimationEditor.cols,
                    sh:img.height/AnimationEditor.rows
                });

            });
        },
        addFrame:function(){
            var self = AnimationEditor;
            var index = self.frameLayers.length;

            var canvas = self.getAnimationCanvas();
            var layer = canvas.createLayer({
                zIndex:index,
                width:canvas.getWidth(),
                height:canvas.getHeight()
            });
            var frame = new Frame();
            if(self.croppedImage != null){
                layer.drawImageSet(self.croppedImage);
                frame.imageSets.push(self.croppedImage);
            }
            self.getAnimation().frames.push(frame);
            self.frameLayers.push(layer);
            self.getFrameList().addItem('# Frame');
            self.getFrameList().itemSelect(index);
        },
        removeFrame:function(index){
            var self = AnimationEditor;
            if(self.frameLayers[index] != undefined){
                self.getAnimation().frames.splice(index,1);
                self.frameLayers[index].destroy();
                self.frameLayers.splice(index,1);
                self.frameLayers.forEach(function(layer,index){
                    layer.set({
                        zIndex:index
                    });
                });
            }
        },
        frameSelect:function(index){
            var self = AnimationEditor;
            self.currentFrame = index;
            self.frameLayers.forEach(function(layer,aux){
                if(index == aux){
                    layer.set({
                        opacity:1
                    });
                }
                else{
                    layer.set({
                        opacity:self.playing?0:0.5
                    });
                }
            });
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
        getAnimation:function(){
            var self = this;
            if(self.animation == null){
                self.animation = new Animation({
                    speed:7
                });
                self.animation.onStep(function(step){
                    self.getFrameList().itemSelect(step);
                });
            }
            return self.animation;
        },
        getFrameList:function(){
            var self = this;
            if(self.frameList == null){
                var getList = function(list){
                    self.frameList = list;
                };
                var titulo = <div><span>Frames</span><button className="btn btn-default pull-right" onClick={self.addFrame}>+</button><div className="clearfix"></div></div>;


                React.render(
                    <SequenceList callback={getList} onItemSelect={self.frameSelect} onItemRemove={self.removeFrame}title={titulo}/>,
                    document.getElementById('list-container')
                );
            }
            return self.frameList;
        }
    };
    return AnimationEditor;
});