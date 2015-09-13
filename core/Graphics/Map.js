define(['PropsParser','Grid'],function(Parser,Grid){
    var Map = function(options){
        options = typeof  options == 'object'?options:{};
        var self = this;
        self.development = true;
        self.grid_visible = false;
        self.width = 8;
        self.height = 16;
        self.tile_w = 32;
        self.tile_h = 32;
        self.imageSets = [];
        self.parent = null;
        self.grid = new Grid();
        self.set(options);
    };


    Map.prototype.set = function(options){
        var self = this;
        self.tile_w =  Parser.parseNumber(options.tile_w,self.tile_w);
        self.tile_h =  Parser.parseNumber(options.tile_h,self.tile_h);
        self.imageSets = Parser.parseArray(options.imageSets,self.imageSets);
        self.width = Parser.parseNumber(options.width,self.width);
        self.height = Parser.parseNumber(options.height,self.height);
        if(self.parent != null){
            self.parent.applyToLayers({
                width:self.width*self.tile_w,
                height:self.height*self.tile_h
            });
        }
        self.grid.set({
            width:self.width*self.tile_w,
            height:self.height*self.tile_h,
            sw:self.tile_w,
            sh:self.tile_h
        });
    };

    Map.prototype.showGrid = function(){
        this.grid_visible = true;
        if(this.parent != null){
            this.parent.createLayer({
                zIndex:10
            }).show();
        }
    };

    Map.prototype.hideGrid = function(){
        this.grid_visible = false;
        if(this.parent != null){
            this.parent.createLayer({
                zIndex:10
            }).hide();
        }
    };


    return Map;
});