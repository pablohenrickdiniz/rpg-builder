app.service('UploadService',['$http',function($http){
    this.uploadFile = function(file,url,success,error){
        var fd = new FormData();
        fd.append('file',file);

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