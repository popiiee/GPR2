/****************************
CrushFTP GUI Plugin custom js
*****************************/
/* Do not change these lines */
var pluginLetsEncrypt = {};
pluginLetsEncrypt.localization = {};
/****************************/

// Plugin details
var pluginName = "LetsEncrypt";
var _plugin = $("#pnlPlugin" + pluginName);

// Interface methods
pluginLetsEncrypt.init = function(pluginID, returnXML){
	pluginLetsEncrypt.returnXML = returnXML;
	applyLocalizations(pluginName, localizations.panels["Plugins"]);
	pluginLetsEncrypt.bindData(0, pluginID);
}

pluginLetsEncrypt.bindData = function(index, pluginID)
{
	index = index || 0;
	var pluginPrefs = [];
	pluginLetsEncrypt.showServerList();
	if(pluginID)
	{
		var data = $(document).data("PluginBindData" + pluginID);
		pluginPrefs = data.dataItem;
		$(".nonEmbed", _plugin).hide();
	}
	else
	{
		pluginPrefs = common.data.getPluginPrefs(pluginName);
	}
	if(pluginPrefs)
	{
		var curPlugin = pluginPrefs;
		if(!pluginID && pluginPrefs.length)
		{
			curPlugin = pluginPrefs[index];
		}
        // if(typeof curPlugin.challenge_path == "undefined")
        //     curPlugin.challenge_path = [{"text" : "./Webinterface/"}];
		pluginLetsEncrypt.bindPluginDetails(curPlugin);
	}
	pluginLetsEncrypt.bindEvents();
}

pluginLetsEncrypt.bindEvents = function()
{
	if(this.eventAdded)return;
	_plugin.find("input, select, textarea").bind("change", function(){
		panelPlugins.itemsChanged(true, pluginLetsEncrypt.returnXML, pluginName);
	});

	_plugin.find("input[type='text'], textarea").bind("textchange", function(){
		panelPlugins.itemsChanged(true, pluginLetsEncrypt.returnXML, pluginName);
	});
	$("[valtype]", _plugin).crushValidator();
	$("[valtype]", _plugin).unbind().bind("textchange",function(){
		$(this).validateNow({
			notForUserManager : true,
			isForPreferences : true
		});
	});

	$("a.serverFilePickButton").each(function(){
        $(this).unbind("click").click(function(){
            var curElem = $(this);
            curElem.crushFtpLocalFileBrowserPopup({
                type : curElem.attr("PickType") || 'dir',
                file_mode : curElem.attr("FileMode") || 'server',
                existingVal : $("#" + curElem.attr("rel"), _plugin).val(),
                callback : function(selectedPath){
                    if(!crushFTP.methods.getFileExtension(selectedPath))
                        selectedPath += "letsencrypt_keystore.jks";
                    $("#" + curElem.attr("rel"), _plugin).val(selectedPath).trigger("change").validateNow();
                }
            });
            return false;
        });
    });

     $('#submit-btn').click(function(e){
        e.preventDefault();
        e.stopPropagation();
        var btn = $(this);
        if(btn.hasClass('ui-state-disabled'))
            return false;
        btn.addClass('ui-state-disabled').attr("disabled", "disabled");
        function continueCommand(){
            var data = {
                command: "letsencrypt",
                action: "fetch_certs"
            };
            _panel.find("input[type='text'],input[type='password'],textarea,select").each(function(){
                if($(this).attr("id"))
                {
                    var curVal = $(this).val();
                    if($(this).attr("id") == "keystore_path"){
                        data[$(this).attr("id")] = crushFTP.methods.htmlEncode(curVal);
                    }
                    else{
                        data[$(this).attr("id")] = curVal;
                    }
                }
            });
            _panel.find("input[type='checkbox']").each(function(){
                if($(this).attr("id"))
                {
                    var curVal = $(this).is(":checked");
                    data[$(this).attr("id")] = curVal;
                }
            });
            crushFTP.data.serverRequest(data, function(msg){
                crushFTP.UI.growl("Let's Encrypt", decodeURIComponent($(msg).text()), false, false);
                btn.removeClass('ui-state-disabled').removeAttr('disabled');
            });
        }
        if(_panel.find(".hasPendingCall").length>0)
        {
            window.pendingEncryptionCall = function(){
                continueCommand();
            };
            _panel.find(".hasPendingCall").trigger("blur");
        }
        else
        {
            continueCommand();
        }
    });
	this.eventAdded = true;
}

pluginLetsEncrypt.bindPluginDetails = function(controlData)
{
	var inputs = _plugin.find("input.ignoreBind,select.ignoreBind,textarea.ignoreBind").removeClass("ignoreBind");
	if(controlData)
	{
		if(typeof controlData.usernameTemplate == "undefined" || controlData.usernameTemplate[0] == "" || controlData.usernameTemplate[0].text == "")
			controlData.usernameTemplate = [{ text: "default" }];
	}
	bindValuesFromXML(_plugin, controlData);
	if(controlData.subItem && controlData.subItem.length>0)
		_plugin.attr("subPluginName", controlData.subItem[0].text || "");
	inputs.addClass("ignoreBind");
}

pluginLetsEncrypt.showServerList = function()
{
	if(!this.serverListShown)
	{
		var service = common;
		if(pluginLetsEncrypt.returnXML)
		{
			service = crushFTP;
		}
		var serverList = service.data.getSubValueFromPrefs("server_list");
		var serverPorts = $("#server_item", _plugin);
		for(var i=0;i<serverList.length;i++)
		{
			var curItem = serverList[i];
			if(curItem)
			{
				var serverType = service.data.getTextContentFromPrefs(curItem, "serverType");
				var ip = service.data.getTextContentFromPrefs(curItem, "ip");
				var port = service.data.getTextContentFromPrefs(curItem, "port");
				var server = ip + "_" + port;
				var newControl = $("<option>"+server+"</option>");
				serverPorts.append(newControl);
				newControl.data("controlData", curItem);
			}
		}
		serverPorts.prepend("<option>All</option>");
		this.serverListShown = true;
	}
}

pluginLetsEncrypt.saveContent = function(saveByIndex, cloneName, removeByIndex, callback)
{
	removeByIndex = removeByIndex || 0;
	if(pluginPlaceHolder.data("hasChanged") || removeByIndex>0 || (saveByIndex>0 && cloneName) || pluginLetsEncrypt.returnXML)
	{
		var hasError = false;
		$("[valtype]", _plugin).each(function(){
			if($(this).validateNow({
				notForUserManager : true,
				isForPreferences : true
			}) && !$(this).attr("_ignore"))
			{
				hasError = true;
			}
		});
		if(hasError){
			return;
		}

		if(!pluginLetsEncrypt.returnXML)
			crushFTP.UI.showIndicator(false, false, "Please wait..");

		var xmlString = [];
		var container = _plugin;
		if(removeByIndex == 0)
		{
			xmlString.push("<plugins_subitem type=\"properties\">");
			xmlString.push("<version>"+$("#version", _plugin).text()+"</version>");
			xmlString.push("<pluginName>"+pluginName+"</pluginName>");
			xmlString.push(buildXMLToSubmitForm(_plugin, true));
			if(typeof saveByIndex != "undefined")
			{
				if(typeof cloneName == "undefined" || cloneName == "undefined" || cloneName == "false" || cloneName == pluginName)
				{
					var subItem = crushFTP.methods.htmlEncode(container.attr("subPluginName"));
					if(!subItem || subItem == "undefined" || subItem == "false" || subItem == pluginName)
						subItem = "";
					xmlString.push("<subItem>"+subItem+"</subItem>");
				}
				else
					xmlString.push("<subItem>"+crushFTP.methods.htmlEncode(cloneName)+"</subItem>");
			}
			else
			{
				if(container.attr("subPluginName") && this.subItem>0)
				{
					var subItem = crushFTP.methods.htmlEncode(container.attr("subPluginName"));
					if(!subItem || subItem == "undefined" || subItem == "false" || subItem == pluginName)
						subItem = "";
					xmlString.push("<subItem>"+subItem+"</subItem>");
				}
				else
				{
					xmlString.push("<subItem></subItem>");
				}
			}
			xmlString.push("</plugins_subitem>");
		}
		var formSubItem = xmlString.join("\n");

		if(pluginLetsEncrypt.returnXML)
			return formSubItem;

		var action = removeByIndex == 0 ? "change" : "remove";
		var index = window.currentPluginIndex;
		var subItemIndex = removeByIndex == 0 ? saveByIndex || this.subItem : removeByIndex;
		subItemIndex = subItemIndex || 0;
		var removeChangeFlag = (saveByIndex>0 && cloneName);
		panelPlugins.savePluginContentProcess(action, formSubItem, index, subItemIndex, removeChangeFlag, callback);
	}
	else
	{
		crushFTP.UI.growl("No changes made", "", false, 3000);
	}
}