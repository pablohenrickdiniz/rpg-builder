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
        object.parent = self;
        object.layer = self.objects.length;
        self.objects.push(object);
        self.refresh();
        return self;
    };

    ObjectLayer.prototype.remove = function(object){
        var self = this;
        var index = self.objects.indexOf(object);
        if(index != -1){
            self.objects.splice(index,1);
            var size = self.objects.length;
            for(var i = index; i < size;i++){
                self.objects[index].layer = index;
            }
            object.parent = null;
            self.refresh();
        }
        return self;
    };

    ObjectLayer.prototype.refresh = function(){
        var self = this;
        self.clear().objects.forEach(function(object){
            self.drawImageSet(object);
        });
    };
    return ObjectLayer;
});