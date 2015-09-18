define(['Color'],function(Color){
    return {
        getCanvas:function(w,h){
            var canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            return canvas;
        },
        getPixels:function(img){
            var c = this.getCanvas(img.width,img.height);
            var ctx = c.getContext('2d');
            ctx.drawImage(img);
            return ctx.getImageData(0,0,ctx.width,ctx.height);

        },
        applyFilter:function(filter, image){
            var args = [this.getPixels(image)];
            filter.apply(null,args);
        },
        reverse:function(pixels){
            var d = pixels.data;
            for (var i=0; i<d.length; i+=4) {
                var r = d[i];
                var g = d[i+1];
                var b = d[i+2];
                var a = d[i+3];
            }
        }
    };
});
