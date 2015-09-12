define(['PropsParser','Grid'],function(Parser,Grid){
    var Map = function(options){
        options = typeof  options == 'object'?options:{};
        var self = this;
        self.development = true;
        self.width = 5;
        self.height = 5;
        self.tile_w = 32;
        self.tile_h = 32;
        self.imageSets = [];
        self.grid = new Grid();
        self.set(options);
    };


    Map.prototype.set = function(options){
        var self = this;
        self.width = Parser.parseNumber(options.width,self.width);
        self.height = Parser.parseNumber(options.height,self.height);
        self.tile_w =  Parser.parseNumber(options.tile_w,self.tile_w);
        self.tile_h =  Parser.parseNumber(options.tile_h,self.tile_h);
        self.grid.set({
            width:self.width*self.tile_w,
            height:self.height*self.tile_h,
            sw:self.tile_w,
            sh:self.tile_h
        }).update();
    };


    return Map;
});