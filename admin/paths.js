requirejs.config({
    "urlArgs": "bust=" + (new Date()).getTime(),
    "paths":{
        "React":'../bower_components/react/react',
        "jquery":"../bower_components/jquery/dist/jquery.min",
        "Jquery-Conflict":'src/jquery-conflict',
        "MapEditor":'../core/Tools/build/MapEditor',
        "AnimationEditor":'../core/Tools/build/AnimationEditor',
        "CE":'../core/Graphics/CanvasEngine',
        "Map":'../core/Graphics/Map',
        "Grid":'../core/Graphics/Grid',
        "ImageLoader":'../core/Resources/ImageLoader',
        "InputNumber":'../bower_components/ReactElements/build/InputNumber',
        "Math":'../bower_components/MathLib/src/Math',
        "AbstractGrid":'../core/Graphics/AbstractGrid',
        "ImageSet":'../core/Graphics/ImageSet',
        "CanvasLayer":'../core/Graphics/CanvasLayer',
        "SetIntervalMixin":'../bower_components/ReactElements/build/mixins/setIntervalMixin',
        "InputNumberMixin":"../bower_components/ReactElements/build/mixins/inputNumberMixin",
        "PropsParser":'../custom/PropsParser' ,
        "MouseReader":'../core/Reader/MouseReader',
        "KeyReader":'../core/Reader/KeyReader',
        "RectSet":'../core/Graphics/RectSet',
        "Overlap":'../bower_components/MathLib/src/Overlap',
        "Color":'../core/Graphics/Color',
        "ObjectLayer":"../core/Graphics/ObjectLayer",
        "Filter":"../core/Graphics/Filter",
        "Animation":"../core/Graphics/Animation",
        "Frame":"../core/Graphics/Frame",
        "FrameSync":'../core/Graphics/FrameSync',
        "InputNumberVertical":"../bower_components/ReactElements/build/InputNumberVertical",
        "MapLoader":"../core/Resources/MapLoader",
        "MaterialsLoader":"../core/Resources/MaterialsLoader",
        "AccordionItem":"../bower_components/ReactElements/build/AccordionItem",
        "Accordion":"../bower_components/ReactElements/build/Accordion",
        "IdGenerator":"../bower_components/ReactElements/build/custom/IdGenerator",
        "InputImage":"../bower_components/ReactElements/build/InputImage",
        "InputControls":"../bower_components/ReactElements/build/InputControls",
        "SequenceList":"../bower_components/ReactElements/build/SequenceList",
        "Select":"../bower_components/ReactElements/build/Select",
    },
    "shim":{
        "Jquery-conflict":{
            deps:["jquery"]
        },
        "MapEditor":{
            deps:['CE','Grid','Map','Jquery-Conflict','ImageLoader','InputNumber','React','Math','AbstractGrid','ImageSet']
        },
        "CE":{
            deps:['CanvasLayer','PropsParser','Jquery-Conflict','MouseReader','Grid','Math','ObjectLayer','KeyReader']
        },
        "Map":{
            deps:["PropsParser"]
        },
        "Grid":{
            deps:['PropsParser','RectSet','AbstractGrid','Color']
        },
        "ImageLoader":{
            deps:['Jquery-Conflict']
        },
        "InputNumber":{
            deps:['React','InputNumberMixin']
        },
        "AbstractGrid":{
            deps:["PropsParser"]
        },
        "ImageSet":{
            deps:['PropsParser','ImageLoader','Filter']
        },
        "CanvasLayer":{
            deps:['Jquery-Conflict','PropsParser','MouseReader','Overlap','Color']
        },
        "PropsParser":{
            deps:['Jquery-Conflict']
        },
        "MouseReader":{
            deps:['Jquery-Conflict']
        },
        "RectSet":{
            deps:['PropsParser','Color']
        },
        "Color":{
            deps:["PropsParser"]
        },
        "ObjectLayer":{
            deps:["CanvasLayer"]
        },
        "Filter":{
            deps:["Color"]
        },
        "Animation":{
            deps:['PropsParser','FrameSync','CanvasLayer']
        },
        "Frame":{
            deps:['PropsParser','IdGenerator']
        },
        "InputNumberVertical":{
            deps:['React','InputNumberMixin']
        },
        "MapLoader":{
            deps:['Map','Jquery-Conflict','MaterialsLoader','ImageSet','ImageLoader']
        },
        "MaterialsLoader":{
            deps:['Jquery-Conflict']
        },
        "AccordionItem":{
            deps:['React','IdGenerator']
        },
        "Accordion":{
            deps:['React','IdGenerator','AccordionItem']
        },
        "InputImage":{
            deps:["React"]
        },
        "InputControls":{
            deps:["React"]
        },
        "SequenceList":{
            deps:["React"]
        },
        "Select":{
            deps:["React"]
        }
    }
});