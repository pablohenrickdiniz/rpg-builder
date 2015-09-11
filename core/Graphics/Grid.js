define(['PropsParser','RectSet'],function(Parser,RectSet){
    var Grid = function(options){
        var self = this;
        self.width = 32;
        self.height = 43;
        self.x = 0;
        self.y = 0;
        self.sw = 32;
        self.sh = 32;
        self.rectSets = [];
        self.set(options);
    };

    Grid.prototype.set = function(options){
        var self = this;
        self.width = Parser.parseNumber(options.width,self.width);
        self.height = Parser.parseNumber(options.height,self.height);
        self.x = Parser.parseNumber(options.x,self.x);
        self.y = Parser.parseNumber(options.y,self.y);
        self.sw = Parser.parseNumber(options.sw,self.sw);
        self.sh = Parser.parseNumber(options.sh,self.sh);
    };

    Grid.prototype.update = function(){
        var self = this;
        self.rectSets = [];
        var x = self.x;
        var y = self.y;
        var w = self.width;
        var h = self.height;
        var sw = self.sw;
        var sh = self.sh;

        for(var i = x ;i <= w/sw;i++){
            for(var j = y; j <= h/sh;j++){
                self.rectSets.push(new RectSet({
                    x:i*sw,
                    y:j*sh,
                    width:sw,
                    height:sh
                }));
            }
        }
    };

    return Grid;
});