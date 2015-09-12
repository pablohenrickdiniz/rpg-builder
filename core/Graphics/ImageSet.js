define(['PropsParser','ImageLoader'],function(Parser,ImageLoader){
    var ImageSet = function(options){
        var self = this;
        self.loads = [];
        self.url = '';
        self.x = 0;
        self.y = 0;
        self.width = 0;
        self.height = 0;
        self.sx = 0;
        self.sy = 0;
        self.sWidth = 0;
        self.sHeight = 0;
        self.layer = 0;
        self.loaded = false;
        self.image = null;
        self.parent = null;
        self.set(options);
    };

    ImageSet.prototype.change = function(){
        var self = this;
        if(self.parent != undefined){
            self.parent.clearRect(self.x,self.y,self.width,self.height);
            self.parent.drawImageSet(self);
        }
    };

    ImageSet.prototype.set = function(options){
        var self = this;
        self.loads = [];
        self.x = Parser.parseNumber(options.x,self.x);
        self.y = Parser.parseNumber(options.y,self.y);
        self.width = Parser.parseNumber(options.width,self.width);
        self.height = Parser.parseNumber(options.height,self.height);
        self.sx = Parser.parseNumber(options.sx,self.sx);
        self.sy = Parser.parseNumber(options.sy,self.sy);
        self.sWidth = Parser.parseNumber(options.sWidth,self.width);
        self.sHeight = Parser.parseNumber(options.sHeight,self.height);
        self.layer = Parser.parseNumber(options.layer,self.layer);
        self.parent = options.parent == undefined?self.parent:options.parent;

        if(options.url != undefined && self.url != options.url){
            self.url = options.url;
            self.loaded = false;
            self.image = new Image();
            self.image.src = self.url;
            ImageLoader.load(self.url,function(img){
                self.loaded = true;
                self.image = img;
                self.change();
            });
        }
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