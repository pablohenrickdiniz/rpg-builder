app.service('TaskService',['$localStorage','$timeout','TASK',function($localStorage,$timeout,TASK){
    var self = this;
    self.executing = false;
    self.registeredActions = [];
    self.paused = false;

    self.initialize = function(){
        console.log('task initialized...');
        self.executeTasks();
    };

    self.executeTasks = function(){
        if($localStorage.tasks && $localStorage.tasks.length > 0 && !self.paused){
            self.executing = true;
            var task = $localStorage.tasks[0];
            if(self.registeredActions[task.action] !== undefined){
                var action = self.registeredActions[task.action];
                console.log('executing task '+task.action);
                action(task.data,function(){
                    $localStorage.tasks.splice(0,1);
                    self.executeTasks();
                },function(){
                    console.log('task failed, restart in '+(TASK.RESTART_TIME/1000)+' seconds');
                    $timeout(function(){
                        self.executeTasks();
                    },TASK.RESTART_TIME);
                });
            }
            else{
                $localStorage.tasks.splice(0,1);
                console.log('task action '+task.action+' not binded');
                self.executeTasks();
            }

        }
        else{
            self.executing = false;
        }
    };

    self.add = function(task){
        if($localStorage.tasks === undefined){
            $localStorage.tasks = [];
        }

        if(task.action){
            $localStorage.tasks.push(task);
        }
        else{
            console.log('task action not defined!');
        }

        if(!self.executing){
            self.executeTasks();
        }
    };

    self.on = function(action,callback){
        self.registeredActions[action] = callback;
        return self;
    };

    self.pause = function(){
        self.paused = true;
    };

    self.continue = function(){
        self.paused = false;
        self.executeTasks();
    };
}]);