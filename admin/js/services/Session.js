app.service('Session',function(){
    this.create = function(sessionId, userId, role, accessToken){
        var self = this;
        self.userId = userId;
        self.role = role;
        self.accessToken = accessToken;
    };

    this.destroy = function(){
        var self = this;
        self.userId = null;
        self.role = null;
        self.accessToken = null;
    };
});