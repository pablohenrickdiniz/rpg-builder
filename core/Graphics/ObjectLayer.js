define(['CanvasLayer'],function(CanvasLayer){
    var ObjectLayer = function(options,canvas){
        var self = this;
        self.objects = [];
        options = options == undefined?{}:options;
        CanvasLayer.apply(self,[options,canvas]);
    };
    ObjectLayer.prototype = new CanvasLayer;

    ObjectLayer.prototype.add = function(object){
        var self = this;
        var layer = object.layer;
        if(self.objects[layer] == undefined){
            self.objects[layer] = [];
        }

        self.objects[layer].push(object);
        self.refresh();
        return self;
    };

    ObjectLayer.prototype.remove = function(object){
        var self = this;
        var index = self.objects.indexOf(object);
        if(index != -1){
            self.objects.splice(index,1);
        }
        return self;
    };

    ObjectLayer.prototype.refresh = function(){
        var self = this;
        self.clear();
        self.objects.forEach(function(layer){
            layer.forEach(function(imageSet){
                self.drawImageSet(imageSet);
            });
        });
    };
    return ObjectLayer;
});