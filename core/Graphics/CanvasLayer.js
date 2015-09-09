define(['jquery','PropsParser'],function($,Parser){
    var CanvasLayer = function(options,canvas){
        var self = this;
        self.context = null;
        self.canvas = canvas;
        self.zIndex = options.zIndex;
        self.width = Parser.parseNumber(options.width,400);
        self.height = Parser.parseNumber(options.height,400);
        self.savedStates = [];

        self.element = null;
        $(window).resize(function(){
            self.refresh();
        });
    };

    CanvasLayer.prototype.saveState = function(name){
        var self = this;
        var url = self.getElement().toDataURL('image/png');
        var img = document.createElement('img');
        img.src = url;
        self.savedStates[name] = img;
    };

    CanvasLayer.prototype.restoreState = function(name){
        var self = this;
        var state = self.savedStates[name];
        if(state != undefined){
            self.getContext().drawImage(state, 0, 0);
        }
    };

    CanvasLayer.prototype.clearStates = function(){
        var self = this;
        self.savedStates = [];
    };

    CanvasLayer.prototype.getElement = function(){
        var self = this;
        if(self.element == null){
            self.element = document.createElement('canvas');
            $(self.element).css({
                zIndex:self.zIndex,
                position:'absolute',
                backgroundColor:'transparent',
                left:self.canvas.viewX,
                top:self.canvas.viewY
            });

            $(self.element).addClass('canvas-layer');
            $(self.element).attr('width',self.width);
            $(self.element).attr('height',self.height);
        }
        return self.element;
    };

    CanvasLayer.prototype.set = function(options){
        var self = this;
        self.zIndex = Parser.parseInt(options.zIndex,self.zIndex);
        var width = Parser.parseNumber(options.width,self.width);
        var height = Parser.parseNumber(options.height,self.height);
        self.resize(width,height);
        $(self.getElement()).css({
            zIndex:self.zIndex
        });
    };

    CanvasLayer.prototype.resize = function(width,height){
        var self = this;
        if(width != self.width && height != self.height){
            self.width = width;
            self.height = height;
            var url = self.getElement().toDataURL('image/png');
            $(self.getElement()).attr('width',width);
            $(self.getElement()).attr('height',height);
            var img = document.createElement('img');
            img.src = url;
            self.getContext().drawImage(img, 0, 0);
        }
    };

    CanvasLayer.prototype.refresh = function(){
        var self = this;
        $(self.getElement()).css({
            left:self.canvas.viewX,
            top:self.canvas.viewY
        });
    };

    CanvasLayer.prototype.getContext = function(){
        var self = this;
        if(self.context == null){
            self.context = self.getElement().getContext('2d');
        }
        return self.context;
    };


    CanvasLayer.prototype.destroy = function(){
        var self = this;
        $(self.element).remove();
        if(self.canvas.layers[self.zIndex] != undefined){
            delete self.canvas.layers[self.zIndex];
        }
    };

    CanvasLayer.prototype.drawImageSet = function(p){
        var context = this.getContext();
        context.drawImage(p.image, p.sx, p.sy, p.sWidth, p.sHeight, p.x, p.y, p.width, p.height);
    };

    CanvasLayer.prototype.clearRect = function(x,y,width,height){
        this.getContext().clearRect(x,y,width,height);
    };

    return CanvasLayer;
});