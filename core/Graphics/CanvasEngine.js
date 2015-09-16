define(['CanvasLayer','PropsParser','Jquery-Conflict','MouseReader'],function(CanvasLayer,Parser,$,MouseReader){
    var CanvasEngine = function(options){
        console.log('intializing canvas engine...');
        var self = this;
        self.layers = [];
        self.height = 400;
        self.viewX = 0;
        self.viewY = 0;
        self.width = 400;
        self.mouseReader = null;
        self.set(options);
        return self;
    };


    CanvasEngine.prototype.getMouseReader = function(){
        console.log('Canvas Engine get mouse reader...');
        var self = this;
        if(self.mouseReader == null){
            self.mouseReader = new MouseReader(self.container);
        }
        return self.mouseReader;
    };

    CanvasEngine.prototype.resize = function(width){
        console.log('Canvas Engine resize...');
        var self = this;
        self.width = Parser.parsePercent(width,$(self.container).parent());
        return self;
    };

    CanvasEngine.prototype.getWidth = function(){
        console.log('Canvas Engine get width...');
        return $(this.container).width();
    };

    CanvasEngine.prototype.getHeight = function(){
        console.log('Canvas Engine get height...');
        return $(this.container).height();
    };


    CanvasEngine.prototype.set = function(options){
        console.log('Canvas Engine set...');
        var self = this;
        self.container = $(options.container)[0] == undefined?self.container:options.container;
        self.height = Parser.parseNumber(options.height,self.height);
        self.viewX = Parser.parseNumber(options.viewX,self.viewX);
        self.viewY = Parser.parseNumber(options.viewY,self.viewY);
        var width = options.width;


        if(Parser.isPercentage(options.width)){
            self.width = options.width;
        }
        else{
            self.width = Parser.parseNumber(options.width,self.width);
        }

        self.layers.forEach(function(layer){
            $(layer.getElement()).css({
                left:self.viewX,
                top:self.viewY
            });
        });

        $(self.container).css({
            width:self.width,
            height:self.height,
            position:'relative',
            overflow:'hidden'
        }).addClass('transparent-background');
    };

    CanvasEngine.prototype.clearAllLayers = function(){
        console.log('Canvas engine clear all layers...');
        this.layers.forEach(function(layer){
            layer.clear();
        });
        return self;
    };

    CanvasEngine.prototype.applyToLayers = function(options){
        console.log('Canvas engine aply to layers...');
        this.layers.forEach(function(layer){
            layer.set(options);
        });
    };

    CanvasEngine.prototype.createLayer = function(options){
        console.log('Canvas engine create layer...');
        var self = this;
        var zIndex = Parser.parseInt(options.zIndex,null);

        if(zIndex != null){
            if(self.layers[zIndex] == undefined){
                console.log('creating layer index '+zIndex);
                var layer = new CanvasLayer(options,self);
                self.layers[zIndex] = layer;
                $(document).ready(function(){
                    $(self.container).append(layer.getElement());
                });
                return layer;
            }
            else{
                return self.layers[zIndex].set(options);
            }
        }

        return null;
    };

    CanvasEngine.prototype.getLayer = function(zIndex){
        console.log('Canvas Engine get layer...');
        var self = this;
        if(self.layers[zIndex] != undefined){
            return self.layers[zIndex];
        }
        return null;
    };

    CanvasEngine.prototype.removeLayer = function(zIndex){
        console.log('Canvas Engine remove layer...');
        var self = this;
        if(self.layers[zIndex] != undefined){
            self.layers[zIndex].destroy();
        }
        return self;
    };

    CanvasEngine.prototype.renderMap = function(map){
        console.log('Canvas Engine render map...');
        var self = this;
        self.clearAllLayers();
        var sets = map.imageSets;
        var size1 = sets.length;
        for(var x = 0; x < size1;x++){
            var size2 = sets[x].length;
            for(var y = 0; y < size2;y++){
                var size3 = sets[x][y].length;
                for(var layer = 0; layer < size3;layer++){
                    var imageSet = sets[x][y][layer];
                    self.createLayer({
                        zIndex:imageSet.layer,
                        width:map.width*map.tile_w,
                        height:map.height*map.tile_h
                    }).drawImageSet(imageSet);
                }
            }
        }

        map.parent = self;
    };

    CanvasEngine.createEngine = function(options){
        console.log('Canvas Engine create engine...');
        return new CanvasEngine(options);
    };

    return CanvasEngine;
});