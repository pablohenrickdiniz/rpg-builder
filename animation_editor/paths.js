requirejs.config({
    "urlArgs": "bust=" + (new Date()).getTime(),
    "paths":{
        "AbstractGrid":"../core/Graphics/AbstractGrid",
        "Animation":"../core/Graphics/Animation",
        "AnimationEditor":'../core/Tools/build/AnimationEditor',
        "CE":"../core/Graphics/CanvasEngine",
        "CanvasLayer":"../core/Graphics/CanvasLayer",
        "Color":"../core/Graphics/Color",
        "Frame":"../core/Graphics/Frame",
        "FrameSync":'../core/Graphics/FrameSync',
        "Grid":"../core/Graphics/Grid",
        "ImageLoader":"../core/Resources/ImageLoader",
        "ImageSet":"../core/Graphics/ImageSet",
        "InputNumber":"../bower_components/ReactElements/build/InputNumber",
        "Jquery-Conflict":'jquery-conflict',
        "Map":"../core/Graphics/Map",
        "MapLoader":"../core/Resources/MapLoader",
        "MaterialsLoader":"../core/Resources/MaterialsLoader",
        "Math":"../bower_components/MathLib/src/Math",
        "MouseReader":"../core/Reader/MouseReader",
        "Overlap":"../bower_components/MathLib/src/Overlap",
        "PropsParser":"../custom/PropsParser",
        "RL":"../core/Resources/ResourcesLoader",
        "React":'../bower_components/react/react',
        "RectSet":"../core/Graphics/RectSet",
        "SetIntervalMixin":"../bower_components/ReactElements/build/mixins/setIntervalMixin",
        "bootstrap":'../bower_components/bootstrap/dist/js/bootstrap',
        "jquery":"../bower_components/jquery/dist/jquery.min",
        "AccordionItem":"../bower_components/ReactElements/build/AccordionItem",
        "Accordion":"../bower_components/ReactElements/build/Accordion",
        "IdGenerator":"../bower_components/ReactElements/build/custom/IdGenerator",
        "InputImage":"build/InputImage",
        "InputControls":"../bower_components/ReactElements/build/InputControls"
    },
    "shim":{
        "Accordion":{
            deps:["React","IdGenerator","AccordionItem"]
        },
        "AccordionItem":{
            deps:["React","IdGenerator"]
        },
        "bootstrap":{
            deps:["jquery"]
        },
        "InputNumber":{
            deps:["SetIntervalMixin"]
        },
        "Grid":{
            deps:["PropsParser","RectSet","AbstractGrid"]
        },
        "Animation":{
            deps:["PropsParser","FrameSync","CanvasLayer"]
        },
        "AbstractGrid":{
            deps:["PropsParser"]
        },
        "CE":{
            deps:["CanvasLayer","PropsParser","Jquery-Conflict","MouseReader"]
        },
        "CanvasLayer":{
            deps:["Jquery-Conflict","PropsParser","MouseReader","Overlap","Color"]
        },
        "Color": {
            deps: ["PropsParser"]
        },
        "Filter":{
            deps:["Color"]
        },
        "Frame":{
            deps:["PropsParser"]
        },
        "ImageSet":{
            deps:["PropsParser","ImageLoader"]
        },
        "Map":{
            deps:["PropsParser"]
        },
        "RectSet":{
            deps:["PropsParser","Color"]
        },
        "ImageLoader":{
            deps:["Jquery-Conflict"]
        },
        "MapLoader":{
            deps:["Map","Jquery-Conflict","MaterialsLoader","ImageSet","ImageLoader"]
        },
        "MaterialsLoader":{
            deps:["Jquery-Conflict"]
        },
        "MouseReader": {
            deps: ["Jquery-Conflict"]
        }
    }
});