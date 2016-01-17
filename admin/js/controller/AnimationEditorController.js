app.controller('AnimationEditorController',['$rootScope','ImageLoader','$timeout',function($scope,ImageLoader,$timeout){
    var self = this;

    /*scope*/
    $scope.init = function(){
        $scope.page.title = 'Editor de Animações';
    };

    $scope.canvasId = 'canvas-container';

    $scope.animationData = {
        graphic:{
            rows:1,
            cols:1,
            gridColor:'#000000',
            images:[],
            imageData:null,
            image:null,
            croppedArea:{}
        },
        currentFrame:0
    };

    $scope.animation = null;


    $scope.changeRows = function(val){
        $scope.animationData.graphic.rows = val;
        var image = $scope.animationData.graphic.image;
        if(image !== null){
            self.getAnimationImage().updateGrid({
                sh:image.height/val
            });
        }
    };

    $scope.changeCols = function(val){
        $scope.animationData.graphic.cols = val;
        var image = $scope.animationData.graphic.image;
        if(image !== null){
            self.getAnimationImage().updateGrid({
                sw:image.width/val
            });
        }
    };

    $scope.addImages = function(images){
        $scope.animationData.graphic.images = $scope.animationData.graphic.images.concat(images);
    };

    $scope.changeGraphic = function(){
        var url = $scope.animationData.graphic.imageData.url;
        ImageLoader.load(url,function(img){
            $scope.animationData.graphic.image = img;
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
    };

    $scope.changeGridColor = function(color){
        $scope.animationData.graphic.gridColor = color;
        var canvas = self.getAnimationImage();
        var grid = canvas.getGrid();
        grid.apply({
            strokeStyle:color
        });
        canvas.redrawGrid();
    };

    $scope.addFrame = function(selected){
        $scope.animationCanvas.createLayer({
            append:false,
            width:$scope.animationCanvas.width,
            height:$scope.animationCanvas.height
        },CE.ObjectLayer);
        self.getAnimation().indexFrame = selected;
        self.addObject();
    };


    $scope.selectFrame = function(frame){
        console.log('selecting frame '+frame);
        self.getAnimation().indexFrame = frame;
        $scope.animationCanvas.layers.forEach(function(layer,index){
            if(layer.type !== 'grid'){
                if(index === frame){
                    layer.opacity = 1;
                }
                else{
                    layer.opacity = 0;
                }
            }
        });
    };

    /*methods*/
    $scope.animationCanvas =  CE.createEngine({
        container:'#canvas-container',
        width:535,
        height:400
    });


    self.animationImage = null;
    self.graphicLayer = null;
    self.graphics = [];
    self.animation=null;
    self.playing=false;
    self.rows=1;
    self.cols=1;
    self.maxLayer=0;
    self.selectedObject=null;

    /*
     self.reset=function(){
     var self = this;
     $scope.animationCanvas = null;
     self.animationImage = null;
     self.graphicLayer = null;
     self.frameLayers = [];
     self.graphics=[];
     self.animation=null;
     self.playing=false;
     self.rows=1;
     self.cols=1;
     self.maxLayer=0;
     self.selectedObject=null;
     self.grid = null;
     };*/

    $scope.initController = function(){
        var canvasImage = self.getAnimationImage();
        self.graphicLayer = canvasImage.createLayer({
            name:'graphic-layer'
        });

        var animationCanvas =   $scope.animationCanvas;
        var animationMouseReader = animationCanvas.getMouseReader();
        var animationKeyReader = animationCanvas.getKeyReader();


        animationCanvas.getGridLayer({
            append:false,
            width:animationCanvas.width,
            height:animationCanvas.height
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
            if(object !== null){
                if(object.parent !== null){
                    object.parent.moveUp(object);
                }
            }
        });

        animationKeyReader.onSequence([CE.KeyReader.Keys.KEY_CTRL,CE.KeyReader.Keys.KEY_DOWN],function(){
            var object = self.selectedObject;
            if(object !== null){
                if(object.parent !== null){
                    object.parent.moveDown(object);
                }
            }
        });

        animationMouseReader.onmousedown(1,function(){
            var reader = this;
            var p = reader.lastDown.left;
            var layer = self.frameLayers[$scope.animation.indexFrame];
            if(layer !== undefined){
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
    };

    self.getAnimationImage =function(){
        var self = this;
        if(self.animationImage === null){
            self.animationImage = CE.createEngine({
                container:'#animations',
                width:530,
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
                        var canvas = $scope.animationCanvas;
                        $scope.animationData.graphic.croppedArea = {
                            image:$scope.animationData.graphic.image,
                            sx:newRect.x,
                            sy:newRect.y,
                            sWidth:newRect.width,
                            sHeight:newRect.height,
                            dWidth:newRect.width,
                            dHeight:newRect.height,
                            x:(canvas.width/2)-(newRect.width/2),
                            y:(canvas.height/2)-(newRect.height/2)
                        };
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
                        return this.state !== 1;
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
                    var canvas = $scope.animationCanvas;
                    $scope.animationData.graphic.croppedArea = {
                        image:$scope.animationData.graphic.image,
                        sx:rect.x,
                        sy:rect.y,
                        dWidth:rect.width,
                        dHeight:rect.height,
                        sWidth:rect.width,
                        sHeight:rect.height,
                        x:(canvas.width/2)-(rect.width/2),
                        y:(canvas.height/2)-(rect.height/2)
                    };
                }
            });
        }
        return self.animationImage;
    };

    $scope.removeFrame= function(index){
        $scope.animationCanvas.removeLayer(index);
        $scope.selectFrame(index-1);
    };

    self.getAnimation = function(){
        var self = this;
        var engine =   $scope.animationCanvas;
        if($scope.animation === null){
            var animation = new CE.Animation({
                speed:7,
                width:engine.width,
                height:engine.height,
                indexFrame:0
            });
            animation.onStep(function(frame){
                $scope.selectFrame(frame);
            });
            $scope.animation = animation;
        }
        return $scope.animation;
    };

    self.addObject =function(){
        var self = this;
        if($scope.animationData.graphic.croppedArea !== null){
            var frame = $scope.animation.indexFrame;
            var layer =   $scope.animationCanvas.getLayer(frame);
            if(layer !== null && layer instanceof CE.ObjectLayer){
                var cropped = _.clone($scope.animationData.graphic.croppedArea);
                layer.add(cropped);
                self.getAnimation().frames[frame] = cropped;
            }
        }
    };
}]);



