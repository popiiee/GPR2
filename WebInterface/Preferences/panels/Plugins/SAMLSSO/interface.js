/****************************
CrushFTP GUI Plugin custom js
*****************************/
/* Do not change these lines */
var pluginSAMLSSO = {};
pluginSAMLSSO.localization = {};
/****************************/

// Plugin details
var pluginName = "SAMLSSO";
var _plugin = $("#pnlPlugin" + pluginName);

// Localizations
pluginSAMLSSO.localization = {
	lblEnabledText : "Enabled",
	lblDebugText : "Debug",
	lblVersionText : "Version :",
	lblUsernameTemplateText : "Username to use as template (except directory access) : ",
	lblPermissionsText : "Directory Permissions : ",
	lblServerItemText : "Server Item : ",
	lblServerItemNoteText :  "You can specify which server item will use this plugin. Example 	lookup_21, or lookup_8080",
	lblHomeFolderLocationText : "Home folder location : ",
	btnBrowseText : "Browse",
	lblHomeFolderNoteText : "Username folder will be made in this location"
};

// Assign localizations
localizations.panels["Plugins"][pluginName] = $.extend(pluginSAMLSSO.localization, localizations.panels["Plugins"][pluginName]);

// Interface methods
pluginSAMLSSO.init = function(pluginID, returnXML){
	pluginSAMLSSO.returnXML = returnXML;
	applyLocalizations(pluginName, localizations.panels["Plugins"]);
	pluginSAMLSSO.bindData(0, pluginID);
	if(!$(document).data("crushftp_enterprise"))
	{
		$("#pluginSection", _panel).block({ message: null, overlayCSS: { opacity: 0.1, cursor: 'normal'} });
		$(".enterpriseFeatureTag", _plugin).show();
	}
	else
	{
		$(".enterpriseFeatureTag", _plugin).hide();
	}
	setTimeout(function(){
		placeHolder.removeData("hasChanged");
	}, 500)
}

pluginSAMLSSO.bindData = function(index, pluginID)
{
	index = index || 0;
	var pluginPrefs = [];
	pluginSAMLSSO.showServerList();
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
		if(typeof curPlugin.saml_decryption_cipher == "undefined")
			curPlugin.saml_decryption_cipher = [{text : "RSA"}];
		if(typeof curPlugin.saml_stream_cipher == "undefined")
			curPlugin.saml_stream_cipher = [{text : "AES/CBC/NoPadding"}];
		if(typeof curPlugin.name_id_format == "undefined")
			curPlugin.name_id_format = [{text : "unspecified"}];
		if(typeof curPlugin.create_local_user == "undefined")
			curPlugin.create_local_user = [{text : "false"}];
		if(typeof curPlugin.create_local_user_template == "undefined")
			curPlugin.create_local_user_template = [{text : ""}];
		pluginSAMLSSO.bindPluginDetails(curPlugin);
	}
	pluginSAMLSSO.loadedSubItem = index;
	pluginSAMLSSO.bindEvents(index);
	if($("#authenticationOnly", _plugin).is(":checked"))
	{
		$(".authenticationOnlyItems").hide();
		$(".authenticationOnlyItemsReverse").show();
	}
	else
	{
		$(".authenticationOnlyItems").show();
		$(".authenticationOnlyItemsReverse").hide();
	}
	if($("#useLocalDirectory", _plugin).is(":checked"))
	{
		$(".forLocalDirectory", _plugin).show();
	}
	else
	{
		$(".forLocalDirectory", _plugin).hide();
	}
	if($("#create_local_user").is(":checked"))
		$("#create_local_user_template").removeAttr("disabled").removeClass('ui-state-disabled');
	else
		$("#create_local_user_template").attr("disabled", "disabled").addClass('ui-state-disabled');
}

pluginSAMLSSO.editRoles = function(){
	var ldapRolesList = $("#ldap_roles", _plugin);
	var roles = "";
	ldapRolesList.find("li[role]").each(function(){
		if(roles.length>0)
			roles += "\n";
		roles += $(this).attr("role");
	});
	jPrompt("Map Roles (user : role) : ", roles, "Input :", function(val){
		if(val != null){
			val = $.trim(val);
			ldapRolesList.empty();
			var items = val.split("\n");
			for (var i = 0; i < items.length; i++) {
				var role = items[i];
				if(role)
				{
					var newControl = $("<li class='ui-widget-content' role='"+role+"'>" + role +"</li>");
					ldapRolesList.append(newControl);
					newControl.parent().find(".ui-widget-header").removeClass("ui-widget-header").removeClass("ui-selected");
					newControl.addClass("ui-widget-header").addClass("ui-selected");
				}
			}
			panelPlugins.itemsChanged(true, pluginSAMLSSO.returnXML, pluginName);
		}
	}, false, false, {
		isTextArea : true
	});
}

pluginSAMLSSO.bindEvents = function()
{
	if(this.eventAdded)return;
	var advancedPrivsOptions = $("a#advancedPrivsOptions",_plugin).click(function(event) {
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
			data.privs = items.join("");
			item.data("controlData", data);
		}
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

	var advancedPrivsOptionsSubFolder = $("a#advancedPrivsOptionsSubFolder", _plugin).click(function(event) {
		window.isAdvancedForSubFolder = true;
		panelPlugins.bindAdvancedPrivs($(this).data("permissions"));
		_panel.fieldAdvancedDialog.dialog("open");
		return false;
	});

	var permissionsInput = $("#permissions", _plugin);
	_plugin.find("input, select, textarea").bind("textchange", function(){

	});
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
		if($(this).is("#useLocalDirectory"))
		{
			if($(this).is(":checked"))
				$(this).closest("p").find(".forLocalDirectory").show();
			else
				$(this).closest("p").find(".forLocalDirectory").hide();
		}
		if($(this).is("#authenticationOnly"))
		{
			if($(this).is(":checked")){
				$(".authenticationOnlyItems").hide();
				$(".authenticationOnlyItemsReverse").show();
			}
			else{
				$(".authenticationOnlyItems").show();
				$(".authenticationOnlyItemsReverse").hide();
			}
		}
		else if($(this).is("#acl_permissions"))
		{
			if($(this).is(":checked"))
			{
				_plugin.find(".ntfsSettings").show();
				crushFTP.UI.checkUnchekInput($("#smb_permissions", _plugin), false);
			}
			else
				_plugin.find(".ntfsSettings").hide();
		}
		else if($(this).is("#smb_permissions"))
		{
			if($(this).is(":checked"))
			{
				_plugin.find(".ntfsSettings").hide();
				crushFTP.UI.checkUnchekInput($("#acl_permissions", _plugin), false);
			}
		}
		else if($(this).is("#create_local_user"))
		{
			if($(this).is(":checked"))
				$("#create_local_user_template").removeAttr("disabled").removeClass('ui-state-disabled').focus();
			else
				$("#create_local_user_template").attr("disabled", "disabled").addClass('ui-state-disabled');
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
		panelPlugins.itemsChanged(true, pluginSAMLSSO.returnXML, pluginName);
	});

	_plugin.find("input[type='text'], textarea").bind("textchange", function(){
		if($(this).hasClass('permissionItem'))
		{
			rebuildPrivs();
			//return false;
		}
		else if($(this).hasClass('permissionItemSubFolder'))
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
		}
		panelPlugins.itemsChanged(true, pluginSAMLSSO.returnXML, pluginName);
	});

	$("a.serverFilePickButton", _plugin).each(function(){
		$(this).unbind("click").click(function(){
			var curElem = $(this);
			curElem.crushFtpLocalFileBrowserPopup({
				type : curElem.attr("PickType") || 'dir',
				file_mode : curElem.attr("FileMode") || 'server',
				existingVal : $("#" + curElem.attr("rel"), _plugin).val(),
				callback : function(selectedPath){
					$("#" + curElem.attr("rel"), _plugin).val(selectedPath).trigger("change");
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
			pluginSAMLSSO.showSubFolderPrivs();
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
					pluginSAMLSSO.showSubFolderPrivs();
					itemsChanged(true);
					panelPlugins.itemsChanged(true);
				}
			});
		}
		return false;
	});
	$("a#testLogin, a#testSearch, a#testSearchRole", _plugin).click(function(){
		var link = $(this);
		if(link.attr("disabled")) return false;
		panelPlugins.pluginMethodCallSaveCallback = function(flag){
			if(flag)
			{
				var title = "";
				var obj = {
					command : "pluginMethodCall",
					method : link.attr("id"),
					pluginName : "SAMLSSO",
					pluginSubItem : pluginSAMLSSO.loadedSubItem == 0 ? "" : _plugin.attr("subPluginName"),
					username : $("#adminUsername", _panel).val()
				};
				if(obj.method == "testLogin")
				{
					obj.password = crushFTP.methods.htmlEncode($("#adminPassword", _panel).val());
					title = "Testing Login";
				}
				else if(obj.method == "testSearch")
				{
					title = "Testing Search";
				}
				else if(obj.method == "testSearchRole")
				{
					title = "Testing Search Role";
				}
				function initCall()
				{
					link.block({
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
						link.unblock().removeAttr("disabled");
						crushFTP.UI.growl(title, decodeURIComponent($(msg).text()), false, false);
					});
				}
				if(obj.method == "testSearch"  || obj.method == "testSearchRole")
				{
					jPrompt("Enter test username:", "", "Test Search", function(val){
						if(val)
						{
							obj.username = val;
							initCall();
						}
					});
				}
				else
				{
					initCall();
				}
			}
		};
		if(pluginPlaceHolder.data("hasChanged"))
			$("#saveContent", _panel).trigger("click");
		else
		{
			panelPlugins.pluginMethodCallSaveCallback(true);
			panelPlugins.pluginMethodCallSaveCallback = false;
		}
		return false;
	});

	$("a.serverFilePickButton", _plugin).each(function(){
		$(this).unbind("click").click(function(){
			var curElem = $(this);
			curElem.crushFtpLocalFileBrowserPopup({
				type : curElem.attr("PickType") || 'dir',
				file_mode : curElem.attr("FileMode") || 'server',
				existingVal : $("#" + curElem.attr("rel"), _plugin).val(),
				callback : function(selectedPath){
					$("#" + curElem.attr("rel"), _plugin).val(selectedPath).trigger("change");
				}
			});
			return false;
		});
	});

	$("a.rolePickButton", _plugin).each(function(){
		$(this).unbind("click").click(function(){
			var curElem = $(this);
			curElem.crushFtpVFSBrowserPopup({
				type : "any",
				existingVal : $("#" + curElem.attr("rel"), _plugin).val(),
				roleBrowse : true,
				roleObj : {
					command : "pluginMethodCall",
					method : "testBrowseTree",
					pluginName : "SAMLSSO",
					pluginSubItem : pluginSAMLSSO.loadedSubItem == 0 ? "" : _plugin.attr("subPluginName")
				},
				callback : function(selectedPath){
					$("#" + curElem.attr("rel"), _plugin).val(selectedPath).trigger("change");
				}
			});
			return false;
		});
	});

	var ldapRolesList = $("#ldap_roles", _plugin);
	ldapRolesList.selectable({
		selected: function(event, ui) {
			var selected = $(ui.selected);
			ldapRolesList.find(".ui-widget-header").removeClass("ui-widget-header");
			selected.addClass("ui-widget-header");
			return false;
		}
	});

	$("a#removeRole", _plugin).click(function(){
		crushFTP.UI.removeItem(ldapRolesList, function(selected){
			panelPlugins.itemsChanged(true, pluginSAMLSSO.returnXML, pluginName);
		});
		return false;
	});

	$("a#addNewRole", _plugin).click(function(evt, control){
		if(evt.altKey)
		{
			pluginSAMLSSO.editRoles();
			return false;
		}
		var role = "";
		if(control)
		{
			role = control.attr("role");
		}
		var appendHTML = "<div style='margin:5px 0px;'>Template Username : <br> <input style='margin:5px 0px;width:200px;' id='templateUsernameForRole' class='extraItem' type='text' value='' /></div>";
		if(role.length>0)
		{
			var _temp = role.split(":");
			if(_temp && _temp.length > 1)
			{
				role = $.trim(_temp[0]);
				appendHTML = "<div style='margin:5px 0px;'>Template Username : <br> <input style='margin:5px 0px;width:200px;' id='templateUsernameForRole' class='extraItem' type='text' value='"+ $.trim(_temp[1]) +"' /></div>";
			}
		}
		jPrompt("Enter LDAP role :", role, "Input", function(value, key, username){
			role = value;
			if(role!=null)
			{
				if(role.length == 0)
				{
					$("#addNewRole", _panel).trigger("click");
					return;
				}
				else
				{
					if(username && username.length>0)
					{
						role += " : " + username;
					}
				}
				if(control)
				{
					control.text(role).attr("role", role);
				}
				else
				{
					var newControl = $("<li class='ui-widget-content' role='"+role+"'>" + role +"</li>");
					ldapRolesList.append(newControl);
					newControl.parent().find(".ui-widget-header").removeClass("ui-widget-header").removeClass("ui-selected");
					newControl.addClass("ui-widget-header").addClass("ui-selected");
				}
				panelPlugins.itemsChanged(true, pluginSAMLSSO.returnXML, pluginName);
			}
		}, false, false, {isWideTextBox:true, appendAfterInput : appendHTML});
		return false;
	});

	$("a#editRole", _plugin).click(function(evt){
		if(evt.altKey)
		{
			pluginSAMLSSO.editRoles();
			return false;
		}
		if(ldapRolesList.find("li.ui-selected").length>0)
		{
			var selected = ldapRolesList.find("li.ui-selected");
			$("#addNewRole", _panel).trigger("click", [selected]);
		}
		return false;
	});

	$("a#moveRoleUp", _plugin).click(function(){
		if(ldapRolesList.find("li.ui-selected").length>0)
		{
			var selected = ldapRolesList.find("li.ui-selected");
			selected.prev().before(selected);
			panelPlugins.itemsChanged(true, pluginSAMLSSO.returnXML, pluginName);
		}
		return false;
	});

	$("a#moveRoleDown", _plugin).click(function(){
		if(ldapRolesList.find("li.ui-selected").length>0)
		{
			var selected = ldapRolesList.find("li.ui-selected");
			selected.next().after(selected);
			panelPlugins.itemsChanged(true, pluginSAMLSSO.returnXML, pluginName);
		}
		return false;
	});

	var keysMapping = $("#keysMapping", _plugin);
	keysMapping.selectable({
		selected: function(event, ui) {
			var selected = $(ui.selected);
			keysMapping.find(".ui-widget-header").removeClass("ui-widget-header");
			selected.addClass("ui-widget-header");
			return false;
		}
	});

	$("a#removeMapping", _plugin).click(function(){
		crushFTP.UI.removeItem(keysMapping, function(selected){
			panelPlugins.itemsChanged(true, pluginSAMLSSO.returnXML, pluginName);
		});
		return false;
	});

	$("a#addNewMapping", _plugin).click(function(evt, control){
			var mapping = "";
			if(control)
			{
				mapping = control.attr("mapping");
			}
			var appendHTML = "<div style='margin:5px 0px;'>CrushFTP Key : <br> <input style='margin:5px 0px;width:200px;' id='keyMappingValue' class='extraItem' type='text' value='' /></div>";
			if(mapping.length>0)
			{
				var _temp = mapping.split(":");
				if(_temp && _temp.length > 1)
				{
					mapping = $.trim(_temp[0]);
					appendHTML = "<div style='margin:5px 0px;'>CrushFTP Key : <br> <input style='margin:5px 0px;width:200px;' id='keyMappingValue' class='extraItem' type='text' value='"+ $.trim(_temp[1]) +"' /></div>";
				}
			}
			var notAllowedCharsInDirName = ":&#?<> ";
			jPrompt("LDAP Key :", mapping, "Input", function(value, key, username){
				mapping = value;
				if(mapping!=null)
				{
					mapping = $.trim(value);
					if(username)
						username = $.trim(username);
					//if(crushFTP.methods.hasSpecialCharacters(mapping, notAllowedCharsInDirName) || crushFTP.methods.hasSpecialCharacters(username, notAllowedCharsInDirName))
					//{
					//	alert("You can not have special characters in key-value mapping");
					//	$("#addNewMapping", _panel).trigger("click");
					//	return;
					//}
					if(mapping.length == 0)
					{
						$("#addNewMapping", _panel).trigger("click");
						return;
					}
					else
					{
						if(username && username.length>0)
						{
							mapping += " : " + username;
						}
					}
					if(control)
					{
						control.text(mapping).attr("mapping", mapping);
					}
					else
					{
						var newControl = $("<li class='ui-widget-content' mapping='"+mapping+"'>" + mapping +"</li>");
						keysMapping.append(newControl);
						newControl.parent().find(".ui-widget-header").removeClass("ui-widget-header").removeClass("ui-selected");
						newControl.addClass("ui-widget-header").addClass("ui-selected");
					}
					panelPlugins.itemsChanged(true, pluginSAMLSSO.returnXML, pluginName);
				}
			}, false, false, {isWideTextBox2:true, appendAfterInput : appendHTML});
		return false;
	});

	$("a#editMapping", _plugin).click(function(){
		if(keysMapping.find("li.ui-selected").length>0)
		{
			var selected = keysMapping.find("li.ui-selected");
			$("#addNewMapping", _panel).trigger("click", [selected]);
		}
		return false;
	});
	this.eventAdded = true;
};

pluginSAMLSSO.showSubFolderPrivs = function(){
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
			}
		}
	}
};

pluginSAMLSSO.bindPluginDetails = function(controlData)
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
			panelPlugins.bindAdvancedPrivs(advancedPrivs);
		}
	}
	var ldapRolesList = $("#ldap_roles", _plugin).empty();
	if(controlData && controlData["ldap_roles"])
	{
		var ldap_roles = controlData["ldap_roles"];
		if(ldap_roles.length>0)
		{
			ldap_roles = ldap_roles[0].text;
			if(ldap_roles)
			{
				ldap_roles = ldap_roles.split("\n");
				for(var i=0;i<ldap_roles.length;i++)
				{
					var curItem = ldap_roles[i];
					if(curItem)
					{
						curItem = $.trim(curItem);
						var newControl = $("<li class='ui-widget-content' role='"+curItem+"'>" + curItem +"</li>");
						ldapRolesList.append(newControl);
						newControl.data("controlData", curItem);
					}
				}
			}
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
	var keysMapping = $("#keysMapping", _panel).empty();
	if(controlData.key_mappings && controlData.key_mappings.length>0 && controlData.key_mappings[0].text)
	{
		var mappings = controlData.key_mappings[0].text.split("\n");
		if(mappings.length>0)
		{
			for (var i = 0; i < mappings.length; i++) {
				var curDir = mappings[i];
				if(curDir)
				{
					var newControl = $('<li class="ui-widget-content" mapping="'+curDir+'">' + curDir + '</li>');
					keysMapping.append(newControl);
					if(newControl)
					{
						newControl.addClass("ui-widget-content ui-selectable-item");
						keysMapping.selectableAdvanced("refresh");
					}
				}
			};
		}
	}
}

pluginSAMLSSO.showServerList = function()
{
	if(!this.serverListShown)
	{
		var service = common;
		if(pluginSAMLSSO.returnXML)
		{
			service = crushFTP;
		}
		var serverList = service.data.getSubValueFromPrefs("server_list");
		var serverPorts = $("#server_item", _plugin).empty();
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
		serverPorts.prepend("<option selected>All</option>");
		this.serverListShown = true;
	}
}

pluginSAMLSSO.saveContent = function(saveByIndex, cloneName, removeByIndex, callback, noGrowl)
{
	removeByIndex = removeByIndex || 0;
	if(pluginPlaceHolder.data("hasChanged") || removeByIndex>0 || (saveByIndex>0 && cloneName) || pluginSAMLSSO.returnXML)
	{
		if(!pluginSAMLSSO.returnXML)
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
					if(privs)
						additionalDirs.push(name+":"+privs);
					else
						additionalDirs.push(name);
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
			//
			var ldapRoles = $("#ldap_roles", container).find("li");
			if(ldapRoles.length>0)
			{
				xmlString.push("<ldap_roles>");
				ldapRoles.each(function(){
					xmlString.push(crushFTP.methods.htmlEncode($(this).attr("role")));
				});
				xmlString.push("</ldap_roles>");
			}
			else
			{
				xmlString.push("<ldap_roles></ldap_roles>");
			}
			var keysMappingItems = [];
			$("#keysMapping", _plugin).find("li").each(function(index, el) {
				var data = $(this).attr("mapping");
				if(data)
				{
					keysMappingItems.push(data);
				}
			});
			if(keysMappingItems.length>0)
			{
				xmlString.push("<key_mappings>"+crushFTP.methods.htmlEncode(keysMappingItems.join("\n"))+"</key_mappings>");
			}
			else
			{
				xmlString.push("<key_mappings></key_mappings>");
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

		if(pluginSAMLSSO.returnXML)
			return formSubItem;

		var action = removeByIndex == 0 ? "change" : "remove";
		var index = window.currentPluginIndex;
		var subItemIndex = removeByIndex == 0 ? saveByIndex || this.subItem : removeByIndex;
		subItemIndex = subItemIndex || 0;
		var removeChangeFlag = (saveByIndex>0 && cloneName);
		panelPlugins.savePluginContentProcess(action, formSubItem, index, subItemIndex, removeChangeFlag, callback, noGrowl);
	}
	else
	{
		if(!noGrowl)
			crushFTP.UI.growl("No changes made", "", false, 3000);
		else
			callback(true);
	}
}