app.service('UploadService',['$http',function($http){
    var self = this;
    self.fileQueue = [];
    self.uploading = false;

    self.executeUploads = function(){
        if(self.fileQueue.length > 0){
            self.uploading = true;
            var queue = self.fileQueue.pop();
            self.upload(queue.fields,queue.url,function(response){
                if(typeof queue.success === 'function'){
                    queue.success(response.data);
                }
                self.executeUploads();
            },function(response){
                if(typeof queue.error === 'function'){
                    queue.error(response.data);
                }
                self.executeUploads();
            });
        }
        else{
            self.executing = false;
        }
    };


    self.upload = function(fields,url,success,error){
        fields = fields === undefined?{}:fields;
        var fd = new FormData();
        Object.keys(fields).forEach(function(index){
            fd.append(index,fields[index]);
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

    self.queue = function(fileData){
        self.fileQueue.push(fileData);
        if(!self.executing){
            self.executeUploads();
        }
    };
}]);