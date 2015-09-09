define(['jquery','CanvasLayer','PropsParser'],function($,CanvasLayer,Parser){
    var CanvasEngine = function(options){
        var self = this;
        self.initialize(options);
        self.layers = [];
    };

    CanvasEngine.prototype.resize = function(width){
        var self = this;
        self.width = Parser.parsePercent(width,$(self.container).parent());
    };

    CanvasEngine.prototype.initialize = function(options){
        var self = this;
        self.container = options.container;
        self.height = Parser.parseNumber(options.height,400);
        self.viewX = Parser.parseNumber(options.viewX,0);
        self.viewY = Parser.parseNumber(options.viewY,0);
        var width = options.width;
        $(document).ready(function(){

            if(Parser.isPercentage(options.width)){
                self.width = options.width;
            }
            else{
                self.width = Parser.parseNumber(options.width,400);
            }

            $(self.container).css({
                width:self.width,
                height:self.height,
                position:'relative',
                overflow:'hidden'
            }).addClass('transparent-background');
        });
    };

    CanvasEngine.prototype.set = function(options){
        var self = this;

        self.height = Parser.parseNumber(options.height,self.height);
        self.viewX = Parser.parseNumber(options.viewX,self.viewX);
        self.viewY = Parser.parseNumber(options.viewY,self.viewY);

        if(Parser.isPercentage(options.width)){
            self.width = options.width;
        }
        else{
            self.width = Parser.parseNumber(options.width,self.width);
        }


        $(self.container).css({
            width:self.width,
            height:self.height
        });
        self.layers.forEach(function(layer){
            layer.refresh();
        });
    };

    CanvasEngine.prototype.createLayer = function(options){
        var self = this;
        var zIndex = Parser.parseInt(options.zIndex,self.layers.length);
        if(self.layers[zIndex] == undefined){
            options.zIndex = zIndex;
            var layer = new CanvasLayer(options,self);
            self.layers[zIndex] = layer;
            $(document).ready(function(){
                $(self.container).append(layer.getElement());
            });
        }

        return self.layers[zIndex];
    };

    CanvasEngine.prototype.getLayer = function(zIndex){
        var self = this;
        if(self.layers[zIndex] != undefined){
            return self.layers[zIndex];
        }
        return null;
    };

    CanvasEngine.prototype.removeLayer = function(zIndex){
        var self = this;
        if(self.layers[zIndex] != undefined){
            self.layers[zIndex].destroy();
        }
    };

    CanvasEngine.createEngine = function(options){
        return new CanvasEngine(options);
    };

    return CanvasEngine;
});