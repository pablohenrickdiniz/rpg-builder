define(['Jquery-Conflict','PropsParser','MouseReader'],function($,Parser,MouseReader){
    var CanvasLayer = function(options,canvas){
        var self = this;
        self.context = null;
        self.canvas = canvas;
        self.zIndex = options.zIndex;
        self.width = Parser.parseNumber(options.width,400);
        self.height = Parser.parseNumber(options.height,400);
        self.savedStates = [];
        self.name = options.name == undefined?'':options.name;
        self.mouseReader = null;

        self.element = null;
        $(window).resize(function(){
            self.refresh();
        });
        $(self.getElement()).on('contextmenu',function(e){
            e.preventDefault();
        });
        $(self.getElement()).css({
            'userSelect':'none'
        });
        return self;
    };

    CanvasLayer.prototype.getMouseReader = function(){
        var self = this;
        if(self.mouseReader == null){
            self.mouseReader = new MouseReader(self.getElement());
        }
        return self.mouseReader;
    };

    CanvasLayer.prototype.saveState = function(name){
        var self = this;
        var url = self.getElement().toDataURL('image/png');
        var img = document.createElement('img');
        img.src = url;
        self.savedStates[name] = img;
        return self;
    };

    CanvasLayer.prototype.restoreState = function(name){
        var self = this;
        var state = self.savedStates[name];
        if(state != undefined){
            self.getContext().drawImage(state, 0, 0);
        }
        return self;
    };

    CanvasLayer.prototype.clearStates = function(){
        var self = this;
        self.savedStates = [];
        return self;
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
            if(self.name != ''){
                $(self.element).attr('data-name',self.name);
            }
        }
        return self.element;
    };

    CanvasLayer.prototype.set = function(options){
        var self = this;
        self.zIndex = Parser.parseInt(options.zIndex,self.zIndex);
        var width = Parser.parseNumber(options.width,self.width);
        var height = Parser.parseNumber(options.height,self.height);
        self.name = options.name == undefined?self.name:options.name;
        self.resize(width,height);
        $(self.getElement()).css({
            zIndex:self.zIndex
        });
        return self;
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
        return self;
    };

    CanvasLayer.prototype.refresh = function(){
        var self = this;
        $(self.getElement()).css({
            left:self.canvas.viewX,
            top:self.canvas.viewY
        });
        return self;
    };

    CanvasLayer.prototype.getContext = function(){
        var self = this;
        if(self.context == null){
            self.context = self.getElement().getContext('2d');
        }
        return self.context;
    };

    CanvasLayer.prototype.drawGrid = function(grid){
        var self = this;
        var context = self.getContext();
        grid.rectSets.forEach(function(row){
            row.forEach(function(rectSet){
                context.fillStyle = rectSet.fillStyle;
                context.strokeStyle = rectSet.strokeStyle;
                context.fillRect(rectSet.x,rectSet.y,rectSet.width,rectSet.height);
                context.strokeRect(rectSet.x,rectSet.y,rectSet.width,rectSet.height);
            });
        });
        return self;
    };

    CanvasLayer.prototype.drawRectSet = function(rectSet){
        var self = this;
        var context = self.getContext();
        context.fillStyle = rectSet.fillStyle;
        context.strokeStyle = rectSet.strokeStyle;
        context.fillRect(rectSet.x,rectSet.y,rectSet.width,rectSet.height);
        context.strokeRect(rectSet.x,rectSet.y,rectSet.width,rectSet.height);
        return self;
    };


    CanvasLayer.prototype.destroy = function(){
        var self = this;
        $(self.element).remove();
        if(self.canvas.layers[self.zIndex] != undefined){
            delete self.canvas.layers[self.zIndex];
        }
        return self;
    };

    CanvasLayer.prototype.drawImage = function(){
        var context = this.getContext();
        context.drawImage.apply(context,arguments);
        return self;
    };

    CanvasLayer.prototype.drawImageSet = function(p){
        var context = this.getContext();
        context.drawImage(p.image, p.sx, p.sy, p.sWidth, p.sHeight, p.x, p.y, p.width, p.height);
        return self;
    };

    CanvasLayer.prototype.clear = function(){
        var self = this;
        self.getContext().clearRect(0,0,self.width,self.height);
        return self;
    };

    CanvasLayer.prototype.clearRect = function(){
        var self = this;
        var context = self.getContext();
        context.clearRect.apply(context,arguments);
        return self;
    };

    return CanvasLayer;
});