requirejs.config({
    "urlArgs": "bust=" + (new Date()).getTime(),
    "paths":{
        "CE":"../bower_components/CanvasEngine/src/core/CanvasEngine",
        "CanvasLayer":"../bower_components/CanvasEngine/src/core/CanvasLayer",
        "AppObject":"../bower_components/CanvasEngine/src/core/AppObject",
        "Math":"../bower_components/MathLib/src/Math",
        "MouseReader":"../bower_components/CanvasEngine/src/Reader/MouseReader",
        "KeyReader":"../bower_components/CanvasEngine/src/Reader/KeyReader",
        "jquery-tmp":"../bower_components/CanvasEngine/src/utils/jquery",
        "jquery":"../bower_components/jquery/dist/jquery",
        "Grid":"../bower_components/CanvasEngine/src/core/Grid",
        "Map":"../bower_components/CanvasEngine/src/core/Map",
        "ImageLoader":"../core/Resources/ImageLoader",
        "InputNumberVertical":"../bower_components/ReactElements/build/InputNumberVertical",
        "InputNumber":"../bower_components/ReactElements/build/InputNumber",
        "reactDom":"../bower_components/react/react-dom",
        "InputNumberMixin":"../bower_components/ReactElements/build/mixins/inputNumberMixin",
        "SetIntervalMixin":"../bower_components/ReactElements/build/mixins/setIntervalMixin",
        "MapEditor":"../core/Tools/build/MapEditor",
        "AbstractGrid":"../bower_components/CanvasEngine/src/core/AbstractGrid",
        "ImageSet":"../bower_components/CanvasEngine/src/core/ImageSet",
        "RectSet":"../bower_components/CanvasEngine/src/core/RectSet",
        "lodash":"../bower_components/lodash/lodash",
        "Color":"../bower_components/CanvasEngine/src/core/Color",
        "AnimationEditor":"../core/Tools/build/AnimationEditor",
        "InputImage":"../bower_components/ReactElements/build/InputImage",
        "InputControls":"../bower_components/ReactElements/build/InputControls",
        "SequenceList":"../bower_components/ReactElements/build/SequenceList",
        "Select":"../bower_components/ReactElements/build/Select",
        "Frame":"../bower_components/CanvasEngine/src/core/Frame",
        "Animation":"../bower_components/CanvasEngine/src/core/Animation",
        "Overlap":"../bower_components/MathLib/src/Overlap",
        "Filter":"../bower_components/CanvasEngine/src/core/Filter",
        "FrameSync":"../bower_components/CanvasEngine/src/core/FrameSync",
        "IdGenerator":"../bower_components/ReactElements/src/custom/IdGenerator",
        "Validator":"../bower_components/CanvasEngine/src/utils/Validator",
        "Parser":"../bower_components/CanvasEngine/src/utils/Parser",
        "jasmine-script":"../jasmine/lib/jasmine-2.3.4/jasmine",
        "jasmine-boot":"../jasmine/lib/jasmine-2.3.4/boot",
        "jasmine-html":"../jasmine/lib/jasmine-2.3.4/jasmine-html"
    },
    "map":{
        "*":{
            "react":"../bower_components/react/react",
            "React":"../bower_components/react/react",
            'jquery':'jquery-tmp',
            "jasmine":"jasmine-boot"
        },
        "jquery-tmp":{'jquery':'jquery'}
    },
    "shim":{
        'CE':{
            deps:['AppObject','Math','MouseReader','CanvasLayer','KeyReader']
        },
        "jasmine-boot":{
            deps:['jasmine-script','jasmine-html']
        },
        "jasmine-html":{
            deps:['jasmine-script']
        }
    }
});