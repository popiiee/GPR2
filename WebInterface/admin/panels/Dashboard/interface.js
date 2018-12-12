/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelDashboard = {};
panelDashboard.localization = {};
/****************************/

// Panel details
panelDashboard.panelName = "Dashboard";
panelDashboard._panel = $("#pnl" + panelDashboard.panelName);

// Graphs Vars
panelDashboard.Graphs = {
	height : "115px",
	width : "115px"
};

// Localizations
panelDashboard.localization = {
};

// Assign localizations
localizations.panels[panelDashboard.panelName] = $.extend(panelDashboard.localization, localizations.panels[panelDashboard.panelName]);

// Interface methods
panelDashboard.init = function(){
	panelDashboard.showHistoricData(false);
	applyLocalizations(panelDashboard.panelName, localizations.panels);
	panelDashboard.bindEvents();
}

panelDashboard.showHistoricData = function(date){
	var dashboardStatus = $('#dashboardStatus');
	if(!date){
		panelDashboard.isLive = true;
		delete panelDashboard.loadedDate;
		dashboardStatus.addClass('online');
		dashboardStatus.find(".next").addClass('disabled');
		dashboardStatus.find(".prev").removeClass('disabled');
		return false;
	}
	panelDashboard.loadedDate = date;
	dashboardStatus.removeClass('online');
	var dt = moment(date,"YYMMDD HHmm");
	dashboardStatus.find('.date > .value').text(dt.format("YYYY-MM-DD HH:mm"));
	dt = dt.add(5, 'minutes');
	var curDate = moment();
	if(dt.isAfter(curDate) || dt.isSame(curDate)){
		dashboardStatus.find(".next").addClass('disabled');
	}
	else{
		dashboardStatus.find(".next").removeClass('disabled');
	}
	dt = dt.subtract(10, 'minutes');
	if(dt.isAfter(panelDashboard.lastSnapshotDate) || dt.isSame(panelDashboard.lastSnapshotDate)){
		dashboardStatus.find(".prev").removeClass('disabled');
	}
	else{
		dashboardStatus.find(".prev").addClass('disabled');
	}
	panelDashboard.isLive = false;
}

panelDashboard.bindEvents = function(){
	$(".resetStat", panelDashboard._panel).contextMenu({
		topPadding : 110,
		leftPadding : 20,
		menu: 'serverResetStatsContextMenu'
	}, function (action, el, pos, command) {
		jConfirm("Are you sure you want to : " + command + "?","Confirm", function(flag){
			if(flag)
			{
				panelDashboard.serverStatResetAction(action);
			}
		});
		return false;
	}).click(function (evt) {
		evt.stopPropagation();
		evt.preventDefault();
		return false;
	});

	$("#changeSnapshotTime").datetimepicker({
        timeFormat: 'hh:mm',
        dateFormat : 'ymmdd',
        showOn: "both",
        buttonImage: "/WebInterface/Resources/images/calendar.png",
        buttonImageOnly: true,
        maxDate: new Date(),
        stepMinute: 5,
        onClose: function(date){
        	panelDashboard.gethistoricalData(date);
        }
    });
    var dashboardStatus = $('#dashboardStatus');
    dashboardStatus.find(".cancel").click(function(){
    	panelDashboard.showHistoricData(false);
    	crushFTP.methods.removeTextRangeSelection();
    	return false;
    });

    dashboardStatus.find(".prev, .next").click(function(){
    	var curTime = moment();
    	var minute = curTime.minute();
    	var closest = Math.round(minute/5)*5;
    	curTime.minute(closest);
    	var useDate = panelDashboard.loadedDate || curTime;
    	if($(this).hasClass('disabled'))
    		return false;
    	if(useDate){
    		var dt = panelDashboard.loadedDate ? moment(panelDashboard.loadedDate, "YYMMDD HHmm") : useDate;
    		if($(this).is(".prev")){
    			dt = dt.subtract(5, 'minutes');
    		}
    		else if($(this).is(".next")){
    			dt = dt.add(5, 'minutes');
    			var curDate = moment();
    			if(dt.isSame(curDate) || dt.isAfter(curDate)){
    				panelDashboard.showHistoricData(false);
    				crushFTP.methods.removeTextRangeSelection();
    				return false;
    			}
    		}
    		panelDashboard.gethistoricalData(dt.format("YYMMDD HHmm"));
    	}
    	crushFTP.methods.removeTextRangeSelection();
    	return false;
    });
    $('#lastSnapshotTime').click(function(){
    	if($(this).attr("date")){
    		panelDashboard.gethistoricalData($(this).attr("date"));
    	}
    	crushFTP.methods.removeTextRangeSelection();
    	return false;
    })
}

panelDashboard.gethistoricalData = function(date){
	if(!date){
		panelDashboard.showHistoricData(false);
		return;
	}
	var dt = date.split(" ")[0];
	var tm = date.split(" ")[1].split(":").join("");
	if(dt && tm){
		var loadedDate = panelDashboard.loadedDate ? panelDashboard.loadedDate + "" : "";
		panelDashboard.showHistoricData(date);
		crushFTP.data.serverRequest({
			command: "getDashboardHistory",
			history_date: dt,
			history_time: tm
		},
		function(data){
			var xml = data.getElementsByTagName("result_value")[0];
			var status = $(data).find("response_status").text();
			if(status.toLowerCase() === "ok"){
				var items = $.xml2json(xml);
				$('[_id="connected_users"]', '#speedInformation').text("-");
				panelDashboard.bindData(items.getDashboardItems, xml.getElementsByTagName("getDashboardItems")[0]);
				var statInfo = $.xml2json($.xml2json(xml.getElementsByTagName("getStatHistory")[0]));
				if(statInfo){
					panelGraphs.bindGraphsData(statInfo, true);
				}
			}
			else{
				// if(!loadedDate){
				// 	panelDashboard.showHistoricData(false);
				// }
				// else{
				// 	panelDashboard.showHistoricData(loadedDate);
				// }
				crushFTP.UI.growl("Failure", status, true, 3000);
			}
		});
	}
}

panelDashboard.serverStatResetAction = function(action)
{
	var cmdObj = {
		command: "adminAction",
		action : action
	};
	crushFTP.data.serverRequest(
	cmdObj,
	function(data){
		var success = false;
		if(data)
		{
			var usersData = $.xml2json(data);
			if(usersData && usersData["response_status"] && usersData["response_status"]== "OK")
			{
				success = true;
			}
		}
		if(!success)
		{
			crushFTP.UI.growl("Failure", "Admin action " + action, true, true);
		}
		else
		{
			var msg = " Stats reset completed..";
			if(action == "allStats")
				msg = "All" + msg;
			else if(action == "loginStats")
				msg = "Login" + msg;
			else if(action == "transferStats")
				msg = "Transfer : Server Bytes (in, out)"  + msg;
			else if(action == "uploadDownloadStats")
				msg = "Upload/Download"  + msg;
			crushFTP.UI.growl("Success", msg, false, 2000);
		}
	});
};

panelDashboard.bindData  = function(items, xml){
	if(!items)return false;
	if($(xml).find("jce_installed").length==0 || $(xml).find("jce_installed").text() == "false")
	{
		if(!panelDashboard.JCEAlertShown)
		{
			panelDashboard.JCEAlertShown = true;
			crushFTP.UI.growl("Message :", "Your server is limited to weak encryption due to Java policy files and bureaucracy limitations.  As a result, your server uses weak encryption that doesn't meet today's standards.  Click <a href='http://www.crushftp.com/crush8wiki/Wiki.jsp?page=JCEInstall' target='_blank'>here</a> to read more on how to resolve this issue :  <a href='http://www.crushftp.com/crush8wiki/Wiki.jsp?page=JCEInstall' target='_blank'>http://www.crushftp.com/crush8wiki/Wiki.jsp?page=JCEInstall</a><br><strong>Java Information :</strong> <br>" + $(xml).find("java_info").text().replace("bin/java","lib/security").replace("bin\\java","lib\\security") + "");
			$("#growlContainer").unbind("click").find("div").unbind("click").find(".ui-notify-close").click(function(){
				$("#growlContainer").find("div").fadeOut(300);
				return false;
			});
		}
	}
	var lowMemoryText = $(xml).find("low_memory").text();
	if(lowMemoryText)
	{
		if(!panelDashboard.LowMemoryAlertShown)
		{
			panelDashboard.LowMemoryAlertShown = true;
			crushFTP.UI.growl("Message :", lowMemoryText, true);
		}
	}
	if($(xml).find("recent_drives").length>0)
	{
		var drives = [];
		$(xml).find("recent_drives").find("item").each(function(){
			drives.push({name : $(this).attr("name"), val : $(this).text()});
		})
		drives.sort(function(a, b) {
          if (a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
          if (a.name.toLowerCase() > b.name.toLowerCase()) { return  1; }
          return 0;
        });
        var drivespaceAlerts = $("#drivespaceAlerts", panelDashboard._panel).empty();
        if(drives.length>0)
        {
        	for (var i = 0; i < drives.length; i++) {
        		var curData = drives[i];
        		drivespaceAlerts.append('<li class="ui-widget-content bottomborder nobg" style="padding:3px;"><div class="ui-priority-primary wrapword" style="margin:0px 5px 0px 0px;float:left;max-width:190px;font-size:11px;">'+curData.name+'</div><div style="float:right;">'+ curData.val +'</div><div style="clear:both;"></div></li>');
        	};
        }
        else
        	drivespaceAlerts.append('<li style="text-align:center;">Nothing to show</li>');
	}
	else{
		var drivespaceAlerts = $("#drivespaceAlerts", panelDashboard._panel).empty();
		drivespaceAlerts.append('<li style="text-align:center;">Nothing to show</li>');
	}
	if($(xml).find("recent_hammering").length>0)
	{
		var logins = [];
		$(xml).find("recent_hammering").find("*").each(function(){
			logins.push({name : this.nodeName, val : $(this).text()});
		})
		logins.sort(function(a, b) {
          if (a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
          if (a.name.toLowerCase() > b.name.toLowerCase()) { return  1; }
          return 0;
        });
        var hammeringAlerts = $("#hammeringAlerts", panelDashboard._panel).empty();
        if(logins.length>0)
        {
        	for (var i = 0; i < logins.length; i++) {
        		var curData = logins[i];
        		hammeringAlerts.append('<li class="ui-widget-content bottomborder nobg" style="padding:3px;"><div class="ui-priority-primary wrapword" style="margin:0px 5px 0px 0px;float:left;max-width:80px;font-size:12px;">'+curData.name+'</div><div style="float:right;">'+ curData.val +'</div><div style="clear:both;"></div></li>');
        	};
        }
        else
        	hammeringAlerts.append('<li style="text-align:center;">Nothing to show</li>');
	}
	else{
		var hammeringAlerts = $("#hammeringAlerts", panelDashboard._panel).empty();
		hammeringAlerts.append('<li style="text-align:center;">Nothing to show</li>');
	}
	if($(xml).find("last_logins_subitem").length>0)
	{
		var logins = [];
		$(xml).find("last_logins_subitem").each(function(){
			logins.push({date : $(this).find("login_date_formatted").text(), user_name : $(this).find("user_name").text(), ip : $(this).find("ip").text(), dns : $(this).find("dns").text()});
		})
        var lastLogins = $("#lastLogins", panelDashboard._panel).empty();
        if(logins.length>0)
        {
        	for (var i = 0; i < logins.length; i++) {
        		var curData = logins[i];
        		lastLogins.prepend('<div class="ui-widget-content listItem" style="padding:3px 5px 3px 5px;"><span style="display:inline-block;float:left;" class="pointer ui-icon ui-icon-person"></span> <span class="name">'+curData.user_name+'</span>  <span class="date">' + curData.date +' </span><div><span class="ip"> ' + curData.ip  +'</span></div><div><span class="dns"> ' + curData.dns +'</span></div><div style="clear:both;"></div></div>');
        	};
        }
        else
        	lastLogins.append('Nothing to show');
	}
	else{
		var lastLogins = $("#lastLogins", panelDashboard._panel).empty();
		lastLogins.append('Nothing to show');
	}
	items.connected_users = 0;
	if($(xml).find("connected_users").length>0)
	{
		$(xml).find("connected_users").each(function(){
			var curUser = $(this).text();
			if(curUser)
			{
				curUser = parseInt(curUser);
				if(!isNaN(curUser))
				{
					items.connected_users += curUser;
				}
			}
		});
	}
	items.concurrent_users = items.concurrent_users.toString();
	if(items.concurrent_users && parseInt(items.concurrent_users)<0)
	{
		panelDashboard._panel.find(".user-info").addClass('hide-concurrent')
	}
	else{
		panelDashboard._panel.find(".user-info").removeClass('hide-concurrent')
	}
	items.connected_users = items.connected_users.toString();
	var max = parseInt(items.ram_max);
	var free = parseInt(items.ram_free);
	var used = max - free;
	var max_f = crushFTP.methods.formatBytes(max);
	var free_f = crushFTP.methods.formatBytes(free);
	var used_f = crushFTP.methods.formatBytes(used);
	var pnlMemoryInfo = $("#memoryInfo", panelDashboard._panel);
	items.ram_max_f = max_f;
	items.ram_free_f = free_f;
	items.ram_used_f = used_f;
	pnlMemoryInfo.find(".sparkline").sparkline([used, free], {
		sliceColors : ['#549FCC','#83B8D8'],
	    type: 'pie',
	    width: panelDashboard.Graphs.width,
	    height: panelDashboard.Graphs.height,
	    offset: -90,
	    borderWidth: 2,
	    borderColor: '#D1E0E0',
	    tooltipFormatter : function(elem, val, fields){
	    	if(fields.offset == 0)
	    		return '  <span style="color: '+fields.color+'">&#9679;</span> Used : '+crushFTP.methods.formatBytes(fields.value)+'</span>';
	    	else
	    		return '  <span style="color: '+fields.color+'">&#9679;</span> Free : '+crushFTP.methods.formatBytes(fields.value)+'</span>';
	    },
	    tooltipValueLookups: {
	        'offset': {
	            0: 'RAM Used',
	            1: 'RAM Free'
	        }
	    }
	});
	adminPanel.data.bindValuesFromJson(panelDashboard._panel, items, "_id");
	if ($(document).data("crushftp_enterprise"))
	{
		var serverInfo = crushFTP.storage("serverInfo");
		serverInfo.connected_users = items.connected_users;
		adminPanel.data.bindValuesFromJson(panelDashboard._panel, serverInfo, "_id");
		$(".replication-info", panelDashboard._panel).show();
	}
	else{
		$(".replication-info", panelDashboard._panel).hide();
	}
	panelDashboard._panel.find(".formatData, .hideZero").each(function(){
		var val = $(this).text();
		if($(this).hasClass("hideZero"))
		{
			val = adminPanel.methods.hideZero(val);
			$(this).text(val);
		}
		if($(this).hasClass("formatData"))
		{
			if(val && crushFTP.methods.isNumeric(val))
			{
				if($(this).hasClass("inKBs"))
				{
					val = parseFloat(val) * 1024;
				}
				$(this).text(crushFTP.methods.formatBytes(val));
				if($(this).hasClass("speedInSecond"))
				{
					$(this).text($(this).text() + " /sec");
				}
			}
		}
	});

	var server_list = items.server_list;
	var pnlLiveServers = $("#liveServers", panelDashboard._panel);
	crushFTP.methods.rebuildSubItems(server_list, "server_list");
	if(server_list && server_list.server_list_subitem)
	{
		server_list = server_list.server_list_subitem;
		var up = 0, down = 0;
		for (var i = 0; i < server_list.length; i++) {
			var curItem = server_list[i];
			if(curItem.running == "true")
				up++;
			else
				down++;
		};

		pnlLiveServers.find(".sparkline").sparkline([down, up], {
			sliceColors : ['#C80D22','#429B42'],
		    type: 'pie',
		    width: panelDashboard.Graphs.width,
		    height: panelDashboard.Graphs.height,
		    offset: -90,
		    borderWidth: 2,
		    borderColor: '#D1E0E0',
		    tooltipFormat: '  <span style="color: {{color}}">&#9679;</span> {{offset:offset}} : {{value}}</span>',
		    tooltipValueLookups: {
		        'offset': {
		            0: 'Down Servers',
		            1: 'Live Servers'
		        }
		    }
		});
		pnlLiveServers.find(".value.up").text(up);
		pnlLiveServers.find(".value.down").text(down);
	}
	else
	{
		pnlLiveServers.find(".sparkline").text("NA");
		pnlLiveServers.find(".value.up,.value.down").text("");
	}

	var pnlProcessThreads = $("#processThreads", panelDashboard._panel);
	var free = parseInt(items.thread_pool_available);
	var busy = parseInt(items.thread_pool_busy);
	pnlProcessThreads.find(".sparkline").sparkline([busy, free], {
		sliceColors : ['#688A97', '#B4C4CB'],
	    type: 'pie',
	    width: panelDashboard.Graphs.width,
	    height: panelDashboard.Graphs.height,
	    offset: -90,
	    borderWidth: 2,
	    borderColor: '#D1E0E0',
	    tooltipFormat: '  <span style="color: {{color}}">&#9679;</span> {{offset:offset}} : {{value}}</span>',
	    tooltipValueLookups: {
	        'offset': {
	            0: 'Busy Threads',
	            1: 'Free Threads'
	        }
	    }
	});

	var pnlDownloadUploadInfo = $("#downloadUploadInfo", panelDashboard._panel);
	var download = parseInt(items.downloaded_files) || 0;
	var upload = parseInt(items.uploaded_files) || 0;
	pnlDownloadUploadInfo.find(".sparkline").sparkline([download, upload], {
		sliceColors : ['#DBB84D','#CC9900'],
	    type: 'pie',
	    width: panelDashboard.Graphs.width,
	    height: panelDashboard.Graphs.height,
	    offset: -90,
	    borderWidth: 2,
	    borderColor: '#D1E0E0',
	    tooltipFormat: '  <span style="color: {{color}}">&#9679;</span> {{offset:offset}} : {{value}}</span>',
	    tooltipValueLookups: {
	        'offset': {
	            0: 'Download Count',
	            1: 'Upload Count'
	        }
	    }
	});

	var pnlTransferInfo = $("#transferInfo", panelDashboard._panel);
	var sent = parseFloat(items.total_server_bytes_sent);
	var received = parseFloat(items.total_server_bytes_received);
	pnlTransferInfo.find(".sparkline").sparkline([sent, received], {
		sliceColors : ['#B5AABA','#95869D'],
	    type: 'pie',
	    width: panelDashboard.Graphs.width,
	    height: panelDashboard.Graphs.height,
	    offset: -90,
	    borderWidth: 2,
	    borderColor: '#D1E0E0',
	    tooltipFormatter : function(elem, val, fields){
	    	if(fields.offset == 0)
	    		return '  <span style="color: '+fields.color+'">&#9679;</span> Sent : '+crushFTP.methods.formatBytes(fields.value)+'</span>';
	    	else
	    		return '  <span style="color: '+fields.color+'">&#9679;</span> Received : '+crushFTP.methods.formatBytes(fields.value)+'</span>';
	    }
	});

	var pnlLoginInfo = $("#loginInfo", panelDashboard._panel);
	var successful = parseInt(items.successful_logins);
	var failed = parseInt(items.failed_logins);
	pnlLoginInfo.find(".sparkline").sparkline([failed, successful], {
		sliceColors : ['#B27940','#FFAD5C'],
	    type: 'pie',
	    width: panelDashboard.Graphs.width,
	    height: panelDashboard.Graphs.height,
	    offset: -90,
	    borderWidth: 2,
	    borderColor: '#D1E0E0',
	    tooltipFormat: '  <span style="color: {{color}}">&#9679;</span> {{offset:offset}} : {{value}}</span>',
	    tooltipValueLookups: {
	        'offset': {
	            0: 'Failed Logins',
	            1: 'Successful Logins'
	        }
	    }
	});

	crushFTP.data.serverRequest({
		command: "getJobsSummary"
	},
	function(data){
		var jobSummary = false;
		if(data)
		{
			if(data.getElementsByTagName("response_data") && data.getElementsByTagName("response_data").length > 0)
			{
				data = data.getElementsByTagName("response_data")[0];
				jobSummary = $.xml2json(data);
				var running = 0;
				if(jobSummary && jobSummary.running_tasks && jobSummary.running_tasks.running_tasks_subitem)
				{
					crushFTP.methods.rebuildSubItems(jobSummary.running_tasks, "running_tasks");
					running = jobSummary.running_tasks.running_tasks_subitem.length;
				}
				$("#runningJobs", panelDashboard._panel).text(running);
			}
		}
	});

	if(!$("#totalJobs", panelDashboard._panel).attr("dataFetched")){
		crushFTP.data.serverRequest({
			command: "getJob",
			schedule_info: true
		},
		function(data){
			var jobSummary = false;
			if(data)
			{
				if(data.getElementsByTagName("response_data") && data.getElementsByTagName("response_data").length > 0)
				{
					data = data.getElementsByTagName("response_data")[0];
					jobSummary = $.xml2json(data);
					var total = 0;
					if(jobSummary && jobSummary.result_value && jobSummary.result_value.result_value_subitem)
					{
						crushFTP.methods.rebuildSubItems(jobSummary.result_value, "result_value");
						total = jobSummary.result_value.result_value_subitem.length;
					}
					$("#totalJobs", panelDashboard._panel).attr("dataFetched","true").text(total);
				}
			}
		});
		crushFTP.data.serverRequest({
			command: "getDashboardHistory"
		},
		function(data){
			if(data.getElementsByTagName("response_data") && data.getElementsByTagName("response_data").length > 0)
			{
				data = data.getElementsByTagName("response_data")[0];
				var dashboardHistory = $.xml2json(data);
				if(dashboardHistory && dashboardHistory.result_value){
					var result_value = dashboardHistory.result_value;
					var lastSnapshotTime = $('#lastSnapshotTime');
					lastSnapshotTime.attr("date", result_value.history_date+' '+result_value.history_time);
					var dateTime = moment(result_value.history_date+''+result_value.history_time,"YYMMDDHHmm");
					panelDashboard.lastSnapshotDate = dateTime;
					lastSnapshotTime.text(dateTime.format("YYYY-MM-DD hh:mm A"))
					$("#changeSnapshotTime").datetimepicker("option", "minDate", dateTime.toDate());
				}
			}
		});
	}
	var now = new Date();
	$("#lastDashboardTimestamp", panelDashboard._panel).text(dateFormat(now, "mediumTime"));
	$(".dashboardPanelLink", panelDashboard._panel).unbind().click(function(){
		if($(this).hasClass("serverStatus"))
		{
			$("#configOptionTabs").tabs("select", 1);
			$("#statusPanelTabs").tabs("select", 0);
		}
		else if($(this).hasClass("sessionInformation"))
		{
			$("#configOptionTabs").tabs("select", 1);
			$("#statusPanelTabs").tabs("select", 1);
		}
		else if($(this).hasClass("serverInformation"))
		{
			$("#configOptionTabs").tabs("select", 3);
		}
		else if($(this).hasClass("userInformation"))
		{
			$("#configOptionTabs").tabs("select", 1);
			$("#statusPanelTabs").tabs("select", 1);
		}
		else if($(this).hasClass("jobsInformation"))
		{
			return true;
		}
		return false;
	});
};