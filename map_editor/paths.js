requirejs.config({
    "urlArgs": "bust=" + (new Date()).getTime(),
    "paths":{
        "CE":"../core/Graphics/CanvasEngine",
        "CanvasLayer":"../core/Graphics/CanvasLayer",
        "PropsParser":"../custom/PropsParser",
        "ImageSet":"../core/Graphics/ImageSet",
        "RL":"../core/Resources/ResourcesLoader",
        "ImageLoader":"../core/Resources/ImageLoader",
        "FrameSync":'../core/Graphics/FrameSync',
        "React":'../bower_components/react/react',
        "bootstrap":'../bower_components/bootstrap/dist/js/bootstrap',
        "jquery":"../bower_components/jquery/dist/jquery.min",
        "Jquery-Conflict":'src/jquery-conflict',
        "InputNumber":"../bower_components/ReactElements/build/InputNumber",
        "SetIntervalMixin":"../bower_components/ReactElements/build/mixins/setIntervalMixin",
        "Grid":"../core/Graphics/Grid",
        "RectSet":"../core/Graphics/RectSet",
        "Color":"../core/Graphics/Color",
        "MouseReader":"../core/Reader/MouseReader",
        "Math":"../bower_components/MathLib/src/Math",
        "Map":"../core/Graphics/Map"
    },
    "shim":{
        "bootstrap":{
            deps:["jquery"]
        },
        "InputNumber":{
            deps:["SetIntervalMixin"]
        }
    }
});