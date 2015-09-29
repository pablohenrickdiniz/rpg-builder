define(
    [
        'CE',
        'React',
        'InputImage',
        'InputControls',
        'SequenceList',
        'Select',
        'ImageLoader',
        'Jquery-Conflict',
        'InputNumber',
        'Frame',
        'ImageSet',
        'Animation',
        'Overlap',
        'KeyReader',
        'Filter'
    ],
    function(
        CE,
        React,
        InputImage,
        InputControls,
        SequenceList,
        Select,
        ImageLoader,
        $,
        InputNumber,
        Frame,
        ImageSet,
        Animation,
        Overlap,
        KeyReader,
        Filter
    ){
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
            selectedObject:null,
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

                self.getAnimationCanvas().getMouseReader().onmousedown(1,function(){
                    var reader = this;
                    var p = reader.lastDown.left;
                    var layer = self.frameLayers[self.currentFrame];
                    if(layer != undefined){
                        var layers = layer.objects;
                        var object = null;
                        var found = false;
                        if(self.selectedObject != null){
                            self.selectedObject.selected = false;
                            self.selectedObject.parent.refresh();
                            self.selectedObject = null;
                        }

                        layers.forEach(function(tmp_layer){
                            tmp_layer.forEach(function(object_tmp){
                                if(Overlap.rectPoint(object_tmp.getBounds(),p)){
                                    object = object_tmp;
                                    object.selected = true;
                                    object.oldX = object.x;
                                    object.oldY = object.y;
                                    self.selectedObject = object;
                                    found = true;
                                    layer.refresh();
                                    return false;
                                }
                            });
                            if(found){
                                return false;
                            }
                        });
                    }
                });

                self.getAnimationCanvas().getMouseReader().onmousemove(function(){
                    var reader = this;
                    var object =  self.selectedObject;
                    if(reader.left && object != null){

                        var p = reader.lastDown.left;
                        var move = reader.lastMove;
                        var dif = Math.vmv(move,p);
                        object.set({
                            x:dif.x+object.oldX,
                            y:dif.y+object.oldY
                        });
                        if(object.parent != null){
                            object.parent.refresh();
                        }
                    }
                });

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

                    var moveCallback = function(ii,ij){
                        var grid = self.animationImage.getGrid();
                        var rect = null;
                        if(grid.checkedSets.length > 0){
                            rect = grid.checkedSets[0];
                        }
                        if(rect != null){
                            var i = grid.rectSets[rect.i+ii] != undefined? rect.i+ii:0;
                            var j = grid.rectSets[i][rect.j+ij] != undefined?rect.j+ij:0;
                            if(grid.rectSets[i][j] != undefined){
                                var newRect = grid.rectSets[i][j];
                                grid.checkedSets = [newRect];
                                grid.apply({
                                    fillStyle:'transparent',
                                    state:0
                                });
                                newRect.set({
                                    fillStyle:'rgba(0,0,150,0.5)',
                                    state:1
                                });
                                self.animationImage.refreshGridLayer();
                                var canvas = self.getAnimationCanvas();
                                self.croppedImage = new ImageSet({
                                    url:self.image.src,
                                    sx:newRect.x,
                                    sy:newRect.y,
                                    x:(canvas.getWidth()/2)-(newRect.width/2),
                                    y:(canvas.getHeight()/2)-(newRect.height/2),
                                    width:newRect.width,
                                    height:newRect.height
                                });
                            }
                        }
                    };


                    /*
                     Muda a área selecionada com as setas do mouse
                     */

                    var reader = self.animationImage.getKeyReader();
                    reader.onSequence([KeyReader.Keys.KEY_DOWN],function(){
                        console.log('keydown!');
                        moveCallback(1,0);
                    });

                    reader.onSequence([KeyReader.Keys.KEY_UP],function(){
                        console.log('keydown!');
                        moveCallback(-1,0);
                    });

                    reader.onSequence([KeyReader.Keys.KEY_LEFT],function(){
                        console.log('keydown!');
                        moveCallback(0,-1);
                    });

                    reader.onSequence([KeyReader.Keys.KEY_RIGHT],function(){
                        console.log('keydown!');
                        moveCallback(0,1);
                    });

                    reader.onSequence([KeyReader.Keys.KEY_SPACE],function(){
                        self.addFrame();
                    });



                    self.animationImage.onAreaSelect(function(area,grid){
                        var reader = self.animationImage.getMouseReader();
                        var rects = grid.getRectsFromArea(area);
                        grid.checkedSets = rects;
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
                    var layer = self.getAnimationCanvas().getLayer(self.currentFrame);
                    if(layer != null){
                        var frame = self.getAnimation().frames[self.currentFrame];
                        layer.add(self.croppedImage);
                        frame.imageSets.push(self.croppedImage);
                    }
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