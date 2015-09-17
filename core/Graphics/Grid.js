define(['PropsParser','RectSet','AbstractGrid'],function(Parser,RectSet,AbstractGrid){
    var Grid = function(options){
        console.log('intializing Grid...');
        options = typeof options == 'object'?options:{};
        var self = this;
        AbstractGrid.apply(self,[options]);
        self.rectSets = [];
    };

    Grid.prototype = new AbstractGrid;


    Grid.prototype.getAreaInterval = function(options){
        var self = this;
        var x = Parser.parseNumber(options.x,0);
        var y = Parser.parseNumber(options.y,0);
        var width =  Parser.parseNumber(options.width,0);
        var height =  Parser.parseNumber(options.height,0);

        var si = parseInt(Math.floor(y/self.sh));
        var sj = parseInt(Math.floor(x/self.sw));
        var ei = parseInt(Math.floor((y+height)/self.sh));
        var ej = parseInt(Math.floor((x+width)/self.sw));
        return {si:si,sj:sj,ei:ei,ej:ej};

    };

    Grid.prototype.getRectsFromArea = function(options){
        var rects = [];
        var self = this;
        var interval = self.getAreaInterval(options);
        for(var i = interval.si; i <= interval.ei;i++){
            if(self.rectSets[i] != undefined){
                for(var j = interval.sj; j <= interval.ej;j++){
                    if(self.rectSets[i][j] != undefined){
                        rects.push(self.rectSets[i][j]);
                    }
                }
            }
        }

        return rects;
    };


    Grid.prototype.apply = function(options,condition){
        var self = this;
        self.rectSets.forEach(function(row){
            row.forEach(function(rectSet){
                if(condition == undefined || condition.apply(rectSet)){
                    rectSet.set(options);
                }
            });
        });
        return self;
    };

    Grid.prototype.set = function(options){
        var self = this;
        var aux_width = self.width;
        var aux_height = self.height;
        var aux_x = self.x;
        var aux_y = self.y;
        var aux_sw = self.sw;
        var aux_sh = self.sh;
        self.width = Parser.parseNumber(options.width,self.width);
        self.height = Parser.parseNumber(options.height,self.height);
        self.sw = Parser.parseNumber(options.sw,self.sw);
        self.sh = Parser.parseNumber(options.sh,self.sh);

        if(self.sw != aux_sw || self.sh != aux_sh){
            self.rectSets = [];
        }
        self.update();


        return self;
    };

    Grid.prototype.update = function(){
        var self = this;
        var sw = self.sw;
        var sh = self.sh;
        var w = self.width;
        var h = self.height;


        if(w > 0 && h > 0){
            var cols = Math.floor(w/sw);
            var rows = Math.floor(h/sh);
            var count = 0;


            for(var i = self.rectSets.length; i < rows;i++){
                if(self.rectSets[i] == undefined){
                    self.rectSets[i] = [];
                }
                for(var j =self.rectSets[i].length; j < cols;j++){
                    count++;
                    self.rectSets[i][j] = new RectSet({
                        x:j*self.sw,
                        y:i*self.sh,
                        width:sw,
                        height:sh
                    });
                }
            }

            for(var j = self.rectSets[0].length;j < cols;j++){
                for(var i = 0; i < self.rectSets.length;i++){
                    count++;
                    self.rectSets[i][j] = new RectSet({
                        x:j*self.sw,
                        y:i*self.sh,
                        width:sw,
                        height:sh
                    });
                }
            }

            for(var i =0; i < self.rectSets.length;i++){
                self.rectSets[i].length = cols;
            }
            self.rectSets.length = Math.min(rows,self.rectSets.length);
        }
        else{
            self.rectSets = [];
        }


        return self;
    };

    return Grid;
});