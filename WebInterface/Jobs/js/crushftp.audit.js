var audit = {
    log: {},
    getName: function(obj){
        obj = obj || {};
        var type = obj.type || "";
        var id = obj.id || obj.connectionID || "";
        var name = obj.name || "";
        if(type || id || name)
            return name + "("+type+"/"+id+")";
        return "";
    },
    skipEntry: false,
    template: '{time}|{user}|{job}: {message}',
    getMsg: function(time, user, job, message){
        return audit.template.replace(/{time}/g, dateFormat(time, "yyyy-mm-dd HH:MM:ss")).replace(/{user}/g, user).replace(/{job}/g, job).replace(/{message}/g, message);
    },
    addLog: function(message){
        var currentJob = taskDesigner.loadedSchedule;
        if(!currentJob || audit.skipEntry)return;
        taskDesigner.getServerTime(function(time){
            var jobName = currentJob.scheduleName;
            var jobID = currentJob.id;
            var curTime = time.getTime();
            var currentUser = crushFTP.storage("username");
            audit.log[jobID] = audit.log[jobID] || [];
            var entry = audit.getMsg(curTime, currentUser, jobName, message);
            audit.log[jobID].push(entry);
            console.log(audit.log);
        });
    },
    clearLog: function(key){
        audit.log[key] = [];
    },
    getLog: function(key){
        audit.log[key] = audit.log[key] || [];
        return audit.log[key].join("\n");
    }
};