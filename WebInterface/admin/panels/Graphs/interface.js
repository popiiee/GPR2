/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelGraphs = {};
panelGraphs.localization = {};
/****************************/

// Panel details
panelGraphs.panelName = "Graphs";
panelGraphs._panel = $("#pnl" + panelGraphs.panelName);

//Local variables
panelGraphs.initGraphInterval = 300;
panelGraphs.intervalsInPoll = 1;
panelGraphs.pollIntervalInMS = 1000;
panelGraphs.maxRecordsToShow = 300;
panelGraphs.hasReopened = false;

panelGraphs.Connections = [0];
panelGraphs.ConnectionsUnique = [0];
panelGraphs.OutSpeed = [0];
panelGraphs.InSpeed = [0];

panelGraphs.connectionsGraph = $("#connectionsGraph", panelGraphs._panel);
panelGraphs.connectionCurrent = $("#connectionCurrent", panelGraphs._panel);
panelGraphs.connectionMax = $("#connectionMax", panelGraphs._panel);
panelGraphs.connectionUnique = $("#connectionUnique", panelGraphs._panel);
panelGraphs.connectionUniqueMax = $("#connectionUniqueMax", panelGraphs._panel);
panelGraphs.connectionsUniqueCB = $("#connectionsUniqueCB", panelGraphs._panel);
panelGraphs.connectionsAllCB = $("#connectionsAllCB", panelGraphs._panel);

panelGraphs.outSpeedGraph = $("#outSpeedGraph", panelGraphs._panel);
panelGraphs.outSpeedCurrent = $("#outSpeedCurrent", panelGraphs._panel);
panelGraphs.outSpeedMax = $("#outSpeedMax", panelGraphs._panel);

panelGraphs.inSpeedGraph = $("#inSpeedGraph", panelGraphs._panel);
panelGraphs.inSpeedCurrent = $("#inSpeedCurrent", panelGraphs._panel);
panelGraphs.inSpeedMax = $("#inSpeedMax", panelGraphs._panel);

panelGraphs.memoryGraph = $("#memoryGraph", panelGraphs._panel);
panelGraphs.ram_max = $("#ram_max", panelGraphs._panel);
panelGraphs.ram_free = $("#ram_free", panelGraphs._panel);

panelGraphs.serverCPUMax = $("#serverCPUMax", panelGraphs._panel);
panelGraphs.osCPUMax = $("#osCPUMax", panelGraphs._panel);

panelGraphs.serverCPUGraph = $("#serverCPUGraph", panelGraphs._panel);
panelGraphs.serverOSGraph = $("#osCPUGraph", panelGraphs._panel);

panelGraphs.graphInfo = $("#graphinfo");
panelGraphs.graphInfo.draggable();
panelGraphs.graphTip = $("#graphtip");

$.fn.sparkline.defaults.common.width = "99%";
$.fn.sparkline.defaults.common.height = "100px";

panelGraphs.maxConnection = 0;
panelGraphs.maxUniqueConnection = 0;
panelGraphs.maxOutSpeed = 0;
panelGraphs.maxInSpeed = 0;

// Localizations
panelGraphs.localization = {};

// Assign localizations
localizations.panels[panelGraphs.panelName] = $.extend(panelGraphs.localization, localizations.panels[panelGraphs.panelName]);

// Interface methods
panelGraphs.init = function() {
    applyLocalizations(panelGraphs.panelName, localizations.panels);
    var isInit = true;

    function threadMethod() {
        if (!panelGraphs._panel.is(":visible")) {
            //panelGraphs.hasReopened = true;
        } else {
            if (!panelGraphs.graphThreadRunning) {
                panelGraphs.refreshDataFromServer(isInit);
                panelGraphs.hasReopened = isInit = false;
            }
        }
    }
    if (!panelGraphs.graphsThread) {
        panelGraphs.graphsThread = setInterval(
            threadMethod, panelGraphs.pollIntervalInMS);
    }
    threadMethod();
    $("#memoryRelease").unbind().click(function() {
        var cmdObj = {
            command: "system.gc"
        };
        crushFTP.data.serverRequest(cmdObj,
            function(data) {
                crushFTP.UI.growl("Success", "", false, 2000);
            });
    });

    panelGraphs.outSpeedGraph.bind("mousemove", function(ev) {
        var left = ev.pageX;
        if (left > $(window).width() - 370) {
            left = $(window).width() - 370;
        }
        panelGraphs.graphTip.css({
            top: panelGraphs.outSpeedGraph.offset().top - panelGraphs.outSpeedGraph.height(),
            left: left
        });
    });

    panelGraphs.inSpeedGraph.bind("mousemove", function(ev) {
        var left = ev.pageX;
        if (left > $(window).width() - 370) {
            left = $(window).width() - 370;
        }
        panelGraphs.graphTip.css({
            top: panelGraphs.inSpeedGraph.offset().top - panelGraphs.inSpeedGraph.height(),
            left: left
        });
    });

    panelGraphs.outSpeedGraph.bind("click", function(ev) {
        var curRegion = panelGraphs.outSpeedGraph.data("curRegion");
        if (curRegion) {
            panelGraphs.showSpeedInfo(curRegion, "out", false, true);
        }
    });

    panelGraphs.inSpeedGraph.bind("click", function(ev) {
        var curRegion = panelGraphs.inSpeedGraph.data("curRegion");
        if (curRegion) {
            panelGraphs.showSpeedInfo(curRegion, "in", false, true);
        }
    });

    panelDashboard._panel.find("fieldset#speedInformation").find(".downSpeed").bind("mouseenter", function(ev) {
        var left = ev.pageX;
        if (left > $(window).width() - 370) {
            left = $(window).width() - 370;
        }
        panelGraphs.graphTip.css({
            top: ev.pageY - 100,
            left: left - 150
        });
        panelGraphs.graphTip.attr("monitoring.down", true);

        function refreshSpeedInfo() {
            panelGraphs.showSpeedInfo(ev, "out", 299);
            setTimeout(function() {
                if (panelGraphs.graphTip.attr("monitoring.down"))
                    refreshSpeedInfo();
            }, 2000);
        }
        refreshSpeedInfo();
    }).bind("mouseleave", function() {
        panelGraphs.graphTip.hide();
        panelGraphs.graphTip.removeAttr("monitoring.down");
    });

    panelDashboard._panel.find("fieldset#speedInformation").find(".upSpeed").bind("mouseenter", function(ev) {
        var left = ev.pageX;
        if (left > $(window).width() - 370) {
            left = $(window).width() - 370;
        }
        panelGraphs.graphTip.css({
            top: ev.pageY - 100,
            left: left - 150
        });
        panelGraphs.graphTip.attr("monitoring.up", true);

        function refreshSpeedInfo() {
            panelGraphs.showSpeedInfo(ev, "in", 299);
            setTimeout(function() {
                if (panelGraphs.graphTip.attr("monitoring.up"))
                    refreshSpeedInfo();
            }, 2000);
        }
        refreshSpeedInfo();
    }).bind("mouseleave", function() {
        panelGraphs.graphTip.hide();
        panelGraphs.graphTip.removeAttr("monitoring.up");
    });

    panelGraphs.graphInfo.find(".close").click(function() {
        panelGraphs.graphInfo.hide();
        return false;
    });

    panelGraphs.connectionsUniqueCB.unbind().change(function(){
        panelGraphs.renderGraphs();
    });

    panelGraphs.connectionsAllCB.unbind().change(function(){
        panelGraphs.renderGraphs();
    });

    $("#memoryGraphPanel").contextMenu({
        topPadding: 110,
        leftPadding: 20,
        menu: 'memoryGraphContextMenu'
    }, function(action, el, pos, command) {
        if (command == "restartProcess") {
            var obj = {
                command: "restartProcess",
                random: Math.random(),
                c2f: crushFTP.getCrushAuth()
            };
            $.ajax({
                type: "POST",
                url: crushFTP.ajaxCallURL,
                data: obj,
                async: true,
                success: function(data) {
                    crushFTP.UI.growl("Success", "", false, 2000);
                }        
            });
        }
        if (command == "setMaxServerMemory") {
            function setMaxMemory() {
                var _val = "0";
                var numbers = /^[0-9]+$/;
                jPrompt("Set Max. Server Memory : ", _val, "Input", function(value) {
                    if (value && value.length > 0) {
                        if (value.match(numbers)) {
                            var obj = {
                                command: "setMaxServerMemory",
                                memory: $.trim(value),
                                random: Math.random(),
                                c2f: crushFTP.getCrushAuth()
                            };
                            $.ajax({
                                type: "POST",
                                url: crushFTP.ajaxCallURL,
                                data: obj,
                                async: true,
                                success: function(data) {
                                    crushFTP.UI.growl("Success", "", false, 2000);
                                }         
                            });
                        } else {
                            jAlert("Please input numeric characters only.", "Error", function() {
                                setMaxMemory();
                            });
                        }
                    }
                });
            }
            setMaxMemory(); 
        }
        if (command == "dumpMemory") {
            window.open("/WebInterface/function/?command=dumpHeap&c2f="+crushFTP.getCrushAuth());
        }
        return false;
    }).click(function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        return false;
    });

};

panelGraphs.showSpeedInfo = function(ev, type, region, info) {
    if (!region) {
        var sparkline = ev.sparklines[0];
        region = sparkline.getCurrentRegionFields().x;
        region = region || 299;
    }
    var curData;
    var infoPanel = panelGraphs.graphTip;
    if (info) {
        infoPanel = panelGraphs.graphInfo;
        if (type == "in")
            infoPanel.find(".title").text("Incoming Speed Information");
        else
            infoPanel.find(".title").text("Outgoing Speed Information");
    }
    infoPanel.show();
    infoPanel.find(".nodata").hide();
    infoPanel.find(".info").hide();
    infoPanel.find(".loader").show();
    var key = "/server_info/incoming_transfers_history/" + region;
    if (type == "out")
        key = "/server_info/outgoing_transfers_history/" + region;
    crushFTP.data.serverRequest({
        command: "getServerItem",
        key: key
    }, function(data) {
        var items = $.xml2json(data);
        if (items && items.response_data && items.response_data.result_value && items.response_data.result_value.result_value_subitem) {
            curData = items.response_data.result_value.result_value_subitem;
            infoPanel.find(".nodata").hide();
            infoPanel.find(".info").show();
            infoPanel.find(".loader").hide();
            if (!jQuery.isArray(curData)) {
                curData = [curData];
            }
            infoPanel.find(".info").empty();
            var hasItems = false;
            for (var i = 0; i < curData.length; i++) {
                var item = curData[i];
                if (item && item.user_name) {
                    var infoItem = $('<li><strong><span class="value user_name"></span></strong>&nbsp;(<span class="value user_protocol"></span>)&nbsp;<span class="value user_ip"></span>&nbsp;&nbsp;<span class="perc"></span><span class="value time"></span><br><strong>Item : </strong><span class="value name"></span>&nbsp;(<span class="value the_file_size size"></span>)&nbsp;<span class="value the_file_speed size"></span></li>');
                    hasItems = true;
                    var dt, dtstart;
                    try {
                        var now = new Date(parseInt(item.now));
                        dt = dateFormat(now, "hh:MM:ss TT");
                        var the_file_start = new Date(parseInt(item.the_file_start));
                        dtstart = dateFormat(now, "hh:MM:ss TT");
                    } catch (ex) {
                        dt = dtstart = "-";
                    }
                    infoItem.find(".time").text(dt);
                    infoItem.find(".user_name").text(item.user_name);
                    infoItem.find(".user_protocol").text(item.user_protocol);
                    infoItem.find(".user_ip").text(item.user_ip);
                    infoItem.find(".name").text(item.name);
                    infoItem.find(".the_file_size").text(crushFTP.methods.formatBytes(item.the_file_size));
                    infoItem.find(".the_file_speed").text(crushFTP.methods.formatBytes(item.the_file_speed * 1024) + "/s");
                    infoPanel.find(".info").append(infoItem);
                    if (type === "in" && item.user_protocol.toLowerCase().indexOf("http") !== 0) {
                        infoItem.find(".the_file_size").hide();
                    }
                    if (type === "out") {
                        var curLoc = item.current_loc;
                        var totalSize = item.the_file_size;
                        var perc = (100 * curLoc) / totalSize;
                        if (perc <= 100)
                            infoItem.find(".perc").text(Math.round(perc) + "%");
                    }
                }
            }
            if (hasItems) {
                infoPanel.show();
            } else {
                infoPanel.find(".nodata").show();
                infoPanel.find(".info").hide();
                infoPanel.find(".loader").hide();
            }
        } else {
            infoPanel.find(".nodata").show();
            infoPanel.find(".info").hide();
            infoPanel.find(".loader").hide();
        }
    });
};

panelGraphs.bindGraphsData = function(items, init){
    function getDataFromResponse(items, key) {
        if (items && items[key]) {
            var val = items[key];
            if (val.lastIndexOf(",") == val.length - 1)
                val = val.substr(0, val.length - 1);
            return val.split(",").reverse();
        } else
            return "";
    }
    if(init){
        priorIntervals = panelGraphs.initGraphInterval;
        panelGraphs.Connections = [];
        panelGraphs.ConnectionsUnique = [];
        panelGraphs.OutSpeed = [];
        panelGraphs.InSpeed = [];
        panelGraphs.RamFree = [];
        panelGraphs.RamUsed = [];
        panelGraphs.ServerCPU = [];
        panelGraphs.OSCPU = [];
        panelGraphs.intervalsInPoll = panelGraphs.initGraphInterval;
    }

    panelGraphs.bindData.graphs({
        logged_in_users: getDataFromResponse(items.response_data, "logged_in_users"),
        connected_unique_ips: getDataFromResponse(items.response_data, "connected_unique_ips"),
        current_download_speed: getDataFromResponse(items.response_data, "current_download_speed"),
        current_upload_speed: getDataFromResponse(items.response_data, "current_upload_speed"),
        ram_free: getDataFromResponse(items.response_data, "ram_free"),
        ram_max: getDataFromResponse(items.response_data, "ram_max"),
        server_cpu: getDataFromResponse(items.response_data, "server_cpu"),
        os_cpu: getDataFromResponse(items.response_data, "os_cpu")
    });
}

panelGraphs.refreshDataFromServer = function(isInit) {
    if(!window.panelDashboard.isLive) return;
    panelGraphs.graphThreadRunning = true;
    var priorIntervals = panelGraphs.intervalsInPoll;
    if (isInit) {
        priorIntervals = panelGraphs.initGraphInterval;
        panelGraphs.Connections = [];
        panelGraphs.ConnectionsUnique = [];
        panelGraphs.OutSpeed = [];
        panelGraphs.InSpeed = [];
        panelGraphs.RamFree = [];
        panelGraphs.RamUsed = [];
        panelGraphs.ServerCPU = [];
        panelGraphs.OSCPU = [];
    }

    if (priorIntervals > panelGraphs.maxRecordsToShow) priorIntervals = panelGraphs.maxRecordsToShow;
    var params = "current_download_speed,current_upload_speed,logged_in_users,ram_free,ram_max,server_cpu,os_cpu,connected_unique_ips";
    crushFTP.data.serverRequest({
        command: "getStatHistory",
        params: params,
        priorIntervals: priorIntervals
    }, function(data) {
        panelGraphs.graphThreadRunning = false;
        panelGraphs.bindGraphsData($.xml2json(data));
    });
};

// Bind data from provided JSON to panel's fields
panelGraphs.bindData = {
    graphs: function(data) {
        if (!data || !data.logged_in_users) {
            return;
        }
        //Connections
        panelGraphs.Connections = panelGraphs.Connections.concat(data.logged_in_users);
        if (panelGraphs.Connections.length > panelGraphs.maxRecordsToShow) {
            var itemsToRemove = panelGraphs.Connections.length - panelGraphs.maxRecordsToShow;
            panelGraphs.Connections.remove(1, itemsToRemove);
            panelGraphs.Connections[0] = 0;
        }
        var currentConnections = parseInt(data.logged_in_users[data.logged_in_users.length - 1]);
        var maxVal = parseInt(data.logged_in_users.max());
        if (maxVal > panelGraphs.maxConnection) {
            panelGraphs.maxConnection = maxVal;
        }
        panelGraphs.connectionCurrent.text(currentConnections);
        panelGraphs.connectionMax.text(panelGraphs.maxConnection);

        //Connections Unique
        panelGraphs.ConnectionsUnique = panelGraphs.ConnectionsUnique.concat(data.connected_unique_ips);
        if (panelGraphs.ConnectionsUnique.length > panelGraphs.maxRecordsToShow) {
            var itemsToRemove = panelGraphs.ConnectionsUnique.length - panelGraphs.maxRecordsToShow;
            panelGraphs.ConnectionsUnique.remove(1, itemsToRemove);
            panelGraphs.ConnectionsUnique[0] = 0;
        }

        var currentUniqueConnections = parseInt(data.connected_unique_ips[data.connected_unique_ips.length - 1]);
        var maxUniqueVal = parseInt(data.connected_unique_ips.max());
        if (maxUniqueVal > panelGraphs.maxUniqueConnection) {
            panelGraphs.maxUniqueConnection = maxUniqueVal;
        }
        panelGraphs.connectionUnique.text(currentUniqueConnections);
        panelGraphs.connectionUniqueMax.text(panelGraphs.maxUniqueConnection);

        //Out speed
        panelGraphs.OutSpeed = panelGraphs.OutSpeed.concat(data.current_download_speed);
        if (panelGraphs.OutSpeed.length > panelGraphs.maxRecordsToShow) {
            var itemsToRemove = panelGraphs.OutSpeed.length - panelGraphs.maxRecordsToShow;
            panelGraphs.OutSpeed.remove(1, itemsToRemove);
            panelGraphs.OutSpeed[0] = 0;
        }
        var currentOutSpeed = parseInt(data.current_download_speed[data.current_download_speed.length - 1]);
        var maxOSVal = parseInt(data.current_download_speed.max());
        if (maxOSVal > panelGraphs.maxOutSpeed) {
            panelGraphs.maxOutSpeed = maxOSVal;
        }
        panelGraphs.outSpeedCurrent.text(crushFTP.methods.formatBytes(currentOutSpeed * 1024) + "/sec");
        panelGraphs.outSpeedMax.text(crushFTP.methods.formatBytes(panelGraphs.maxOutSpeed * 1024) + "/sec");


        //In Speed
        panelGraphs.InSpeed = panelGraphs.InSpeed.concat(data.current_upload_speed);
        if (panelGraphs.InSpeed.length > panelGraphs.maxRecordsToShow) {
            var itemsToRemove = panelGraphs.InSpeed.length - panelGraphs.maxRecordsToShow;
            panelGraphs.InSpeed.remove(1, itemsToRemove);
            panelGraphs.InSpeed[0] = 0;
        }
        var currentInSpeed = parseInt(data.current_upload_speed[data.current_upload_speed.length - 1]);
        var maxISVal = parseInt(data.current_upload_speed.max());
        if (maxISVal > panelGraphs.maxInSpeed) {
            panelGraphs.maxInSpeed = maxISVal;
        }
        panelGraphs.inSpeedCurrent.text(crushFTP.methods.formatBytes(currentInSpeed * 1024) + "/sec");
        panelGraphs.inSpeedMax.text(crushFTP.methods.formatBytes(panelGraphs.maxInSpeed * 1024) + "/sec");

        //Memory
        panelGraphs.RamFree = panelGraphs.RamFree.concat(data.ram_free);
        if (panelGraphs.RamFree.length > panelGraphs.maxRecordsToShow) {
            var itemsToRemove = panelGraphs.RamFree.length - panelGraphs.maxRecordsToShow;
            panelGraphs.RamFree.remove(1, itemsToRemove);
            panelGraphs.RamFree[0] = 0;
        }
        panelGraphs.ram_free.text(crushFTP.methods.formatBytes(data.ram_free[data.ram_free.length - 1]));
        panelGraphs.ram_max.text(crushFTP.methods.formatBytes(data.ram_max[data.ram_max.length - 1]));

        panelGraphs.RamUsed = [];
        var maxRam = data.ram_max[data.ram_max.length - 1];
        for (var i = 0; i < panelGraphs.RamFree.length; i++) {
            if (panelGraphs.RamFree[i] > 0)
                panelGraphs.RamUsed.push(maxRam - panelGraphs.RamFree[i]);
        }
        //Server CPU
        panelGraphs.ServerCPU = panelGraphs.ServerCPU.concat(data.server_cpu);
        if (panelGraphs.ServerCPU.length > panelGraphs.maxRecordsToShow) {
            var itemsToRemove = panelGraphs.ServerCPU.length - panelGraphs.maxRecordsToShow;
            panelGraphs.ServerCPU.remove(1, itemsToRemove);
            panelGraphs.ServerCPU[0] = 0;
        }
        var maxServerCPU = 0;
        for (var i = panelGraphs.ServerCPU.length - 1; i >= 0; i--) {
            if(parseInt(panelGraphs.ServerCPU[i])>maxServerCPU)
                maxServerCPU = panelGraphs.ServerCPU[i];
        };
        panelGraphs.serverCPUMax.text(maxServerCPU);

        //OS CPU
        panelGraphs.OSCPU = panelGraphs.OSCPU.concat(data.os_cpu);
        if (panelGraphs.OSCPU.length > panelGraphs.maxRecordsToShow) {
            var itemsToRemove = panelGraphs.OSCPU.length - panelGraphs.maxRecordsToShow;
            panelGraphs.OSCPU.remove(1, itemsToRemove);
            panelGraphs.OSCPU[0] = 0;
        }
        var maxCPU = 0;
        for (var i = panelGraphs.OSCPU.length - 1; i >= 0; i--) {
            if(parseInt(panelGraphs.OSCPU[i])>maxCPU)
                maxCPU = panelGraphs.OSCPU[i];
        };
        panelGraphs.osCPUMax.text(maxCPU);
        // Now render graphs
        panelGraphs.renderGraphs(maxRam);
    }
};

panelGraphs.renderGraphs = function(maxRam) {
    if(!maxRam && panelGraphs.curMaxRam)
        maxRam = panelGraphs.curMaxRam;
    panelGraphs.curMaxRam = maxRam;
    var connections = panelGraphs.Connections;
    if(panelGraphs.connectionsUniqueCB.is(":checked")){
        connections = panelGraphs.ConnectionsUnique;
    }
    panelGraphs.connectionsGraph.sparkline(connections, {
        type: "line",
        lineColor: "#36363a",
        fillColor: "#A3A3C2"
    });
    panelGraphs.outSpeedGraph.sparkline(panelGraphs.OutSpeed, {
        type: "line",
        lineColor: "#36363a",
        fillColor: "#ADAD85",
        tooltipOffsetY: -50
    }).unbind('sparklineRegionChange').bind('sparklineRegionChange', function(ev) {
        panelGraphs.outSpeedGraph.data("curRegion", ev);
        panelGraphs.showSpeedInfo(ev, "out");
    }).unbind('mouseleave').bind('mouseleave', function() {
        panelGraphs.graphTip.hide();
    });

    panelGraphs.inSpeedGraph.sparkline(panelGraphs.InSpeed, {
        type: "line",
        lineColor: "#999966",
        fillColor: "#ADAD85",
        tooltipOffsetY: -50
    }).unbind('sparklineRegionChange').bind('sparklineRegionChange', function(ev) {
        panelGraphs.inSpeedGraph.data("curRegion", ev);
        panelGraphs.showSpeedInfo(ev, "in");
    }).unbind('mouseleave').bind('mouseleave', function() {
        panelGraphs.graphTip.hide();
    });

    panelGraphs.memoryGraph.sparkline(panelGraphs.RamUsed, {
        type: "line",
        lineColor: "#83B8D8",
        fillColor: "#549FCC",
        chartRangeMax: maxRam
    });

    panelGraphs.serverCPUGraph.sparkline(panelGraphs.ServerCPU, {
        type: "line",
        lineColor: "#83B8D8",
        fillColor: "#549FCC",
        chartRangeMin: 0,
        chartRangeMax: 100,
        chartRangeClip: true
    });

    panelGraphs.serverOSGraph.sparkline(panelGraphs.OSCPU, {
        type: "line",
        lineColor: "#83B8D8",
        fillColor: "#549FCC",
        chartRangeMin: 0,
        chartRangeMax: 100
    });
};