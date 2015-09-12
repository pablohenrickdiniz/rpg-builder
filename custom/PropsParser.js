define(['Jquery-Conflict'],function($){
    return {
        parseNumber:function(number,defaultValue){
            if(number == undefined || isNaN(number)){
                return defaultValue;
            }
            return number;
        },
        parseFloat:function(number,defaultValue){
            return parseFloat(this.parseNumber(number,defaultValue));
        },
        parseInt:function(number,defaultValue){
            return parseInt(this.parseNumber(number,defaultValue));
        },
        parsePercent:function(percent,parent){
            percent = parseFloat(percent.replace('%',''));
            var width = $(parent).width();
            console.log(width);
            return width*(percent/100);
        },
        isPercentage:function(number){
            var exp = /^[0-9]+(\.[0-9]+)?%$/;
            return exp.test(number);
        },
        parseArray:function(array,defaultArray){
            if(array instanceof Array){
                return array;
            }
            return defaultArray;
        },
        parseInterval:function(value,min,max){
            if(value < min){
                value = min;
            }
            if(value > max){
                value = max;
            }
            return value;
        }
    };
});