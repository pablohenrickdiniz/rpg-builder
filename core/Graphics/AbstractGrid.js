define(function(){
    var AbstractGrid = function(options){
        console.log('initializing Abstract Grid...');
        options = typeof options == 'object'?options:{};
        var self = this;
        self.x = 0;
        self.y = 0;
        self.width = 0;
        self.height = 0;
        self.sw = 0;
        self.sh = 0;
        self.parent = null;
        self.set(options);
    };

    AbstractGrid.prototype.isDrawable = function(){
        var self = this;
        return self.sw > 0 && self.sh > 0 && self.width >0 && self.height > 0;
    };

    AbstractGrid.prototype.set = function(options){
        var self = this;
        self.width = Parser.parseNumber(options.width,self.width);
        self.height = Parser.parseNumber(options.height,self.height);
        self.sw = Parser.parseNumber(options.sw,self.sw);
        self.sh = Parser.parseNumber(options.sh,self.sh);
        return self;
    };


    return AbstractGrid;
});