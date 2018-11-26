/*!
* CrushFTP Web GUI interface methods for User Manager
*
* http://crushFTP.com/
*
* Copyright @ CrushFTP
*
* Date: Thu, Aug 11 2011
*
* Author: Vipul Limbachiya
*
* http://vipullimbachiya.com
*/

window.dataBindEvents = [];

var tempAccounts = {
	ajaxCallURL : "/WebInterface/function/",
	ajaxCallURLBase : "/WebInterface/function/",
	refreshInfoInterval : 5000,
	indicatorHTML : "<div class='loadingIndicator'><img src='/WebInterface/Resources/images/loading.gif' alt='loding indicator' /></div>",
	buggyBrowser : $.browser.msie && $.browser.version < 8	,
	UI :
	{
		showIndicator : function(loaderOnly, blockElement, message)
		{
			if(loaderOnly)
			{
				blockElement = blockElement || $("#tempAccounts");
				if(blockElement.length>0)
				{
					blockElement.find("div.loadingIndicator").remove();
					blockElement.prepend(tempAccounts.indicatorHTML);
				}
			}
			else
			{
				tempAccounts.placeHolder = $("#tempAccountHolder");
				blockElement = blockElement || tempAccounts.placeHolder;
				message = message || "Loading...";
				blockElement.block({
					message:  '<div><span style="float: left; margin-right: 0.3em;" class="ui-icon ui-icon-refresh"></span>'+message+'</div>',
					css: {
						border: 'none',
						padding: '15px',
						backgroundColor: '#000',
						'-webkit-border-radius': '10px',
						'-moz-border-radius': '10px',
						opacity: .5,
						color: '#fff',
						width: '100px',
						'text-align':'left'
					}
				});
			}
		},
		hideIndicator : function(loaderOnly, blockElement)
		{
			if(loaderOnly)
			{
				blockElement = blockElement || $("#tempAccounts");
				if(blockElement.length>0)
				{
					blockElement.find("div.loadingIndicator").remove();
				}
			}
			else
			{
				blockElement = blockElement || tempAccounts.placeHolder;
				blockElement.unblock();
			}
		},
		initLoadingIndicator : function()
		{
			$("#loadingIndicator").dialog({
				autoOpen: false,
				dialogClass: "loadingIndicatorWindow",
				closeOnEscape: false,
				draggable: false,
				width: 150,
				minHeight: 50,
				modal: true,
				buttons: {},
				resizable: false,
				open: function() {
					$('body').css('overflow','hidden');
				},
				close: function() {
					$('body').css('overflow','auto');
				}
			});
		},
		showLoadingIndicator : function(data)
		{
			if(!data)return;
			$("#loadingIndicator").html(data.message && '' != data.message ? data.message : 'Please wait...');
			$("#loadingIndicator").dialog('option', 'title', data.title && '' != data.title ? data.title : 'Loading');
			$("#loadingIndicator").dialog('open');
		},
		hideLoadingIndicator : function()
		{
			$("#loadingIndicator").dialog('close');
		},
		checkUnchekInput : function(input, flag)
		{
			if(flag)
			{
				if(input.attr("type") == "radio")
				{
					var selected = input.closest(".customForm").find("input[name='"+input.attr("name")+"']:checked");
					if(input == selected)return;
					input.closest(".customForm").find("input[name='"+input.attr("name")+"']").each(function(){
						var _parent = $(this).parent().next();
						$(_parent).removeClass("ui-state-active").removeClass("ui-icon-radio-off").removeClass("ui-icon ui-icon-circle-check").addClass("ui-icon-radio-off");
						$(_parent).find("span").removeClass("ui-state-active").removeClass("ui-icon-radio-off").removeClass("ui-icon ui-icon-circle-check").addClass("ui-icon-radio-off");
					});

					input.attr("checked","checked").parent("label").next().find("span").removeClass("ui-icon-radio-off").addClass("ui-icon ui-icon-circle-check");
				}
				else if(input.attr("type") == "checkbox")
				{
					input.attr("checked","checked").parent("label").next().find("span").addClass("ui-icon ui-icon-check");
				}
			}
			else
			{
				if(input.attr("type") == "radio")
				{
					var selected = input.closest(".customForm").find("input[name='"+input.attr("name")+"']:checked");
					if(input == selected)return;
					input.removeAttr("checked").parent("label").next().find("span").removeClass("ui-icon ui-icon-circle-check");
				}
				else if(input.attr("type") == "checkbox")
				{
					input.removeAttr("checked").parent("label").next().find("span").removeClass("ui-icon").removeClass("ui-icon-check");
				}
			}
		},
		isScrolledIntoView : function(elem) {
			if(!elem ||  elem.length ==0) return;
			var docViewTop = $(window).scrollTop();
			var docViewBottom = docViewTop + $(window).height();

			var elemTop = $(elem).offset().top;
			var elemBottom = elemTop + $(elem).height();

			return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom));
		},
		initEvents : function()
		{
			$(".backToTop", "#GUIAdmin").unbind().click(function () {
				$('html,body').animate({
					scrollTop: 0
				}, 500, false);
				return false;
			});

			//Keep this line at the end of this method, it will bind click at the end of all bindings
			$("#topNavigation, ul#context-menu").find("a").click(function(){
				contextMenu.hide();
				$(document).trigger("click");
			});

			$("#mainServerInstance").unbind().change(function(){
				var options = {
					path: '/'
				};
				$.cookie("mainServerInstance", null);
				$.cookie("mainServerInstance", $(this).val(), options);
				window.location = window.location;
			});
		},
		growl : function(title, content, warning, expires){
			$("#growlContainer").notify({
				speed: 500,
				expires: expires
			});
			var handler = $("#growlContainer")
				.notify({ custom:true })
				.notify("create", { title:title, text:content });
			$(handler.element).removeClass("ui-state-error,ui-state-highlight");
			if(warning)
			{
				$(handler.element).addClass("ui-state-error");
			}
			else
			{
				$(handler.element).addClass("ui-state-highlight");
			}
		},
		notification : function(msg, error){
			if(!msg)
			{
				$("#notification").hide();
				return;
			}
			if(error)
			{
				$("#notification").removeClass("ui-state-highlight").removeClass("ui-state-error").empty().html(msg).show().addClass("ui-state-error").prepend('<span style="float: left; margin-right: 0.3em;" class="ui-icon ui-icon-alert"></span>');
			}
			else
			{
				$("#notification").removeClass("ui-state-highlight").removeClass("ui-state-error").empty().html(msg).show().addClass("ui-state-highlight").prepend('<span style="float: left; margin-right: 0.3em;" class="ui-icon ui-icon-info"></span>');
			}
		},
		addItem : function(listing, newControl, data, callback)
		{
			listing.append(newControl);
			newControl.data("controlData", data);
			newControl.parent().find(".ui-widget-header").removeClass("ui-widget-header").removeClass("ui-selected");
			newControl.addClass("ui-widget-header").addClass("ui-selected");
			listing.closest("div.sideScroll").scrollTo(newControl);
			if(callback)
				callback(newControl);
		},
		replaceItem : function(oldControl, newControl, data, callback)
		{
			oldControl.replaceWith(newControl);
			newControl.data("controlData", data);
			newControl.parent().find(".ui-widget-header").removeClass("ui-widget-header").removeClass("ui-selected");
			newControl.addClass("ui-widget-header").addClass("ui-selected");
			if(callback)
				callback(newControl);
		},
		removeItem : function(listing, callback, noConfirm)
		{
			var selected = listing.find("li.ui-selected");
			if(selected.length==0)return;
			function continueRemove(flag)
			{
				var toFocus = [];
				if(selected.next("li").length>0)
				{
					toFocus = selected.next("li");
				}
				else if(selected.prev("li").length>0)
				{
					toFocus = selected.prev("li");
				}
				selected.remove();
				if(toFocus.length>0)
				{
					toFocus.parent().find(".ui-widget-header").removeClass("ui-widget-header").removeClass("ui-selected");
					toFocus.addClass("ui-widget-header").addClass("ui-selected");
					if(callback)
						callback(toFocus, selected);
				}
				else
				{
					if(callback)
						callback(toFocus, selected);
				}
			}

			if(!noConfirm)
			{
				jConfirm("Are you sure you wish to remove this item?","Confirm", function(flag){
					if(flag)
					{
						continueRemove();
					}
				});
			}
			else
			{
				continueRemove();
			}
		},
		copyItem : function(item, callback)
		{
			if(item.length>0)
			{
				var copy = item.clone(true);
				item.parent().append(copy);
				copy.parent().find(".ui-widget-header").removeClass("ui-widget-header").removeClass("ui-selected");
				copy.addClass("ui-widget-header").addClass("ui-selected");
				if(callback)
					callback(copy);
			}
		},
		moveItem : function(item, up, autoScroll, callback)
		{
			if(item.length>0)
			{
				if(up)
				{
					if(item.prev().length>0)
						item.prev().before(item);
				}
				else
				{
					if(item.next().length>0)
						item.next().after(item);
				}
				if(autoScroll)
					item.closest("div.sideScroll").scrollTo(item);
				if(callback)
					callback(item);
			}
		},
		multiOptionControlDataBind : function(dataSet, dataColumn, control, bindItemMethod, directData, noSubitem, reverse){
			var dataItem = directData ? dataSet : dataSet[dataColumn];
			control.empty();
			if(dataItem)
			{
				if(!noSubitem)
				{
					dataItem = dataItem[dataColumn + "_subitem"];
				}
				if(dataItem)
				{
					function addNewOption(curItem)
					{
						var newControl = bindItemMethod(curItem);
						if(!newControl)return;
						if(reverse)
							control.prepend(newControl);
						else
							control.append(newControl);
						newControl.data("controlData", curItem);
					}
					if(dataItem.length && dataItem.length>0 && !noSubitem)
					{
						for(var i=0; i < dataItem.length; i++)
						{
							addNewOption(dataItem[i]);
						}
					}
					else
					{
						addNewOption(dataItem);
					}
				}
			}
		}
	},
	data:
	{
		refreshInfoThread : function () {
			tempAccounts.data.dataRefreshCall();
			if (!tempAccounts.refreshInfoThreadInterval) {
				tempAccounts.refreshInfoThreadInterval = setInterval(
					function(){
						if(!$(document).data("refreshInfoThreadRunning"))
							tempAccounts.data.dataRefreshCall();
						if(window.panelJobsMonitor && panelJobsMonitor._panel && panelJobsMonitor._panel.is(":visible"))
						{
							panelJobsMonitor.dataPollingMethod();
						}
					}
				, tempAccounts.refreshInfoInterval);
			}
		},
		dataRefreshCall : function () {
			$(document).data("refreshInfoThreadRunning", true);
			tempAccounts.UI.showIndicator(true, $("#statusPanelTabs"));
			var isThredContinued = false;
			if(panelServerInfo && panelServerInfo._panel.is(":visible"))
			{
				tempAccounts.dataRepo.refreshServerInfo(function(items){
					if(panelServerInfo.bindData)
					{
						if(panelServerInfo.bindData.serverList)
							panelServerInfo.bindData.serverList(items);
						if(panelServerInfo.bindData.serverInfo)
							panelServerInfo.bindData.serverInfo(items);
					}
					if((panelServerInfo.status && panelServerInfo.status.logLiveUpdate()) || !window.firstTimeRefershDone)
					{
						window.firstTimeRefershDone = true;
						isThredContinued = true;
						tempAccounts.dataRepo.getSeverLog(function(log){
							if(panelServerInfo && panelServerInfo.bindData && panelServerInfo.bindData.serverLog)
							{
								panelServerInfo.bindData.serverLog(log, panelServerInfo.status.logScrollWithActivity());
								$(document).removeData("refreshInfoThreadRunning");
								tempAccounts.UI.hideIndicator(true, $("#statusPanelTabs"));
							}
						});
					}
					if(!isThredContinued)
					{
						$(document).removeData("refreshInfoThreadRunning");
						tempAccounts.UI.hideIndicator(true, $("#statusPanelTabs"));
					}
				});
			}
			if(panelUserInfo._panel.is(":visible"))
			{
				var sessionSelectionStatus = {type : false, index : -1};
				if(panelUserInfo && panelUserInfo.status && panelUserInfo.status.selectedSession)
				{
					sessionSelectionStatus = panelUserInfo.status.selectedSession();
				}
				tempAccounts.dataRepo.refreshUserSessonList(false, function(items){
					if(panelUserInfo)
					{
						if(panelUserInfo.bindData)
						{
							if(panelUserInfo.bindData.sessionList)
								panelUserInfo.bindData.sessionList(items, "", false, sessionSelectionStatus);
						}
						tempAccounts.dataRepo.refreshUserSessonList("recent_", function(recentItems){
							if(panelUserInfo.bindData)
							{
								if(panelUserInfo.bindData.sessionList)
									panelUserInfo.bindData.sessionList(recentItems, "recent_", false, sessionSelectionStatus);
							}
							if(panelUserInfo.bindData && panelUserInfo.bindData.sessionInfo)
							{
								if(sessionSelectionStatus.index>=0)
								{
									tempAccounts.dataRepo.getUserSessionInfo(sessionSelectionStatus.type, sessionSelectionStatus.index, function(data){
										panelUserInfo.bindData.sessionInfo(data, sessionSelectionStatus);
										$(document).removeData("refreshInfoThreadRunning");
										tempAccounts.UI.hideIndicator(true, $("#statusPanelTabs"));
									});
								}
								else
								{
									$(document).removeData("refreshInfoThreadRunning");
									tempAccounts.UI.hideIndicator(true, $("#statusPanelTabs"));
								}
							}
							else
							{
								$(document).removeData("refreshInfoThreadRunning");
								tempAccounts.UI.hideIndicator(true, $("#statusPanelTabs"));
							}
						});
					}
				});
			}
		},
		serverRequest: function(dataToSubmit, callback, requestType, url)
		{
			url = url || tempAccounts.ajaxCallURL;
			requestType = requestType || "GET";
			$.ajax({
				type: requestType
				, url: url
				, data: dataToSubmit
				, success: function(msg){
					callback(msg);
				}
				, error: function(XMLHttpRequest, textStatus, errorThrown)
				{
					callback(false, XMLHttpRequest, textStatus, errorThrown);
				}
			});
		},
		getValueFromJson : function(item, node)
		{
			if(item && item[node])
			{
				return item[node];
			}
			else
			{
				return "";
			}
		},
		getTextContentFromPrefs : function(item, node)
		{
			if(item && item[node])
			{
				return item[node];
			}
			else
			{
				return "";
			}
		},
		getTextValueFromXMLNode : function(item, text)
		{
			if(item && item.length>0 && item[0] && item[0].text)
			{
				return item[0].text;
			}
			else
			{
				return text || "";
			}
		},
		getServerItem : function(key, callback)
		{
			var obj = {command:"getServerItem",key:key};
			$.ajax({
				type: "GET"
				, url: tempAccounts.ajaxCallURL
				, data: obj
				, success: function(msg){
					callback(msg);
				}
			});
		},
		loadAllPrefs : function(callback)
		{
			this.getServerItem("server_settings", callback);
		},
		getXMLPrefsDataFromServer : function(dataKey, callback)
		{
			var items = [];
			tempAccounts.data.loadAllPrefs(function(data){
				if(data.getElementsByTagName("result_value") && data.getElementsByTagName("result_value").length > 0)
				{
					data = data.getElementsByTagName("result_value")[0];
					$(data).find("reportSchedules").find("usernames").each(function(){
						var users = [];
						$(this).find("usernames_subitem").each(function(){
							users.push($(this).text());
						});
						$(this).text(users.join(","));
					});
					items = $.xml2json(data);
					tempAccounts.storage(dataKey, items);
					tempAccounts.storage(dataKey + "_RAW", data);
					if(callback){
						callback(data);
					}
				}
			});
		},
		setXMLPrefs : function(dataKey, dataType, dataAction, entryData, callback)
		{
			var obj = {
				command:"setServerItem",
				key: dataKey,
				data_type: dataType,
				data_action: dataAction,
				data: entryData
			};
			tempAccounts.data.serverRequest(obj,
				function(msg){
					callback(msg);
			}, "POST");
		},
		updateLocalPrefs : function(data, key)
		{
			var dataJson = $.xml2json(data, true);
			if(dataJson)
			{
				var prefs = $(document).data("GUIXMLPrefs");
				if(key == "server_prefs")
				{
					for(var item in dataJson)
					{
						if(item.length && item.length>0 && dataJson[item].length && dataJson[item].length>0)
						{
							prefs[item] = dataJson[item];
						}
					}
				}
				else
				{
					prefs[key] = [dataJson];
				}
				$(document).data("GUIXMLPrefs", prefs);
			}
		},
		getSubValueFromPrefs : function(node)
		{
			var prefs = $(document).data("GUIXMLPrefs");
			if(prefs && prefs[node] && prefs[node][node + "_subitem"])
			{
				return prefs[node][node + "_subitem"];
			}
			else
			{
				return [];
			}
		},
		getTextContent : function(obj) {
			if ($.browser.msie && parseInt(jQuery.browser.version) == 10) {
                var itm = {};
                itm.textContent = $(obj).text();
                return itm;
            }
            else
            {
				if (window.ActiveXObject) {
					var obj2 = {};
					try {
						obj2.textContent = obj.text;
					} catch (ex) {}
					return obj2;
				} else {
					return obj;
				}
            }
		},
		bindValuesFromJson : function(_panel, curItem, attrToUse, ignoreUnderscore)
		{
			function elemNameWithoutUnderScore(name)
			{
				if(ignoreUnderscore && name.indexOf("_")>=0)
				{
					name = name.substr(0, name.indexOf("_"));
				}
				return name;
			}

			attrToUse = attrToUse || "id";
			_panel.find("input[type='text']:not(.ignoreBind),input[type='password']:not(.ignoreBind), textarea:not(.ignoreBind), select:not(.ignoreBind)").each(function(){
				if($(this).attr(attrToUse))
				{
					if(curItem)
					{
						var curData = tempAccounts.data.getValueFromJson(curItem, elemNameWithoutUnderScore($(this).attr(attrToUse)));
						var curVal = curData.value || curData;
						$(this).val(curVal).trigger("change");
					}
					else
					{
						$(this).val("").trigger("change");
					}
				}
			});
			_panel.find("input[type='checkbox']:not(.ignoreBind), input[type='radio']:not(.ignoreBind) ").each(function(){
				if($(this).attr(attrToUse))
				{
					if(curItem)
					{
						var curData = tempAccounts.data.getValueFromJson(curItem, elemNameWithoutUnderScore($(this).attr(attrToUse)));
						var curVal = curData.value || curData;
						if($(this).is(".reverse"))
						{
							tempAccounts.UI.checkUnchekInput($(this), curVal != "true");
						}
						else
						{
							tempAccounts.UI.checkUnchekInput($(this), curVal == "true");
						}
						$(this).trigger("change");
					}
					else
					{
						if($(this).is(".reverse"))
						{
							tempAccounts.UI.checkUnchekInput($(this), true);
						}
						else
						{
							tempAccounts.UI.checkUnchekInput($(this), false);
						}
						$(this).trigger("change");
					}
				}
			});
			_panel.find(".liveData").each(function(){
				if($(this).attr(attrToUse))
				{
					if(curItem)
					{
						var curVal = tempAccounts.data.getValueFromJson(curItem, elemNameWithoutUnderScore($(this).attr(attrToUse)));
						$(this).text(curVal);
					}
					else
					{
						$(this).text("");
					}
				}
			});
		},
		buildXMLToSubmitForm : function(_panel, includeRadio, attrToUse, ignoreNullValue)
		{
			attrToUse = attrToUse || "id";
			var xmlString = [];
			_panel.find("input[type='text']:not(.ignoreBind, .excludeXML),input[type='password']:not(.ignoreBind, .excludeXML), textarea:not(.ignoreBind, .excludeXML), select:not(.ignoreBind, .excludeXML)").each(function(){
				if($(this).attr(attrToUse))
				{
					var curVal = $(this).val();
					if(!ignoreNullValue)
						xmlString.push("<"+$(this).attr(attrToUse)+">"+tempAccounts.methods.htmlEncode(curVal)+"</"+$(this).attr(attrToUse)+">");
					else if(curVal.length>0)
						xmlString.push("<"+$(this).attr(attrToUse)+">"+tempAccounts.methods.htmlEncode(curVal)+"</"+$(this).attr(attrToUse)+">");
				}
			});
			_panel.find("input[type='checkbox']:not(.ignoreBind, .excludeXML)").each(function(){
				if($(this).attr(attrToUse))
				{
					if($(this).is(".reverse"))
					{
						xmlString.push("<"+$(this).attr(attrToUse)+">"+!$(this).is(":checked")+"</"+$(this).attr(attrToUse)+">");
					}
					else
					{
						xmlString.push("<"+$(this).attr(attrToUse)+">"+$(this).is(":checked")+"</"+$(this).attr(attrToUse)+">");
					}
				}
			});
			if(includeRadio)
			{
				_panel.find("input[type='radio']:not(.ignoreBind, .excludeXML)").each(function(){
					if($(this).attr(attrToUse))
					{
						xmlString.push("<"+$(this).attr(attrToUse)+">"+$(this).is(":checked")+"</"+$(this).attr(attrToUse)+">");
					}
				});
			}
			return xmlString.join("\r\n");
		}
	},
	storage : function(key, val)
	{
		if(key)
		{
			if(val)
			{
				return $(document).data(key, val);
			}
			else
			{
				return $(document).data(key);
			}
		}
		else
		{
			return false;
		}
	},
	removeStorage : function(key)
	{
		if($(document).data(key))
		{
			$(document).removeData(key);
		}
	},
	userLogin :
	{
		//Login status thread
		userLoginStatusCheckThread : function () {
			if (!$(document).data("loginStatusThreadRunning") && !tempAccounts.loginStatusThreadInterval) {
				tempAccounts.loginStatusThreadInterval = setInterval(
				function () {
					var targetUrl = window.location.toString();
					tempAccounts.userLogin.bindUserName(function (response, username) {
						if (response == "failure") {
							if(tempAccounts.placeHolder)
							{
								tempAccounts.placeHolder.removeData("hasChanged");
							}
							window.location = targetUrl;
						}
					});
				}, 300000);
			}
		},
		//Bind user name
		bindUserName : function (callBack) { /* Data to POST to receive file listing */
			var obj = {
				command: "getUsername",
				random: Math.random()
			}; /* Make a call and receive list */
			var username = "anonymous";
			$.ajax({
				type: "GET",
				url: tempAccounts.ajaxCallURL,
				data: obj,
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					errorThrown = errorThrown || "getUsername failed";
					tempAccounts.UI.growl("Error : ", errorThrown, true, true);
					callBack("failure", username);
				},
				success: function (msg) {
					var responseText = msg;
					try {
						var response = msg.getElementsByTagName("response");
						response = tempAccounts.data.getTextContent(response[0]).textContent;
						if (response == "success") {
							username = msg.getElementsByTagName("username");
							username = tempAccounts.data.getTextContent(username[0]).textContent;
						}
						if (username == "anonymous" || username == "") {
							callBack("failure", username);
							return false;
						} else {
							$(document).data("username", username);
						}
					} catch (ex) {
						if (callBack) {
							callBack("failure", username);
							return false;
						}
					}
					if (callBack) {
						callBack(response, username);
					}
				}
			});
		}
	},
	dataRepo :
	{
		refreshServerInfo : function(callback)
		{
			tempAccounts.data.serverRequest({
				command: "getServerItem",
				key : "server_info"
			},
			function(data){
				var items = false;
				if(data && typeof data.getElementsByTagName != "undefined")
				{
					if(data.getElementsByTagName("result_value") && data.getElementsByTagName("result_value").length > 0)
					{
						data = data.getElementsByTagName("result_value")[0];
						items = $.xml2json(data);
						tempAccounts.methods.rebuildSubItems(items, "result_value");
						tempAccounts.storage("serverInfo", items);
						if(items)
						{
							var versionInfo = "";
							if(items.version_info_str)
								versionInfo = items.version_info_str;
							if(items.sub_version_info_str)
							{
								var subversion = items.sub_version_info_str;
								if(subversion.indexOf("_")==0)
									subversion = subversion.substr(1, subversion.length);
								versionInfo += " Build : " + subversion;

								$("#crushVersionInfo").text(versionInfo);
							}
						}
						if(callback){
							callback(items);
							return;
						}
					}
				}
				if(callback){
					callback(items);
				}
				return;
			});
		},
		getSeverLog : function(callback)
		{
			tempAccounts.data.serverRequest({
				command: "getServerItem",
				key : "server_info/server_log"
			},
			function(data){
				var items = false;
				if(data && typeof data.getElementsByTagName != "undefined")
				{

					if(data.getElementsByTagName("result_value") && data.getElementsByTagName("result_value").length > 0)
					{
						data = data.getElementsByTagName("result_value")[0];
						var log = [];
						$(data).find("result_value_subitem").each(function(){
							log.push($(this).text());
						});
						if(callback){
							if(tempAccounts.buggyBrowser)
								callback(log.join("\r\n"));
							else
								callback(log.join("\n"));
							return;
						}
					}
				}
				if(callback){
					callback(items);
				}
				return;
			});
		},
		refreshUserSessonList : function(prefix, callback)
		{
			prefix = prefix || "";
			tempAccounts.data.serverRequest({
				command: "getSessionList",
				session_list : prefix + "user_list"
			},
			function(data){
				var items = false;
				if(data && typeof data.getElementsByTagName != "undefined")
				{
					if(data.getElementsByTagName("session_list") && data.getElementsByTagName("session_list").length > 0)
					{
						data = data.getElementsByTagName("session_list")[0];
						items = $.xml2json(data);
						tempAccounts.methods.rebuildSubItems(items, "session_list");
						if(callback){
							callback(items);
							return;
						}
					}
				}
				if(callback){
					callback(items);
				}
				return;
			});
		},
		getUserSessionInfo : function(prefix, index, callback)
		{
			prefix = prefix || "";
			if(index<0)return;
			tempAccounts.data.serverRequest({
				command: "getServerItem",
				key : "server_info/"+prefix+"user_list/" + index
			},
			function(data){
				var items = false;
				if(data)
				{
					if(data.getElementsByTagName("result_value") && data.getElementsByTagName("result_value").length > 0)
					{
						data = data.getElementsByTagName("result_value")[0];
						if(callback){
							callback(data);
							return;
						}
					}
				}
				if(callback){
					callback(items);
				}
				return;
			});
		},
		refreshServerGroupList : function(callback)
		{
			tempAccounts.data.serverRequest({
				command: "getServerItem",
				key : "server_settings/server_groups"
			},
			function(data){
				var items = false;
				if(data)
				{
					if(data.getElementsByTagName("result_value") && data.getElementsByTagName("result_value").length > 0)
					{
						data = data.getElementsByTagName("result_value")[0];
						items = $.xml2json(data);
						tempAccounts.methods.rebuildSubItems(items, "result_value");
						tempAccounts.storage("serverGroups", items);
						if(callback){
							callback(items);
							return;
						}
					}
				}
				if(callback){
					callback(items);
				}
				return;
			});
		},
		bindUserList : function (callback)
		{
			var serverGroup = $("#userConnectionGroups").val() || "MainUsers";
			tempAccounts.data.serverRequest({
				command: 'getUserList',
				serverGroup : serverGroup
			},
			function(data){
				if(data)
				{
					var users = $.xml2json(data, true);
					if(users && users.response_data && users.response_data.length>0 && users.response_data[0].user_list && users.response_data[0].user_list.length>0)
					{
						var userList = users.response_data[0].user_list[0].user_list;
						if(userList && userList.length>0 && userList[0].user_list_subitem && userList[0].user_list_subitem.length>0)
						{
							userList = userList[0].user_list_subitem;
							if(callback)
							{
								callback(userList);
							}
						}
					}
				}
				else
				{
					tempAccounts.UI.growl("Failure", $(data).text(), true, true);
				}
			});
		},
		bindConnectionGroupList : function(allPrefs)
		{
			var prefs = $.xml2json(allPrefs, true);
			var userConnectionGroups = $("#userConnectionGroups").empty();
			if(prefs && prefs.server_groups && prefs.server_groups.length>0 && prefs.server_groups[0].server_groups_subitem && prefs.server_groups[0].server_groups_subitem.length>0)
			{
				tempAccounts.methods.rebuildSubItems(prefs.server_groups, "server_groups");
				var serverGroupList = prefs.server_groups[0]["server_groups_subitem"];
				for(var i=0;i<serverGroupList.length;i++)
				{
					var name = serverGroupList[i].text;
					userConnectionGroups.append("<option val='"+name+"'>"+name+"</option>");
				}
			}
			else
			{
				userConnectionGroups.append("<option val='MainUsers'>MainUsers</option>");
			}
		},
		getCurrentUserInformation : function(callback)
		{
			tempAccounts.data.serverRequest({
					command: 'getUserInfo',
					path : "/",
					random: Math.random()
				},
				function(data){
					if(data)
					{
						callback(data);
					}
				}
			);
		},
		getUserInfo : function(user, callback, trackInfo, returnDataOnly) {
			var context = this;
			function getUserCall()
			{
				var serverGroup = $("#userConnectionGroups").val() || "MainUsers";
				tempAccounts.data.serverRequest({
					command: 'getUser',
					serverGroup : serverGroup,
					username : user
				},
				function(data){
					if(data)
					{
						var usersData = $.xml2json(data, false);
						if(usersData && usersData["response_status"] && usersData["response_status"]== "OK")
						{
							if(callback)
							{
								var userItems = usersData.response_data.user_items;
								if(!returnDataOnly)
								{
									tempAccounts.storage("currentUser", userItems);
									tempAccounts.isUserAdmin = false;
									tempAccounts.isUserLimitedAdmin = false;
									if(userItems && userItems.user && userItems.user.site)
									{
										if(userItems.user.site.indexOf("(CONNECT)")>=0)
										{
											tempAccounts.isUserAdmin = true;
										}
										else if(userItems.user.site.indexOf("(USER_ADMIN)")>=0)
										{
											tempAccounts.isUserLimitedAdmin = true;
										}
									}
									tempAccounts.storage("currentUserXML", data);
									if(trackInfo)
									{
										tempAccounts.data.storeCurrentUserInfo(user);
										tempAccounts.data.bindGroupDetails();
									}
								}
								callback(userItems, data);
							}
						}
						else
						{
							tempAccounts.UI.growl("Failure", $(data).text(), true, true);
							if(trackInfo)
							{
								tempAccounts.data.storeCurrentUserInfo(false);
							}
							if(callback)
							{
								callback(false);
							}
						}
					}
					else
					{
						tempAccounts.UI.growl("Failure", $(data).text(), true, true);
						if(trackInfo)
						{
							tempAccounts.data.storeCurrentUserInfo(false);
						}
						if(callback)
						{
							callback(false);
						}
					}
				});
			}
			if($.trim(user).toLowerCase() == "default" || returnDataOnly)
			{
				getUserCall();
			}
			else
			{
				tempAccounts.dataRepo.refreshDefaultUserData(function(info, xml){
					if(info)
					{
						getUserCall();
					}
					else
					{
						if(callback)
						{
							callback(false);
						}
					}
				});
			}
		},
		//Expects user name, action as new, update or delete, a callback function and a flag if to track current user or not
		saveUserInfo : function(user, vfs_items, permissions, userName, action, callback, noGrowl) {
			var context = this;
			var serverGroup = $("#userConnectionGroups").val() || "MainUsers";
			var objData = {
				command: 'setUserItem',
				data_action : action || 'new',
				serverGroup : serverGroup,
				username : userName
			};
			if(action == "delete")
			{
				delete objData.username;
				objData.usernames = userName;
			}
			if(user)
			{
				objData.user = user;
				objData.xmlItem = "user";
			}
			if(vfs_items)
			{
				objData.vfs_items = vfs_items;
			}
			if(permissions)
			{
				objData.permissions = permissions;
			}
			tempAccounts.data.serverRequest(objData,
			function(data, XMLHttpRequest, textStatus, errorThrown){
				if(data)
				{
					var usersData = $.xml2json(data, false);
					if(usersData && usersData["response_status"] && usersData["response_status"]== "OK")
					{
						if(callback)
						{
							callback(data);
						}
					}
					else
					{
						if(!noGrowl)
						{
							tempAccounts.UI.growl("Failure", $(data).text(), true, true);
						}
						if(callback)
						{
							callback(false, data);
						}
					}
				}
				else
				{
					if(!noGrowl)
					{
						tempAccounts.UI.growl("Failure", $(data).text(), true, true);
					}
					if(callback)
					{
						callback(false, XMLHttpRequest, textStatus, errorThrown);
					}
				}
			});
		},
		saveGroupInfo : function(groupXML, userName, action, callback, noGrowl) {
			var context = this;
			var serverGroup = $("#userConnectionGroups").val() || "MainUsers";
			var objData = {
				command: 'setUserItem',
				data_action : action || 'new',
				serverGroup : serverGroup,
				username : userName,
				xmlItem : "groups",
				groups : groupXML
			};
			tempAccounts.data.serverRequest(objData,
			function(data, XMLHttpRequest, textStatus, errorThrown){
				if(data)
				{
					var usersData = $.xml2json(data, false);
					if(usersData && usersData["response_status"] && usersData["response_status"]== "OK")
					{
						if(callback)
						{
							callback(data);
						}
					}
					else
					{
						if(!noGrowl)
						{
							tempAccounts.UI.growl("Failure", $(data).text(), true, true);
						}
						if(callback)
						{
							callback(false, data);
						}
					}
				}
				else
				{
					if(!noGrowl)
					{
						tempAccounts.UI.growl("Failure", $(data).text(), true, true);
					}
					if(callback)
					{
						callback(false, XMLHttpRequest, textStatus, errorThrown);
					}
				}
			});
		},
		getGroupInfo : function(type, serverGroup, callback) {
			var context = this;
			type = type || "group";
			serverGroup = serverGroup || "MainUsers";
			tempAccounts.data.serverRequest({
				command: 'getUserXML',
				serverGroup : serverGroup,
				xmlItem : type
			},
			function(data){
				if(data)
				{
					var usersData = $.xml2json(data, false);
					if(usersData && usersData["response_status"] && usersData["response_status"]== "OK")
					{
						var response = usersData.response_data;
						if(callback)
						{
							callback(response, data);
						}
					}
				}
				else
				{
					tempAccounts.UI.growl("Failure", $(data).text(), true, true);
					if(callback)
					{
						callback(false);
					}
				}
			});
		},
		refreshDefaultUserData : function(callback){
			tempAccounts.dataRepo.getUserInfo("default", function(info, xml){
				if(info)
				{
					tempAccounts.storage("defaultUser", info);
					tempAccounts.storage("defaultUserXML", xml);
					if(callback)
					{
						callback(info, xml);
					}
				}
				else
				{
					if(callback)
					{
						callback(false);
					}
				}
			});
		}
	},
	methods :
	{
		initGUI : function(){
			tempAccounts.placeHolder = $("#tempAccountHolder");
			tempAccounts.GUIAdmin = $("#GUIAdmin");
			$(document).data("pageTitle", document.title);
			tempAccounts.GUIAdmin.find("#tempAccounts").block({
				message:  'Loading..',
				css: {
					border: 'none',
					padding: '10px',
					width : '200px',
					backgroundColor: '#000',
					'-webkit-border-radius': '10px',
					'-moz-border-radius': '10px',
					opacity: .5,
					color: '#fff',
					'text-align':'left'
				}
			});
			var blockMsg = $(".blockMsg");
			var mainServerInstance = $.cookie("mainServerInstance");
			tempAccounts.data.serverRequest({
				command: 'getServerItem',
					key: "server_settings/server_list",
					random: Math.random()
				},
				function(data){
					var _mainServerInstance = $("#mainServerInstance").empty();
					if(data)
					{
						$(data).find("result_value_subitem").each(function(){
							var type = $(this).find("serverType").text();
							if(type.toLowerCase() == "dmz")
							{
								var instance = $(this).find("server_item_name").text();
								if(!instance) instance = $(this).find("ip").text() + ":" + $(this).find("port").text();
								if(instance && instance.length>0)
								{
									if(instance.toLowerCase() == "main")
										_mainServerInstance.append("<option value=''>"+instance+"</option>");
									else
										_mainServerInstance.append("<option value='"+instance+"'>"+instance+"</option>");
								}
							}
						});
						if(_mainServerInstance.find("option").length>0)
						{
							_mainServerInstance.prepend("<option value=''>Main</option>")
							if(mainServerInstance != null)
							{
								if(_mainServerInstance.find("option[value='"+mainServerInstance+"']").length>0)
								{
									if(mainServerInstance.length>0 && mainServerInstance.toLowerCase()!= "main")
										tempAccounts.ajaxCallURL = tempAccounts.ajaxCallURLBase + mainServerInstance + "/";
									_mainServerInstance.val(mainServerInstance);
								}
								else
								{
									tempAccounts.ajaxCallURL = tempAccounts.ajaxCallURLBase;
									_mainServerInstance.val("");
									var options = {
										path: '/'
									};
									$.cookie("mainServerInstance", null);
									$.cookie("mainServerInstance", "", options);
								}
							}
						}
						else
						{
							_mainServerInstance.parent().remove();
						}
				}
				tempAccounts.data.getXMLPrefsDataFromServer("GUIXMLPrefs", function(allPrefs){
					blockMsg.text("Loading Current User Information..");
					tempAccounts.dataRepo.getCurrentUserInformation(function(data){
						/*var customizations = [];
						var logo = "";
						$(data).find("customizations_subitem").each(function(){
							var curObj = {
								key : $(this).find("key").text(),
								value : $(this).find("value").text()
							};
							customizations.push(curObj);
							if(curObj.key && curObj.key.toLowerCase() == "logo")
							{
								logo = curObj.value;
							}
						});
						if(logo)
						{
							if(logo.toLowerCase().indexOf("http://")<0 && logo.toLowerCase().indexOf("https://")<0)
							{
								logo = "/WebInterface/images/" + logo;
							}
							if(logoElem.find("img").length>0)
								logoElem.find("img").replaceWith("<img src='" + logo+ "' />");
							else
								logoElem.append("<img src='" + logo + "' />");
						}
						logoElem.show();*/
					});
				});
			}, false, tempAccounts.ajaxCallURLBase);
			tempAccounts.UI.hideLoadingIndicator();
			tempAccounts.UI.initEvents();

			/*Session checker will get version information, based on it new features will be show/hide/initiated*/
			$(".enterpriseFeature").hide();
			$("#SessionSeconds").sessionChecker({
				callBack:function(){
					if (($(document).data("crushftp_version")+"").indexOf("6") >= 0) //show new features
					{
						if (($(document).data("crushftp_enterprise")+"") * 1 > 0) //show new features
						{
							$(".enterpriseFeature").show();
						}
					}
					else
					{
						tempAccounts.userLogin.userLoginStatusCheckThread();
					}
				}
			});
		},
		loadPanel : function(panelPlaceHolder, panel, initParam, callback){
			tempAccounts.UI.notification(false);
			if(panel && panel.length>0)
			{
				$.ajax({
					url : "panels/"+panel+"/index.html?random="+Math.random(),
					success : function(response) {
						var curPanel = $(response);
						panelPlaceHolder.append(curPanel);
						buildButtons(curPanel);
						$(".tabs", curPanel).tabs();
						$("#configOptionTabs").tabs();
						$.getScript("panels/"+panel+"/interface.js?random="+Math.random(), function() {
							initParam = initParam || false;
							var initScript = "panel" + panel + ".init();";
							if(initParam)
							{
								initScript = "panel" + panel + ".init('"+initParam+"');";
							}
							try{
								eval(initScript);
								tempAccounts.methods.initLayoutEvents(curPanel, panel);
								if(callback)
									callback(true);
							}
							catch(ex){
								if(ex && ex.toString() != "")
								{
									tempAccounts.UI.growl("Error", "panel" +panel + ".init(); " + ex, true);
								}
								if(callback)
									callback(false);
							}
						});
					},
					error : function(xhr)
					{
						var msg = "Sorry but there was an error: " + xhr.status + " " + xhr.statusText + " while loading panel : " + panel;
						tempAccounts.UI.notification(msg, true);
						if(callback)
							callback(false);
					}
				});
			}
			else
			{
				if(callback)
				{
					callback(false);
				}
			}
			return false;
		},
		initLayoutEvents : function(context, panel){
			context = context || tempAccounts.placeHolder;
			tempAccounts.methods.itemsChanged(false);
			context.form();
			$("#ui-datepicker-div").hide();
			if(context.find(".panelFormFields").length>0)
			{
				tempAccounts.methods.listenChanges(context.find(".panelFormFields"));
			}
			else
			{
				tempAccounts.methods.listenChanges(context);
			}
			context.unbind("changed").bind("changed", function(){
				tempAccounts.methods.itemsChanged(true);
			});
			vtip(context);
			$("ol.selectable", context).selectable({
				selected: function(event, ui) {
					var selected = $(ui.selected);
					selected.parent().find(".ui-widget-header").removeClass("ui-widget-header");
					selected.addClass("ui-widget-header");
					if(selected.is("li"))
					{
						try{
							var events = $(this).data('events');
							if(events && events.onSelect)
							{
								$(this).trigger("onSelect", [$(this), selected]);
							}
						}
						catch(ex){
							if(ex && ex.toString() != "")
							{
								tempAccounts.UI.growl("Error", ex, true);
							}
						}
					}
					return false;
				}
			});
		},
		listenChanges : function(context){
			context = context || tempAccounts.placeHolder;
			context.find("input:not(.ignoreChange), select:not(.ignoreChange), textarea:not(.ignoreChange)").change(function(){
				tempAccounts.methods.itemsChanged(true);
			});
			context.find("input[type='text']:not(.ignoreChange), textarea:not(.ignoreChange)").bind("textchange", function(){
				tempAccounts.methods.itemsChanged(true);
			});
		},
		itemsChanged : function(flag){
			var context = tempAccounts.placeHolder;
			if(context)
			{
				context.data("hasChanged", flag);
			}
		},
		setPageTitle : function(title, append){
			if(title)
			{
				if(append)
				{
					title =  $(document).data("pageTitle") + " :: " + title;
				}
				document.title = title;
			}
			else if($(document).data("pageTitle"))
			{
				document.title = $(document).data("pageTitle");
			}
		},
		confirmExit : function(){
			if(tempAccounts.placeHolder.data("hasChanged"))
			{
				return "If you navigate away, you will loose your unsaved changes. Do you want to continue?";
			}
		},
		//Generate random code based on length, numeric flag restricts code to be numbers only
		generateRandomPassword : function(length, numeric, possible){
			length = length || 8;
			var randomId = "";
			possible = possible || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			if(numeric)
			{
				possible = "0123456789";
			}
			for( var i=0; i < length; i++ )
				randomId += possible.charAt(Math.floor(Math.random() * possible.length));
			return randomId;
		},
		//Validate numbers
		isNumeric : function(input){
			return ((input - 0) == input && input.length > 0);
		},
		//Validate Email address
		isValidEmail : function(email)
		{
			return (email.indexOf("@") > 0 && email.lastIndexOf(".") > email.indexOf("@"));
		},
		formatBytes : function(bytes) {
			if ((bytes / 1024).toFixed(0) == 0) return bytes + " bytes";
			else if ((bytes / 1024 / 1024).toFixed(0) == 0) return (bytes / 1024).toFixed(1) + " KB";
			else if ((bytes / 1024 / 1024 / 1024).toFixed(0) == 0) return (bytes / 1024 / 1024).toFixed(1) + " MB";
			else if ((bytes / 1024 / 1024 / 1024 / 1024).toFixed(0) == 0) return (bytes / 1024 / 1024 / 1024).toFixed(1) + " GB";
			else if ((bytes / 1024 / 1024 / 1024 / 1024 / 1024).toFixed(0) == 0) return (bytes / 1024 / 1024 / 1024 / 1024).toFixed(1) + " TB";
		},
		formatTime : function(secs) {
			var remaining = "";
			if(!secs) return "";
			if(secs.indexOf(".")<0)
				secs = secs + ".0";
			secs = secs.substring(0, secs.indexOf(".")) * 1;
			var mins = (secs / 60) + ".0";
			mins = mins.substring(0, mins.indexOf(".")) * 1;
			if (mins > 0) {
				secs -= (mins * 60);
				remaining = mins + " min, " + secs + " secs";
			} else {
				if (secs < 0) {
					remaining = "Calculating";
				} else {
					remaining = secs + " secs";
				}
			}
			return remaining;
		},
		hideZero : function(val) {
			if(!val || val+"" == "0" || val == "undefined" || val.length == 0)
				return "N/A";
			else
				return val;
		},
		validateUserPassword : function(password)
		{
			var messages = false;
			var minLength = $(document).data("GUIXMLPrefs").min_password_length || 8;
			var minNumeric = $(document).data("GUIXMLPrefs").min_password_numbers || 0;
			var minLower = $(document).data("GUIXMLPrefs").min_password_lowers || 0;
			var minUpper = $(document).data("GUIXMLPrefs").min_password_uppers || 0;
			var minSpecial = $(document).data("GUIXMLPrefs").min_password_specials || 0;
			if($(document).data("GUIXMLPrefs").blank_passwords == "false" && password.length == 0)
			{
				return messages;
			}
			var passed = validatePassword(password, {
				length:   [minLength, 100],
				lower:    minLower,
				upper:    minUpper,
				numeric:  minNumeric,
				special:  minSpecial
			});
			if(!passed)
			{
				var rules = [];
				rules.push("<br /> - Must be of at least " + minLength +  " characters");
				if(minNumeric>0)
				{
					rules.push(" - Must contain at least " + minNumeric +  " numbers");
				}
				if(minLower>0)
				{
					rules.push(" - Must contain at least " + minLower +  " lower case characters");
				}
				if(minUpper>0)
				{
					rules.push(" - Must contain at least " + minUpper +  "  upper case characters");
				}
				if(minSpecial>0)
				{
					rules.push(" - Must contain at least " + minSpecial +  "  special characters (like "+tempAccounts.specialCharactersInUserPass+")");
				}
				messages = [];
				messages.push("Password is not valid. Follow these rules for password : " + rules.join("<br/>"));
			}
			return messages;
		},
		isDate : function(str, uk) {
		  var parms = str.split(/[\.\-\/]/);
		  var yyyy = parseInt(parms[2],10);
		  var mm   = parseInt(parms[1],10);
		  var dd   = parseInt(parms[0],10);
		  if(uk)
		  {
			mm   = parseInt(parms[0],10);
			dd   = parseInt(parms[1],10);
		  }
		  var date = new Date(yyyy,mm-1,dd,0,0,0,0);
		  return mm === (date.getMonth()+1) &&
				 dd === date.getDate() &&
			   yyyy === date.getFullYear();
		},
		//Check if input has special characters
		hasSpecialCharacters: function (input, charset){
			charset = charset || tempAccounts.notAllowedChars;
			for (var i = 0; i < input.length; i++) {
				if (charset.indexOf(input.charAt(i)) != -1) {
					return true;
				}
			}
			return false;
		},
		removeSpecialChars : function(strVal)
		{
			return strVal.replace(/[^a-zA-Z 0-9]+/g,'');
		},
		//Check if input starts with number
		startsWithNumber : function(input){
		   input = input.replace(/(^\d+)(.+$)/i,'$1');
		   return !isNaN(input);
		},
		rebuildSubItems: function(item, name){
			if(!item[name  + "_subitem"])
			{
				item[name  + "_subitem"] = [];
			}
			else if(!item[name  + "_subitem"].push)
			{
				var slab = item[name  + "_subitem"];
				item[name  + "_subitem"] = [slab];
			}
		},
		logout : function (elem) {
			$.ajax({
				type: "POST",
				url: tempAccounts.ajaxCallURL,
				data: {
					command: "logout",
					random: Math.random()
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					$.cookie("CrushAuth", "", {
						path: '/',
						expires: -1
					});
					document.location = document.location;
				},
				success: function (msg) {
					//Remove CrushAuth cookie and redirect to login page
					$.cookie("CrushAuth", "", {
						path: '/',
						expires: -1
					});
					document.location = document.location;
				}
			});
		},
		buildXMLToSubmit : function(_panel, includeRadio)
		{
			var xmlString = [];
			_panel.find("input[type='text']:not(.ignoreBind, .excludeXML),input[type='password']:not(.ignoreBind, .excludeXML), textarea:not(.ignoreBind, .excludeXML), select:not(.ignoreBind, .excludeXML)").each(function(){
				if($(this).attr("id"))
				{
					xmlString.push("<"+$(this).attr("id")+">"+tempAccounts.methods.htmlEncode($(this).val())+"</"+$(this).attr("id")+">");
				}
			});
			_panel.find(".liveData:not(.ignoreBind, .excludeXML)").each(function(){
				if($(this).attr("id"))
				{
					xmlString.push("<"+$(this).attr("id")+">"+tempAccounts.methods.htmlEncode($(this).text())+"</"+$(this).attr("id")+">");
				}
			});
			_panel.find("input[type='checkbox']:not(.ignoreBind, .excludeXML)").each(function(){
				if($(this).attr("id"))
				{
					if($(this).is(".reverse"))
					{
						xmlString.push("<"+$(this).attr("id")+">"+!$(this).is(":checked")+"</"+$(this).attr("id")+">");
					}
					else
					{
						xmlString.push("<"+$(this).attr("id")+">"+$(this).is(":checked")+"</"+$(this).attr("id")+">");
					}
				}
			});
			if(includeRadio)
			{
				_panel.find("input[type='radio']:not(.ignoreBind, .excludeXML)").each(function(){
					if($(this).attr("id"))
					{
						xmlString.push("<"+$(this).attr("id")+">"+$(this).is(":checked")+"</"+$(this).attr("id")+">");
					}
				});
			}
			return xmlString.join("\r\n");
		},
		jsonToXML : function(json, flag)
		{
			if(!json) return "";
			var xml = [];
			for(var item in json)
			{
				var curItem = json[item];
				if(!$.isFunction(curItem))
				{
					if(curItem[0] && curItem[0][item + "_subitem"])
					{
						var subItem = curItem[0][item + "_subitem"];
						xml.push("<"+item+"  type=\"vector\">");
						if(subItem && subItem.length>0)
						{
							var itemTypeText = "";
							var subItemType = subItem[0].type;
							if(subItemType)
							{
								if($.isArray(subItemType) && subItemType.length>1)
								{
									itemTypeText = "type =\""+subItemType[1]+"\"";
								}
								else if(typeof subItemType === "string")
								{
									itemTypeText = "type =\""+subItemType+"\"";
								}
							}
							if($.isArray(subItem) && subItem.length>1)
							{
								for(var subSubItem in subItem)
								{
									var curSubItem = subItem[subSubItem];
									if(!$.isFunction(curSubItem))
									{
										xml.push("<"+item+"_subitem "+itemTypeText+">" + tempAccounts.methods.jsonToXML(curSubItem, true) + "</"+item+"_subitem>");
									}
								}
							}
							else
							{
								xml.push("<"+item+"_subitem "+itemTypeText+">" + tempAccounts.methods.jsonToXML(subItem, true) + "</"+item+"_subitem>");
							}
						}
						xml.push("</"+item+">");
					}
					else
					{
						var textVal = curItem;
						if($.isArray(textVal))
						{
							if(textVal.length>0)
							{
								textVal = textVal[0];
								if(typeof textVal.text != "undefined")
								{
									textVal = textVal.text;
								}
								else if(typeof textVal != "string")
								{
									textVal = "";
								}
							}
							else
							{
								textVal = "";
							}
						}
						else if(flag)
						{
							xml.push(tempAccounts.methods.jsonToXML(curItem));
						}

						if(item.toLowerCase() != "type" && typeof curItem != "string")
						{
							if(typeof textVal =="string")
							{
								xml.push("<"+item+">" + escape(textVal) + "</"+item+">");
							}
						}
						else
						{
							if(typeof curItem != "string")
							{
								textVal = curItem[0].text;
								if(textVal && typeof textVal == "string")
								{
									xml.push("<"+item+">" + escape(textVal) + "</"+item+">");
								}
							}
						}
					}
				}
			}
			return xml.join("\r\n");
		},
		xmlUnSafeCharsMapping : {
			'&': '&amp;',
			'"': '&quot;',
			"'" : '&apos;',
			'<': '&lt;',
			'>': '&gt;'
		},
		xmlUnSafeCharsMappingReverse : {
			'&amp;' : '&',
			'&quot;' : '"',
			'&apos;' : '"',
			'&lt;' : '<',
			'&gt;' : '>',
			'%2B' : '+',
			'%25' : '%'
		},
		xmlEncode : function(value)
		{
			if (value == undefined || value.length == 0) return value;
			 return value.replace(/([\&'"<>])/g, function(str, item) {
				return tempAccounts.methods.xmlUnSafeCharsMapping[item];
			}).replace(/\%/g, "%25").replace(/\+/g, "%2B");
		},
		decodeXML : function(value)
		{
			if (value == undefined || value.length == 0) return value;
			 return value.replace(/(&quot;|&lt;|&gt;|&amp;|&apos;|%2B|%25)/g,
				function(str, item) {
					return tempAccounts.methods.xmlUnSafeCharsMappingReverse[item];
			});
		},
		htmlEncode : function(value, encodeVal) {
			if(value != undefined && value.length>0)
			{
				var lines = value.split(/\r\n|\r|\n/);
				for (var i = 0; i < lines.length; i++) {
					if(lines[i] && typeof lines[i] == "string")
					lines[i] = tempAccounts.methods.xmlEncode(lines[i]);
				}
				if(encodeVal)
					return encodeURIComponent(lines.join('\r\n'));
				else
					return lines.join('\r\n');
			}
			else
				return value;
		},
		encode : function(value) {
			return $('<div/>').text(value).html();
		},
		decode : function(value){
			return $('<div/>').html(value).text();
		}
	}
};