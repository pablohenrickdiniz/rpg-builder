define(['Color'],function(Color) {
    return {
        filterList:[],
        filtering:false,
        canvas:null,
        context:null,
        /*
         cria um elemento canvas temporário
         HTMLCanvasElement : getCanvas(int width, int height)
         */
        getCanvas: function (w, h) {
            var self = this;
            if(self.canvas == null){
                self.canvas = document.createElement('canvas');
                self.canvas.width = w;
                self.canvas.height = h;
            }
            else{
                if(self.canvas.width != w){
                    self.canvas.width = w;
                }

                if(self.canvas.height != h){
                    self.canvas.height = h;
                }
            }
            return self.canvas;
        },
        /*
         Array[] : getPixels(HTMLImage image)
         obtém os pixels da imagem
         */
        getPixels: function (img) {
            var c = this.getCanvas(img.width, img.height);
            var ctx = c.getContext('2d');
            ctx.drawImage(img,0,0);
            return ctx.getImageData(0, 0, img.width, img.height);
        },
        /*
         void: applyFilter(function filter, HTMLImage img)
         aplica o filtro na imagem
         */
        applyFilter: function (filter, image,callback) {
            var self = this;
            if(!self.filtering){
                self.filtering = true;
                var args = [this.getPixels(image)];
                var imageData = filter.apply(null, args);
                var canvas = self.getCanvas(imageData.width,imageData.height);
                var ctx = canvas.getContext('2d');
                ctx.putImageData(imageData,0,0);
                var url = canvas.toDataURL('image/png');
                var img = document.createElement('img');
                img.onload = function(){
                    callback(img);
                };
                img.src = url;
                self.filtering = false;
                if(self.filterList.length > 0){
                    var filter_args = self.filterList.shift();
                    self.applyFilter.apply(self,filter_args);
                }
            }
            else{
                self.filterList.push([filter,image,callback]);
            }
        },
        invert: function (imageData) {
            var data = imageData.data;
            for (var i = 0; i < data.length; i += 4) {
                data[i] = 255 - data[i];     // red
                data[i + 1] = 255 - data[i + 1]; // green
                data[i + 2] = 255 - data[i + 2]; // blue
            }
            return imageData;
        }
    }
});
