/*
    ImageSet(Object options)
    Cria um objeto que define uma região de imagem
    exemplo:
    var image = new ImageSet({
        url:'http;//www.example.com/img/image.png' // caminho para a imagem,
        x:0, //posição x da imagem
        y:0, //posição y da imagem
        width:32, //largura da imagem
        height:32, //altura da imagem
        sx: 0, //posição x do qual o corte inicia
        sy: 0, //posição y do qual o corte inicia
        sWidth:32, //largura da área de corte
        sHeight:32 //altura da área de corte
    });
 */
define(['PropsParser','ImageLoader'],function(Parser,ImageLoader){
    var ImageSet = function(options){
        var self = this;
        self.loads = [];
        self.url = '';
        self.x = 0;
        self.y = 0;
        self.width = 0;
        self.height = 0;
        self.sx = 0;
        self.sy = 0;
        self.sWidth = 0;
        self.sHeight = 0;
        self.layer = 0;
        self.loaded = false;
        self.image = null;
        self.parent = null;
        self.set(options);
    };


    /*
        ImageSet : set(Object options)
        Altera as propriedades de ImageSet
        exemplo:
        imageSet.set({
     url:'http;//www.example.com/img/image.png' // caminho para a imagem,
     x:0, //posição x da imagem
     y:0, //posição y da imagem
     width:32, //largura da imagem
     height:32, //altura da imagem
     sx: 0, //posição x do qual o corte inicia
     sy: 0, //posição y do qual o corte inicia
     sWidth:32, //largura da área de corte
     sHeight:32 //altura da área de corte
        });
     */
    ImageSet.prototype.set = function(options){
        var self = this;
        self.loads = [];
        self.x = Parser.parseNumber(options.x,self.x);
        self.y = Parser.parseNumber(options.y,self.y);
        self.width = Parser.parseNumber(options.width,self.width);
        self.height = Parser.parseNumber(options.height,self.height);
        self.sx = Parser.parseNumber(options.sx,self.sx);
        self.sy = Parser.parseNumber(options.sy,self.sy);
        self.sWidth = Parser.parseNumber(options.sWidth,self.width);
        self.sHeight = Parser.parseNumber(options.sHeight,self.height);
        self.layer = Parser.parseNumber(options.layer,self.layer);
        self.parent = options.parent == undefined?self.parent:options.parent;

        if(options.url != undefined && self.url != options.url){
            self.url = options.url;
            self.loaded = false;
            self.image = new Image();
            self.image.src = self.url;
            ImageLoader.load(self.url,function(img){
                self.loaded = true;
                self.image = img;
            });
        }
        return self;
    };

    /*
        boolean isLoaded()
        Verifica se a imagem de imageSet já foi carregada
     */
    ImageSet.prototype.isLoaded = function(){
        return this.loaded;
    };

    return ImageSet;
});