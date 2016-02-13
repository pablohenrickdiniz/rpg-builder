app.controller('AnimationEditorController',['$rootScope','ImageLoader','$localStorage','$timeout','Utils',function($scope,ImageLoader,$localStorage,$timeout,Utils){
    var self = this;

    self.graphicLayer = null;
    self.graphics = [];
    self.animation=null;
    self.rows=1;
    self.cols=1;
    self.maxLayer=0;
    self.frameLayers = [];

    $scope.modalVisible = false;
    $scope.storage = $localStorage;
    $scope.canvasId = 'canvas-container';
    $scope.hoverObject = null;
    $scope.currentObject = null;
    $scope.loadingImage = false;
    $scope.animationImage = null;
    $scope.objectMenu = false;
    $scope.gridMenu = false;

    /*scope*/
    $scope.init = function(){
        $scope.page.title = 'Editor de Animações';
        $scope.initController();
    };


    $scope.animationData = {
        graphic:{
            rows:1,
            cols:1,
            gridColor:'#000000',
            images:[],
            imageData:{
                url:''
            },
            image:null,
            croppedArea:{}
        },
        currentFrame:0
    };

    $scope.grid = {
        width:32,
        height:32,
        active:true
    };


    $scope.cursor = {
        x:0,
        y:0
    };

    $scope.animation = null;

    $scope.$watchGroup(['currentObject.dx','currentObject.dy','currentObject.dWidth','currentObject.dHeight'],function(newValues, oldValues){
        newValues.forEach(function(val,index){
            if(oldValues[index] !== newValues[index]){
                if($scope.currentObject !== null && $scope.currentObject.canvasLayer !== undefined){
                    $scope.currentObject.canvasLayer.refresh();
                }
                return false;
            }
        });
    });

    $scope.changeRows = function(val){
        var image = $scope.animationData.graphic.image;
        if(image !== null){
            self.getAnimationImage().updateGrid({
                sh:image.height/val
            });
        }
    };

    $scope.changeCols = function(val){
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


    $scope.$watch('animationData.graphic.imageData.url',function(newVal, oldVal){
        $timeout(function(){
            if(newVal !== oldVal && self.graphicLayer !== null){
                ImageLoader.load(newVal,function(img){
                    $scope.animationData.graphic.image = img;
                    var canvasImage = self.getAnimationImage();

                    canvasImage.applyToLayers({
                        width:img.width,
                        height:img.height
                    });
                    self.graphicLayer.clear().drawImage(img,0,0);
                    canvasImage.updateGrid({
                        width:img.width,
                        height:img.height,
                        sw:img.width,
                        sh:img.height
                    });

                    var colorThief = new ColorThief();
                    var dominant = colorThief.getColor(img);
                    var color = new CE.Color({
                        red:dominant[0],
                        blue:dominant[1],
                        green:dominant[2]
                    }).reverse();
                    $timeout(function(){
                        $scope.changeGridColor(color.toHEX());
                        $scope.changeRows($scope.animationData.graphic.rows);
                        $scope.changeCols($scope.animationData.graphic.cols);
                    });

                });

            }
        });
    });

    $scope.changeGraphic = function($url){
        $scope.animationData.graphic.imageData.url = $url;
        $scope.modalVisible = false;
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
        $scope.stopAnimation();
        var layer = $scope.animationCanvas.createLayer({
            append:false,
            width:$scope.animationCanvas.width,
            height:$scope.animationCanvas.height
        },CE.ObjectLayer);
        self.getAnimation().indexFrame = selected;
        $scope.addObject();
        self.frameLayers.push(layer);
        $scope.selectFrame(selected);
    };


    $scope.selectFrame = function(frame){
        console.log('selecting frame '+frame);
        self.getAnimation().indexFrame = frame;
        $scope.animationCanvas.layers.forEach(function (layer, index) {
            if (layer.type !== 'grid') {
                if (index === frame) {
                    layer.opacity = 1;
                }
                else {
                    layer.opacity = 0;
                }
            }
        });
    };


    $scope.initController = function(){
        /*methods*/

        $scope.animationCanvas =  CE.createEngine({
            container:'#canvas-container',
            width:535,
            height:400
        });
        self.getAnimation().stop();

        var canvasImage = self.getAnimationImage();
        self.graphicLayer = canvasImage.createLayer({
            name:'graphic-layer'
        });

        var animationCanvas =   $scope.animationCanvas;
        var animationMouseReader = animationCanvas.getMouseReader();
        var animationKeyReader = animationCanvas.getKeyReader();

        $(document).on('keydown',function(e){
            //console.log(e.keyCode);
        });

        animationCanvas.getGridLayer({
            append:false,
            width:animationCanvas.width,
            height:animationCanvas.height
        });

        animationKeyReader.onSequence([CE.KeyReader.Keys.KEY_DEL],function(){
            console.log('delete...');
            if($scope.currentObject !== null && $scope.currentObject.canvasLayer !== null){
                $scope.currentObject.canvasLayer.remove($scope.currentObject);
                $scope.currentObject = null;
            }
        });

        animationKeyReader.onSequence([CE.KeyReader.Keys.KEY_CTRL,CE.KeyReader.Keys.KEY_GT],function(){
            var object = $scope.currentObject;
            if(object !== null && object.canvasLayer !== null){
                object.canvasLayer.moveUp(object);
            }
        });

        animationKeyReader.onSequence([CE.KeyReader.Keys.KEY_CTRL,CE.KeyReader.Keys.KEY_LT],function(){
            var object = $scope.currentObject;
            if(object !== null && object.canvasLayer !== null){
                object.canvasLayer.moveDown(object);
            }
        });

        animationMouseReader.onmousedown(1,function(){
            var reader = this;
            var p = reader.lastDown.left;
            var layer = self.frameLayers[self.getAnimation().indexFrame];
            if(layer !== undefined){
                var objects = layer.objects;
                if($scope.currentObject !== null){
                    $scope.currentObject.selected = false;
                    $scope.currentObject = null;
                }

                objects.forEach(function(object){
                    var abs_x = p.x -object.dx;
                    var abs_y = p.y - object.dy;

                    if(abs_x >=0 && abs_y >= 0 && abs_x  <= object.dWidth && abs_y <= object.dHeight){
                        var prop_w = object.dWidth/object.sWidth;
                        var prop_h = object.dHeight/object.sHeight;
                        var prop_x = (abs_x/prop_w);
                        var prop_y = (abs_y/prop_h);
                        var rel_x = prop_x+object.sx;
                        var rel_y = prop_y+object.sy;

                        if(!Utils.isPixelTransparent(object.image,rel_x,rel_y)){
                            object.selected = true;
                            object.odx = object.dx;
                            object.ody = object.dy;
                            $scope.currentObject = object;
                            return false;
                        }
                    }
                });

                layer.refresh();
            }
        });

        animationMouseReader.onmouseout(function(){
            $scope.cursor = {x:0,y:0};
            $scope.hoverObject = null;
            $scope.$apply();
        });

        animationMouseReader.onmousemove(function(){
            var reader = this;
            var move = reader.lastMove;
            $scope.cursor = move;
            $scope.$apply();


            var layer = self.frameLayers[self.getAnimation().indexFrame];
            if(layer !== undefined){
                var objects = layer.objects;
                $scope.hoverObject = null;
                objects.forEach(function(object){
                    var abs_x = move.x -object.dx;
                    var abs_y = move.y - object.dy;

                    if(abs_x >0 && abs_y > 0 && abs_x  <= object.dWidth && abs_y <= object.dHeight){
                        var prop_w = object.dWidth/object.sWidth;
                        var prop_h = object.dHeight/object.sHeight;
                        var prop_x = (abs_x/prop_w);
                        var prop_y = (abs_y/prop_h);
                        var rel_x = prop_x+object.sx;
                        var rel_y = prop_y+object.sy;


                        if(!Utils.isPixelTransparent(object.image,rel_x,rel_y)){
                            $scope.hoverObject = object;
                            return false;
                        }
                    }
                });

            }

            if(reader.left && $scope.currentObject !== null){
                var object =  $scope.currentObject;
                var p = reader.lastDown.left;
                var diff = CE.Math.vmv(move,p);
                var dx =diff.x+object.odx;
                var dy =diff.y+object.ody;

                if($scope.grid.active){
                    var width = animationCanvas.getGrid().width;
                    var height = animationCanvas.getGrid().height;
                    var g_width = $scope.grid.width;
                    var g_height = $scope.grid.height;

                    var gnx_1 = Math.floor(dx/g_width)*g_width;
                    var gny_1 = Math.floor(dy/g_height)*g_height;
                    var gnx_2 = gnx_1+g_width;
                    var gny_2 = gny_1+g_height;


                    if((dx - gnx_1) < (gnx_2 - (dx+object.dWidth))){
                        dx = gnx_1;
                    }
                    else{
                        dx = gnx_2;
                    }

                    if((dy - gny_1) <= (gny_2 - (dy+object.dHeight))){
                        dy = gny_1;
                    }
                    else{
                        dy = gny_2;
                    }
                }


                object.dx = dx;
                object.dy = dy;
            }
        });
    };

    self.getAnimationImage =function(){
        var self = this;
        if($scope.animationImage === null){
            $scope.animationImage = CE.createEngine({
                container:'#animations',
                width:500,
                height:500,
                selectable:true,
                draggable:true,
                scalable:true
            });

            var moveCallback = function(ii,ij){
                var grid = $scope.animationImage.getGrid();
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
                        $scope.animationImage.refreshGridLayer();
                        var canvas = $scope.animationCanvas;
                        $scope.animationData.graphic.croppedArea = {
                            image:$scope.animationData.graphic.image,
                            sx:newRect.x,
                            sy:newRect.y,
                            sWidth:newRect.width,
                            sHeight:newRect.height,
                            dWidth:newRect.width,
                            dHeight:newRect.height,
                            dx:(canvas.width/2)-(newRect.width/2),
                            dy:(canvas.height/2)-(newRect.height/2)
                        };
                        $scope.$apply();
                    }
                }
            };


            /*
             Muda a área selecionada com as setas do mouse
             */

            var reader = $scope.animationImage.getKeyReader();
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
                $scope.addObject();
            });

            $scope.animationImage.onAreaSelect(function(area,grid){
                var reader = $scope.animationImage.getMouseReader();
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
                    $scope.$apply();
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
                    $scope.$apply();
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
                        dx:(canvas.width/2)-(rect.width/2),
                        dy:(canvas.height/2)-(rect.height/2)
                    };
                }
            });
        }
        return $scope.animationImage;
    };

    $scope.removeFrame= function(index){
        $scope.animationCanvas.removeLayer(index);
        self.frameLayers.splice(index,1);
        self.getAnimation().remove(index);
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
                indexFrame:0,
                repeat:true
            });
            animation.onStep(function(frame){
                $scope.selectFrame(frame);
                $scope.$apply();
            });
            $scope.animation = animation;
        }
        return $scope.animation;
    };

    $scope.addObject =function(){
        if($scope.animationData.graphic.croppedArea !== null && $scope.animation !== null){
            var frame = $scope.animation.indexFrame;
            var layer =   $scope.animationCanvas.getLayer(frame);
            if(layer !== null && layer instanceof CE.ObjectLayer){
                var cropped = new CE.ImageSet($scope.animationData.graphic.croppedArea);
                cropped.selected = true;
                if($scope.currentObject !== null){
                    $scope.currentObject.selected = false;
                }
                layer.add(cropped);
                self.getAnimation().frames[frame] = cropped;
                layer.refresh();
            }
        }
    };

    $scope.showModal = function(){
        $scope.modalVisible = true;

    };

    $scope.hideModal = function(){
        $scope.modalVisible = false;
    };

    $scope.playAnimation = function(){
        self.frameLayers.forEach(function(layer){
            layer.objects.forEach(function(object){
                object.selected = false;
            });
            layer.refresh();
        });
        self.getAnimation().execute();
    };

    $scope.pauseAnimation = function() {
        self.getAnimation().pause();
    };

    $scope.stopAnimation = function(){
        self.getAnimation().stop();
        $scope.selectFrame(0);
    };

    $scope.changeSpeed = function(speed) {
        self.getAnimation().speed = speed;
    };

    $scope.showGridMenu = function(){
        $scope.gridMenu = true;
    };

    $scope.hideGridMenu = function(){
        $scope.gridMenu = false;
    };

    $scope.showObjectMenu = function(){
        $scope.objectMenu = true;
    };

    $scope.hideObjectMenu = function(){
        $scope.objectMenu = false;
    };
}]);



