/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelStatsConfig = {};
panelStatsConfig.localization = {};
/****************************/

// Panel details
var panelName = "StatsConfig";
var _panel = $("#pnl" + panelName);

// Localizations
panelStatsConfig.localization = {
	headerText : " ",
	lblStatsDatabaseTabText : "Statistics Database",
	lblScriptMySQLTabText : "Script MySQL",
	btnBrowseText : "Browse",
	btnTestDBText : "Test DB",
	btnResetText : "Reset To Default",
	btnCancelText : "Cancel",
	btnOKText : "Save",
	btnExecuteQuery : "Execute Query",
	btnClearQuerys : "Clear",
	txtQueryTitle : "SQL Query:",
	txtQueryResponseTitle : "SQL Response:",
	txtReturnTitle : "Return Limit:"
};

// Assign localizations
localizations.panels[panelName] = $.extend(panelStatsConfig.localization, localizations.panels[panelName]);

// Interface methods
panelStatsConfig.init = function(){
	applyLocalizations(panelName, localizations.panels);
	crushFTP.methods.setPageTitle(panelStatsConfig.localization.Header, true);
	panelStatsConfig.bindData();
	panelStatsConfig.bindEvents();
	$("#browsePopupBtn", _panel).hide();
    setupPrefsReplicationSave(_panel, panelName);
}

panelStatsConfig.bindData = function()
{
	var prefs = common.data.ServerPrefs();
	bindValuesFromXML(_panel, prefs);
	if(prefs)
	{
		var nameList = $("#SCsqlItems", _panel);
		var selectedIndex = nameList.find("li.ui-widget-header").index();
		nameList.empty();

		var arrayItems = [];
		for(var i in prefs)
		{
			if(i.indexOf("stats_")==0 || i.indexOf("disable_stats")==0)
			{
				arrayItems.push(
					{
						key : i,
						text : prefs[i][0].text || ""
					}
				);
			}
		}

		arrayItems = arrayItems.sort(crushFTP.methods.sortObjectsRefKey);
		for(var i=0;i<arrayItems.length;i++)
		{
			var newControl = $("<li class='ui-widget-content' name='"+arrayItems[i].key+"'>"+arrayItems[i].key+"</li>");
			nameList.append(newControl);
			newControl.data("controlData", arrayItems[i]);
		}

		if(selectedIndex>=0)
		{
			selectedIndex+=1;
			var selected = nameList.find(":nth-child("+selectedIndex+")").addClass("ui-widget-header ui-selected");
			panelStatsConfig.bindFormDetails(selected);
		}
	}
}

panelStatsConfig.bindEvents = function()
{
	var sqlItems = $("#SCsqlItems", _panel);
	sqlItems.selectable({
		selected: function(event, ui) {
			var selected = $(ui.selected);
			function continueLoading()
			{
				selected.parent().find(".ui-widget-header").removeClass("ui-widget-header ui-selected");
				selected.addClass("ui-widget-header ui-selected");
				panelStatsConfig.bindFormDetails(selected);
			}
			if(_panel.find(".hasPendingCall").length>0)
			{
				window.pendingEncryptionCall = function(){
					continueLoading();
				};
				_panel.find(".hasPendingCall").trigger("blur");
			}
			else
			{
				continueLoading();
			}
			return false;
		}
	});

	var formDetailsPanel  = $("#formDetailsPanel", _panel);
	formDetailsPanel.find("input, select, textarea").bind("change", function(){
		if($(this).attr("id") == "stats_db_pass")
		{
			var item = $("#SCsqlItems", _panel).find("li[name='stats_db_pass']");
			if(!item || item.length==0)return;
			var data = item.data("controlData");
			if(data)
			{
				data.text = $(this).val();
			}
			item.data("controlData", data);
		}
		else
		{
			var item = sqlItems.find("li.ui-widget-header");
			if(!item || item.length==0)return;
			var data = item.data("controlData");
			if(data)
			{
				var isBool = $(this).attr("type") == "radio" || $(this).attr("type") == "checkbox";
				data.text = isBool ? $(this).is(":checked").toString() : $(this).val();
				if($(this).attr("id") == "type")
				{
					item.text($(this).val());
				}
			}
			item.data("controlData", data);
		}
		itemsChanged(true);
	});

	formDetailsPanel.find("input[type='text'], textarea").bind("textchange", function(){
		var item = sqlItems.find("li.ui-widget-header");
		if(!item || item.length==0)return;
		var data = item.data("controlData");
		if(data)
		{
			var isBool = $(this).attr("type") == "radio" || $(this).attr("type") == "checkbox";
			data.text = isBool ? $(this).is(":checked").toString() : $(this).val();
			if($(this).attr("id") == "type")
			{
				item.text($(this).val());
			}
		}
		item.data("controlData", data);
		itemsChanged(true);
	});

	$("a.serverFilePickButton", _panel).each(function(){
		$(this).unbind("click").click(function(){
			var curElem = $(this);
			curElem.crushFtpLocalFileBrowserPopup({
				type : curElem.attr("PickType") || 'file',
				existingVal : $("#" + curElem.attr("rel"), _panel).val(),
				callback : function(selectedPath){
					$("#" + curElem.attr("rel"), _panel).val(selectedPath).trigger("change").trigger("textchange");
				}
			});
			return false;
		});
	});

	$("a#testDBSearch", _panel).click(function(){
		var link = $(this);
		if(link.attr("disabled"))return false;
		if(_panel.find(".hasPendingCall").length>0)
		{
			window.pendingEncryptionCall = function(){
				link.trigger("click");
			};
			_panel.find(".hasPendingCall").trigger("blur");
		}
		else
		{
			var obj = {
				command : "testDB",
				db_driver_file : panelStatsConfig.getDataFromKey("stats_db_driver_file") || "",
				db_driver : panelStatsConfig.getDataFromKey("stats_db_driver") || "",
				db_url : panelStatsConfig.getDataFromKey("stats_db_url") || "",
				db_user : panelStatsConfig.getDataFromKey("stats_db_user") || "",
				db_pass : panelStatsConfig.getDataFromKey("stats_db_pass") || ""
			};
			$("a#testDBSearch", _panel).block({
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
				$("a#testDBSearch", _panel).unblock().removeAttr("disabled");
				crushFTP.UI.growl("Testing Database", decodeURIComponent($(msg).text()), false, false);
			});
		}
		return false;
	});

	$('a#execute_query', _panel).click(function(){
		var sql_query = jQuery.trim($('textarea#sql_query', _panel).val());
		if(sql_query == ""){
			crushFTP.UI.growl("Error", "Please write a query before you execute it.", true, 3000);
		} else {
			var obj = {
				command : "testQuery",
				db_driver_file : panelStatsConfig.getDataFromKey("stats_db_driver_file") || "",
				db_driver : panelStatsConfig.getDataFromKey("stats_db_driver") || "",
				db_url : panelStatsConfig.getDataFromKey("stats_db_url") || "",
				db_user : panelStatsConfig.getDataFromKey("stats_db_user") || "",
				db_pass : panelStatsConfig.getDataFromKey("stats_db_pass") || "",
				sql_limit : $('input#sql_limit', _panel).val() || 1000,
				sql : sql_query
			};
			$("a#execute_query", _panel).block({
				message:  'Executing..',
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
				$("a#execute_query", _panel).unblock().removeAttr("disabled");
				var queryResult = '',
				tableHeadersResult = '',
				tableResultContent = '';
				if($(msg).find("SQL").length > 0){
					queryResult += '<p style="text-align: right">Total rows: '+$(msg).find("SQL_subitem").length+'</p>';
					$(msg).find("SQL_subitem").each(function(indexMain){ var rootIndex = indexMain;
						tableResultContent += '<tr>';
						$(this).children().each(function(index){
							if(rootIndex == 0){
								tableHeadersResult += '<th style="padding: 5px 8px; text-align: left" class="ui-dialog-titlebar ui-widget-header ui-corner-all">'+this.tagName+'</th>';
							}
							tableResultContent += '<td>'+$(this).text()+'</td>';
						});
						tableResultContent += '</tr>';
					});
					queryResult += '<table style="width: 100%" cellpadding="2" cellspasing="2"><thead><tr>'+tableHeadersResult+'</tr></thead><tbody>'+tableResultContent+'</tbody></table>';
				} else {
					queryResult = decodeURIComponent($(msg).text());
				}
				$('#sql_response', _panel).html(queryResult).trigger("create");
			});
		}
		return false;
	});

	$('a#clear_querys', _panel).click(function(){
		$('textarea#sql_query', _panel).val('');
		$('#sql_response', _panel).html('');
		itemsChanged(false);
	});
}

panelStatsConfig.getDataFromKey = function(key)
{
	var data = "";
	var sqlItem = $("#SCsqlItems", _panel).find("li[name='"+key+"']");
	if(sqlItem && sqlItem.length>0)
	{
		var controlData = sqlItem.data("controlData");
		if(controlData && controlData.text)
			data = encodeURIComponent(controlData.text);
		else
			data = "";
	}
	return data;
}

panelStatsConfig.bindFormDetails = function(selected)
{
	if(!selected || selected.length==0)
	{
		return;
	}
	var controlData = selected.data("controlData");
	if(controlData && controlData.key)
	{
		var data = controlData.text;
		var key = controlData.key;
		var txtSCDBAction = $("#txtSCDBAction", _panel).val(data);
		if(key == "stats_db_driver_file")
		{
			$("#browsePopupBtn", _panel).show();
		}
		else
		{
			$("#browsePopupBtn", _panel).hide();
		}
		if(key == "stats_db_pass")
		{
			$("#stats_db_pass", _panel).show().val(data);
			txtSCDBAction.hide();
		}
		else
		{
			$("#stats_db_pass", _panel).hide().val("");
			txtSCDBAction.show();
		}
	}
}

panelStatsConfig.saveContent = function()
{
	if(placeHolder.data("hasChanged"))
	{
		crushFTP.UI.showIndicator(false, false, "Please wait..");
		var xmlString = [];
		var formAlertsList = $("#SCsqlItems", _panel).find("li");
		if(formAlertsList.length>0)
		{
			xmlString.push('<server_prefs type="properties">');
			formAlertsList.each(function(){
				var data = $(this).data("controlData");
				if(data)
				{
					var text = data.text;
					/*if($(this).attr("name") != "stats_db_pass")
					{
						text = crushFTP.methods.htmlEncode(text);
					}*/
					xmlString.push("<"+$(this).attr("name")+">"+crushFTP.methods.htmlEncode(text)+"</"+$(this).attr("name")+">");
				}
			});
			xmlString.push("</server_prefs>");
		}
		var formSubItem = xmlString.join("\n");
		var action = xmlString.length>0 ? "reset" : "remove";
		crushFTP.data.setXMLPrefs("server_settings/server_prefs/"
			, "properties"
			, action
			, formSubItem
			, function(data){
				data = $.xml2json(data, true);
				if(data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK")
				{
					common.data.updateLocalPrefs(function(){
						crushFTP.UI.hideIndicator();
						panelStatsConfig.bindData();
						crushFTP.UI.growl("Data saved", "Your changes are saved", false, 5000);
						placeHolder.removeData("hasChanged");
					});
				}
				else
				{
					crushFTP.UI.growl("Error while saving", "Your changes are not saved", true);
				}
			}
			, panelStatsConfig.saveParams
		);
	}
	else
	{
		crushFTP.UI.growl("No changes made", "", false, 3000);
	}
}