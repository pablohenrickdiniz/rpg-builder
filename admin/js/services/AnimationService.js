app.factory('AnimationService',['ImageLoader',function(ImageLoader){
    return {
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
        reset:function(){
            var self = this;
            self.animationCanvas = null;
            self.animationImage = null;
            self.accordion = null;
            self.frameList = null;
            self.graphicLayer = null;
            self.graphicGrid = null;
            self.frameLayers = [];
            self.currentFrame=0;
            self.graphics=[];
            self.image=null;
            self.croppedImage=null;
            self.animation=null;
            self.playing=false;
            self.rows=1;
            self.cols=1;
            self.maxLayer=0;
            self.selectedObject=null;
        },
        init:function(){
            var self = this;
            self.reset();
            var canvasImage = self.getAnimationImage();
            self.graphicLayer = canvasImage.createLayer({
                name:'graphic-layer'
            });

            var animationCanvas = self.getAnimationCanvas();
            var animationMouseReader = animationCanvas.getMouseReader();
            var animationKeyReader = animationCanvas.getKeyReader();

            animationCanvas.updateGrid({
                width:animationCanvas.getWidth(),
                height:animationCanvas.getHeight(),
                sw:32,
                sh:32,
                opacity:0.1
            });

            animationKeyReader.onSequence([CE.KeyReader.Keys.KEY_DEL],function(){
                console.log('delete...');
                if(self.selectedObject !== null && self.selectedObject.parent !== null){
                    var object = self.selectedObject;
                    var parent = object.parent;
                    parent.remove(self.selectedObject);
                    self.selectedObject = null;
                    self.getAnimation().frames.forEach(function(frame){
                        var index = frame.imageSets.indexOf(object);
                        if(index !== -1){
                            frame.removeImageSet(object);
                            return false;
                        }
                    });
                }
            });

            animationKeyReader.onSequence([CE.KeyReader.Keys.KEY_CTRL,CE.KeyReader.Keys.KEY_UP],function(){
                var object = self.selectedObject;
                if(object != null){
                    if(object.parent != null){
                        object.parent.moveUp(object);
                    }
                }
            });

            animationKeyReader.onSequence([CE.KeyReader.Keys.KEY_CTRL,CE.KeyReader.Keys.KEY_DOWN],function(){
                var object = self.selectedObject;
                if(object != null){
                    if(object.parent != null){
                        object.parent.moveDown(object);
                    }
                }
            });

            animationMouseReader.onmousedown(1,function(){
                var reader = this;
                var p = reader.lastDown.left;
                var layer = self.frameLayers[self.currentFrame];
                if(layer != undefined){
                    var objects = layer.objects;
                    var object = null;
                    var found = false;
                    if(self.selectedObject !== null){
                        self.selectedObject.selected = false;
                        self.selectedObject.parent.refresh();
                        self.selectedObject = null;
                    }

                    objects.forEach(function(object_tmp){
                        var x = p.x -object_tmp.x;
                        var y = p.y - object_tmp.y;
                        if(!object_tmp.isTransparent(x,y)){
                            object = object_tmp;
                            object.selected = true;
                            object.oldX = object.x;
                            object.oldY = object.y;
                            self.selectedObject = object;
                            found = true;
                            layer.refresh();
                            return false;
                        }
                        if(found){
                            return false;
                        }
                    });
                }
            });

            animationMouseReader.onmousemove(function(){
                var reader = this;
                var object =  self.selectedObject;
                if(reader.left && object !== null){
                    var p = reader.lastDown.left;
                    var move = reader.lastMove;
                    var dif = Math.vmv(move,p);

                    var pos = {
                        x:dif.x+object.oldX,
                        y:dif.y+object.oldY
                    };

                    var width = animationCanvas.getGrid().width;
                    var height = animationCanvas.getGrid().height;

                    var gnx_1 = Math.floor(pos.x/32)*32;
                    var gny_1 = Math.floor(pos.y/32)*32;
                    var gnx_2 = gnx_1+32;
                    var gny_2 = gny_1+32;



                    if((pos.x - gnx_1) < (gnx_2 - (pos.x+object.width))){
                        pos.x = gnx_1;
                    }
                    else{
                        pos.x = gnx_2;
                    }

                    if((pos.y - gny_1) <= (gny_2 - (pos.y+object.height))){
                        pos.y = gny_1;
                    }
                    else{
                        pos.y = gny_2;
                    }

                    object.set(pos);
                    if(object.parent !== null){
                        object.parent.refresh();
                    }
                }
            });
        },
        getAnimationCanvas:function(){
            var self = this;
            if(self.animationCanvas === null){
                self.animationCanvas = CE.createEngine({
                    container:'#canvas-container',
                    width:560,
                    height:400
                });
            }
            return self.animationCanvas;
        },
        getAnimationImage:function(){
            var self = this;
            if(self.animationImage == null){
                self.animationImage = CE.createEngine({
                    container:'#animations',
                    width:560,
                    height:400,
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
                    if(rect !== null){
                        var i = grid.rectSets[rect.i+ii] !== undefined? rect.i+ii:0;
                        var j = grid.rectSets[i][rect.j+ij] !== undefined?rect.j+ij:0;
                        if(grid.rectSets[i][j] !== undefined){
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
                            self.croppedImage = new CE.ImageSet({
                                url:self.image.src,
                                sx:newRect.x,
                                sy:newRect.y,
                                width:newRect.width,
                                height:newRect.height
                            });
                            self.croppedImage.set({
                                x:(canvas.getWidth()/2)-(newRect.width/2),
                                y:(canvas.getHeight()/2)-(newRect.height/2)
                            });
                        }
                    }
                };


                /*
                 Muda a área selecionada com as setas do mouse
                 */

                var reader = self.animationImage.getKeyReader();
                reader.onSequence([CE.KeyReader.Keys.KEY_DOWN],function(){
                    console.log('keydown!');
                    moveCallback(1,0);
                });

                reader.onSequence([CE.KeyReader.Keys.KEY_UP],function(){
                    console.log('keydown!');
                    moveCallback(-1,0);
                });

                reader.onSequence([CE.KeyReader.Keys.KEY_LEFT],function(){
                    console.log('keydown!');
                    moveCallback(0,-1);
                });

                reader.onSequence([CE.KeyReader.Keys.KEY_RIGHT],function(){
                    console.log('keydown!');
                    moveCallback(0,1);
                });

                reader.onSequence([CE.KeyReader.Keys.KEY_F],function(){
                    self.addFrame();
                });

                reader.onSequence([CE.KeyReader.Keys.KEY_O],function(){
                    self.addObject();
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
                            if(rect.state !== 1){
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
                        self.croppedImage = new CE.ImageSet({
                            url:self.image.src,
                            sx:rect.x,
                            sy:rect.y,
                            width:rect.width,
                            height:rect.height,
                            sWidth:rect.width,
                            sHeight:rect.height
                        });
                        self.croppedImage.set({
                            x:(canvas.getWidth()/2)-(rect.width/2),
                            y:(canvas.getHeight()/2)-(rect.height/2)
                        });
                    }
                });
            }
            return self.animationImage;
        },
        changeGraphic:function(url){
            var self = this;
            ImageLoader.load(url,function(img){
                self.image = img;
                self.graphicLayer.set({
                    width:img.width,
                    height:img.height
                }).clear().drawImage(img,0,0);
                self.getAnimationImage().updateGrid({
                    width:img.width,
                    height:img.height,
                    sw:img.width,
                    sh:img.height
                });
            });
        },
        changeRows:function(rows){
            var self = this;
            if(self.image !== null){
                self.getAnimationImage().updateGrid({
                    sh:self.image.height/rows
                });
            }
            self.rows = rows;
        },
        changeCols:function(cols){
            var self = this;
            if(self.image !== null){
                self.getAnimationImage().updateGrid({
                    sw:self.image.width/cols
                });
            }
            self.cols = cols;
        },
        changeGridColor:function(color){
            var self = this;
            var canvas = self.getAnimationImage();
            var grid = canvas.getGrid();
            grid.apply({
                strokeStyle:color
            });
            canvas.redrawGrid();
        },
        addFrame:function(callback){
            /*
            var self = this;
            var index = self.frameLayers.length;
            var canvas = self.getAnimationCanvas();
            var layer = canvas.createLayer({
                width:canvas.getWidth(),
                height:canvas.getHeight(),
                name:'frame-'+index
            },CE.ObjectLayer);
            self.getAnimation().add({});
            self.frameLayers.push(layer);
            self.currentFrame = index;
            self.addObject();
            callback();*/
        },
        getAnimation:function(){
            var self = this;
            var engine = self.getAnimationCanvas();
            if(self.animation === null){
                self.animation = new CE.Animation({
                    speed:7,
                    width:engine.getWidth(),
                    height:engine.getHeight()
                });
                self.animation.onStep(function(step){
                    self.getFrameList().itemSelect(step);
                });
            }
            return self.animation;
        },
        addObject:function(){
            var self = this;
            if(self.croppedImage !== null){
                var layer = self.getAnimationCanvas().getLayer(self.currentFrame);
                if(layer !== null && layer instanceof CE.ObjectLayer){
                    var cropped = self.croppedImage.clone();
                    layer.add(cropped);
                    self.getAnimation().frames[self.currentFrame] = cropped.getGraphic();
                }
            }
        }
    };
}]);