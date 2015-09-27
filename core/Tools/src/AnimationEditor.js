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
        maxLayer:0,
        /*
            void:initialize()
            inicializa o editor de animação
         */
        initialize:function(){
            var self = this;
            self.getAnimationCanvas();
            var canvasImage = self.getAnimationImage();
            self.getFrameList();
            self.graphicLayer = canvasImage.createLayer();
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
                <div className="form-group">
                    <div className="col-md-8">
                        <InputControls skin="black-skin" onPlay={self.playAnimation} onPause={self.pauseAnimation} onStop={self.stopAnimation}/>
                    </div>
                    <div className="col-md-4">
                        <input type="range" min="1" max="20" onChange={self.changeSpeed}/>
                    </div>
                </div>,
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
        /*
            void: changeSpeed(Event e)
            Muda a velocidade animação
         */
        changeSpeed:function(e){
            var val = e.target.value;
            AnimationEditor.getAnimation().setSpeed(val);
        },
        /*
            void : playAnimation()
            executa a animação
         */
        playAnimation:function(){
            console.log('Playing animation...');
            AnimationEditor.playing = true;
            AnimationEditor.getAnimation().execute();
        },
        /*
            void : pauseAnimation()
            pausa a execução da animação
         */
        pauseAnimation:function(){
            console.log('Animation paused!');
            AnimationEditor.playing = false;
            AnimationEditor.getAnimation().pause();
        },
        /*
            void : stopAnimation()
            para a execução da animação
         */
        stopAnimation:function(){
            console.log('Animation stoped!');
            AnimationEditor.playing = false;
            AnimationEditor.getAnimation().stop();
        },
        /*
            void : rowsChange(int cols)
            Executa quando o número de linhas
            da imagem de recurso é alterado
         */
        rowsChange:function(rows){
            var self = AnimationEditor;
            if(self.image != null){
                self.getAnimationImage().updateGrid({
                    sh:self.image.height/rows
                });
            }
            self.rows = rows;
        },
        /*
            void:colsChange(int cols)
            Executa quando o número de colunas
            da imagem de recurso é alterado
         */
        colsChange:function(cols){
            var self = AnimationEditor;
            if(self.image != null){
                self.getAnimationImage().updateGrid({
                    sw:self.image.width/cols
                });
            }
            self.cols = cols;
        },
        /*
            CanvasEngine: getAnimationCanvas()
            Obtém a engine que renderiza as camadas de canvas
            que executa e edita os frames do objeto animation
         */
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
        /*
            CanvasEngine: getAnimationImage()
            Obtém a engine renderiza as camadas de canvas
            mostra seleciona os quadros
            da imagem de animação
         */
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
        /*
            void: addGraphics(Array<String> urls)
            Adiciona à lista de  urls com recursos de imagem

         */
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
        /*
            void:changeGraphic(string url)
            Carrega um recurso de imagem para animação
            da url
        */
        changeGraphic:function(url){
            ImageLoader.load(url,function(img){
                AnimationEditor.image = img;
                AnimationEditor.graphicLayer.set({
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
        /*
            void : addFrame()
            Adiciona um novo frame na animação
         */
        addFrame:function(){
            console.log('add frame...');
            var self = AnimationEditor;
            var index = self.frameLayers.length;
            console.log('index');
            var canvas = self.getAnimationCanvas();
            var layer = canvas.createLayer({
                width:canvas.getWidth(),
                height:canvas.getHeight(),
                type:'object'
            });

            var frame = new Frame();
            self.getAnimation().frames.push(frame);
            self.frameLayers.push(layer);
            self.getFrameList().addItem('# Frame');
            self.getFrameList().itemSelect(index);
            self.currentFrame = index;
            self.addObject();
        },
        /*
            void: addObject()
            Adiciona um novo objeto inteligente no frame selecionado
         */
        addObject:function(){
            var self = AnimationEditor;
            if(self.croppedImage != null){
                console.log(self.currentFrame);
                var layer = self.getAnimationCanvas().getLayer(self.currentFrame);
                var frame = self.getAnimation().frames[self.currentFrame];
                layer.add(self.croppedImage);
                frame.imageSets.push(self.croppedImage);
            }
        },
        /*
            void : removeFrame(int index)
            Remove o frame na posição index
         */
        removeFrame:function(index){
            var self = AnimationEditor;
            if(self.frameLayers[index] != undefined){
                self.getAnimation().frames.splice(index,1);
                self.getAnimationCanvas().removeLayer(index);
                self.frameLayers.splice(index,1);
                self.frameSelect(Math.max(Math.min(index,self.frameLayers.length-1),0));
            }
        },
        /*
            void: frameSelect(int index)
            seleciona o mostra o frame
         */
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
        /*
            Animation: getAnimation()
            Obtém o objeto animation, que representa
            a animação a ser criada
         */
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
        /*
            FrameList: getFrameList()
            obtém o objeto React responsável pela
            criação e pelos enventos da lista de frames
         */
        getFrameList:function(){
            var self = this;
            if(self.frameList == null){
                var getList = function(list){
                    self.frameList = list;
                };
                var titulo = (
                    <div>
                        <div className="btn-group col-md-12">
                            <button className="btn btn-default" onClick={self.addFrame}>+ Frame</button>
                            <button className="btn btn-default" onClick={self.addObject}>+ Object</button>
                        </div>
                        <span>Frames</span>
                        <div className="clearfix"></div>
                    </div>
                );


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