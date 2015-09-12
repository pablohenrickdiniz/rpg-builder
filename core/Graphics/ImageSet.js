define(['PropsParser'],function(Parser){
    var ImageSet = function(options){
        this.initialize(options);
    };

    ImageSet.prototype.initialize = function(options){
        var self = this;
        self.loads = [];
        self.imageUrl = options.image != undefined?options.image:"";
        self.image = document.createElement('img');
        self.image.src = self.imageUrl;
        self.x = Parser.parseNumber(options.x,0);
        self.y = Parser.parseNumber(options.y,0);
        self.width = Parser.parseNumber(options.width,0);
        self.height = Parser.parseNumber(options.height,0);
        self.sx = Parser.parseNumber(options.sx,self.x);
        self.sy = Parser.parseNumber(options.sy,self.y);
        self.sWidth = Parser.parseNumber(options.sWidth,self.width);
        self.sHeight = Parser.parseNumber(options.sHeight,self.height);
        self.layer = Parser.parseNumber(options.layer,0);
        self.loaded = false;
        self.image.onload = function(){
            self.loaded = true;
            self.loads.forEach(function(callback){
                callback.apply(self,[self]);
            });
            self.loads = [];
        };

    };

    ImageSet.prototype.getProps = function(){
        var self = this;
        return {
            x:self.x,
            y:self.y,
            width:self.width,
            height:self.height,
            sx:self.sx,
            sy:self.sy,
            sWidth:self.sWidth,
            sHeight:self.sHeight,
            image:self.image,
            layer:self.layer
        };
    };

    ImageSet.prototype.isLoaded = function(){
        return this.loaded;
    };

    ImageSet.prototype.onLoad = function(callback){
        var self = this;
        self.loads.push(callback);
        return self;
    };

    return ImageSet;
});