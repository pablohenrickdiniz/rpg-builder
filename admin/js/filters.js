app.filter('bobUrl',function(){
    return function(url,baseUrl){
       var regex = /^(blob|data):/;
       if(regex.test(url)){
            return url;
       }
       else{
           return baseUrl+url;
       }
    };
});