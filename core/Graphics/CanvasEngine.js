define(['CanvasLayer','PropsParser','Jquery-Conflict','MouseReader'],function(CanvasLayer,Parser,$,MouseReader){
    var CanvasEngine = function(options){
        console.log('intializing canvas engine...');
        var self = this;
        self.layers = [];
        self.height = 400;
        self.viewX = 0;
        self.viewY = 0;
        self.lastViewX = 0;
        self.lastViewY = 0;
        self.width = 400;
        self.mouseReader = null;
        self.draggable = false;
        self.scalable = false;
        self.scale = 1;
        self.set(options);
        self.initialize();
        return self;
    };
    /*
        Inicializa a engine de canvas
     */
    CanvasEngine.prototype.initialize = function(){
        var self = this;

        self.getMouseReader().onmousedown(3,function(){
            self.lastViewX = self.viewX;
            self.lastViewY = self.viewY;
        });


        self.getMouseReader().onmousemove(function(e){
            var reader = this;
            if(self.draggable && reader.right){
                var pa = reader.lastDown.right;
                var pb = reader.lastMove;
                var p = Math.vmv(pa,pb);
                var x = self.lastViewX-p.x;
                var y = self.lastViewY-p.y;
                var layer = self.createLayer({zIndex:0});
                var min_x = self.getWidth()-layer.width;
                var min_y = self.getHeight()-layer.height;
                min_x = min_x>0?0:min_x;
                min_y = min_y>0?0:min_y;
                x = Math.min(Math.max(x,min_x),0);
                y = Math.min(Math.max(y,min_y),0);
                self.set({
                    viewX:x,
                    viewY:y
                });
            }
        });

        self.getMouseReader().onmousewheel(function(e){
            var reader = this;
            if(self.scalable){
                var y = reader.lastWheel.deltaY;
                if(y > 0){
                    if(self.scale > 0.1){
                        self.set({
                            scale:self.scale-0.1
                        });
                    }
                }
                else if(y < 0){
                    self.set({
                        scale:self.scale+0.1
                    });
                }
            }
        });
    };

    /*
        MouseReader : getMouseReader() obtém instância
        do leitor de mouse
     */
    CanvasEngine.prototype.getMouseReader = function(){
        console.log('Canvas Engine get mouse reader...');
        var self = this;
        if(self.mouseReader == null){
            self.mouseReader = new MouseReader(self.container);
        }
        return self.mouseReader;
    };
    /*
        CanvasEngie : resize(int width) Redimensiona a largura da engine
     */
    CanvasEngine.prototype.resize = function(width){
        console.log('Canvas Engine resize...');
        var self = this;
        self.width = Parser.parsePercent(width,$(self.container).parent());
        return self;
    };
    /*
        int : getWidth() Obtém largura do container de canvas em pixels
     */
    CanvasEngine.prototype.getWidth = function(){
        console.log('Canvas Engine get width...');
        return $(this.container).width();
    };

    /*
        int : getHeight() Obtém altura do container de canvas em pixels
     */
    CanvasEngine.prototype.getHeight = function(){
        console.log('Canvas Engine get height...');
        return $(this.container).height();
    };

    /*
        CanvasEngine: set(Object options)
        altera as propriades da engine de canvas
        exemplo:
        engine.set({
            container:'#canvas-container', //elemento pai das camadas de canvas
            width:500 ,//100%              //largura do container
            height:200,                    //altura do container
            viewX:0,                       //posição x do canto superior esquerdo das camadas
            viewY:0,                       //posição y do canto superior esquerdo das camadas
            draggable:true                 //A posição das camadas de canvas podem ser movidas pressionado com o botão esquerdo do mouse
        })
     */
    CanvasEngine.prototype.set = function(options){
        console.log('Canvas Engine set...');
        var self = this;
        self.container = $(options.container)[0] == undefined?self.container:options.container;
        self.height = Parser.parseNumber(options.height,self.height);
        self.viewX = Parser.parseNumber(options.viewX,self.viewX);
        self.viewY = Parser.parseNumber(options.viewY,self.viewY);
        self.scale = Parser.parseNumber(options.scale,self.scale);
        self.scalable = typeof options.scalable == 'boolean'?options.scalable:self.scalable;
        self.draggable = typeof options.draggable == 'boolean'?options.draggable:self.draggable;
        var width = options.width;


        if(Parser.isPercentage(options.width)){
            self.width = options.width;
        }
        else{
            self.width = Parser.parseNumber(options.width,self.width);
        }


        self.layers.forEach(function(layer){
            $(layer.getElement()).css({
                left:self.viewX,
                top:self.viewY,
                transform:'scale('+self.scale+')'
            });
        });

        $(self.container).css({
            width:self.width,
            height:self.height,
            position:'relative',
            overflow:'hidden'
        }).addClass('transparent-background').on('contextmenu',function(e){
            e.preventDefault();
        });
        return self;
    };

    /*
       CanvasEngine: clearAllLayers() Remove todo o conteúdo desenhado nas camadas
     */
    CanvasEngine.prototype.clearAllLayers = function(){
        console.log('Canvas engine clear all layers...');
        this.layers.forEach(function(layer){
            layer.clear();
        });
        return self;
    };

    /*
        CanvasEngine: applyToLayers(Object options, Function conditions)
        Aplica as propriedades options nas camadas que satisfazem as conditions
        que deve retornar verdadeiro ou falso para cada camada
        exemplo:
        engine.applyToLayers({
            width:100,
            heigh:100
        },function(){
            return this.zIndex > 3;
        });
        no exemplo, todas as camadas de canvas que possuem o zIndex maior que 3
        vão receber as propriedades
     */
    CanvasEngine.prototype.applyToLayers = function(options,conditions){
        console.log('Canvas engine apply to layers...');
        var self = this;
        self.layers.forEach(function(layer){
            if(conditions == undefined || conditions.apply(layer)){
                layer.set(options);
            }
        });
        return self;
    };
    /*
        CanvasLayer: createLayer(Object options)
        cria uma camada de canvas com as propriedades options,
        caso já exista uma camada com o mesmo zIndex passado como
        parâmetro nas propriedades, ele retorna essa camada já existente
        e aplica as outras propriedades sobre esse camada
        exemplo:
        var layer = engine.createLayer({
            zIndex:0,
            width:200,
            height:200
        });
        var layer2 = engine.createLayer({
            zIndex:0,
            width:300
        });
        layer == layer2 'true'
        layer2 => {zIndex:0, width:300,height:200}
     */
    CanvasEngine.prototype.createLayer = function(options){
        console.log('Canvas engine create layer...');
        var self = this;
        var zIndex = Parser.parseInt(options.zIndex,null);

        if(zIndex != null){
            if(self.layers[zIndex] == undefined){
                console.log('creating layer index '+zIndex);
                var layer = new CanvasLayer(options,self);
                self.layers[zIndex] = layer;
                $(document).ready(function(){
                    $(self.container).append(layer.getElement());
                });
                return layer;
            }
            else{
                return self.layers[zIndex].set(options);
            }
        }

        return null;
    };
    /*
        CanvasLayer: getLayer(int zIndex)
        Obtém a camada pelo zIndex
     */
    CanvasEngine.prototype.getLayer = function(zIndex){
        console.log('Canvas Engine get layer...');
        var self = this;
        if(self.layers[zIndex] != undefined){
            return self.layers[zIndex];
        }
        return null;
    };
    /*
        CanvasEngine: removeLayer(int zIndex)
        Remove uma camada de canvas pelo zIndex
     */
    CanvasEngine.prototype.removeLayer = function(zIndex){
        console.log('Canvas Engine remove layer...');
        var self = this;
        if(self.layers[zIndex] != undefined){
            self.layers[zIndex].destroy();
        }
        return self;
    };

    /*
        CanvasEngine: renderMap(Map map)
        Renderiza o mapa nas camadas de canvas
     */



    CanvasEngine.prototype.renderMap = function(map){
        console.log('Canvas Engine render map...');
        var self = this;
        self.clearAllLayers();
        var sets = map.imageSets;
        var size1 = sets.length;
        map.renderIntervals.forEach(function(interval){
            clearInterval(interval);
        });
        console.log(map);

        for(var i = 0; i < size1;i++){
            var size2 = sets[i].length;
            for(var j = 0; j < size2;j++){
                sets[i][j].forEach(function(imageSet){
                    map.renderIntervals.push(setTimeout(function(){
                        var layer = self.createLayer({
                            zIndex:imageSet.layer,
                            width:map.width*map.tile_w,
                            height:map.height*map.tile_h
                        });
                        layer.drawImageSet(imageSet);
                    },(20*i)+(j*20)));
                });
            }
        }

        map.parent = self;
    };
    /*
        Cria uma instância de CanvasEngine
        CanvasEngine : createEntine(Object options)
        exemplo:
        CanvasEngine.createEngine({
            container:'#canvas-container',
            width:500,
            height:500
        });
     */
    CanvasEngine.createEngine = function(options){
        console.log('Canvas Engine create engine...');
        return new CanvasEngine(options);
    };

    return CanvasEngine;
});