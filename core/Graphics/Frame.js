define(['PropsParser'],function(Parser){
    var Frame = function(options){
        var self = this;
        self.imageSets = [];
        self.soundEffect = null;
        self.set(options);
    };

    Frame.prototype.set = function(options){
        var self = this;
        self.imageSets = Parser.parseArray(options.imageSets,self.imageSets);
    };

    return Frame;
});