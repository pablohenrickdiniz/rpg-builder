requirejs.config({
    "urlArgs": "bust=" + (new Date()).getTime(),
    "paths":{
        "React":'../bower_components/react/react',
        "bootstrap":'../bower_components/bootstrap/dist/js/bootstrap',
        "jquery":"../bower_components/jquery/dist/jquery.min",
        "Jquery-Conflict":'src/jquery-conflict',
        "MapEditor":'../core/Tools/build/MapEditor',
        "CE":'../core/Graphics/CanvasEngine',
        "Map":'../core/Graphics/Map',
        "Grid":'../core/Graphics/Grid',
        "ImageLoader":'../core/Resources/ImageLoader',
        "InputNumber":'../bower_components/ReactElements/build/InputNumber',
        "Math":'../bower_components/MathLib/build/Math',
        "AbstractGrid":'../core/Graphics/AbstractGrid',
        "ImageSet":'../core/Graphics/ImageSet',
        "CanvasLayer":'../core/Graphics/CanvasLayer',
        "SetIntervalMixin":'../bower_components/ReactElements/build/mixins/setIntervalMixin',
        "PropsParser":'../custom/PropsParser' ,
        "MouseReader":'../core/Reader/MouseReader',
        "RectSet":'../core/Graphics/RectSet',
        "Overlap":'../bower_components/MathLib/build/Overlap',
        "Color":'../core/Graphics/Color'
    },
    "shim":{
        "bootstrap":{
            deps:["jquery"]
        },
        "InputNumber":{
            deps:['SetIntervalMixin']
        }
    }
});