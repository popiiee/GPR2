/****************************
CrushFTP GUI Plugin custom js
*****************************/
/* Do not change these lines */
var pluginHomeDirectory = {};
pluginHomeDirectory.localization = {};
/****************************/

// Plugin details
var pluginName = "HomeDirectory";
var _plugin = $("#pnlPlugin" + pluginName);

// Localizations
pluginHomeDirectory.localization = {
	lblEnabledText : "Enabled",
	lblDebugText : "Debug",
	lblVersionText : "Version : ",
	lblPathText : "Path : ",
	btnBrowseText : "Browse",
	lblDirectoryPermissionText : "Directory Permissions : ",
	lblUseUniqueTimeStampText : "Use Unique Time Stamped Folder? (ex. johndoe_01.01.2007)",
	lblUsernameMatchingText : "Username matching : ",
	lblPrependUserNameText : "Prepend username?",
	lblAlwaysGenerateHomeFolderText : "Replace Existing VFS With New Home Folder",
	lblRunOnlyForLoginEventText : "Only run if configured for a login event?",
	lblServerText : "Server : ",
	lblAllowAccessToOldHomeFoldersText : "Allow access to old home folders",
	lblCreateAdditionalSubfoldersText : " Create additional subfolders in home directory : "
};

// Assign localizations
localizations.panels["Plugins"][pluginName] = $.extend(pluginHomeDirectory.localization, localizations.panels["Plugins"][pluginName]);

// Interface methods
pluginHomeDirectory.init = function(pluginID, returnXML){
	pluginHomeDirectory.returnXML = returnXML;
	applyLocalizations(pluginName, localizations.panels["Plugins"]);
	$("#setupTabLink", _plugin).trigger("click");
	pluginHomeDirectory.bindData(0, pluginID);
}

pluginHomeDirectory.bindData = function(index, pluginID)
{
	index = index || 0;
	var pluginPrefs = [];
	pluginHomeDirectory.showServerList();
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
		pluginHomeDirectory.bindPluginDetails(curPlugin);
	}
	pluginHomeDirectory.bindEvents();

	var service = common;
	if(pluginHomeDirectory.returnXML)
	{
		service = crushFTP;
	}
	var server_item = service.data.getTextContentFromPrefs(curPlugin, "server_item");
	if(server_item)
	{
		if($.isArray(server_item))
			server_item = server_item[0].text;
		var items = server_item ? server_item.split(",") : [];
		if(items.has("All"))
		{
			crushFTP.UI.checkUnchekInput(_plugin.find("#server_item_all"), true);
			setTimeout(function(){
				_plugin.find("#server_item_all").trigger("change");
				pluginPlaceHolder.removeData("hasChanged");
			},100);
		}
		else
		{
			var serverPorts = $("#server_item_list", _plugin);
			serverPorts.find("input[name!='server_item_All']").each(function(){
				$(this).closest(".item").removeClass('ui-state-disabled');
			});
			for (var i = 0; i < items.length; i++) {
				crushFTP.UI.checkUnchekInput(_plugin.find("input[server_name='"+items[i]+"']"), true);
			}
		}
	}
	$('input[id$="privs_quota"]').trigger("custom-change");
	_panel.find(".maskPasswordOnURL").trigger("applymask");
}

pluginHomeDirectory.showServerList = function()
{
	if(!this.serverListShown)
	{
		var service = common;
		if(pluginHomeDirectory.returnXML)
		{
			service = crushFTP;
		}
		var serverList = service.data.getSubValueFromPrefs("server_list");
		var serverPorts = $("#server_item_list", _plugin);
		for(var i=0;i<serverList.length;i++)
		{
			var curItem = serverList[i];
			if(curItem)
			{
				var serverType = service.data.getTextContentFromPrefs(curItem, "serverType");
				var ip = service.data.getTextContentFromPrefs(curItem, "ip");
				var port = service.data.getTextContentFromPrefs(curItem, "port");
				var server = ip + "_" + port;
				var newControl = $('<span class="item" style="width:auto;"><input class="ignoreBind excludeXML" type="checkbox" server_name="'+server+'" name="server_item_'+server+'" id="server_item_'+server+'" /><label for="server_item_'+server+'">'+server+'</label><span class="spacer"></span></span>');
				serverPorts.append(newControl);
				newControl.data("controlData", curItem);
			}
		}
		serverPorts.prepend('<span class="item" style="width:auto;"><input class="ignoreBind excludeXML" type="checkbox" name="server_item_All" id="server_item_all" /><label for="server_item_all">All</label><span class="spacer"></span></span>');
		this.serverListShown = true;
	}
}

pluginHomeDirectory.showSubFolderPrivs = function(){
	var homeDirSubFolders = $("#homeDirSubFolders", _panel);
	var item = homeDirSubFolders.find("li.ui-selected");
	if(!item || item.length==0)
	{
		$("#subfolderPrivs").hide().clearForm();
	}
	else
	{
		var data = item.data("controlData");
		$("#subfolderPrivs").show().clearForm();
		if(data.privs && data.privs.length>0)
		{
			var permissionsInputVal = data.privs;
			if(permissionsInputVal)
			{
				var actionItems = permissionsInputVal.split("(");
				var filteredItems = [];
				for (var i = 0; i < actionItems.length; i++) {
					var curAction = actionItems[i];
					if(curAction && curAction.length>0)
					{
						curAction = curAction.replace("(","").replace(")","");
						filteredItems.push(curAction);
					}
				};
				var advancedPrivs = {
					sync : {},
					encryption : {}
				};
				if(filteredItems.length>0)
				{
					for (var i = 0; i < filteredItems.length; i++) {
						var curItem = filteredItems[i];
						if(curItem.indexOf("sync")==0)
						{
							var info = curItem.split("=");
							advancedPrivs.sync[info[0]] = info[1];
						}
						else if(curItem.indexOf("pgp")==0)
						{
							var info = curItem.split("=");
							advancedPrivs.encryption[info[0]] = info[1];
						}
						else if(curItem.indexOf("quota")==0)
						{
							var info = curItem.split("quota");
							if(crushFTP.methods.isNumeric(info[1]))
							{
								var val = Math.round(info[1]/(1024*1024));
								$("#subfolder_privs_quota", _plugin).val(val);
							}
						}
						else if(curItem.indexOf("comment")==0)
						{
							var info = curItem.replace("comment", "");
							$("#subfolder_privs_comment", _plugin).val(unescape(info));
						}
						else
							crushFTP.UI.checkUnchekInput($("#subfolder_privs_" + curItem, _plugin), true);
					};
					$("a#advancedPrivsOptionsSubFolder",_plugin).data("permissions", advancedPrivs);
				}
				$('input[id$="privs_quota"]').trigger("custom-change");
			}
		}
	}
}

pluginHomeDirectory.bindEvents = function()
{
	if(this.eventAdded)return;
	var advancedPrivsOptions = $("a#advancedPrivsOptions",_plugin).click(function(event) {
		panelPlugins.bindAdvancedPrivs($(this).data("permissions"));
		_panel.fieldAdvancedDialog.dialog("open");
		return false;
	});

	function rebuildPrivs(){
		permissionsInput.val("");
		var items = [];
		$(".permissionCB:checked", _plugin).each(function(){
			items.push($(this).attr("rel"));
		});

		$(".permissionItem", _plugin).each(function(){
			if($(this).val())
			{
				if($(this).attr("id") == "privs_quota")
				{
					var MB = $(this).val();
					if(crushFTP.methods.isNumeric(MB))
					{
						MB = parseInt(MB) * 1024 * 1024;
					}
					else
					{
						MB = "";
					}
					if(MB)
					{
						items.push("(quota" + MB + ")");
					}
				}
				else
					items.push("(" + $(this).attr("id").replace("privs_", "") + escape($(this).val()) + ")");
			}
		});
		var advPrivs = advancedPrivsOptions.data("permissions");
		if(advPrivs)
		{
			if(advPrivs.sync)
			{
				for(var data in advPrivs.sync)
				{
					items.push("("+data+"="+advPrivs.sync[data]+")");
				}
			}
			if(advPrivs.encryption)
			{
				for(var data in advPrivs.encryption)
				{
					items.push("("+data+"="+advPrivs.encryption[data]+")");
				}
			}
		}
		permissionsInput.val(items.join("")).trigger("change");
	}

	_panel.advancedPrivsReceiver = function(data){
		if(window.isAdvancedForSubFolder)
		{
			advancedPrivsOptionsSubFolder.data("permissions", data);
			rebuildPrivsSubFolder();
			window.isAdvancedForSubFolder = false;
		}
		else
		{
			advancedPrivsOptions.data("permissions", data);
			rebuildPrivs();
		}
		itemsChanged(true);
		panelPlugins.itemsChanged(true);
	}

	var advancedPrivsOptionsSubFolder = $("a#advancedPrivsOptionsSubFolder",_plugin).click(function(event) {
		window.isAdvancedForSubFolder = true;
		panelPlugins.bindAdvancedPrivs($(this).data("permissions"));
		_panel.fieldAdvancedDialog.dialog("open");
		return false;
	});

	function rebuildPrivsSubFolder(){
		var items = [];
		$(".permissionCBSubFolder:checked", _plugin).each(function(){
			items.push($(this).attr("rel"));
		});

		$(".permissionItemSubFolder", _plugin).each(function(){
			if($(this).val())
			{
				if($(this).attr("id") == "subfolder_privs_quota")
				{
					var MB = $(this).val();
					if(crushFTP.methods.isNumeric(MB))
					{
						MB = parseInt(MB) * 1024 * 1024;
					}
					else
					{
						MB = "";
					}
					if(MB)
					{
						items.push("(quota" + MB + ")");
					}
				}
				else
					items.push("(" + $(this).attr("id").replace("subfolder_privs_", "") + escape($(this).val()) + ")");
			}
		});
		var advPrivs = advancedPrivsOptionsSubFolder.data("permissions");
		if(advPrivs)
		{
			if(advPrivs.sync)
			{
				for(var data in advPrivs.sync)
				{
					items.push("("+data+"="+advPrivs.sync[data]+")");
				}
			}
			if(advPrivs.encryption)
			{
				for(var data in advPrivs.encryption)
				{
					items.push("("+data+"="+advPrivs.encryption[data]+")");
				}
			}
		}
		var homeDirSubFolders = $("#homeDirSubFolders", _panel);
		var item = homeDirSubFolders.find("li.ui-selected");
		if(item.length>0)
		{
			var data = item.data("controlData");
			/*var uniqueItems = [];
			$.each(data, function(i, el){
			    if($.inArray(el, uniqueItems) === -1) uniqueItems.push(el);
			});
			items = uniqueItems;*/
			data.privs = items.join("");
			item.data("controlData", data);
		}
	}

	var permissionsInput = $("#permissions", _plugin);
	_plugin.find("input, select, textarea").bind("change", function(){
		if($(this).hasClass('permissionCB'))
		{
			// permissionsInput.val("");
			// var items = [];
			// $(".permissionCB:checked", _plugin).each(function(){
			// 	items.push($(this).attr("rel"));
			// });
			// $(".permissionItem", _plugin).each(function(){
			// 	if($(this).val())
			// 	{
			// 		if($(this).attr("id") == "privs_quota")
			// 		{
			// 			var MB = $(this).val();
			// 			if(crushFTP.methods.isNumeric(MB))
			// 			{
			// 				MB = parseInt(MB) * 1024 * 1024;
			// 			}
			// 			else
			// 			{
			// 				MB = "";
			// 			}
			// 			if(MB)
			// 			{
			// 				items.push("(quota" + MB + ")");
			// 			}
			// 		}
			// 		else
			// 			items.push("(" + $(this).attr("id").replace("privs_", "") + escape($(this).val()) + ")");
			// 	}
			// });
			// permissionsInput.val(items.join("")).trigger("change");
			rebuildPrivs();
			return false;
		}
		if($(this).closest('span.item').length>0)
		{
			var serverPorts = $("#server_item_list", _plugin);
			if($(this).is("#server_item_all"))
			{
				if($(this).is(":checked"))
				{
					serverPorts.find("input[name!='server_item_All']").each(function(){
						$(this).closest(".item").addClass('ui-state-disabled');
					});
					$("#server_item").val("All").trigger('change');
				}
				else
				{
					serverPorts.find("input[name!='server_item_All']").each(function(){
						$(this).closest(".item").removeClass('ui-state-disabled').end().trigger('change');
					});
				}
			}
			else
			{
				if($("#server_item_all", serverPorts).is(":checked"))
				{
					crushFTP.UI.checkUnchekInput($(this), false);
				}
				var items = [];
				$("#server_item_list").find("input:checked").each(function(){
					items.push($(this).attr("server_name"));
				});
				$("#server_item").val(items.join(",")).trigger('change');
			}
		}
		if($(this).hasClass('permissionCBSubFolder'))
		{
			// var items = [];
			// $(".permissionCBSubFolder:checked", _plugin).each(function(){
			// 	items.push($(this).attr("rel"));
			// });
			// $(".permissionItemSubFolder", _plugin).each(function(){
			// 	if($(this).val())
			// 	{
			// 		if($(this).attr("id") == "subfolder_privs_quota")
			// 		{
			// 			var MB = $(this).val();
			// 			if(crushFTP.methods.isNumeric(MB))
			// 			{
			// 				MB = parseInt(MB) * 1024 * 1024;
			// 			}
			// 			else
			// 			{
			// 				MB = "";
			// 			}
			// 			if(MB)
			// 			{
			// 				items.push("(quota" + MB + ")");
			// 			}
			// 		}
			// 		else
			// 			items.push("(" + $(this).attr("id").replace("subfolder_privs_", "") + escape($(this).val()) + ")");
			// 	}
			// });
			// var homeDirSubFolders = $("#homeDirSubFolders", _panel);
			// var item = homeDirSubFolders.find("li.ui-selected");
			// if(item.length>0)
			// {
			// 	var data = item.data("controlData");
			// 	data.privs = items.join("");
			// 	item.data("controlData", data);
			// }
			rebuildPrivsSubFolder();
			return false;
		}
		panelPlugins.itemsChanged(true, pluginHomeDirectory.returnXML, pluginName);
	});

	_plugin.find("input[type='text'], textarea").bind("textchange", function(){
		if($(this).hasClass('permissionItem'))
		{
			rebuildPrivs();
			return false;
		}
		else if($(this).hasClass('permissionItemSubFolder'))
		{
			rebuildPrivsSubFolder();
			return false;
		}
		panelPlugins.itemsChanged(true, pluginHomeDirectory.returnXML, pluginName);
	});

	$("a.serverFilePickButton", _plugin).each(function(){
		$(this).unbind("click").click(function(){
			var curElem = $(this);
			var existingData = {};
			var relElem = $("#" + curElem.attr("rel"), _panel);
			var val;
			if(relElem.hasClass('maskPasswordOnURL')){
				val = relElem.data("originalURL") || relElem.val();
			}
			else{
				val = relElem.val();
			}
			existingData[curElem.attr("rel")] = val;
			curElem.crushFtpLocalFileBrowserPopup({
				type : curElem.attr("PickType") || 'dir',
				file_mode: curElem.attr("FileMode") || 'server',
				isFTPBrowse : true,
				existingVal: val,
				allowRootSelection: true,
				existingData : existingData,
				callback: function (selectedPath, ftpServerInfo) {
					$("#" + curElem.attr("rel"), _panel).val(ftpServerInfo.url).trigger("change");
					$("#" + curElem.attr("rel") + ".maskPasswordOnURL", _panel).trigger("applymask");
				}
			});
			return false;
		});
	});

	var homeDirSubFolders = $("#homeDirSubFolders", _panel);
	homeDirSubFolders.selectableAdvanced({
		select: function(event, ui) {
			var selected = $(ui.selection);
			selected.parent().find(".ui-state-highlight").removeClass("ui-state-highlight");
			selected.parent().find(".ui-state-highlight, .ui-selected, .ui-widget-header, .ui-state-highlight, .ui-state-focus, .ui-state-active").removeClass("ui-state-highlight ui-selected ui-widget-header ui-state-highlight ui-state-focus ui-state-active");
			selected.addClass('ui-selected ui-widget-header');
			pluginHomeDirectory.showSubFolderPrivs();
			return false;
		},
		change: function(event, ui) {
			var selected = $(ui.selection).filter(":last");
			selected.parent().find(".ui-state-highlight, .ui-selected, .ui-widget-header, .ui-state-highlight, .ui-state-focus, .ui-state-active").removeClass("ui-state-highlight ui-selected ui-widget-header ui-state-highlight ui-state-focus ui-state-active");
			selected.addClass('ui-selected ui-widget-header');
			return false;
		},
		remove : function(event, ui) {
			$("a#removeSubFolder", _panel).click();
			return false;
		}
	});

	$('input[id$="privs_quota"]').each(function(){
		$(this).unbind('textchange.quota custom-change change').bind('textchange.quota custom-change change', function(event) {
			if($(this).val()){
				$(this).closest("fieldset").find('input[id$="privs_real_quota"]').attr("checked", "checked").attr("readonly", "readonly").closest("span").find("span").find("span").addClass("ui-icon ui-icon-check");
			}
			else{
				$(this).closest("fieldset").find('input[id$="privs_real_quota"]').removeAttr("readonly");
			}
		});
	});

	var notAllowedCharsInDirName = ":&#?<>";
	$("a#addNewSubFolder", _panel).click(function(evt){
		jPrompt("Enter Folder Name :", "untitled", "Input", function(value){
			if(value)
			{
				value = $.trim(value);
				if(homeDirSubFolders.find("li[rel='"+value.toLowerCase()+"']").length>0)
				{
					jAlert("Folder exists", "Choose another folder name", function(){
						$("a#addNewSubFolder", _panel).click();
					});
				}
				else if(crushFTP.methods.hasSpecialCharacters(value, notAllowedCharsInDirName))
                {
                    jAlert("You can not use these characters in folder name : \"" + notAllowedCharsInDirName + "\"", "Invalid name", function(){
                        $("a#addNewSubFolder", _panel).click();
                    });
                    return false;
                }
				else
				{
					var newControl = $('<li class="ui-widget-content" rel="'+value.toLowerCase()+'">' + value + '</li>');
					var data = {name : value};
					newControl.data("controlData", data);
					homeDirSubFolders.append(newControl);
					if(newControl)
					{
						newControl.addClass("ui-widget-content ui-selectable-item");
						homeDirSubFolders.selectableAdvanced("refresh");
						itemsChanged(true);
						panelPlugins.itemsChanged(true);
					}
				}
			}
		});
		return false;
	});

	$("a#editSubFolder", _panel).click(function(){
		var item = homeDirSubFolders.find("li.ui-selected");
		if(!item || item.length==0)return;
		var data = item.data("controlData");
		if(data)
		{
			var name = data["name"];
			jPrompt("Enter Folder Name :", name, "Input", function(value){
				if(value)
				{
					value = $.trim(value);
					if(value != name && homeDirSubFolders.find("li[rel='"+value.toLowerCase()+"']").length>0)
					{
						jAlert("Folder exists", "Choose another folder name", function(){
							$("a#editSubFolder", _panel).click();
						});
					}
					else if(crushFTP.methods.hasSpecialCharacters(value, notAllowedCharsInDirName))
		            {
		                jAlert("You can not use these characters in folder name : \"" + notAllowedCharsInDirName + "\"", "Invalid name", function(){
		                    $("a#editSubFolder", _panel).click();
		                });
		                return false;
		            }
					else
					{
						data.name = value;
						item.attr("rel", value.toLowerCase());
						item.text(value);
						item.data("controlData", data);
						homeDirSubFolders.selectableAdvanced("refresh");
						itemsChanged(true);
						panelPlugins.itemsChanged(true);
					}
				}
			});
			itemsChanged(true);
			panelPlugins.itemsChanged(true);
		}
		return false;
	});

	$("a#removeSubFolder", _panel).click(function(){
		var item = homeDirSubFolders.find("li.ui-selected");
		if(!item || item.length==0)return false;
		var data = item.data("controlData");
		if(data)
		{
			var name = data["name"];
			jConfirm("Are you sure you wish to remove folder : " + name, "Confirm", function(val){
				if(val)
				{
					item.remove();
					homeDirSubFolders.selectableAdvanced("refresh");
					pluginHomeDirectory.showSubFolderPrivs();
					itemsChanged(true);
					panelPlugins.itemsChanged(true);
				}
			});
		}
		return false;
	});
	_panel.find(".maskPasswordOnURL").each(function(){
		$(this).unbind("blur.form").bind("blur.form", function(){
			$(this).trigger("applymask");
        }).unbind("applymask").bind("applymask", function(){
        	var elem = $(this);
        	var value = $(this).val();
            var url = value;
            try{
                url = URI(value);
            }catch(ex){
                url = URI(encodeURI(value));
            }
            if(url && elem.val().substr(8, 1) != ":")
            {
                var pass = url.password();
                var mask = false;
                var existingPass = elem.data("password");
                if(pass != existingPass)
                {
                    if(existingPass)
                    {
                        mask = new Array(existingPass.length+1).join('*');
                    }
                    if(existingPass && pass == mask)
                        pass = existingPass;
                    else
                        mask = new Array(pass.length+1).join('*');
                    if(pass)
                    {
                        elem.data("password", pass);
                        elem.data("url", value);
                        url.password(mask);
                        var _val = url.toString();
                        // if(value.length!=unescape(_val).length)
                        //     _val = _val.substr(0, _val.length-1);
                        elem.val(unescape(_val));
                    }
                }
                else
                {
                    pass = existingPass;
                    mask = new Array(pass.length+1).join('*');
                    url.password(mask);
                    var _val = url.toString();
                    // if(value.length!=unescape(_val).length)
                    //     _val = _val.substr(0, _val.length-1);
                    elem.val(unescape(_val));
                }
                url.password(pass);
                var _val = url.toString();
                // if(value.length!=unescape(_val).length){
                //     _val = _val.substr(0, _val.length-1);
                // }
                elem.data("originalURL", _val);
            }
        });
	});
	this.eventAdded = true;
}

pluginHomeDirectory.bindPluginDetails = function(controlData)
{
	var inputs = _plugin.find("input.ignoreBind,select.ignoreBind,textarea.ignoreBind").removeClass("ignoreBind");
	bindValuesFromXML(_plugin, controlData);
	if(controlData.subItem && controlData.subItem.length>0)
		_plugin.attr("subPluginName", controlData.subItem[0].text || "");
	inputs.addClass("ignoreBind");
	var permissionsInput = $("#permissions", _plugin);
	var permissionsInputVal = permissionsInput.val();
	if(permissionsInputVal)
	{
		var actionItems = permissionsInputVal.split("(");
		var filteredItems = [];
		for (var i = 0; i < actionItems.length; i++) {
			var curAction = actionItems[i];
			if(curAction && curAction.length>0)
			{
				curAction = curAction.replace("(","").replace(")","");
				filteredItems.push(curAction);
			}
		};
		var advancedPrivs = {
			sync : {},
			encryption : {}
		};
		if(filteredItems.length>0)
		{
			for (var i = 0; i < filteredItems.length; i++) {
				var curItem = filteredItems[i];
				if(curItem.indexOf("sync")==0)
				{
					var info = curItem.split("=");
					advancedPrivs.sync[info[0]] = info[1];
				}
				else if(curItem.indexOf("pgp")==0)
				{
					var info = curItem.split("=");
					advancedPrivs.encryption[info[0]] = info[1];
				}
				else if(curItem.indexOf("quota")==0)
				{
					var info = curItem.split("quota");
					if(crushFTP.methods.isNumeric(info[1]))
					{
						var val = Math.round(info[1]/(1024*1024));
						$("#privs_quota", _plugin).val(val);
					}
				}
				else if(curItem.indexOf("comment")==0)
				{
					var info = curItem.replace("comment", "");
					$("#privs_comment", _plugin).val(unescape(info));
				}
				else
					crushFTP.UI.checkUnchekInput($("#privs_" + curItem, _plugin), true);
			};
			$("a#advancedPrivsOptions",_plugin).data("permissions", advancedPrivs);
		}
	}
	if(controlData.additional_paths && controlData.additional_paths.length>0 && controlData.additional_paths[0].text)
	{
		var additionalDirs = controlData.additional_paths[0].text.split("\n");
		var homeDirSubFolders = $("#homeDirSubFolders", _panel).empty();
		if(additionalDirs.length>0)
		{
			for (var i = 0; i < additionalDirs.length; i++) {
				var curDir = additionalDirs[i];
				if(curDir)
				{
					var name = curDir;
					var privs = "";
					if(curDir.indexOf(":")>0)
					{
						name = curDir.substr(0, curDir.lastIndexOf(":"));
						privs = curDir.substr(curDir.lastIndexOf(":")+1, curDir.length);
					}
					var newControl = $('<li class="ui-widget-content" rel="'+name.toLowerCase()+'">' + name + '</li>');
					var data = {name : name, privs : privs};
					newControl.data("controlData", data);
					homeDirSubFolders.append(newControl);
					if(newControl)
					{
						newControl.addClass("ui-widget-content ui-selectable-item");
						homeDirSubFolders.selectableAdvanced("refresh");
						itemsChanged(true);
						panelPlugins.itemsChanged(true);
					}
				}
			};
		}
		var item = homeDirSubFolders.find("li.ui-selected");
		if(!item || item.length==0)
		{
			$("#subfolderPrivs").hide().clearForm();
		}
	}
}

pluginHomeDirectory.saveContent = function(saveByIndex, cloneName, removeByIndex, callback)
{
	removeByIndex = removeByIndex || 0;
	if(pluginPlaceHolder.data("hasChanged") || removeByIndex>0 || (saveByIndex>0 && cloneName) || pluginHomeDirectory.returnXML)
	{
		if(!pluginHomeDirectory.returnXML)
			crushFTP.UI.showIndicator(false, false, "Please wait..");
		var xmlString = [];
		var container = _plugin;
		if(removeByIndex == 0)
		{
			xmlString.push("<plugins_subitem type=\"properties\">");
			xmlString.push("<version>"+$("#version", _plugin).text()+"</version>");
			xmlString.push("<pluginName>"+pluginName+"</pluginName>");
			var additionalDirs = [];
			$("#homeDirSubFolders").find("li").each(function(index, el) {
				var data = $(this).data("controlData");
				if(data)
				{
					var name = data.name;
					var privs = data.privs;
					if(!additionalDirs.has(name))
					{
						if(privs)
							additionalDirs.push(name+":"+privs);
						else
							additionalDirs.push(name);
					}
				}
			});
			if(additionalDirs.length>0)
			{
				xmlString.push("<additional_paths>"+crushFTP.methods.htmlEncode(additionalDirs.join("\n"))+"</additional_paths>");
			}
			else
			{
				xmlString.push("<additional_paths></additional_paths>");
			}
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

		if(pluginHomeDirectory.returnXML)
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