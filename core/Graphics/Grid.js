define(['PropsParser','RectSet'],function(Parser,RectSet){
    var Grid = function(options){
        options = typeof options == 'object'?options:{};
        var self = this;
        self.width = 0;
        self.height = 0;
        self.x = 0;
        self.y = 0;
        self.sw = 0;
        self.sh = 0;
        self.rectSets = [];
        self.set(options);
    };

    Grid.prototype.getRectsFromArea = function(options){
        var rects = [];
        var self = this;
        var x = Parser.parseNumber(options.x,0);
        var y = Parser.parseNumber(options.y,0);
        var width =  Parser.parseNumber(options.width,0);
        var height =  Parser.parseNumber(options.height,0);

        var si = parseInt(Math.floor(x/self.sw));
        var sj = parseInt(Math.floor(y/self.sh));
        var ei = parseInt(Math.floor((x+width)/self.sw));
        var ej = parseInt(Math.floor((y+height)/self.sh));


        for(var i = si; i <= ei;i++){
            if(self.rectSets[i] != undefined){
                for(var j = sj; j <= ej;j++){
                    if(self.rectSets[i][j] != undefined){
                        rects.push(self.rectSets[i][j]);
                    }
                }
            }
        }

        return rects;
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