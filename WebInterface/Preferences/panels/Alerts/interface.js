/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelAlerts = {};
panelAlerts.localization = {};
/****************************/

// Panel details
var panelName = "Alerts";
var _panel = $("#pnl" + panelName);

// Localizations
panelAlerts.localization = {
	headerText : ""
	, pnlDescText : "Alerts allow for automatic notifications when specific server events occur."
	, btnAddText : "Add"
	, btnCopyText : "Copy"
	, btnRemoveText : "Remove"
	, lblAlertTypeText : "Alert Type : "
	, lblSecondsIntervalText : "Seconds interval : "
	, lblLoginCountText : "Login count : "
	, lblPercentageOfQuotaTobeReachedText : "Percentage of quota to be reached for this alert : "
	, lblDriveText : "Drive : "
	, lblThresholdInMBText : "Threshold in MB : "
	, lblEmailText : "Email"
	, lblEmailMaxOfText : "Max of : "
	, lblEmailDurationText : "emails per hour"
	, lblEmailFromText : "From : "
	, lblEmailToText : "To : "
	, lblEmailCCText : "CC : "
	, lblEmailBCCText : "BCC : "
	, lblEmailSubjectText : "Subject : "
	, lblEmailBodyText : "Body : "
	, btnResetText : "Reset To Default"
	, btnCancelText : "Cancel"
	, btnOKText : "Save"
};

panelAlerts.defaultVals = {
	hammering : {
		body : "<LINE>\r\nID:%user_id%\r\nConnectionGroup:%user_listen_ip_port%\r\nServerIP:%user_listen_ip%\r\nServerPort:%user_port%\r\nUserIP:%user_ip%\r\nProtocol:%user_protocol%\r\nUsername:%user_name%\r\n</LINE>"
	},
	big_dir : {
		body : "{alert_msg}"
	}
}

// Assign localizations
localizations.panels[panelName] = $.extend(panelAlerts.localization, localizations.panels[panelName]);

// Interface methods
panelAlerts.init = function(){
	applyLocalizations(panelName, localizations.panels);
	crushFTP.methods.setPageTitle(panelAlerts.localization.Header, true);
	panelAlerts.bindData();
	panelAlerts.bindEvents();
    setupPrefsReplicationSave(_panel, panelName);
}

panelAlerts.validateData = function(){
	var formAlertsList = $("#alerts", _panel).find("li");
	var validated = true;
	if(formAlertsList.length>0)
	{
		formAlertsList.each(function(){
			var elm = $(this);
			var controlData = elm.data("controlData");
			var type = controlData.type[0].text;
			if(type === "User reached quota percentage" && validated){
				var quota_perc = controlData.quota_perc ? controlData.quota_perc[0].text : "";
				if(!quota_perc || !crushFTP.methods.isNumeric(quota_perc)){
					jAlert("User quota percentage value is invalid, it must be numeric value", "Error", function(){
						var selected = $(elm);
						selected.parent().find(".ui-widget-header").removeClass("ui-widget-header");
						selected.parent().find(".ui-selected").removeClass("ui-selected");
						selected.addClass("ui-widget-header ui-selected");
						panelAlerts.bindFormDetails(selected);
						setTimeout(function(){
							$("#quota_perc").focus().addClass('input-error');
							setTimeout(function(){
								$("#quota_perc").removeClass('input-error');
							}, 1000);
						}, 100);
					}, {
  						classForPopupPanel : 'warning'
  					});
  					validated = false;
				}
			}
		});
	}
	return validated;
}

panelAlerts.bindData = function()
{
	panelAlerts.bindActions();
	var prefs = common.data.ServerPrefs();
	bindValuesFromXML(_panel, prefs);
	if(prefs && prefs["alerts"])
	{
		var alerts = prefs["alerts"];
		if(alerts.length>0)
		{
			alerts = alerts[0] ? alerts[0]["alerts_subitem"] : false;
			if(alerts)
			{
				var alertsList = $("#alerts", _panel);
				var selected = alertsList.find("li.ui-widget-header").index();
				alertsList.empty();
				for(var i=0;i<alerts.length;i++)
				{
					var curItem = alerts[i];
					var type = crushFTP.data.getTextValueFromXMLNode(curItem.type, "");
					if(curItem && curItem.type && type != "Dummy")
					{
						var typeText = type == "User Hammering" ? "Too Many Active Logins" : type;
						var newControl = $("<li class='ui-widget-content' alertType='"+type+"'>"+typeText+"</li>");
						alertsList.append(newControl);
						newControl.data("controlData", curItem);
					}
				}
				if(selected>=0)
				{
					selected += 1;
					panelAlerts.bindFormDetails(alertsList.find("li:nth-child("+selected+")").addClass("ui-widget-header ui-selected"));
				}
			}
		}
	}
}

panelAlerts.bindActions = function()
{
	var alert_plugin = $("#alert_plugin", _panel).empty();
	alert_plugin.append("<option value=\"\">-</option>");
	var crushTaskPlugins = common.data.getPluginPrefs("CrushTask");
	var pluginOpts = $('<optgroup label="Plugin"></optgroup>');
	for(var index=0; index<crushTaskPlugins.length;index++)
	{
		var curPlugin = crushTaskPlugins[index];
		if(curPlugin && curPlugin.subItem && curPlugin.subItem.length>0)
		{
			var tabName = curPlugin.subItem[0].text ? "CrushTask:" + curPlugin.subItem[0].text : "CrushTask";
			pluginOpts.append("<option value=\""+unescape(tabName)+"\">"+unescape(tabName)+"</option>");
		}
	}
	alert_plugin.append(pluginOpts);
	var availableJobs = $(document).data("AvailableJobsNoEvents");
	if(availableJobs && availableJobs.length>0)
	{
		var jobOpts = $('<optgroup label="Job"></optgroup>');
		for (var i = 0; i < availableJobs.length; i++) {
			jobOpts.append("<option value=\"Job:"+unescape(availableJobs[i])+"\">"+unescape(availableJobs[i])+"</option>");
		}
		alert_plugin.append(jobOpts);
	}
};

panelAlerts.bindEvents = function()
{
	var alerts = $("#alerts", _panel);
	alerts.selectable({
		selected: function(event, ui) {
			var selected = $(ui.selected);
			selected.parent().find(".ui-widget-header").removeClass("ui-widget-header");
			selected.addClass("ui-widget-header");
			panelAlerts.bindFormDetails(selected);
			return false;
		}
	});

	_panel.find("select#type").change(function(){
		var type = $(this).val();
		var typeText = type == "User Hammering" ? "Too Many Active Logins" : type;
		if(type == "User Hammering")
		{
			$("#body", _panel).val(panelAlerts.defaultVals.hammering.body).change();
		}
		if(type == "Big Directory")
		{
			$("#body", _panel).val(panelAlerts.defaultVals.big_dir.body).change();
			typeText = "Big Directory";
		}
		$("#subject", _panel).val(typeText).change();
		panelAlerts.showFieldsBasedOnType(type);
	});

	$("a#addAlert", _panel).click(function(){
		crushFTP.UI.addItem($("#alerts", _panel)
		, $("<li class='ui-widget-content'>No Action</li>")
		, {
			alert_plugin:[{text:""}],
			cc:[{text:""}],
			quota_perc:[{text:""}],
			login_count:[{text:""}],
			max_alert_emails:[{text:"60"}],
			body:[{text:"Username (if any): %user_name%\nUser IP: %user_ip%\nMessage (if any): %msg%"}],
			bcc:[{text:""}],
			type:[{text:"No Action"}],
			subject:[{text:""}],
			from:[{text:""}],
			to:[{text:""}],
			threshold_mb:[{text:""}],
			drive:[{text:""}],
			login_interval:[{text:"60"}]
		}
		, panelAlerts.bindFormDetails);
		itemsChanged(true);
		return false;
	});

	$("a#copyAlert", _panel).click(function(){
		crushFTP.UI.copyItem($("#alerts", _panel).find("li.ui-selected"), panelAlerts.bindFormDetails);
		itemsChanged(true);
		return false;
	});

	$("a#removeAlert", _panel).click(function(){
		crushFTP.UI.removeItem($("#alerts", _panel), panelAlerts.bindFormDetails);
		itemsChanged(true);
		return false;
	});

	var formDetailsPanel  = $("#formDetailsPanel", _panel);
	formDetailsPanel.find("input, select, textarea").bind("change", function(){
		var item = alerts.find("li.ui-selected");
		if(!item || item.length==0)return;
		var data = item.data("controlData");
		if(data)
		{
			var isBool = $(this).attr("type") == "radio" || $(this).attr("type") == "checkbox";
			data[$(this).attr("id")] = [{text: isBool ? $(this).is(":checked").toString() : $(this).val()}];
			if($(this).attr("id") == "type")
			{
				var typeText = $(this).val() == "User Hammering" ? "Too Many Active Logins" : $(this).val();
				item.text(typeText);
			}
		}
		item.data("controlData", data);
		itemsChanged(true);
	});

	formDetailsPanel.find("input[type='text'], textarea").bind("textchange", function(){
		var item = alerts.find("li.ui-selected");
		if(!item || item.length==0)return;
		var data = item.data("controlData");
		if(data)
		{
			var isBool = $(this).attr("type") == "radio" || $(this).attr("type") == "checkbox";
			data[$(this).attr("id")] = [{text: isBool ? $(this).is(":checked").toString() : $(this).val()}];
			if($(this).attr("id") == "type")
			{
				var typeText = $(this).val() == "User Hammering" ? "Too Many Active Logins" : $(this).val();
				item.text(typeText);
			}
		}
		item.data("controlData", data);
		itemsChanged(true);
	});

	$("#testEmail", _panel).click(function(){
		var prefs = common.data.ServerPrefs();
		function getPrefsVal(key,dval)
		{
			if(prefs && prefs[key] && prefs[key].length>0 && prefs[key][0].text)
				return prefs[key][0].text;
			else
				dval;
		}
		var that = $(this);
		var obj = {
			command : "testSMTP",
			to : $("#to", _panel).val(),
			cc : $("#cc", _panel).val(),
			bcc : $("#bcc", _panel).val(),
			from : $("#from", _panel).val(),
			subject : $("#subject", _panel).val(),
			body : $("#body", _panel).val(),
			server : getPrefsVal("smtp_server", ""),
			user : getPrefsVal("smtp_user", ""),
			pass : crushFTP.methods.htmlEncode(getPrefsVal("smtp_pass", "")),
			ssl : getPrefsVal("smtp_ssl", "false"),
			html : getPrefsVal("smtp_html", "false")
		};
		that.block({
			message:  'Wait..',
			css: {
				border: 'none',
				padding: '0px 10px',
				backgroundColor: '#000',
				'-webkit-border-radius': '10px',
				'-moz-border-radius': '10px',
				opacity: .5,
				color: '#fff',
				'text-align':'left'
			}
		}).attr("disabled", "disabled");
		crushFTP.data.serverRequest(obj, function(msg){
			that.unblock().removeAttr("disabled");
			crushFTP.UI.growl("Sending test email : ", decodeURIComponent($(msg).text()), false, false);
		});
		return false;
	})
}

panelAlerts.bindFormDetails = function(alertList)
{
	if(!alertList)
	{
		$("#formDetailsPanel", _panel).hide();
		return;
	}
	var controlData = $(alertList).data("controlData");
	if(!controlData){
		$("#formDetailsPanel", _panel).hide();
		return;
	}
	var formDetailsPanel = $("#formDetailsPanel", _panel).show();
	var type = crushFTP.data.getTextValueFromXMLNode(controlData.type, "");
	panelAlerts.showFieldsBasedOnType(type);
	var inputs = formDetailsPanel.find("input.ignoreBind,select.ignoreBind,textarea.ignoreBind").removeClass("ignoreBind");
	bindValuesFromXML(formDetailsPanel, controlData);
	inputs.addClass("ignoreBind");
}

panelAlerts.showFieldsBasedOnType = function(type)
{
	type = type || _panel.find("select#type").val();
	$(".hammeringSpecific,.quotaReachedSpecific,.diskSpaceBelowThresholdSpecific, .variableWatcherSpecific, .securityAlertSpecific, .lowMemoryAlertSpecific", _panel).hide();
	if(type == "User Hammering")
	{
		$(".hammeringSpecific", _panel).show();
	}
	else if(type == "User reached quota percentage")
	{
		$(".quotaReachedSpecific", _panel).show();
	}
	else if(type == "Disk Space Below Threshold")
	{
		$(".diskSpaceBelowThresholdSpecific", _panel).show();
	}
	else if(type == "Variable Watcher")
	{
		$(".variableWatcherSpecific", _panel).show();
	}
	else if(type == "Security Alert")
	{
		$(".securityAlertSpecific", _panel).show();
	}
	else if(type == "ServerBeat Alert")
	{
		$(".securityAlertSpecific", _panel).show();
	}
	else if(type == "Low Memory")
	{
		$(".lowMemoryAlertSpecific", _panel).show();
	}
}

panelAlerts.saveContent = function()
{
	if(panelAlerts.validateData())
	{
		if(placeHolder.data("hasChanged"))
		{
			crushFTP.UI.showIndicator(false, false, "Please wait..");
			var xmlString = [];
			var formAlertsList = $("#alerts", _panel).find("li");
			if(formAlertsList.length>0)
			{
				xmlString.push("<alerts type=\"vector\">");
				formAlertsList.each(function(){
					xmlString.push("<alerts_subitem type=\"properties\">");
					var controlData = $(this).data("controlData");
					for(var item in controlData)
					{
						if(controlData[item].length)
						{
							if(controlData[item][0].text)
							{
								xmlString.push("<"+item+">"+crushFTP.methods.htmlEncode(controlData[item][0].text)+"</"+item+">");
							}
						}
					}
					xmlString.push("</alerts_subitem>");
				});
				xmlString.push("</alerts>");
			}
			else
			{
				xmlString.push("<alerts type=\"vector\"><alerts_subitem type=\"properties\"><type>Dummy</type></alerts_subitem></alerts>");
			}
			var formSubItem = xmlString.join("\n");
			var action = xmlString.length>0 ? "reset" : "remove";
			crushFTP.data.setXMLPrefs("server_settings/alerts/0"
				, "vector"
				, action
				, formSubItem
				, function(data){
					data = $.xml2json(data, true);
					if(data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK")
					{
						common.data.updateLocalPrefs(function(){
							crushFTP.UI.hideIndicator();
							crushFTP.UI.growl("Data saved", "Your changes are saved", false, 5000);
							panelAlerts.bindData();
							placeHolder.removeData("hasChanged");
						});
					}
					else
					{
						crushFTP.UI.growl("Error while saving", "Your changes are not saved", true);
					}
				}
				, panelAlerts.saveParams
			);
		}
		else
		{
			crushFTP.UI.growl("No changes made", "", false, 3000);
		}
	}
}