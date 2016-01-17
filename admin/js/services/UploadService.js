app.service('UploadService',['$http',function($http){
    this.uploadFile = function(file,data,url,success,error){
        data = data == undefined?{}:data;
        var fd = new FormData();
        fd.append('file',file);
        Object.keys(data).forEach(function(index){
            fd.append(index,data[index]);
        });

        $http({
            method:'POST',
            url:url,
            data:fd,
            withCredentials:true,
            transformRequest:angular.identity,
            headers:{'Content-Type':undefined}
        }).then(success,error);
    };
}]);