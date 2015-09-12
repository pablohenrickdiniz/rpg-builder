define(['PropsParser','RectSet'],function(Parser,RectSet){
    var Grid = function(options){
        options = typeof options == 'object'?options:{};
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

    Grid.prototype.getRectFrom = function(options){
        var self = this;
        var x = Parser.parseNumber(options.x,0);
        var y = Parser.parseNumber(options.y,0);

        var i = parseInt(Math.floor(x/self.sw));
        var j = parseInt(Math.floor(y/self.sh));
        if(self.rectSets[i] != undefined && self.rectSets[i][j] != undefined){
            return self.rectSets[i][j];
        }
        return null;
    };

    Grid.prototype.apply = function(options){
        var self = this;
        self.rectSets.forEach(function(row){
            row.forEach(function(rectSet){
                rectSet.set(options);
            });
        });
        return self;
    };

    Grid.prototype.set = function(options){
        var self = this;
        self.width = Parser.parseNumber(options.width,self.width);
        self.height = Parser.parseNumber(options.height,self.height);
        self.x = Parser.parseNumber(options.x,self.x);
        self.y = Parser.parseNumber(options.y,self.y);
        self.sw = Parser.parseNumber(options.sw,self.sw);
        self.sh = Parser.parseNumber(options.sh,self.sh);
        return self;
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
            if(self.rectSets[i] == undefined){
                self.rectSets[i] = [];
            }
            for(var j = y; j <= h/sh;j++){
                self.rectSets[i][j] = new RectSet({
                    x:i*sw,
                    y:j*sh,
                    width:sw,
                    height:sh
                });
            }
        }
        return self;
    };

    return Grid;
});