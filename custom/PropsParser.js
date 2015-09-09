define(['jquery'],function($){
    return {
        parseNumber:function(number,defaultValue){
            if(number == undefined || isNaN(number)){
                return defaultValue;
            }
            return number;
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
        }
    };
});