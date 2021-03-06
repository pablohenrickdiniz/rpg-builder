requirejs.config({
    "urlArgs": "bust=" + (new Date()).getTime(),
    "paths":{
        "CE":"../bower_components/CanvasEngine/src/core/CanvasEngine",
        "jquery-tmp":"../bower_components/CanvasEngine/src/utils/jquery",
        "jquery":"../bower_components/jquery/dist/jquery",
        "lodash":"../bower_components/lodash/lodash",
        "jasmine-script":"../jasmine/lib/jasmine-2.3.4/jasmine",
        "jasmine-boot":"../jasmine/lib/jasmine-2.3.4/boot",
        "jasmine-html":"../jasmine/lib/jasmine-2.3.4/jasmine-html"
    },
    "map":{
        "*":{
            'jquery':'jquery-tmp',
            "jasmine":"jasmine-boot"
        },
        "jquery-tmp":{'jquery':'jquery'}
    },
    "shim":{
        'CE':{
            deps:['lodash','jquery']
        },
        "jasmine-boot":{
            deps:['jasmine-script','jasmine-html']
        },
        "jasmine-html":{
            deps:['jasmine-script']
        }
    }
});