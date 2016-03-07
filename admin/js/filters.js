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

app.filter('maxSize',function(){
    return function(size1,size2){
        if(size1 >  size2 || size1 == size2){
            return '100%';
        }
        return 'auto';
    };
});