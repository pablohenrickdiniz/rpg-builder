define(['PropsParser','FrameSync','CanvasLayer'],function(Parser,FrameSync,CanvasLayer){
    var Animation = function(options){
        var self = this;
        self.speed = 3;
        self.repeat = false;
        self.running = false;
        self.frames = [];
        self.indexFrame = -1;
        self.x = 0;
        self.y = 0;
        self.width = 32;
        self.height = 32;
        self.frameInterval = null;
        self.canvasLayer = null;
        self.set(options);
    };


    Animation.prototype.set = function(options){
        var self = this;
        self.speed = Parser.parseInt(options.speed,self.speed);
        self.repeat = typeof options.repeat == 'boolean'?options.repeat:self.repeat;
        self.frames = Parser.parseArray(options.frames,self.frames);
        self.x = Parser.parseInt(options.x, self.x);
        self.y = Parser.parseInt(options.y, self.y);
        self.width = Parser.parseInt(options.width,self.width);
        self.height = Parser.parseInt(options.height,self.height);
        self.canvasLayer = options.canvasLayer instanceof CanvasLayer?options.canvasLayer:self.canvasLayer;
    };

    Animation.prototype.execute = function(){
        var self = this;
        if(!self.running){
            self.running = true;
            self.step();
        }
    };



    Animation.prototype.setSpeed = function(speed){
        this.speed = speed;
    };

    Animation.prototype.getSpeed = function(){
        return this.speed;
    };

    Animation.prototype.step = function(){
        var self = this;
        self.frameInterval = setTimeout(function(){
            FrameSync(function(){
                self.step()
            });

            if(self.indexFrame >= self.frames.length-1){
                self.indexFrame = 0;
            }
            else{
                self.indexFrame = self.indexFrame+1;
            }
            if(self.canvasLayer != null){
                self.canvasLayer.drawAnimation(self);
            }
        },1000/(self.speed));
    };

    Animation.prototype.stop = function(){
        var self = this;
        self.running = false;
        clearInterval(self.frameInterval);
        self.indexFrame = -1;
    };

    Animation.prototype.isRunning = function() {
        return this.running;
    };

    return Animation;
});