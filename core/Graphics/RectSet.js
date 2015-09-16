define(['PropsParser','Color'],function(Parser,Color){
    var RectSet = function(options){
        var self = this;
        self.width = 32;
        self.height = 32;
        self.x = 0;
        self.y = 0;
        self.fillStyle = Color.create({alpha:0}).toRGBA();
        self.strokeStyle = Color.create({alpha:0.2}).toRGBA();
        self.lineWidth = 1;
        self.lineDash = [];
        self.state = 0;
        self.set(options);
        return self;
    };

    RectSet.prototype.getLine = function(){
        var self = this;
        return Math.floor(self.y/self.height);
    };

    RectSet.prototype.getColumn = function(){
        var self = this;
        return Math.floor(self.x/self.width);
    };

    RectSet.prototype.set = function(options){
        var self = this;
        self.width = Parser.parseNumber(options.width,self.width);
        self.height =  Parser.parseNumber(options.height,self.height);
        self.x =  Parser.parseNumber(options.x,self.x);
        self.y =  Parser.parseNumber(options.y,self.y);
        self.state = Parser.parseNumber(options.state,self.state);
        self.lineDash = Parser.parseArray(options.lineDash,self.lineDash);
        self.fillStyle = Color.isColor(options.fillStyle)?options.fillStyle:self.fillStyle;
        self.strokeStyle = Color.isColor(options.strokeStyle)?options.strokeStyle:self.strokeStyle;
        return self;
    };

    return RectSet;
});