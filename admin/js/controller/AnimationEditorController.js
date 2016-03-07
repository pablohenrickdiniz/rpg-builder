app.controller('AnimationEditorController',['$rootScope','ImageLoader','$localStorage','$timeout','Utils',function($scope,ImageLoader,$localStorage,$timeout,Utils){
    var self = this;
    self.graphicLayer = null;
    self.graphics = [];
    self.animation=null;
    self.rows=1;
    self.cols=1;
    self.maxLayer=0;
    self.frameLayers = [];
    self.resize_active = false;
    self.resize_vertex = null;
    self.object_data = {
        old_width:0,
        old_height:0,
        old_x:0,
        old_y:0
    };


    $scope.modalVisible = false;
    $scope.storage = $localStorage;
    $scope.canvasId = 'canvas-container';
    $scope.hoverObject = null;
    $scope.currentObject = null;
    $scope.loadingImage = false;
    $scope.animationImage = null;
    $scope.objectMenu = false;
    $scope.gridMenu = false;
    $scope.tool = 'one';


    $scope.$watch('tool',function(newVal, oldVal){
        if(newVal !== oldVal){
            switch(newVal){
                case 'one':
                    self.getAnimationImage().set({
                        multiSelect:false
                    });
                    break;
                case 'group':
                    self.getAnimationImage().set({
                        multiSelect:true
                    });
                    break;
            }
        }
    });


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
        y:0,
        style:null
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
            var layer = self.getAnimationImage().getGridLayer();
            layer.getGrid().set({
                sh:image.height/val
            });
            layer.refresh();
        }
    };

    $scope.changeCols = function(val){
        var image = $scope.animationData.graphic.image;
        if(image !== null){
            var layer = self.getAnimationImage().getGridLayer();
            layer.getGrid().set({
                sw:image.width/val
            });
            layer.refresh();
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
                    var layer = canvasImage.getGridLayer();
                    var grid = layer.getGrid();

                    layer.set({
                        width:img.width,
                        height:img.height
                    });

                    grid.set({
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
        var layer = canvas.getGridLayer();
        var grid = layer.getGrid();
        grid.apply({
            strokeStyle:color
        });
        layer.refresh();
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
        },CE.EXT.CanvasEngineGrid);


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
                var animation = self.getAnimation();
                var frame = animation.frames[animation.indexFrame];
                if(frame !== null){
                    self.moveUp(frame,object);
                }
            }
        });

        animationKeyReader.onSequence([CE.KeyReader.Keys.KEY_CTRL,CE.KeyReader.Keys.KEY_LT],function(){
            var object = $scope.currentObject;
            if(object !== null && object.canvasLayer !== null){
                object.canvasLayer.moveDown(object);
                var animation = self.getAnimation();
                var frame = animation.frames[animation.indexFrame];
                if(frame !== null){
                    self.moveDown(frame,object);
                }
            }
        });

        animationMouseReader.onmousedown(1,function(){
            if(!self.resize_active){
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

            if($scope.currentObject !== null){
                var object =  $scope.currentObject;
                if(reader.left){
                    var p = reader.lastDown.left;
                    var diff = CE.Math.vmv(move,p);
                    if(self.resize_vertex !== null){
                        /*Redimensionamento de objeto*/
                        /*
                         0 - Top Left
                         1 - Top Center
                         2 - Top Right
                         3 - Center Rigth
                         4 - Bottom Rigth
                         5 - Bottom Center
                         6 - Bottom Left
                         7 - Center Left
                         */
                        if([0,6,7].indexOf(self.resize_vertex) !== -1){
                            var nw1  = Math.max(self.object_data.old_width-diff.x,1);
                            var diff_width1 = nw1 -self.object_data.old_width;
                            var dx1 = self.object_data.old_x-diff_width1;
                            object.dWidth = nw1;
                            object.dx = dx1;
                        }
                        else if([2,3,4].indexOf(self.resize_vertex) !== -1){
                            object.dWidth = Math.max(self.object_data.old_width+diff.x,1);
                        }

                        if([0,1,2].indexOf(self.resize_vertex) !== -1){
                            var nh1  =  Math.max(self.object_data.old_height-diff.y,1);
                            var diff_height1 = nh1 - self.object_data.old_height;
                            var dy1 = self.object_data.old_y-diff_height1;
                            object.dHeight = nh1;
                            object.dy = dy1;
                        }
                        else if([4,5,6].indexOf(self.resize_vertex) !== -1){
                            object.dHeight = Math.max(self.object_data.old_height+diff.y,1);
                        }
                    }
                    else{
                        var dx =diff.x+object.odx;
                        var dy =diff.y+object.ody;

                        if($scope.grid.active){
                            var grid = animationCanvas.getGridLayer().getGrid();
                            var width = grid.width;
                            var height = grid.height;
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
                }
                else{
                    var xa = object.dx-3;
                    var xb = xa+(object.dWidth/2);
                    var xc = xa+object.dWidth;
                    var ya = object.dy-3;
                    var yb = ya+(object.dHeight/2);
                    var yc = ya+object.dHeight;

                    var cursor = null;
                    self.resize_vertex = null;
                    if(move.x >= xa && move.x <= xa+6){
                        if(move.y >= ya && move.y <= ya+6){
                            cursor = 'nwse-resize';
                            self.resize_vertex = 0;
                        }
                        else if(move.y >= yb &&  move.y <= yb + 6){
                            cursor = 'ew-resize';
                            self.resize_vertex = 7;
                        }
                        else if(move.y >= yc &&  move.y <= yc + 6){
                            cursor = 'nesw-resize';
                            self.resize_vertex = 6;
                        }
                    }
                    else if(move.x >= xb && move.x <= xb+6){
                        if(move.y >= ya && move.y <= ya+6){
                            cursor = 'ns-resize';
                            self.resize_vertex = 1;
                        }
                        else if(move.y >= yc && move.y <= yc+6){
                            cursor = 'ns-resize';
                            self.resize_vertex = 5;
                        }
                    }
                    else if(move.x >= xc && move.x <= xc+6){
                        if(move.y >= ya && move.y <= ya+6){
                            self.resize_vertex = 2;
                            cursor = 'nesw-resize';
                        }
                        else if(move.y >= yb && move.y <= yb+6){
                            self.resize_vertex = 3;
                            cursor = 'ew-resize';
                        }
                        else if(move.y >= yc && move.y <= yc+6){
                            self.resize_vertex = 4;
                            cursor = 'nwse-resize';
                        }
                    }

                    if(self.resize_vertex !== null){
                        self.object_data = {
                            old_x:object.dx,
                            old_y:object.dy,
                            old_width:object.dWidth,
                            old_height:object.dHeight
                        };
                    }

                    self.resize_active = (cursor !== null);
                    $scope.cursor.style = cursor;
                    $scope.$apply();
                }
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
            },CE.EXT.CanvasEngineGrid);

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
                moveCallback(1,0);
            });

            reader.onSequence([CE.KeyReader.Keys.KEY_UP],function(){
                moveCallback(-1,0);
            });

            reader.onSequence([CE.KeyReader.Keys.KEY_LEFT],function(){
                moveCallback(0,-1);
            });

            reader.onSequence([CE.KeyReader.Keys.KEY_RIGHT],function(){
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
            var animation = new CE.EXT.Animation({
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
                var animation = self.getAnimation();
                if(animation.frames[frame] === undefined){
                    animation.frames[frame] = [];
                }
                animation.frames[frame].push(cropped);
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

    $scope.selectTool = function(tool){
        $scope.tool = tool;
    };

    $scope.export = function(){
        console.log(self.getAnimation().toJSON());
    };


    self.moveUp = function(array, object){
        var index = array.indexOf(object);
        if (index !== -1 && index < array.length - 1) {
            var objectB = array[index + 1];
            array[index + 1] = object;
            array[index] = objectB;
        }
    };

    self.moveDown = function(array, object){
        var index = array.indexOf(object);
        if (index !== -1 && index > 0) {
            var objectB = array[index - 1];
            array[index - 1] = object;
            array[index] = objectB;
        }
    };
}]);



