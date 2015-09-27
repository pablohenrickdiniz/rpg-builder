define(['PropsParser','IdGenerator'],function(Parser,IdGenerator){
    var Frame = function(options){
        var self = this;
        options = options == undefined?{}:options;
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