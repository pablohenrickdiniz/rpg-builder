app.service('Utils',function(){
    return {
        isPixelTransparent:function(img,x,y){
            var self = this;
            if (x >= 0 && y >= 0) {
                var canvas = document.createElement('canvas');
                canvas.width = 1;
                canvas.height = 1;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, x, y, 1, 1, 0, 0, 1, 1);
                var p = ctx.getImageData(0, 0, 1, 1).data;
                return p[3] === undefined || p[3] === 0;
            }

            return true;
        }
    };
});