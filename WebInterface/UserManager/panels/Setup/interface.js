/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelSetup = {};
panelSetup.localization = {};
/****************************/

// Panel details
var panelName = "Setup";

// Localizations
panelSetup.localization = {
};

// Assign localizations
localizations.panels[panelName] = $.extend(panelSetup.localization, localizations.panels[panelName]);

// Interface methods
panelSetup.init = function(){
	panelSetup.serverDirSelectList = $("#serverDirSelectList", panelSetup._panel);
	panelSetup.serverDirBrowsePanel = $("#serverDirBrowsePanel", panelSetup._panel);
	panelSetup.userDirSelectList = $("#userDirSelectList", panelSetup._panel);
	panelSetup.vfsItemsDirList = $("#vfsItems", panelSetup._panel);
	panelSetup.vfsItemOperations = $("#vfsItemOperations", panelSetup._panel);
	panelSetup.serverItemOperations = $("#serverItemOperations", panelSetup._panel);

	applyLocalizations(panelName, localizations.panels);
	window.dataBindEvents.push(panelSetup.bindData);
	panelSetup.bindEvents();
	if(userManager.onlyVFS)
		$("#VFSOnlyButtons").show();
}

function fixChars(val)
{
    return val.replace(/@/g,"{at}").replace(/:/g,"{colon}").replace(/&/g,"{amp}").replace(/\?/g,"{question}").replace(/\//g,"{slash}").replace(/\\/g,"{backslash}").replace(/#/g,"{hash}").replace(/>/g,"%3E").replace(/</g,"%3C");
}

panelSetup.clearForm = function(panel)
{
	panel = panel || panelSetup._panel;
	panel.find("input, select, textarea").each(function(){
		if($(this).attr("id") != "serverDirSelectList" && !$(this).hasClass("ui-autocomplete-input"))
		{
			if($(this).attr("type")=="checkbox")
			{
				if($(this).closest("td").is(".checkboxArea"))return;
				crushFTP.UI.checkUnchekInput($(this));
			}
			else
			{
				$(this).val("");
			}
		}
	});
}

panelSetup.bindData = function(userInfo, jsonDeep, panel)
{
	panelSetup.serverDirSelectList.empty().append("<option>/</option>");
	panelSetup.userDirSelectList.empty().append("<option>/</option>");
	panelSetup.vfsItemsDirList.removeData('records');
	$('#expiredLabel').hide();
	if(userInfo && userInfo.user && userInfo.user.account_expire)
	{
		setTimeout(function(){
			var accExpDate = new Date(userInfo.user.account_expire).getTime();
			if(userManager.methods.getServerTime && typeof userManager.methods.getServerTime == "function"){
				userManager.methods.getServerTime(function(time){
					var curTime = time.getTime();
					if(accExpDate < curTime){
						$('#expiredLabel').show();
					}
				});
			}
		}, 100);
	}
	if(!$(document).data("crushftp_enterprise"))
	{
		$("#item_option_itemType").find("option[value='rfile']").remove();
	}
	if(crushFTP.storage("userName") && crushFTP.storage("userName").toLowerCase() == "default")
	{
		$("#vfsItemsListingAndOptions", panelSetup._panel).addClass("notInheritable").find("td.checkboxArea").addClass("noInherit");
		$("#accountDetailsAndOptions", panelSetup._panel).block({ message: "Can not be changed for default user.", overlayCSS: { opacity: 0.2, cursor: 'normal'},css: {
			border: 'none',
			backgroundColor: 'transparent',
			color: 'rgb(77, 73, 73)',
			'text-align':'center',
			'font-weight' : 'normal',
			opacity : 0.8,
			width : '100%',
			cursor : 'normal'
		}});
	}
	else
	{
		$("#vfsItemsListingAndOptions", panelSetup._panel).removeClass("notInheritable").find("td.checkboxArea").removeClass("noInherit");
		$("#accountDetailsAndOptions", panelSetup._panel).unblock();
	}

	panelSetup.buildDirPrivs();
	var dataPanel = panel || panelSetup._panel;
	panelSetup.clearForm(dataPanel);
	if(panel)
	{
		panel.removeClass("inheritValSet");
	}
	if(userInfo.user)
	{
		var saltField = $("#salt", panelSetup._panel);
		var saltGenerated = false;
		if(userInfo.user.salt && userInfo.user.salt.split("|||").length>1 && userInfo.user.salt.split("|||")[0] == "random" && crushFTP.storage("userName") && crushFTP.storage("userName").toLowerCase() !== "default")
		{
			if(userInfo.user.password && !userInfo.user.password.startsWithArray(["MD5:","SHA:","SHA512:","SHA256:","SHA3:","MD4:","BCRYPT:","MD5CRYPT:"]))
			{
				var pass = panelSetup.generatePasswordUsingPrefs();
				userInfo.user.salt = pass;
				saltGenerated = true;
			}
		}

		if(userInfo.user.salt && userInfo.user.salt != "random")
		{
			$("#warningTextSalt", panelSetup._panel).show();
		}
		else
		{
			$("#warningTextSalt", panelSetup._panel).hide();
		}

		if(!panel)
		{
			saltField.removeAttr("_val").unbind("textchange.custom");
			if(userInfo.user.salt){
				saltField.attr("_val", userInfo.user.salt);
				saltField.bind("textchange.custom", function(){
					jConfirm("Changing the salt will invalidate the password and you will need to re-enter the password.<br> Are you sure you want to change salt?", "Confirm", function(value){
						if(!value)
						{
							saltField.val(saltField.attr("_val"));
						}
						else
						{
							saltField.removeAttr("_val").unbind("textchange.custom");
						}
					});
				});
			}
		}
		userInfo.user.crush_value1 = userInfo.user.user_name;
		userInfo.user.crush_value2 = userInfo.user.password;
		userManager.data.bindValuesFromJson(dataPanel, userInfo.user, false, panel);
		var dataInheritedFrom = false;
		var curData = userManager.methods.seperateValueAndInheritValue(crushFTP.data.getValueFromJson(userInfo.user, "max_logins"));
		var curVal = curData.value;
		dataInheritedFrom = curData.inherit || dataInheritedFrom;
		var chkAccount_enabled = $("#account_enabled", dataPanel);
		crushFTP.UI.checkUnchekInput(chkAccount_enabled, parseInt(curVal)>=0);
		var username = $("#crush_value1", dataPanel);
		var password = $("#crush_value2", dataPanel);
		if(username.length>0 && password.length>0)
		{
			username = username.val().toLowerCase();
			password.removeClass("ignoreBlank");
			if(userManager.usernamesToIgnorePasswordValidation.has(username))
			{
				password.attr("valtype", "").validateNow();
			}
			else
			{
				if($(document).data("GUIXMLPrefs") && $(document).data("GUIXMLPrefs").blank_passwords && $(document).data("GUIXMLPrefs").blank_passwords == "false")
				{
					password.addClass("ignoreBlank").attr("valtype", "userPass").validateNow();
				}
				else
				{
					password.attr("valtype", "userPass");
				}
			}
		}
		$("#email", dataPanel).closest("fieldset").removeClass("inheritSet");
		userManager.data.setInheritPropertyOfSection($("#email", dataPanel), "email", !panel);

		if(saltGenerated)
		{
			crushFTP.UI.checkUnchekInput(saltField.closest("table").find("input[type='checkbox']"), true);
			saltField.closest("table").find("input[type='checkbox']").trigger("change");
		}

		if(userInfo.user.otp_auth && userInfo.user.otp_auth === "true")
		{
			panelSetup._panel.find("#two-factor-protocols").show();
			var twoFactorProtocols = panelSetup._panel.find("#two-factor-protocols");
			var allChecked = true;
			twoFactorProtocols.find("input:not('#otp_auth_all')").each(function(){
				if(!$(this).is(":checked"))
					allChecked = false;
			});
			if(allChecked){
				crushFTP.UI.checkUnchekInput($('#otp_auth_all', panelSetup._panel), true);
				$('#otp_auth_all', panelSetup._panel).change();
			}

		}
	}

	var vfsLinks = $("#vfsLinks", dataPanel).empty();
	if(userInfo.user.linked_vfs)
	{
		userManager.UI.multiOptionControlDataBind(userInfo.user
		, "linked_vfs"
		, vfsLinks
		, function(curItem){
				var vfsLink = crushFTP.methods.decodeXML(curItem);
				if(vfsLink && vfsLink.length>0 && vfsLink != "null")
					return $("<li class='ui-widget-content' link='" + vfsLink + "'>"+vfsLink+"</li>");
				else
					return false;
			}
		, !panel);
	}

	var editSelectedVFSLink = $("#editSelectedVFSLink").unbind().click(function(){
		var selectedVFS = $("#vfsLinks").find("li.ui-widget-header");
		if(selectedVFS.length==0)
		{
			return false;
		}
		else
		{
			if(selectedVFS.attr("link"))
			{
				panelSetup.editVFSUser = selectedVFS.attr("link");
				$("#editUserVFSFramePopup").dialog("open");
			}
		}
		return false;
	});

	var vfsItemButtons = $("#vfsItemButtons");
	vfsItemButtons.removeData("extraVfsLinks");
	vfsItemButtons.find(".vfsBtn").remove();
	if(userInfo.user.extra_vfs)
	{
		if(userInfo.user.extraVFSLinks){
			vfsItemButtons.data("extraVfsLinks", userInfo.user.extraVFSLinks);
		}
		crushFTP.methods.rebuildSubItems(userInfo.user.extra_vfs, "extra_vfs");
		if(userInfo.user.extra_vfs && userInfo.user.extra_vfs.extra_vfs_subitem)
		{
			var pnlEnabled = panelSetup._panel.find("#vfsCheckBox").find("input:checked").length>0;
			if(pnlEnabled && !userInfo.user.extra_vfs.inheritedFrom)
			{
				var subItms = userInfo.user.extra_vfs.extra_vfs_subitem;
				if(subItms && subItms.length>0)
				{
					for(var i=0;i<subItms.length;i++)
					{
						var name = subItms[i];
						var btn = $('<li class="ui-state-default ui-corner-top vfsBtn" _name="'+escape(name)+'"><a href="#vfs-'+escape(name)+'">'+name+'</a><span class="ui-icon ui-icon-close pointer" role="presentation" style="float:right;">Remove Tab</span></li>');
						vfsItemButtons.find("#addNewBtn").before(btn);
						btn.data("controlData", name);
					}
				}
			}
			else if(!pnlEnabled && userInfo.user.extra_vfs.inheritedFrom)
			{
				var subItms = userInfo.user.extra_vfs.extra_vfs_subitem;
				if(subItms && subItms.length>0)
				{
					for(var i=0;i<subItms.length;i++)
					{
						var name = subItms[i];
						var btn = $('<li class="ui-state-default ui-corner-top vfsBtn" _name="'+escape(name)+'"><a href="#vfs-'+escape(name)+'">'+name+'</a><span class="ui-icon ui-icon-close pointer" role="presentation" style="float:right;">Remove Tab</span></li>');
						vfsItemButtons.find("#addNewBtn").before(btn);
						btn.data("controlData", name);
					}
				}
			}
		}
	}

	if(!panel)
	{
		userManager.data.setInheritPropertyOfSection(vfsLinks, "linked_vfs", true);
		var dataInheritedFrom = false;
		var dataInheritedFrom = crushFTP.data.getValueFromJson(userInfo.user, "linked_vfs").inheritedFrom || "default";
		userManager.methods.showInheritValueLabel(vfsLinks, dataInheritedFrom);

		var vfsItemList = $("#vfsItemList", dataPanel);
		var vfsItemsListingAndOptions = $("#vfsItemsListingAndOptions", dataPanel).removeClass("inheritSet").removeAttr('inheritedFrom');
		userManager.data.setInheritPropertyOfSection(vfsItemList, "root_dir", true, userInfo.user);
		vfsItemsListingAndOptions.find("td.checkboxArea").find("input").trigger("change");
	}
	if(dataPanel.find("#serverDirSelectList").length>0)
	{
		panelSetup.serverDirSelectList.trigger("change.local");
	}
	userManager.UI.panelsPostbindEvent(dataPanel);
	if(crushFTP.storage("userName") && crushFTP.storage("userName").toLowerCase() == "default")
	{
		$("#vfsItemsListingAndOptions", panelSetup._panel).unblock();
	}
	var itemProperty_option_use_dmz = $("#itemProperty_option_use_dmz").empty();
	$("#mainServerInstance").find("option").each(function(){
		if($(this).text().toLowerCase() != "main")
			itemProperty_option_use_dmz.append("<option value='"+$(this).text()+"'>"+$(this).text()+"</option>");
	});
	itemProperty_option_use_dmz.prepend("<option value='true'>Any</option>");
	itemProperty_option_use_dmz.prepend("<option value='false' selected>No</option>");
	itemProperty_option_use_dmz.append("<option value='false' _rel='custom'>Custom</option>");

	crushFTP.UI.showLoadingIndicator(true);
	setTimeout(function(){
		crushFTP.UI.hideLoadingIndicator(true);
		if(vfsItemButtons.data("extraVfsLinks"))
		{
			vfsItemButtons.find(".vfsBtn > a").addClass("clicking");
			crushFTP.UI.showLoadingIndicator(true);
			function clickItem(){
				if(vfsItemButtons.find(".clicking:first").length>0)
				{
					vfsItemButtons.find(".clicking:first").removeClass('clicking').trigger("click", [function(){
						clickItem();
					}]);
				}
				else{
					crushFTP.UI.hideLoadingIndicator(true);
					$("#vfsItemButtons").find(".vfsBtnDefault > a").click();
				}
			};
			clickItem();
		}
	}, 500);
}

panelSetup.revealPassEvent = function(){
	var newUserPass = $(document).data("newUserPass");
	if(newUserPass){
		$(document).removeData("newUserPass");
		$("#crush_value2", panelSetup._panel).val(newUserPass);
	}
	$("#revealPassword", panelSetup._panel).unbind("dblclick").bind("dblclick", function(){
		var pass = newUserPass || $("#crush_value2", panelSetup._panel).val();
		jAlert("<div style='word-wrap:break-word;'>Selected password is : " + crushFTP.methods.textEncode(pass) + "</div>", "Password");
	});
}

panelSetup.bindMiniURLs = function (miniURLs, sortBy, sortType) {
    if (miniURLs) {
        var formMiniURLsList = $("#miniURLs", panelSetup.miniURLsDialog);
        var selected = formMiniURLsList.find(".ui-widget-header").index();
        formMiniURLsList.empty();
        sortBy = sortBy || $("#miniURLSortLinks").find("a.desc, a.asc").attr("rel") || "user";
        if (!sortType)
        {
            sortType = $("#miniURLSortLinks").find("a.desc").length > 0 ? "desc" : "asc";
        }
        function sortData() {
            miniURLs = miniURLs.sort(function (a, b) {
                return (
                    a[sortBy] > b[sortBy]) ? 1 :((b[sortBy] > a[sortBy]) ? -1 : 0);
            });
            if (sortType == "desc")
                miniURLs = miniURLs.reverse();
        }
        sortData();
        for (var i = 0; i < miniURLs.length; i++) {
            var curItem = miniURLs[i];
            if (curItem) {
                var key = curItem.key;
                var user = curItem.user;
                var redirect = curItem.redirect;
                var expires = curItem.expire || "-";
                if (key != "null") {
                    var newControl = $("<li class='ui-widget-content' key='" + key + "'>" + key + " --> " + redirect + "<span class='copy-link' style='float:right;'> <span style='display:inline-block;position:relative;top:3px;' class='ui-icon ui-icon-copy'></span>Copy Link</span> <span style='float:right;'> <span style='display:inline-block;position:relative;top:3px;' class='ui-icon ui-icon-calendar'></span> "+expires+" </span></li>");
                    formMiniURLsList.append(newControl);
                    newControl.data("controlData", curItem);
                }
            }
        }
        formMiniURLsList.find("span.copy-link").unbind().click(function(){
        	var serverURL = $("#serverURLforMiniURL").val();
        	if(!serverURL)
    		{
    			alert("Please enter server URL to continue.");
    			$("#serverURLforMiniURL").focus();
    			return false;
    		}
        	var liItem = $(this).closest("li").data("controlData");
    		if(!serverURL.endsWith('/'))
    			serverURL = serverURL + "/";
    		jPrompt("URL", serverURL + liItem.key, "Copy", false, false, false, {
	            hideCancelButton: true
	        });
        	return false;
        });
    }
}

panelSetup.bindEvents = function(callBack)
{
	userManager.UI.togglePanels(panelSetup._panel);
	panelSetup.revealPassEvent();
	panelSetup.serverDirSelectList.combobox();
	function continueVFSAddProcess(callBack)
	{
		var name = $.trim($("#itemProperty_option_name_static", fieldPropertiesDialog).val());
		var newName = $.trim($("#itemProperty_option_name", fieldPropertiesDialog).val());
		if(!newName || newName.length==0)
		{
			jAlert("Item name is required", "Enter name", function(){
				$("#itemProperty_option_name", fieldPropertiesDialog).focus();
			});
			return false;
		}
		var url = unescape($("#itemProperty_option_url", fieldPropertiesDialog).val());
		if($("#itemProperty_option_url", fieldPropertiesDialog).data("url"))
			url = $("#itemProperty_option_url", fieldPropertiesDialog).data("url");
		var curItemData = fieldPropertiesDialog.data("curItemData");
		if(curItemData && curItemData.type.toLowerCase()=="file")
		{
			$("#itemProperty_option_url", fieldPropertiesDialog).val(url);
		}
		else
		{
			if(url.lastIndexOf("/") != url.length - 1)
			{
				url = url + "/";
				$("#itemProperty_option_url", fieldPropertiesDialog).val(url);
			}
		}
		var expireDate = $("#vfs_expire", fieldPropertiesDialog).val();
		$("#item_option_itemType", fieldPropertiesDialog).trigger("change");
		if(crushFTP.methods.hasSpecialCharacters(newName, userManager.notAllowedCharsInDirName))
		{
			jAlert("You can not use these characters in name : \"" + userManager.notAllowedCharsInDirName + "\"", "Invalid name", function(){
				$("#itemProperty_option_name", fieldPropertiesDialog).focus();
			});
			return false;
		}
		if(expireDate && expireDate.length>0)
		{
			if(crushFTP.methods.isDateTime(expireDate).length>0)
			{
				jAlert("Please enter expiry date in valid format", "Invalid expire date", function(){
					$("#vfs_expire", fieldPropertiesDialog).focus();
				});
				return false;
			}
		}
		var toCompare = $.trim(newName).toLowerCase();
		var hasmatch = false;
		panelSetup.vfsItemsDirList.find("li").each(function(){
			var path = unescape($.trim($(this).attr("path"))).toLowerCase();
			if(toCompare == path && path != $.trim(name).toLowerCase())
				hasmatch = true;
		});
		function addItem(){
			var protocolSelected = $("#item_option_itemType", fieldPropertiesDialog).val();
			var as2Selected = protocolSelected == "custom";
			var excludeItems = fieldPropertiesDialog.find("*[_name*='as2']");
			if(!as2Selected)
			{
				excludeItems = excludeItems.addClass("excludeXML");
			}
			var S3Selected = (protocolSelected == "s3" || protocolSelected == "s3crush");
			if(S3Selected)
			{
				fieldPropertiesDialog.find(".privateOptions").find("input").addClass("excludeXML");
				fieldPropertiesDialog.find("*[name*='s3'], input[name='server_side_encrypt'], input[name='server_side_encrypt_kms']").removeClass("excludeXML");
				fieldPropertiesDialog.find("*[name*='s3'].neverInclude").addClass('excludeXML');
			}
			else
			{
				fieldPropertiesDialog.find("*[name*='s3'], input[name='server_side_encrypt'], input[name='server_side_encrypt_kms']").addClass("excludeXML");
				fieldPropertiesDialog.find(".privateOptions").find("input").removeClass("excludeXML");
			}
			if(protocolSelected == "s3crush")
			{
				fieldPropertiesDialog.find("input[name='random_id'], input[name='segmented'], input[name='multithreaded_s3'], input[name='s3_stat_head_calls'], input[name='s3_stat_head_calls_double']").removeClass("excludeXML");
			}
			var GdriveSelected = protocolSelected == "gdrive";
			if(GdriveSelected)
			{
				fieldPropertiesDialog.find(".privateOptions").find("input").addClass("excludeXML");
				fieldPropertiesDialog.find("*[name*='gdrive']").removeClass("excludeXML");
			}
			else
			{
				fieldPropertiesDialog.find("*[name*='gdrive']").addClass("excludeXML");
				fieldPropertiesDialog.find(".privateOptions").find("input").removeClass("excludeXML");
			}
			var citrixSelected = protocolSelected == "citrix";
			if(citrixSelected)
			{
				fieldPropertiesDialog.find("#itemProperty_option_client_id, #itemProperty_option_client_secret").removeClass("excludeXML");
			}
			var SSLOptionSelected = protocolSelected == "ftps" || protocolSelected == "ftpes" || protocolSelected == "https" || protocolSelected == "webdavs";
			var ftpSelected = protocolSelected == "ftp";
			if(SSLOptionSelected || (ftpSelected && $("#itemProperty_option_ftpEncryption", fieldPropertiesDialog).val() == "true"))
			{
				fieldPropertiesDialog.find(".SSLOptions").find("input").removeClass("excludeXML");
			}
			else
			{
				fieldPropertiesDialog.find(".SSLOptions").find("input").addClass("excludeXML");
			}

			var HadoopOptionSelected = protocolSelected == "hadoop";
			if(HadoopOptionSelected)
			{
				fieldPropertiesDialog.find(".hadoopOption2, .hadoopOption").find("input").removeClass("excludeXML");
			}
			else
			{
				fieldPropertiesDialog.find(".hadoopOption").find("input").addClass("excludeXML");
			}

			if(ftpSelected)
			{
				fieldPropertiesDialog.find(".ftpOptions").find("select, input").removeClass("excludeXML");
			}
			else
			{
				fieldPropertiesDialog.find(".ftpOptions").find("select, input").addClass("excludeXML");
			}

			if(protocolSelected == "ftp" || protocolSelected == "ftps" || protocolSelected == "ftpes")
			{
				fieldPropertiesDialog.find(".ftpsOptions").find("select, input").removeClass("excludeXML");
			}
			else
			{
				fieldPropertiesDialog.find(".ftpsOptions").find("select, input").addClass("excludeXML");
			}
			if(panelSetup.rebuildCustomScripts)
			{
				panelSetup.rebuildCustomScripts();
				delete panelSetup.rebuildCustomScripts;
			}

			var itemProperties = userManager.data.buildXMLToSubmitForm(fieldPropertiesDialog, true, "_name");
			if(excludeItems) excludeItems.removeClass("excludeXML");
			var type = "DIR";
			if(curItemData && curItemData.type.toLowerCase()=="file")
			{
				type = "FILE";
			}
			else
			{
				if(url.lastIndexOf("/") != url.length - 1 && url.lastIndexOf("\\") != url.length - 1)
					type = "FILE";
			}
			var suggestions = fieldPropertiesDialog.find(".suggested:visible").find("#suggestedSettingsUsed").find("li");
			if(suggestions && suggestions.length>0){
				suggestions.each(function(){
					itemProperties += '\n<'+$(this).attr("key")+'>'+$(this).attr("_value")+'</'+$(this).attr("key")+'>';
				});
			}
			callBack(type, itemProperties, name, newName);
		}
		if(hasmatch)
		{
			jAlert("There is already an item available with same name <strong>\""+ newName +"\"</strong>, Please choose other name", "Error",  function(_val){return false;
			});
		}
		else
			addItem();
	}

	function refreshCitrixToken(dialog){
		var client_id = dialog.find("#itemProperty_option_client_id").val() || "";
		var citrix_client_info = client_id;
		client_id = client_id.split("~")[0];
		var client_secret = client_id.split("~")[1];
		var baseURL = window.location.protocol + "//" + window.location.host + "/";
		var curURL = baseURL + "%3Fcommand%3Dregister_citrix_api%26c2f%3D"+crushFTP.getCrushAuth();
		var url = "https://secure.sharefile.com/oauth/authorize?response_type=code&client_id="+client_id+"&redirect_uri=" + curURL + "&citrix_client_info=" + citrix_client_info;
		dialog.parent().block({ message: "Waiting... <a href='javascript:void(0);' class='cancel' style='color:#fff;'>Cancel</a> <div style='margin-top:20px;'>(If your browser has not opened a new window, you may need to unblock popups.)</div>", overlayCSS: { opacity: 0.7, cursor: 'normal'},css: {
			border: 'none',
			backgroundColor: 'transparent',
			color: '#fff',
			'text-align':'center',
			'font-weight' : 'normal',
			opacity : 0.8,
			width : '100%',
			cursor : 'normal'
		}});
		var popup = window.open(url, "citrix", "width=800,height=600");
		var timer, stopPolling;

		function closePopup(){
			dialog.parent().unblock();
			popup.close();
			clearTimeout(timer);
			stopPolling = true;
		}

		dialog.parent().find("a.cancel").click(function(){
			closePopup();
		});

		function checkTokenStatus(){
			if(stopPolling){
				stopPolling = false;
				return false;
			}
			crushFTP.data.serverRequest({
				command: 'lookup_citrix_api_code',
				client_id: client_id,
				serverGroup : $("#userConnectionGroups").val() || "MainUsers",
				server_url : url,
				citrix_client_info: citrix_client_info
			},
			function(data){
				var code = data ? $.trim($(data).find("response").text()) : "";
				if(data && code && code != "null")
				{
					dialog.find("#itemProperty_option_client_secret").val(code).trigger("textchange");
					closePopup();
					crushFTP.UI.growl("Message : ", "Token Refreshed.", false, 3000);
				}
				else{
					timer = setTimeout(function(){
						checkTokenStatus();
					}, 1000);
				}
			});
		}
		checkTokenStatus();
	}

	function refreshGoogleToken(dialog){
		var baseURL = window.location.protocol + "//" + window.location.host + "/";
		var curURL = encodeURIComponent(baseURL) + "%3Fcommand%3Dregister_gdrive_api";
		var google_client_id = dialog.find("#itemProperty_option_gdrive_secretKeyID").val().split("~")[0];
		var googleURL = 'https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive&redirect_uri='+curURL+'&response_type=code&access_type=offline&client_id='+google_client_id+'&prompt=consent';
		dialog.parent().block({ message: "Waiting... <a href='javascript:void(0);' class='cancel' style='color:#fff;'>Cancel</a> <div style='margin-top:20px;'>(If your browser has not opened a new window, you may need to unblock popups.)</div>", overlayCSS: { opacity: 0.7, cursor: 'normal'},css: {
			border: 'none',
			backgroundColor: 'transparent',
			color: '#fff',
			'text-align':'center',
			'font-weight' : 'normal',
			opacity : 0.8,
			width : '100%',
			cursor : 'normal'
		}});
		var popup = window.open(googleURL, "google", "width=800,height=600");
		var timer, stopPolling;

		function closePopup(){
			dialog.parent().unblock();
			popup.close();
			clearTimeout(timer);
			stopPolling = true;
		}

		dialog.parent().find("a.cancel").click(function(){
			closePopup();
		});

		function checkTokenStatus(){
			if(stopPolling){
				stopPolling = false;
				return false;
			}
			crushFTP.data.serverRequest({
				command: 'lookup_gdrive_api_code',
				google_client_info: dialog.find("#itemProperty_option_gdrive_secretKeyID").val(),
				serverGroup : $("#userConnectionGroups").val() || "MainUsers",
				server_url : curURL
			},
			function(data){
				var code = data ? $.trim($(data).find("response").text()) : "";
				if(data && code && code != "null")
				{
					//dialog.find(".gdriveCredentials").find(".username").hide();
					//dialog.find("#itemProperty_option_gdrive_secretKeyID").val("user").trigger("textchange");//we use the actual google API client_id now
					dialog.find("#itemProperty_option_gdrive_secretKey").val(code).trigger("textchange");
					closePopup();
					crushFTP.UI.growl("Message : ", "Token Refreshed.", false, 3000);
				}
				else{
					timer = setTimeout(function(){
						checkTokenStatus();
					}, 1000);
				}
			});
		}
		checkTokenStatus();
	}

	panelSetup.miniURLsDialog = $("#miniURLsPanel").dialog({
		autoOpen: false,
		width: 800,
		title: "MiniURLs:",
		modal: true,
		resizable: false,
		closeOnEscape: true,
		buttons: [
		{
			id:"vitem-cancel",
			text: "OK",
			click: function() {
				$(this).dialog("close");
			}
		}]
	});

	$('#serverURLforMiniURL').val(window.location.protocol +"//"+ window.location.host);

	var fieldPropertiesDialog = $("#fieldPropertiesDialog").dialog({
		autoOpen: false,
		width: 700,
		modal: true,
		resizable: false,
		closeOnEscape: false,
		/* edited by carlos assign some ids to the buttons for easy tour reference */
		buttons: [
		{
			id:"vitem-test",
			text: "Test",
			click: function() {
				continueVFSAddProcess(function(type, itemProperties, name, newName){
					crushFTP.UI.showIndicator(false, fieldPropertiesDialog, "Wait..");
					fieldPropertiesDialog.find(".maskPasswordOnURL").trigger("blur");
					var itemPropertiesJSON = $.xml2json("<item>" +  unescape(itemProperties) + "<type>" + type + "</type>" + "</item>");
					var _name = newName || name;
					panelSetup.testVFSItemCall(itemPropertiesJSON, function(msg, totalTime){
						crushFTP.UI.hideIndicator(false, fieldPropertiesDialog);
						if (msg && msg.childNodes && msg.childNodes.length > 0) {
							var items = $(msg).find("listing").text();
							if($(msg).find("error").text())
							{
								crushFTP.UI.growl("Error : ", "Connection failed. <br>" + $(msg).find("error").text() + "<br>Time taken to test: "+totalTime, true, 5000);
							}
							else if(items)
							{
								items = items.replace(/\n/g,' ').replace(/\s/g,' ');
								eval(items);
								if(l && jQuery.isArray(l))
								{
									crushFTP.UI.growl("Success : ", "Connection succeed" + "<br>Time taken to test:"+totalTime, false, 3000);
								}
								else
								{
									crushFTP.UI.growl("Error : ", "Connection failed (or empty directory)" + "<br>Time taken to test: "+totalTime, true, 5000);
								}
							}
						}
					}, _name);
				});
			}
		},
		{
			id:"vitem-cancel",
			text: "Cancel",
			click: function() {
				$(this).dialog("close");
				crushFTP.UI.hideIndicator(false, fieldPropertiesDialog);
			}
		},
		{
			id:"vitem-ok",
			text: "OK",
			click: function() {
				var that = $(this);
				crushFTP.UI.hideIndicator(false, fieldPropertiesDialog);
				if(fieldPropertiesDialog.find(".ui-state-error:visible").length>0)
				{
					crushFTP.UI.growl("Error : ", "Fix the errors on form to continue", true, 2000);
					return false;
				}
				function continueProcess(){
					continueVFSAddProcess(function(type, itemProperties, name, newName){
					 	var itemPropertiesJSON = $.xml2json("<item>" +  unescape(itemProperties) + "<type>" + type + "</type>" + "</item>");
						panelSetup.updateOrAddVFSPropertiesForItemByName(name, itemPropertiesJSON, newName);
						panelSetup.userDirSelectList.trigger("change");
						panelSetup._panel.trigger("changed", [panelSetup.userDirSelectList]);
						that.dialog("close");
					});
				}
				if(fieldPropertiesDialog.find(".hasPendingCall").length>0)
				{
					window.pendingEncryptionCall = function(){
						continueProcess();
					};
				}
				else
				{
					continueProcess();
				}
			}
		}
		],
		beforeClose : function(){
			$(".removeItemFileParser2", fieldPropertiesDialog).click();
			fieldPropertiesDialog.find("#itemProperty_option_s3serverURL").removeAttr('lastSelected');
			fieldPropertiesDialog.find("#itemProperty_option_glacierServerURL").removeAttr('lastSelected');
			return true;
		},
		open: function(){
			panelSetup.showHideItemPropertiesSettings();
			fieldPropertiesDialog.find(".gdriveCredentials").find(".username").show();
			setTimeout(function(){
				$("#itemProperty_option_url", fieldPropertiesDialog).trigger("textchange").trigger("applymask");
			}, 500);
			$("a.serverFilePickButton", fieldPropertiesDialog).each(function(){
				$(this).unbind().click(function(){
					var curElem = $(this);
					curElem.crushFtpLocalFileBrowserPopup({
						type : curElem.attr("PickType") || 'dir',
						file_mode : curElem.attr("FileMode") || 'user',
						existingVal : $("#" + curElem.attr("rel"), fieldPropertiesDialog).val(),
						callback : function(selectedPath){
							$("#" + curElem.attr("rel"), fieldPropertiesDialog).val(selectedPath).trigger("change");
						}
					});
					return false;
				});
			});
			fieldPropertiesDialog.dialog("option", "position", "center top").dialog("moveToTop");
			fieldPropertiesDialog.find("#itemProperty_option_verifyHost").trigger("change");
			fieldPropertiesDialog.find(".refreshGoogleToken").unbind().click(function(){
				refreshGoogleToken(fieldPropertiesDialog);
				return false;
			});
			fieldPropertiesDialog.find(".refreshCitrixToken").unbind().click(function(){
				refreshCitrixToken(fieldPropertiesDialog);
				return false;
			});
			var curItemData = fieldPropertiesDialog.data("curItemData");
			fieldPropertiesDialog.find(".sftp-suggested-settings").suggestedSettings({
				suggestions : configSuggestions.sftp,
				existing: curItemData
			});
		}
	});

	fieldPropertiesDialog.find("#itemProperty_option_verifyHost").change(function(){
		if($(this).is(":checked")){
			fieldPropertiesDialog.find('.onlyVerifyHost').show();
		}
		else
			fieldPropertiesDialog.find('.onlyVerifyHost').hide();
	}).trigger("change");

	var dmzCustomOptions = $("#dmzCustomOptions").form().dialog({
        autoOpen: false,
        title : "Custom DMZ : ",
        resizable: false,
        width: 440,
        dialogClass : 'customShadow2',
        closeOnEscape: true,
        show: {effect: 'fade', duration: 500},
        hide: {effect: 'fade', duration: 500},
        open: function(event, ui){
            $(event.target).dialog('widget').css({ position: 'fixed' }).position({ my: 'center', at: 'center', of: window });
        },
        create: function(event, ui) {
            $(event.target).parent().css('position', 'fixed');
        },buttons : {
            "OK" : function(){
                if(window.afterCustomDMZSelection)
                {
                    window.afterCustomDMZSelection();
                    delete window.afterCustomDMZSelection;
                }
                $(this).dialog("close");
            },
            "Cancel" : function(){
                $(this).dialog("close");
            }
        },
        close : function(){
            setTimeout(function(){
                if(window.afterCustomDMZSelection)
                    window.afterCustomDMZSelection(true);
            },100);
        },
        resizeStop: function(event, ui) {
            var position = [(Math.floor(ui.position.left) - $(window).scrollLeft()),
                             (Math.floor(ui.position.top) - $(window).scrollTop())];
            $(event.target).parent().css('position', 'fixed');
            $(dlg).dialog('option','position',position);
        }
    });

    dmzCustomOptions.find("#customDMZType").change(function(){
        if($(this).val() == "socks5")
            dmzCustomOptions.find("div.socksOptions").show();
        else
            dmzCustomOptions.find("div.socksOptions").hide();
    });

    $('#extendExpiration').unbind().click(function(e){
    	e.preventDefault();
    	e.stopPropagation();
    	$("#quickSetExpirationTime", panelRestrictions._panel).trigger("click", [function(){
			$("#saveUserData", "#GUIInterface").trigger("click");
    	}])
    });

	$("#item_option_itemType", fieldPropertiesDialog).change(function(){
		panelSetup.showHideItemPropertiesSettings();
		if(!$(this).hasClass('notextChange')){
			panelSetup.buildPropertiesURL();
		}
		setTimeout(function(){
			fieldPropertiesDialog.find(".maskPasswordOnURL").trigger("applymask");
		}, 100);
	});

	fieldPropertiesDialog.find("#itemProperty_option_s3serverURL").change(function(){
        var val = $(this).val();
        $(this).attr('lastSelected', val);
        panelSetup.buildPropertiesURL();
        setTimeout(function(){
        	fieldPropertiesDialog.find(".maskPasswordOnURL").trigger("applymask");
        }, 100);
    });

    fieldPropertiesDialog.find("#itemProperty_option_glacierServerURL").change(function(){
        var val = $(this).val();
        $(this).attr('lastSelected', val);
        panelSetup.buildPropertiesURL();
        setTimeout(function(){
        	fieldPropertiesDialog.find(".maskPasswordOnURL").trigger("applymask");
        }, 100);
    });

	fieldPropertiesDialog.find("#itemProperty_option_user_name, #itemProperty_option_password, #itemProperty_option_secretKeyID, #itemProperty_option_secretKey, #itemProperty_option_gdrive_secretKeyID, #itemProperty_option_gdrive_secretKey,#itemProperty_option_s3_bucket,#itemProperty_option_s3_path, #itemProperty_option_client_secret, #itemProperty_option_client_id").bind("textchange", function(){
		if($(this).hasClass('notextChange'))return false;
		if($(this).is("#itemProperty_option_s3_bucket"))
		{
			var val = $(this).val().toLowerCase();
			$(this).val(val);
			if(crushFTP.methods.hasSpecialCharacters(val, "!@#$%^&*()+=[]\\\';,/{}|\":<>?~"))
			{
				$(this).addClass('ui-state-error').closest("td").find(".error").show();
			}
			else
			{
				$(this).removeClass('ui-state-error').closest("td").find(".error").hide();
			}
		}
		panelSetup.buildPropertiesURL();
		if($(this).is("#itemProperty_option_user_name") || $(this).is("#itemProperty_option_password") || $(this).is("#itemProperty_option_secretKey") || $(this).is("#itemProperty_option_gdrive_secretKeyID") || $(this).is("#itemProperty_option_gdrive_secretKey") || $(this).is("#itemProperty_option_client_secret") || $(this).is("#itemProperty_option_client_id"))
		{
			fieldPropertiesDialog.find(".maskPasswordOnURL").trigger("applymask");
		}
	}).bind("blur", function(){
		$(this).val($.trim($(this).val())).trigger('textchange');
	});

	fieldPropertiesDialog.find("#itemProperty_option_url").bind("textchange", function(){
		panelSetup.buildPropertiesURLReverse();
	}).bind("change", function(){
		panelSetup.buildPropertiesURLReverse();
	}).focus(function(){
		if ($(this).val().indexOf("s3")==0)
			$(this).closest("td").find("#warningText").show();
	}).bind("blur", function(){
		$(this).closest("td").find("#warningText").hide();
	});


	fieldPropertiesDialog.find(".maskPasswordOnURL").each(function(){
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
                        if(value.length!=unescape(_val).length)
                            _val = _val.substr(0, _val.length-1);
                        elem.val(unescape(_val));
                    }
                }
                else
                {
                    pass = existingPass;
                    mask = new Array(pass.length+1).join('*');
                    url.password(mask);
                    var _val = url.toString();
                    if(value.length!=unescape(_val).length)
                        _val = _val.substr(0, _val.length-1);
                    elem.val(unescape(_val));
                }
                url.password(pass);
                var _val = url.toString();
                if(value.length!=unescape(_val).length)
                    _val = _val.substr(0, _val.length-1);
            }
        });
	});

	/*Encryption settings for item*/
	var fieldAdvancedDialog = $("#fieldAdvancedDialog").dialog({
		autoOpen: false,
		height: 600,
		width: 800,
		modal: true,
		resizable: true,
		closeOnEscape: false,
		buttons: {
			"Cancel" : function(){
				$(this).dialog( "close" );
			},
			"OK": function() {
				var isChanged = fieldAdvancedDialog.attr("isChanged");
				if(isChanged.toString() == "true")
				{
					var encryption = {};
					fieldAdvancedDialog.find(".encryption").find("input:checked, input[type='text'], input[type='password']").each(function(){
						var val = $(this).val();
						if($(this).is(":checked"))
						{
							val = "true";
						}
						if(val.length>0)
							encryption[$(this).attr("_name")]= val;
					});
					var sync = {};
					fieldAdvancedDialog.find(".sync").find("input:checked, input[type='text'], input[type='password']").each(function(){
						var val = $(this).val();
						if($(this).is(":checked"))
						{
							val = "true";
						}
						if(val.length>0)
							sync[$(this).attr("_name")]= val;
					});
					var posix = {};
					fieldAdvancedDialog.find(".posix").find("input:checked, input[type='text'], input[type='password']").each(function(){
						var val = $(this).val();
						if($(this).is(":checked"))
						{
							val = "true";
						}
						if(val.length>0)
							posix[$(this).attr("_name")]= val;
					});
					var dynamic_size = fieldAdvancedDialog.find("#itemSync_option_dynamic_size").is(":checked");
					var ratio = fieldAdvancedDialog.find("#itemSync_option_setup_ratio").is(":checked");
					$("#advancedVFSOptions", panelSetup._panel).data("privs", {"encryption":encryption, "sync":sync, "posix":posix, dynamic_size: dynamic_size, ratio: ratio});
					$("#privsOptions", panelSetup._panel).find("input:first").trigger("change");
					panelSetup._panel.trigger("changed", [panelSetup.userDirSelectList]);
				}
				$(this).dialog("close");
			}
		},
		beforeClose : function(){
			return true;
		},
		open: function(){
			fieldAdvancedDialog.find("#advancedSettingsTabs").tabs({selected:0});
			$("a.serverFilePickButton", fieldAdvancedDialog).each(function(){
				$(this).unbind("click").click(function(){
					var curElem = $(this);
					curElem.crushFtpLocalFileBrowserPopup({
						type : curElem.attr("PickType") || 'dir',
						file_mode : curElem.attr("FileMode") || 'user',
						existingVal : $("#" + curElem.attr("rel"), fieldAdvancedDialog).val(),
						callback : function(selectedPath){
							$("#" + curElem.attr("rel"), fieldAdvancedDialog).val(selectedPath).trigger("change");
						}
					});
					return false;
				});
			});

			$("a.testPGPButton").each(function () {
				$(this).testPGPButton();
			});
		}
	});

	vtip(fieldAdvancedDialog);

	fieldAdvancedDialog.find("input").change(function(){
		fieldAdvancedDialog.attr("isChanged", true);
	});

	$("#pgpEncryptionGenerateButton").unbind().click(function () {
		if ($("#pgpPivateKeyPathGenerate").val().indexOf(".key") < 0)
		{
			$("#pgpPivateKeyPathGenerate").val($("#pgpPivateKeyPathGenerate").val()+"private.key");
		}
		var obj = {
			command: "pgpGenerateKeyPair",
			pgpCommonNameGenerate: crushFTP.methods.htmlEncode($("#pgpCommonNameGenerate").val()),
			pgpKeySizeGenerate: $("#pgpKeySizeGenerate").val(),
			pgpKeyDaysGenerate: $("#pgpKeyDaysGenerate").val(),
			pgpPrivateKeyPasswordGenerate: fixChars($("#pgpPrivateKeyPasswordGenerate").val()).split(' ').join('%20'),
			pgpPivateKeyPathGenerate: crushFTP.methods.htmlEncode($("#pgpPivateKeyPathGenerate").val()),
			random: Math.random()
		};
		obj.c2f = crushFTP.getCrushAuth();
		$.ajax({
			type: "POST",
			url: userManager.ajaxCallURL,
			data: obj,
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				errorThrown = errorThrown || "pgpGenerateKeyPair failed";
				crushFTP.UI.growl("Error : ", errorThrown, true, true);
			},
			success: function (msg) {
				var responseText = msg;
				try {
					var response = msg.getElementsByTagName("response");
					response = crushFTP.data.getTextContent(response[0]).textContent;
					alert(response);
				} catch (ex) {}
			}
		});
		return false;
	});

	fieldAdvancedDialog.find("input[type='text']").bind("textchange", function(){
		fieldAdvancedDialog.attr("isChanged", true);
	});

	panelSetup._panel.find("#crush_value2").bind("textchange", function(){
		$(this).data("dataChanged", true);
	});

	$(".checkboxArea>input[type='checkbox']", panelSetup._panel).change(function(){
		var curUserData = crushFTP.storage("currentUserInherited");
		var fs = $(this).closest("fieldset");
		if(!$(this).is(":checked"))
		{
			curUserData = {user: crushFTP.storage("currentUsersLowerLevelsData")};
			fs.addClass("inheritSet");
			if(fs.is("#vfsItemsListingAndOptions"))
			{
				fs.removeClass("inheritSet").removeAttr('inheritedFrom');
				var curData = userManager.methods.seperateValueAndInheritValue(crushFTP.data.getValueFromJson(curUserData.user, "root_dir"));
				if(curData.inherit)
                {
                	fs.find("legend").text(curData.inherit);
                }
			}
		}
		else
			fs.removeClass("inheritSet");
		if($(this).attr("vfsArea") == "yes")
		{
			if(!$(this).is(":checked"))
			{
				panelSetup.vfsItemsDirList.empty();
				panelSetup.userDirSelectList.val("/");
				panelSetup.loadUser = fs.find("legend").text();
				if(window.panelSettings)
					$("#root_dir", panelSettings._panel).addClass("excludeXML");
			}
			else
			{
				if(window.panelSettings)
					$("#root_dir", panelSettings._panel).removeClass("excludeXML");
				panelSetup.loadUser = false;
			}
		}
		if(!fs.hasClass("notInheritable"))
		{
			panelSetup.bindData(curUserData, false, fs);
			if(fs.is("#vfsItemsListingAndOptions"))
				panelSetup.userDirSelectList.change();
		}
	});

	$("#account_enabled", panelSetup._panel).change(function(){
		var max_logins = panelRestrictions._panel.find("#max_logins");
		if(max_logins && max_logins.length>0)
		{
			crushFTP.UI.checkUnchekInput(max_logins.closest("fieldset").find(".checkboxArea").find("input[type='checkbox']"), true).trigger("change");
			if(!$(this).is(":checked"))
			{
				max_logins.val("-1").trigger("change");
			}
			else
			{
				max_logins.val("0").trigger("change");
			}
		}
	});

	var passwordGeneratePanel = $("#passwordGeneratePanel");
	$("#generateRandomPass", panelSetup._panel).unbind().click(function () {
		var pass = panelSetup.generatePasswordUsingPrefs();
		$("#generated_password", panelSetup._panel).val(pass);
		passwordGeneratePanel.show();
		return false;
	});
	passwordGeneratePanel.hide();
	passwordGeneratePanel.find("a#usePassword").unbind().click(function () {
		$("#crush_value2",  panelSetup._panel).val($("#generated_password", passwordGeneratePanel).val()).trigger("change").effect("highlight", {}, 1500);
		window.prompt("To copy information to clipboard : Use Ctrl+C, Enter", "Username : " + $('input#crush_value1').val() + "\n Password : " + $('input#generated_password').val());
		return false;
	});
	passwordGeneratePanel.find("a#cancelPassword").unbind().click(function () {
		passwordGeneratePanel.hide();
		return false;
	});

	$("#generateRandomSaltPass", panelSetup._panel).unbind().click(function () {
		var pass = panelSetup.generatePasswordUsingPrefs();
		var saltField = $("#salt", panelSetup._panel);
		saltField.val(pass).trigger("textchange");
		return false;
	});

	var vfsLinks = $("#vfsLinks", panelSetup._panel);
	$("a#addVFSLink", panelSetup._panel).click(function(evt, controlData, control){
		var users = crushFTP.storage("users");
		var userList = [];
		for(var i in users)
		{
			if(users[i].text)
				userList.push(users[i].text);
		}
		jPrompt("Choose a user to link to their VFS : ", false, "Link to User's VFS", function(value){
			var user = value;
			if(user != null)
			{
				crushFTP.UI.addItem(vfsLinks
					, $("<li class='ui-widget-content' link='" + user + "'>" + user + "</li>")
					, user);
				panelSetup._panel.trigger("changed", [vfsLinks]);
			}
		}, userList);
		return false;
	});

	$("a#removeVFSLink", panelSetup._panel).click(function(){
		crushFTP.UI.removeItem(vfsLinks, function(){
			panelSetup._panel.trigger("changed", [vfsLinks]);
		});
		return false;
	});

	panelSetup.vfsItemsDirList.unbind("onSelect").bind("onSelect"
		, function(evt, list, selected){
			if($(selected).is(".uplevelLink"))
			{
				evt.stopPropagation();
				evt.preventDefault();
				panelSetup.serverDirSelected($(selected), true);
			}
			else
			{
				panelSetup.vfsItemSelected(list, selected);
			}
		return false;
	});

	panelSetup.vfsItemsDirList.find("li").live("dblclick", function(){
		// Remove selection range, it messes up UI as all the text came between selection highlights in native browser selection manner
		if (window.getSelection) // Modern Browsers
		{
			var selection = window.getSelection();
			if (selection.removeAllRanges) {
				selection.removeAllRanges();
			}
		}
		if (document.getSelection) // IE
		{
			var selection = document.getSelection();
			if (selection.removeAllRanges) {
				selection.removeAllRanges();
			}
		}
		panelSetup.serverDirSelected($(this), true);
		return false;
	});

	panelSetup.vfsItemsDirList.bind("keydown", function(evt){
		var list = panelSetup.vfsItemsDirList;
		try{
			if(evt.keyCode == 13)
			{
				var item = panelSetup.vfsItemsDirList.find(".ui-widget-header[_type='dir']:first");
				if(item.length>0)
				{
					panelSetup.serverDirSelected(item, true);
				}
				item = panelSetup.vfsItemsDirList.find(".ui-widget-header.uplevelLink");
				if(item.length>0)
				{
					panelSetup.serverDirSelected(item, true);
				}
				evt.stopPropagation();
				evt.preventDefault();
				return false;
			}
			else if(evt.keyCode == 40)//down
			{
				var item = panelSetup.vfsItemsDirList.find(".ui-widget-header:last");
				if(item.length==0)
					item = panelSetup.vfsItemsDirList.find("li:first");
				if(item.length>0 && item.next().length>0)
				{
					panelSetup.vfsItemsDirList.find(".ui-widget-header").removeClass("ui-selected ui-widget-header");
					item.next().addClass("ui-selected ui-widget-header");
					panelSetup.vfsItemsDirList.parent().scrollTo(item.next());
					list.trigger("onSelect", [list, list.find(".ui-widget-header")]);
				}
				evt.stopPropagation();
				evt.preventDefault();
				return false;
			}
			else if(evt.keyCode == 38)//up
			{
				var item = panelSetup.vfsItemsDirList.find(".ui-widget-header:first");
				if(item.length==0)
					item = panelSetup.vfsItemsDirList.find("li:first");
				if(item.length>0 && item.prev().length>0)
				{
					panelSetup.vfsItemsDirList.find(".ui-widget-header").removeClass("ui-selected ui-widget-header");
					item.prev().addClass("ui-selected ui-widget-header");
					panelSetup.vfsItemsDirList.parent().scrollTo(item.prev());
					list.trigger("onSelect", [list, list.find(".ui-widget-header")]);
				}
				evt.stopPropagation();
				evt.preventDefault();
				return false;
			}
		}
		catch(ex){}
	});

	panelSetup.vfsItemsDirList.find("li").live("click.shift", function(evt){
		panelSetup.vfsItemsDirList.focus();
		var curitem = $(this);
		var shift = evt.shiftKey || curitem.attr("shift") == "true";
		curitem.removeAttr("shift");
		if (shift) {
			if (window.lastSelectedItem) // Last selected item, if shift is pressed
			{
				var lastItem = window.lastSelectedItem;
				window.lastSelectedItem = false;
				if (lastItem != curitem) //If current and last items are not same
				{
					var lastItemIndex = parseInt($(lastItem).index());
					var curItemIndex = parseInt($(curitem).index());

					//loop through items between last selected and current, and apply selection class
					if (lastItemIndex > curItemIndex) {
						for (var i = curItemIndex; i <= lastItemIndex; i++) {
							if ($(panelSetup.vfsItemsDirList.find("li").get(i)).is(":visible")) {
								$(panelSetup.vfsItemsDirList.find("li").get(i)).addClass("ui-widget-header ui-selected");
							}
						}
					}
					//reverse loop if below item selected first
					if (curItemIndex > lastItemIndex) {
						for (var i = lastItemIndex; i <= curItemIndex; i++) {
							if ($(panelSetup.vfsItemsDirList.find("li").get(i)).is(":visible")) {
								$(panelSetup.vfsItemsDirList.find("li").get(i)).addClass("ui-widget-header ui-selected");
							}
						}
					}
					panelSetup.vfsItemSelected(panelSetup.vfsItemsDirList, panelSetup.vfsItemsDirList.find("li.ui-widget-header"));
				}
			}
			// Remove selection range, it messes up UI as all the text came between selection highlights in native browser selection manner
			if (window.getSelection) // Modern Browsers
			{
				var selection = window.getSelection();
				if (selection.removeAllRanges) {
					selection.removeAllRanges();
				}
			}
			if (document.getSelection) // IE
			{
				var selection = document.getSelection();
				if (selection.removeAllRanges) {
					selection.removeAllRanges();
				}
			}
		}
		else {
			window.lastSelectedItem = curitem;
		}
		return false;
	});

	panelSetup.vfsItemsDirList.parent().droppable({
		activeClass: "ui-state-default",
		hoverClass: "ui-state-hover",
		accept: ".serverItem",
		drop: function( event, ui ) {
			var curPath = panelSetup.userDirSelectList.val();
			var itemAdded = false;
			var serverItemSelected = panelSetup.serverDirBrowsePanel.find("li.ui-widget-header");
			if(serverItemSelected.length==0)
				serverItemSelected = ui.draggable.clone();
			serverItemSelected.each(function() {
				if(panelSetup.checkIfCurrentDirIsVFSItem(curPath))
				{
					var el = $(this);
					panelSetup.vfsItemsDirList.append(el.removeClass("ui-draggable").clone());
					panelSetup.vfsItemsDirList.find("li.ui-widget-header").removeClass("ui-selected ui-widget-header");
					var selected = panelSetup.vfsItemsDirList.find("li:last").addClass("ui-selected ui-widget-header");
					panelSetup.vfsItemSelected(false, selected);
					var newPath = curPath + selected.attr("name").replace(/\:/g, "");
					if(selected.attr("_type").toLowerCase() == "dir")
					{
						newPath += "/";
					}
					if(typeof newPath == "undefined") newPath = "/";
					var itemName = selected.attr("name").replace(/\:/g, "");
					selected.attr("name", itemName);
					var url = selected.text();
					if(url)
					{
						url = unescape(panelSetup.serverDirSelectList.val()) + url;
						if(selected.attr("_type").toLowerCase() == "dir")
						{
							 url += "/";
						}
						url = url.replace("//", "/");
					}
					if(url.indexOf("//") != 0 && url.indexOf("\\") != 0)
					{
						url = selected.attr("curPath");
						if(selected.attr("_type").toLowerCase() == "dir")
						{
							 url += "/";
						}
					}
					if(unescape(url).indexOf("/")!=0)
						url = "/" + url;
					var itemPropertiesJSON = {
						name : crushFTP.methods.htmlEncode(itemName),
						type : selected.attr("_type"),
						path : curPath,
						url : "FILE:/"+ unescape(url)
					};
					var matchedElem = false;
					var currentUser = crushFTP.storage("currentUser");
					if(panelSetup.extraVFS)
					{
						var usrExtraVFS = $(document).data("userName") + "~" + panelSetup.extraVFS;
						currentUser = crushFTP.storage("extraUserInfo"+usrExtraVFS);
					}
					if(currentUser.vfs_items && currentUser.vfs_items.vfs_items_subitem)
					{
						crushFTP.methods.rebuildSubItems(currentUser.vfs_items, "vfs_items");
						var curVFSItems = currentUser.vfs_items.vfs_items_subitem;
						for(var i=0;i<curVFSItems.length;i++)
						{
							var curItem = curVFSItems[i];
							if(curItem.vfs_items_subitem_subitem && curItem.vfs_items_subitem_subitem.name)
							{
								var _itemName = unescape(curItem.vfs_items_subitem_subitem.name.toLowerCase());
								var path = unescape(curItem.vfs_items_subitem_subitem.path.toLowerCase());
								if(itemPropertiesJSON.name.toLowerCase() == _itemName && itemPropertiesJSON.path.toLowerCase() == path)
								{
									matchedElem = curItem;
									i = curVFSItems.length+1;
								}
							}
						}
					}
					if(matchedElem)
					{
						selected.remove();
						crushFTP.UI.growl("Message : ", "Item with same name exists. You can create Virtual Directory and add this item to it.", true, 3000);
					}
					else
					{
						panelSetup.lastDroppedItem = newPath;
						panelSetup.updateOrAddVFSPropertiesForItemByName(itemName, itemPropertiesJSON);

						var newItemPath = panelSetup.serverDirSelectList.val();
						var recentlyUsedServerItems = $.jStorage.get("recentlyUsedServerItems") || [];
						if(!recentlyUsedServerItems.has(newItemPath))
							recentlyUsedServerItems.unshift(newItemPath);
						if(recentlyUsedServerItems.length>10)
						{
							recentlyUsedServerItems = recentlyUsedServerItems.splice(0, 10);
						}
						$.jStorage.set("recentlyUsedServerItems", recentlyUsedServerItems);
						panelSetup.showRecentServerItemOption();
						itemAdded = true;
					}
				}
				else
				{
					crushFTP.UI.growl("Message : ", "Items can not be dropped here", true, 3000);
				}
			});
			if(itemAdded){
				serverItemSelected.removeClass('ui-widget-header ui-selected');
				panelSetup.userDirSelectList.trigger("change");
				panelSetup._panel.trigger("changed", [panelSetup.userDirSelectList]);
			}
		}
	});

	var userDirDelay = (function () {
		var timer = 0;
		return function (callback, ms) {
			clearTimeout(timer);
			timer = setTimeout(callback, ms);
		};
	})();

	panelSetup.userDirSelectList.unbind().change(function(){
		var that = this;
		userDirDelay(function(){
			$(that).find("option:selected").nextAll("option").remove();
			panelSetup.bindServerDirsToBrowse(unescape($(that).val()), true, true);
		}, 100);
		return false;
	});

	panelSetup._panel.find("#refreshUserListing").unbind().click(function(){
		panelSetup.userDirSelectList.change();
		return false;
	});

	panelSetup.serverDirBrowsePanel.parent().unbind().bind("scroll", function(){
		var curScroll = $(this).scrollTop();
		var lastScroll = $(this).attr("lastScroll") || 0;
		if(curScroll > 0)
		{
			$(this).attr("lastScroll", curScroll);
		}
	});

	panelSetup.serverDirBrowsePanel.unbind("onSelect").bind("onSelect", function(evt, list, selected){
		var lastScroll = panelSetup.serverDirBrowsePanel.parent().attr("lastScroll") || 0;
		if(lastScroll>0)
		{
			panelSetup.serverDirBrowsePanel.parent().scrollTop(lastScroll);
		}
		if($(selected).is(".uplevelLink"))
		{
			evt.stopPropagation();
			evt.preventDefault();
			panelSetup.serverDirBrowsePanel.parent().attr("lastScroll", 0);
			panelSetup.serverDirSelected($(selected));
		}
		else
		{
			panelSetup.showHideServerOperationButtons();
		}
		return false;
	});

	panelSetup.serverDirBrowsePanel.find("li").live("click", function(){
		panelSetup.serverDirBrowsePanel.focus();
		var lastScroll = panelSetup.serverDirBrowsePanel.parent().attr("lastScroll") || 0;
		if(lastScroll>0)
		{
			panelSetup.serverDirBrowsePanel.parent().scrollTop(lastScroll);
		}
		if($(this).is(".uplevelLink"))
		{
			panelSetup.serverDirSelected($(this));
		}
		else
		{
			$(this).parent().find(".ui-widget-header").removeClass("ui-selected ui-widget-header");
			$(this).addClass("ui-selected ui-widget-header");
			panelSetup.showHideServerOperationButtons();
		}
		return false;
	});

	panelSetup.serverDirBrowsePanel.find("li").live("dblclick", function(){
		panelSetup.serverDirBrowsePanel.parent().attr("lastScroll", 0);
		panelSetup.serverDirSelected($(this));
		return false;
	});

	panelSetup.serverDirBrowsePanel.bind("keydown", function(evt){
		var list = panelSetup.serverDirBrowsePanel;
		try{
			if(evt.keyCode == 13)
			{
				panelSetup.serverDirBrowsePanel.parent().attr("lastScroll", 0);
				var item = panelSetup.serverDirBrowsePanel.find(".ui-widget-header[_type='dir']:first");
				if(item.length>0)
				{
					panelSetup.serverDirSelected(item);
				}
				item = panelSetup.serverDirBrowsePanel.find(".ui-widget-header.uplevelLink");
				if(item.length>0)
				{
					panelSetup.serverDirSelected(item);
				}
				evt.stopPropagation();
				evt.preventDefault();
				return false;
			}
			else if(evt.keyCode == 40)//down
			{
				panelSetup.serverDirBrowsePanel.parent().attr("lastScroll", 0);
				var item = panelSetup.serverDirBrowsePanel.find(".ui-widget-header:last");
				if(item.length==0)
					item = panelSetup.serverDirBrowsePanel.find("li:first");
				if(item.length>0 && item.next().length>0)
				{
					panelSetup.serverDirBrowsePanel.find(".ui-widget-header").removeClass("ui-selected ui-widget-header");
					item.next().addClass("ui-selected ui-widget-header");
					panelSetup.serverDirBrowsePanel.parent().scrollTo(item.next());
					list.trigger("onSelect", [list, list.find(".ui-widget-header")]);
				}
				evt.stopPropagation();
				evt.preventDefault();
				return false;
			}
			else if(evt.keyCode == 38)//up
			{
				panelSetup.serverDirBrowsePanel.parent().attr("lastScroll", 0);
				var item = panelSetup.serverDirBrowsePanel.find(".ui-widget-content:first");
				if(item.length==0)
					item = panelSetup.serverDirBrowsePanel.find("li:first");
				if(item.length>0 && item.prev().length>0)
				{
					panelSetup.serverDirBrowsePanel.find(".ui-widget-content").removeClass("ui-selected ui-widget-header");
					item.prev().addClass("ui-selected ui-widget-header");
					panelSetup.serverDirBrowsePanel.parent().scrollTo(item.prev());
					list.trigger("onSelect", [list, list.find(".ui-widget-header")]);
				}
				evt.stopPropagation();
				evt.preventDefault();
				return false;
			}
		}
		catch(ex){}
	});

	var serverDirDelay = (function () {
		var timer = 0;
		return function (callback, ms) {
			clearTimeout(timer);
			timer = setTimeout(callback, ms);
		};
	})();

	panelSetup.serverDirSelectList.unbind("change.local").bind("change.local", function(){
		var that = this;
		serverDirDelay(function(){
			$(that).find("option:selected").nextAll("option").remove();
			panelSetup.bindServerDirsToBrowse(unescape($(that).val()), true);
		}, 100);
		return false;
	});

	panelSetup._panel.find("#refreshServerListing").unbind().click(function(){
		panelSetup.serverDirSelectList.trigger("change.local");
		return false;
	});
	panelSetup.showRecentServerItemOption();
	panelSetup._panel.find("#showServerItemHistory").unbind().click(function(){
		panelSetup.showRecentServerItemOption();
		var lastServerPathHistory = $("#lastServerPathHistory").css({
			top : $(this).position().top + 13,
			left : $(this).position().left + 13,
		}).show();
		$(document).bind("click.temp, keydown.temp", function(){
			lastServerPathHistory.hide();
			$(document).unbind("click.temp, keydown.temp");
		});
		return false;
	});

	$("#lastServerPathHistory").find("li").live("click", function(){
		var path = $(this).data("path");
		if(path)
		{
			$(".serverFileDropdown").find("input").val(path);
			panelSetup.serverDirSelectList.trigger("change.doselect");
		}
	});

	var vfsOptions = $("#vfsOptions", panelSetup._panel);
	$("a#inheritFromRootVFSOptions", panelSetup._panel).click(function(){
		var selected = $("li.ui-widget-header", panelSetup.vfsItemsDirList);
		if(selected.length>0)
		{
			selected.each(function(){
				panelSetup.updateItemPrivs($(this).data("hrefPath"), "(inherited)");
				panelSetup.updateItemPrivs($(this).data("hrefPath"), "", "true");
				panelSetup.vfsItemSelected(false, $(this));
			});
			$("#privsOptions", vfsOptions).find(".ui-state-active").removeClass("ui-state-active");
			panelSetup._panel.trigger("changed", [vfsOptions]);
			panelSetup.bindServerDirsToBrowse(unescape(panelSetup.userDirSelectList.val()), true, true, true);
		}
		return false;
	});

	function updatePrivs(changedItem)
	{
		if(!changedItem)return;
		var selectedDir = $("li.ui-widget-header", panelSetup.vfsItemsDirList);
		if(selectedDir && selectedDir.length>0)
		{
			if(changedItem.is("#setup_replicate")){
				if($(changedItem).is(":checked")){
					$("#privsOptions", vfsOptions).find(".replicate-async").show();
				}
				else{
					$("#privsOptions", vfsOptions).find(".replicate-async").hide();
				}
			}
			$(selectedDir).each(function(){
				var curItem = $(this);
				if(typeof curItem.attr !="undefined")
				{
					if(changedItem.is("#setup_invisible:checked"))
					{
						jConfirm("This will make the item invisible, Are you sure you want to do that?", "Confirm", function(value){
							crushFTP.UI.checkUnchekInput(changedItem, value);
							panelSetup.updatePrivsForSelectedItem();
							$("#privsOptions", vfsOptions).removeClass("ui-priority-secondary");
							$("#privsOptions", vfsOptions).find(".ui-state-active").removeClass("ui-state-active");
						});
					}
					else if(changedItem.is("#setup_write:checked") && !curItem.hasClass("vfsOrigItem"))
					{
						jAlert("Can not allow write access to virtual folder.", "Error", function(){
							crushFTP.UI.checkUnchekInput(changedItem, false);
							panelSetup.updatePrivsForSelectedItem();
							$("#privsOptions", vfsOptions).removeClass("ui-priority-secondary");
							$("#privsOptions", vfsOptions).find(".ui-state-active").removeClass("ui-state-active");
						});
					}
					else if(changedItem.is("#setup_makedir:checked") && !curItem.hasClass("vfsOrigItem"))
					{
						jAlert("Can not allow make directory access to virtual folder.", "Error", function(){
							crushFTP.UI.checkUnchekInput(changedItem, false);
							panelSetup.updatePrivsForSelectedItem();
							$("#privsOptions", vfsOptions).removeClass("ui-priority-secondary");
							$("#privsOptions", vfsOptions).find(".ui-state-active").removeClass("ui-state-active");
						});
					}
					else if((changedItem.is("#setup_delete:checked") || changedItem.is("#setup_deletedir:checked")) && (!curItem.hasClass("vfsOrigItem")))
					{
						jAlert("Can not allow delete access to virtual folder.", "Error", function(){
							crushFTP.UI.checkUnchekInput(changedItem, false);
							panelSetup.updatePrivsForSelectedItem();
							$("#privsOptions", vfsOptions).removeClass("ui-priority-secondary");
							$("#privsOptions", vfsOptions).find(".ui-state-active").removeClass("ui-state-active");
						});
					}
					else
					{
						panelSetup.updatePrivsForSelectedItem();
						$("#privsOptions", vfsOptions).removeClass("ui-priority-secondary");
						$("#privsOptions", vfsOptions).find(".ui-state-active").removeClass("ui-state-active");
					}
				}
			});
		}
		else
		{
			$(changedItem).parent().next().removeClass("ui-state-active").removeClass("hover");
			crushFTP.UI.checkUnchekInput($(changedItem).val("").text(""), false);
		}
	}

	vfsOptions.find("input[type='checkbox'], textarea, input[type='text']").bind("change", function(){
		updatePrivs($(this));
		vfsOptions.find(".ui-state-active").removeClass("ui-state-active");
	});

	vfsOptions.find("textarea, input[type='text']").bind("textchange", function(){
		updatePrivs($(this));
		vfsOptions.find(".ui-state-active").removeClass("ui-state-active");
	});

	$("#vfsOptions", panelSetup._panel).click(function(){
		if(vfsOptions.find("#privsOptions").hasClass("ui-priority-secondary") && unescape(panelSetup.userDirSelectList.val()) == "/")
		{
			if(!userManager.isVFSHelpShown && $("#vfsItemsListingAndOptions").is(":visible"))
			{
				var itemsPanel = panelSetup.vfsItemsDirList;
				if(itemsPanel.find("li").length==0)
				{
					var top = $("#vfsItemsListingAndOptions").offset().top + 250;
					var vfsSetupHelp = $("#vfsSetupHelp").show().css("top", top + "px");
					vfsSetupHelp.click(function(){
						vfsSetupHelp.hide();
						$('.sa-overlay,.sa-pulse-overlay').remove();
   						$('div[class*="sa-blur"]').remove();
					});
					$("#vfsItemPanel").seekAttention({
						callback : function(){
							vfsSetupHelp.click();
						},
						hideOnHover : false
					});
				}
			}
		}
	});

	panelSetup.showHideVFSOperationButtons();

	panelSetup.vfsItemOperations.find("li.properties").find("a").click(function(){
		if($(this).closest("li").hasClass("ui-state-disabled"))return false;
		var userItemSelected = panelSetup.vfsItemsDirList.find("li.ui-widget-header:first");
		if(userItemSelected.length>0)
		{
			panelSetup.showVFSItemProperties(userItemSelected);
		}
		return false;
	});

	function copyVFSItem(matchedElem, callback, isPaste){
		if(matchedElem && matchedElem.name)
		{
			var _name = matchedElem.name;
			var location = matchedElem.url || "Not specified";
			var curPath = panelSetup.userDirSelectList.val();
			if(!isPaste)
				_name = _name + " copy";
			jPrompt("Enter a name for item : ", _name, "Input", function(name){
				if(name != null)
				{
					name = $.trim(name);
					var toCompare = $.trim(name).toLowerCase();
					var hasmatch = false;
					panelSetup.vfsItemsDirList.find("li").each(function(){
						var path = unescape($.trim($(this).attr("path"))).toLowerCase();
						if(toCompare == path)
							hasmatch = true;
					});
					function addItem(){
						if(matchedElem)
						{
							var itemToSave = $.extend(true, {}, matchedElem);
							itemToSave.name = name;
							itemToSave.path = curPath;
							var privs = matchedElem.privs;
							delete itemToSave.privs;
							panelSetup.updateOrAddVFSPropertiesForItemByName(name, itemToSave);
							for (var key in privs) {
								var curKey = key.replace(matchedElem.path.toUpperCase() + matchedElem.name.toUpperCase() + "/", curPath + name + "/");
								panelSetup.updateItemPrivs(curKey, privs[key]);
							}
							if(callback)
								callback();
						}
					}
					if(hasmatch)
					{
						jAlert("There is already an item available with same name <strong>\""+ name +"\"</strong>, Please choose other name", "Error",  function(_val){
							copyVFSItem(matchedElem, callback, isPaste);
						});
					}
					else
						addItem();
				}
				else
				{
					if(isPaste && callback)
						callback();
				}
			}, false, false, {
				messageToAppend : "(Location : "+unescape(location)+")<br><br>"
			});
		}
	}

	panelSetup.vfsItemOperations.find("li.copy").find("a").click(function(){
		if($(this).closest("li").hasClass("ui-state-disabled"))return false;
		var userItemSelected = panelSetup.vfsItemsDirList.find("li.ui-widget-header");
		if(userItemSelected.length>0)
		{
			var toCopy = [];
			userItemSelected.each(function(){
				var _name = unescape($.trim($(this).attr("path")));
				var root_dir = unescape($.trim($(this).attr("rootDir")));
				var VFSItem = panelSetup.checkIfCurrentDirIsVFSItem(root_dir, _name);
				if(VFSItem.url)
				{
					var matchedElem = panelSetup.getVFSPropertiesForItemByName(_name, root_dir);
					var curPrivs = crushFTP.storage("currentUserDirPrivs") || new Object();
					if(panelSetup.extraVFS)
						curPrivs = crushFTP.storage("extraUserDirPrivs"+panelSetup.extraVFS) || new Object();
					var curName = root_dir + _name + "/";
					//var _privs = unescape($.trim($(this).attr("privs")));
					var relatedPrivs = {};
					for(var key in curPrivs){
						if(key.indexOf(curName.toUpperCase())==0)
						{
							relatedPrivs[key] = curPrivs[key];
						}
					}
					// if(curPrivs[curName.toUpperCase()])
					// {
					// 	_privs = curPrivs[curName.toUpperCase()]
					// }
					matchedElem.privs = relatedPrivs;
					if(matchedElem)
					{
						toCopy.push(matchedElem);
					}
				}
				else
				{
					crushFTP.UI.growl("Ignored Virtual folder : ", "Can't copy Virtual folders", true, 2000);
				}
			});
			if(toCopy.length>0)
			{
				$(document).data("copiedVFSItems", toCopy);
				crushFTP.UI.growl("Message : ", toCopy.length + " item(s) copied. You can paste them to other users as well", false, 3000);
				panelSetup.showHideVFSOperationButtons();
			}
		}
	});

	panelSetup.vfsItemOperations.find("li.paste").find("a,span").click(function(){
		if($(this).closest("li").hasClass("ui-state-disabled"))return false;
		var copiedVFSItems = $(document).data("copiedVFSItems");
		if(copiedVFSItems && copiedVFSItems.length>0)
		{
			var i = 0;
			function callAction()
			{
				copyVFSItem(copiedVFSItems[i], function(){
					i++;
					if(i == copiedVFSItems.length)
					{
						panelSetup.userDirSelectList.trigger("change");
						panelSetup._panel.trigger("changed", [panelSetup.userDirSelectList]);
					}
					else
					{
						callAction();
					}
				}, true);
			}
			callAction(i);
		}
	});

	panelSetup.vfsItemOperations.find("li.show-miniurls").find("a,span").click(function(){
		if($(this).closest("li").hasClass("ui-state-disabled"))return false;
		var prefs = crushFTP.storage("GUIXMLPrefs") || {};
		var miniURLs = prefs.miniURLs && prefs.miniURLs.miniURLs_subitem ? prefs.miniURLs.miniURLs_subitem : [];
		var usersMiniURLs = [];
		var userName = $(document).data("userName");
		for (var i = 0; i < miniURLs.length; i++) {
			if(miniURLs[i].user.toLowerCase() === userName.toLowerCase())
				usersMiniURLs.push(miniURLs[i]);
		}
		panelSetup.miniURLsDialog.dialog("open");
		$("#miniURLSortLinks").find("a").unbind().click(function (e) {
	        e.preventDefault();
	        e.stopPropagation();
	        var elem = $(this);
	        var parent = elem.closest("#miniURLSortLinks");
	        var sortBy = elem.attr("rel") , sortType = elem.hasClass("asc") ? "desc" : "asc";
	        parent.find(".asc,.desc").removeClass("asc desc");
	        elem.addClass(sortType);
	        panelSetup.bindMiniURLs(usersMiniURLs, sortBy, sortType);
	    });
		panelSetup.bindMiniURLs(usersMiniURLs);
	});

	panelSetup.vfsItemOperations.find("li.duplicate").find("a").click(function(){
		if($(this).closest("li").hasClass("ui-state-disabled"))return false;
		var userItemSelected = panelSetup.vfsItemsDirList.find("li.ui-widget-header:first");
		if(userItemSelected.length>0)
		{
			var _name = unescape($.trim(userItemSelected.attr("path")));
			var root_dir = unescape($.trim(userItemSelected.attr("rootDir")));
			var matchedElem = panelSetup.getVFSPropertiesForItemByName(_name, root_dir);

			var curPrivs = crushFTP.storage("currentUserDirPrivs") || new Object();
			if(panelSetup.extraVFS)
				curPrivs = crushFTP.storage("extraUserDirPrivs"+panelSetup.extraVFS) || new Object();
			var curName = root_dir + _name + "/";
			var _privs = unescape($.trim(userItemSelected.attr("privs")));
			if(curPrivs[curName.toUpperCase()])
			{
				_privs = curPrivs[curName.toUpperCase()]
			}
			matchedElem.privs = _privs;

			copyVFSItem(matchedElem, function(){
				panelSetup.userDirSelectList.trigger("change");
				panelSetup._panel.trigger("changed", [panelSetup.userDirSelectList]);
			});
		}
		return false;
	});

	panelSetup._panel.find("a#advancedVFSOptions").click(function(){
		var userItemSelected = panelSetup.vfsItemsDirList.find("li.ui-widget-header:first");
		if(userItemSelected.length>0)
		{
			var fieldAdvancedDialog = $("#fieldAdvancedDialog");
			fieldAdvancedDialog.clearForm();
			fieldAdvancedDialog.find("#pgpKeySizeGenerate").val("2048");
			fieldAdvancedDialog.find("#pgpKeyDaysGenerate").val("365");
			panelSetup.showVFSItemEncryption(userItemSelected);
		}
		return false;
	});

	panelSetup.vfsItemOperations.find("li.newFolder").find("a").click(function(evt, data){
		if($(this).closest("li").hasClass("ui-state-disabled"))return false;
		var that = $(this);
		var _name = data || "";
		jPrompt("Enter a directory name : ", _name, "Directory Name", function(value){
			var name = value;
			if(name != null)
			{
				if(crushFTP.methods.hasSpecialCharacters(name, userManager.notAllowedCharsInDirName))
				{
					jAlert("You can not use these characters in directory name : \"" + userManager.notAllowedCharsInDirName + "\"", "Invalid name", function(){
						that.trigger("click", [name]);
					});
					return false;
				}
				var toCompare = $.trim(name).toLowerCase();
				var hasmatch = false;
				panelSetup.vfsItemsDirList.find("li").each(function(){
					var path = unescape($.trim($(this).attr("path"))).toLowerCase();
					if(toCompare == path)
						hasmatch = true;
				});
				function addItem(){
					var itemPropertiesJSON = {
						name : name,
						path : panelSetup.userDirSelectList.val(),
						type : "DIR",
						url : ""
					};
					panelSetup.updateOrAddVFSPropertiesForItemByName(name, itemPropertiesJSON);
					panelSetup.userDirSelectList.trigger("change");
					panelSetup._panel.trigger("changed", [panelSetup.userDirSelectList]);
				}
				if(hasmatch)
				{
					jAlert("There is already an item available with same name <strong>\""+ name +"\"</strong>, Please choose other name", "Error",  function(_val){
						that.trigger("click", [name]);
					});
				}
				else
					addItem();
			}
		}, false, false, {
			messageToAppend : "(This is a virtual directory, you cannot upload to it.)<br><br>"
		});
		return false;
	});

	panelSetup.vfsItemOperations.find("li.newItem").find("a").click(function(){
		if($(this).closest("li").hasClass("ui-state-disabled"))return false;
		panelSetup.showVFSItemProperties();
		panelSetup._panel.trigger("changed", [$(this)]);
		return false;
	});

	panelSetup.vfsItemOperations.find("li.rename").find("a").click(function(){
		if($(this).closest("li").hasClass("ui-state-disabled"))return false;
		var userItemSelected = panelSetup.vfsItemsDirList.find("li.ui-widget-header:first");
		if(userItemSelected.length>0)
		{
			panelSetup.renameVFSItem(userItemSelected);
		}
		return false;
	});

	panelSetup.vfsItemOperations.find("li.remove").find("a").click(function(){
		if($(this).closest("li").hasClass("ui-state-disabled"))return false;
		var userItemSelected = panelSetup.vfsItemsDirList.find("li.ui-widget-header");
		if(userItemSelected.length>0)
		{
			panelSetup.removeVFSItem(userItemSelected);
		}
		return false;
	});
	var jobSelector = $('#jobSelector');
	$('a#runJobForUser', panelSetup._panel).button().contextMenu({
			menu: "batchRunJobSelector",
			openOnClick : true,
			inSpeed : 0,
			outSpeed : 0
		},
		function(action, el, pos) {
			var users = [];
			if(action == "current"){
				users.push($(document).data("userName"))
			}
			else if(action == "selectedBatch"){
				$("#userList").find("option").each(function(){
					var userName = $(this).attr("userName");
					if($(this).is(":selected"))
						users.push(userName);
				});
			}
			else {
				$("#userList").find("option").each(function(){
					var userName = $(this).attr("userName");
					users.push(userName);
				});
			}
			jobSelector.data("users", users);
			if(!jobSelector.data("dialogAdded"))
			{
				jobSelector.form();
				jobSelector.data("dialogAdded", true);
				var list = jobSelector.find("ol");
				function filterJobs(phrase)
				{
					list.find("li").hide();
					list.find("li:Contains('"+phrase+"')").show();
					if(list.find("li:visible").length>0){
						$('#noMatchigJobMsg', jobSelector).hide();
					}
					else{
						$('#noMatchigJobMsg', jobSelector).show();
					}
				}
				var lastSearched = "";
				jobSelector.find("#filter_job").unbind("keyup").keyup(function (evt) {
					var evt = (evt) ? evt : ((event) ? event : null);
					var phrase = this.value;
					if (lastSearched === phrase) {
						return false;
					}
					filterJobs(phrase);
					lastSearched = phrase;
				});
				jobSelector.dialog({
					autoOpen: false,
					title : "Select Job to run :",
					height: 400,
					width: 300,
					modal: true,
					closeOnEscape: true,
					buttons: {
						"Cancel" : function(){
							$(this).dialog( "close" );
						},
						"OK": function() {
							var that = $(this);
							var job = list.find("li.ui-selected").attr("job");
							if(!job){
								alert("Please select job to run");
								return false;
							}
							crushFTP.UI.showIndicator(false, false, "Please wait..");
					        var obj = {
					            command : "testJobSchedule",
					            scheduleName : job,
					            selected_users : jobSelector.data("users").join(",")
					        };
							$(this).dialog( "close" );
					        crushFTP.data.serverRequest(obj, function(data){
				                crushFTP.UI.growl("Response : ", $(data).find("response").text(), false, 3000);
				                crushFTP.UI.hideIndicator();
					        });
						}
					},
					open : function(evt, ui){
						var availableJobs = $(document).data("AvailableJobsNoEvents");
						list.empty();
						if(availableJobs && availableJobs.length>0)
						{
							for (var i = 0; i < availableJobs.length; i++) {
								list.append('<li class="ui-widget-content" job="'+availableJobs[i]+'">'+unescape(availableJobs[i])+'</li>');
							}
							jobSelector.find("#noJobMsg").hide();
						}
						else
						{
							jobSelector.find("#noJobMsg").show();
						}
						list.find("li").unbind().click(function(){
							list.find("li.ui-selected").removeClass('ui-selected');
							$(this).addClass('ui-selected');
						});
						lastSearched = "";
						jobSelector.find("#filter_job").val("user").trigger('keyup');
					}
				});
			}
			jobSelector.dialog("open");
			return false;
		}
	);

	$("a#sendPassEmail", panelSetup._panel).click(function(){
		var userEmail = $.trim($("#email", panelSetup._panel).val());
		if(!userEmail || userEmail == "" || !crushFTP.methods.isValidEmail(userEmail))
		{
			jAlert("Please enter valid email address", "Invalid email", function(){
				$("#email", panelSetup._panel).focus().select();
			});
			return false;
		}
		$("#emailTemplatesDialog").dialog("open");
		var that = $(this);
		userManager.afterEmailTemplate = function(name, cancel, edited)
		{
			if(cancel)
				return;
			var obj = {
				command : "sendPassEmail",
				serverGroup : crushFTP.methods.htmlEncode($("#userConnectionGroups").val()) || "MainUsers",
				user_name : crushFTP.methods.htmlEncode($("#crush_value1", panelSetup._panel).val()),
				user_pass : crushFTP.methods.htmlEncode($("#crush_value2", panelSetup._panel).val()),
				user_email : crushFTP.methods.htmlEncode(userEmail),
				user_first_name : crushFTP.methods.htmlEncode($("#first_name", panelSetup._panel).val()),
				user_last_name : crushFTP.methods.htmlEncode($("#last_name", panelSetup._panel).val()),
				email_template : crushFTP.methods.htmlEncode(name)
			};
			obj = $.extend(obj, edited || {});
			userManager.methods.performServerAction(that, obj, "Sending user information via email :", false, true);
		}
		return false;
	});

	$("#vfsOptions", panelSetup._panel).find("input[type='text'],textarea").bind("focus", function(){
		var selected = $("li.ui-widget-header", panelSetup.vfsItemsDirList);
		if(selected.length==0)
		{
			$(this).blur();
			return false;
		}
	});

	panelSetup.serverItemOperations.find("li.newFolder").find("a").click(function(){
		if($(this).closest("li").hasClass("ui-state-disabled"))return false;
		panelSetup.addServerItem();
		return false;
	});

	panelSetup.serverItemOperations.find("li.rename").find("a").click(function(){
		if($(this).closest("li").hasClass("ui-state-disabled"))return false;
		var itemSelected = panelSetup.serverDirBrowsePanel.find("li.ui-widget-header:first");
		if(itemSelected.length>0)
		{
			panelSetup.renameServerItem(itemSelected);
		}
		return false;
	});

	panelSetup.serverItemOperations.find("li.remove").find("a").click(function(){
		if($(this).closest("li").hasClass("ui-state-disabled"))return false;
		var itemSelected = panelSetup.serverDirBrowsePanel.find("li.ui-widget-header:first");
		if(itemSelected.length>0)
		{
			panelSetup.removeServerItem(itemSelected);
		}
		return false;
	});

	panelSetup.serverItemOperations.find("li.moveRight").find("a").click(function(){
		if($(this).closest("li").hasClass("ui-state-disabled"))return false;
		var serverItemSelected = panelSetup.serverDirBrowsePanel.find("li.ui-widget-header");
		if(serverItemSelected.length>0)
		{
			var curPath = panelSetup.userDirSelectList.val();
			if(panelSetup.checkIfCurrentDirIsVFSItem(curPath))
			{
				serverItemSelected.each(function() {
					var el = $(this);
					panelSetup.vfsItemsDirList.append(el.removeClass("ui-selected ui-widget-header").clone());
					panelSetup.vfsItemsDirList.find("li.ui-widget-header").removeClass("ui-selected ui-widget-header");
					var selected = panelSetup.vfsItemsDirList.find("li:last").addClass("ui-selected ui-widget-header");
					panelSetup.vfsItemSelected(false, selected);
					var newPath = curPath + selected.attr("name").replace(/\:/g, "");
					if(selected.attr("_type").toLowerCase() == "dir")
					{
						newPath += "/";
					}
					if(typeof newPath == "undefined") newPath = "/";
					panelSetup.updatePrivsForSelectedItem(newPath.toUpperCase());
					var itemName = selected.attr("name").replace(/\:/g, "");
					selected.attr("name", itemName);
					var url = selected.text();
					if(url)
					{
						url = unescape(panelSetup.serverDirSelectList.val()) + url;
						if(selected.attr("_type").toLowerCase() == "dir")
						{
							 url += "/";
						}
						url = url.replace("//", "/");
					}
					if(url.indexOf("//") != 0 && url.indexOf("\\") != 0)
					{
						url = selected.attr("curPath");
						if(selected.attr("_type").toLowerCase() == "dir")
						{
							 url += "/";
						}
					}
					url = unescape(url);
					if(url.indexOf("/")!=0)
						url = "/" + url;
					var itemPropertiesJSON = {
						name : crushFTP.methods.htmlEncode(itemName),
						type : selected.attr("_type"),
						path : curPath,
						url : "FILE:/"+ url
					};
					panelSetup.lastDroppedItem = newPath;
					panelSetup.updateOrAddVFSPropertiesForItemByName(itemName, itemPropertiesJSON);

					var newItemPath = panelSetup.serverDirSelectList.val();
					var recentlyUsedServerItems = $.jStorage.get("recentlyUsedServerItems") || [];
					if(!recentlyUsedServerItems.has(newItemPath))
						recentlyUsedServerItems.unshift(newItemPath);
					if(recentlyUsedServerItems.length>10)
					{
						recentlyUsedServerItems = recentlyUsedServerItems.splice(0, 10);
					}
					$.jStorage.set("recentlyUsedServerItems", recentlyUsedServerItems);
					panelSetup.showRecentServerItemOption();
				});


				panelSetup.userDirSelectList.trigger("change");
				panelSetup._panel.trigger("changed", [panelSetup.userDirSelectList]);
			}
			else
			{
				crushFTP.UI.growl("Message : ", "Items can not be added here", true, 3000);
			}
		}
		return false;
	});

	var localdelay = (function () {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();

	var filterServerItems = $("#filterServersFiles", panelSetup._panel).unbind("keyup").keyup(function (evt) {
		var evt = (evt) ? evt : ((event) ? event : null);
		var phrase = this.value;
		// if (panelSetup.last_searched_avl_c && window.last_searched_avl_c === phrase) {
		// 	return false;
		// }
		localdelay(function(){
			panelSetup.filterServerItems(phrase);
		}, 500);
		// window.last_searched_avl_c = phrase;
	});

	var filterUsersFiles = $("#filterUsersFiles", panelSetup._panel).unbind("keyup").keyup(function (evt) {
		var evt = (evt) ? evt : ((event) ? event : null);
		var phrase = this.value;
		// if (panelSetup.last_searched_usd_c && window.last_searched_usd_c === phrase) {
		// 	return false;
		// }
		localdelay(function(){
			panelSetup.filterUserItems(phrase);
		}, 500);
		// window.last_searched_usd_c = phrase;
	});

	$("#clearServerFilesFilter", panelSetup._panel).click(function(){
		filterServerItems.val("").trigger("keyup");
		return false;
	});

	$("#clearUsersFilesFilter", panelSetup._panel).click(function(){
		filterUsersFiles.val("").trigger("keyup");
		return false;
	});

	$("#quickSetVFSExpirationTime").click(function(){
		var input = $("#vfs_expire");
		var selDate = input.datepicker("getDate");
		var myDate = new Date();
		var defaultDays = 30;
		if(selDate)
		{
			var t2 = selDate.getTime();
			var t1 = myDate.getTime();
			defaultDays = parseInt((t2-t1)/(24*3600*1000)) + 1;
		}
		jPrompt("Enter the number of days from now until this item expires : ", defaultDays, "Input", function(value){
			var days = parseInt(value);
			if(days != null && days != NaN)
			{
				if (days == NaN) days = 0;
				if (days > 0) {
					myDate.setDate(myDate.getDate() + days);
					input.datepicker( "setDate" , myDate );
				}
				panelSetup._panel.trigger("changed", [input]);
			}
		});
		return false;
	});

	var vfsItemButtons = $("#vfsItemButtons");

	var vfsAddNew = $("#vfsAddNew", panelSetup._panel).click(function(evt, data){
		var newName = data || "Extra";
		jPrompt("Enter a name/alias for new VFS : ", newName, "Input", function(value){
			if(value)
			{
				value = $.trim(value);
				if(crushFTP.methods.hasSpecialCharacters(value, userManager.notAllowedCharsInDirName+"_") || crushFTP.methods.hasSpecialCharacters(value, userManager.notAllowedCharsInUserName+"_"))
				{
					jAlert("You can not use these characters in VFS name : " + userManager.notAllowedCharsInUserName+"_", "Invalid name", function(){
						vfsAddNew.trigger("click", [value]);
					});
				}
				else if(vfsItemButtons.find("li[_name='"+escape(value)+"']").length>0)
				{
					jAlert("Same name for extra VFS item exists, please use another name", "Error", function(){
						vfsAddNew.trigger("click", [value]);
					});
				}
				else
				{
					panelSetup.addExtraVFS(value);
				}
			}
		});
		return false;
	});

	vfsItemButtons.find("a").live("click",function(evt, cb){
		if(!$(this).is("#vfsAddNew"))
		{
			$(this).closest("ul").find(".ui-tabs-selected").removeClass("ui-tabs-selected ui-state-active");
			$(this).closest("li").addClass("ui-tabs-selected ui-state-active");
			panelSetup.loadVFSInfo($(this), cb);
		}
		return false;
	});

    vfsItemButtons.find(".ui-icon-close").live("click", function(evt){
    	evt.stopPropagation();
    	var that = $(this);
    	if(vfsItemButtons.find(".vfsBtn").length>0)
    	{
    		jConfirm("Are you sure you wish to remove VFS item : <strong>\""+ that.parent().find("a").text() +"\"</strong>?", "Confirm", function(flag){
    			if(flag)
    			{
					panelSetup.remvoeVFSPanel(that.closest("li"));
    			}
    		});
    	}
    	else
    	{
    		jAlert("You can not delete base VFS item", "Error");
    	}
    	return false;
    });

    $("#saveUserDataVFSOnly").unbind().click(function(){
    	var _userName = $(document).data("userName");
    	crushFTP.UI.showLoadingIndicator(true);
		crushFTP.data.serverRequest({
			command: 'getUser',
			serverGroup : $("#userConnectionGroups").val() || "MainUsers",
			username : _userName
		},
		function(data){
			if(data)
			{
				var pnlEnabled = panelSetup._panel.find("#vfsCheckBox").find("input:checked").length>0;
				var xml = [];
				function traverseAndBuildXML(tree) {
				    $(tree).contents().each(function() {
				        if (this.nodeType == 3) {
				            xml.push(crushFTP.methods.xmlEncode($(this).text()));
				        } else {
				        	if($(this).attr("type"))
				        		xml.push("<"+this.nodeName+" type=\""+$(this).attr("type")+"\">");
				        	else
				        		xml.push("<"+this.nodeName+">");
				            traverseAndBuildXML(this);
				            xml.push("</"+this.nodeName+">");
				        }
				    });
				}
				traverseAndBuildXML($(data).find("user"));
				var usr = "<user type=\"properties\">" + xml.join("") + "</user>";
				if(pnlEnabled)
				{
					if(usr.indexOf("<root_dir>")>=0)
						usr = usr.replace("<root_dir></root_dir>", "<root_dir>/</root_dir>");
					else
						usr = usr.replace("</user>", "<root_dir>/</root_dir></user>");
				}
				else
				{
					if(usr.indexOf("<root_dir>")>=0)
					{
						var start = usr.indexOf("<root_dir>");
						var end = usr.indexOf("</root_dir>");
						var str = usr.substring(0, start);
						str = str + usr.substring(end + 11, usr.length);
						usr = str;
					}
				}
		    	var vfs_items = panelSetup.generateVFSXML(false, true);
				var permissions = panelSetup.generatePrivsXML(false, true);
				if(!vfs_items || vfs_items.length==0)
					vfs_items = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><vfs type=\"properties\"></vfs>";
				if(!permissions || permissions.length==0)
					permissions = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><permissions type=\"properties\"><item name=\"/\">(read)(view)(resume)</item></permissions>";

				crushFTP.UI.hideLoadingIndicator();
		    	userManager.dataRepo.saveUserInfo("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n"+ usr, vfs_items, permissions, _userName, "replace", function(response){
					crushFTP.UI.hideLoadingIndicator();
					if(response)
					{
						userManager.placeHolder.removeData("hasChanged");
						crushFTP.UI.growl("Message : ", "User VFS info saved", false, 3000);
					}
					else
					{
						crushFTP.UI.growl("Failure : ", response, true, true);
					}
				});
			}
		});
    	return false;
    });

	$("#cancelChangesVFSOnly").unbind().click(function(){
		window.parent.panelSetup.editUserVFSFramePopup.dialog("close");
		return false;
	});

	panelSetup.editUserVFSFramePopup = $("#editUserVFSFramePopup").dialog({
	    autoOpen: false,
	    modal: true,
	    title : "Update User's VFS :",
	    zIndex : 99999,
	    open: function(ev, ui){
	    	if(panelSetup.editVFSUser)
	    	{
				panelSetup.editUserVFSFramePopup.html('<iframe id="vfsDialogFrame" width="99%" height="99%" marginWidth="0" marginHeight="0" frameBorder="0" scrolling="auto" />');
				var serverGroup = $("#userConnectionGroups").val() || "MainUsers";
				var frame = $("#vfsDialogFrame", panelSetup.editUserVFSFramePopup).attr("src", "/WebInterface/UserManager/index.html?onlyVFS=true&username="+panelSetup.editVFSUser+"&serverGroup="+serverGroup);
				frame.bind("load", function(){
					panelSetup.editUserVFSFramePopup.dialog("widget").animate({
					    width: '90%',
					    height: '750px'
					  }, {
					  duration: 500,
					  step: function() {
					    panelSetup.editUserVFSFramePopup.dialog('option', 'position', 'center');
					  },
					  complete: function(){
					  	frame.css("height", "740px");
					  }
					});
				})
			}
	    },
	    close :function(){
	    	panelSetup.editUserVFSFramePopup.html("");
	    }
	});
	$('#showmetaInfo').unbind().bind("change", function(){
		if($(this).is(":checked")){
			panelSetup.vfsItemsDirList.addClass('show-meta-info');
		}
		else
		{
			panelSetup.vfsItemsDirList.removeClass('show-meta-info');
		}
	});
	var twoFactorProtocols = panelSetup._panel.find("#two-factor-protocols");
	$('#otp_auth', panelSetup._panel).unbind().bind("change", function(){
		if($(this).is(":checked")){
			twoFactorProtocols.show();
			twoFactorProtocols.find("input").each(function(){
				crushFTP.UI.checkUnchekInput($(this), false);
			})
			crushFTP.UI.checkUnchekInput($('#otp_auth_all', panelSetup._panel), true);
			$('#otp_auth_all', panelSetup._panel).change();
		}
		else
		{
			panelSetup._panel.find("#two-factor-protocols").hide();
		}
	});

	twoFactorProtocols.find("input:not('#otp_auth_all')").bind('change', function(event) {
		var allChecked = true;
		twoFactorProtocols.find("input:not('#otp_auth_all')").each(function(){
			if(!$(this).is(":checked"))
				allChecked = false;
		});
		if(allChecked){
			crushFTP.UI.checkUnchekInput($('#otp_auth_all', panelSetup._panel), true);
			$('#otp_auth_all', panelSetup._panel).change();
		}
		else{
			crushFTP.UI.checkUnchekInput($('#otp_auth_all', panelSetup._panel), false);
		}
	});

	$('#otp_auth_all', panelSetup._panel).unbind().bind("change", function(){
		if($(this).is(":checked")){
			twoFactorProtocols.find("input:not('#otp_auth_all')").each(function(){
				crushFTP.UI.checkUnchekInput($(this), true);
			});
		}
	});

	$("#clear2FASecret", panelSetup._panel).unbind().bind("click", function(){
		$("#twofactor_secret").val("").trigger('textchange');
		return false;
	});
}

panelSetup.remvoeVFSPanel = function(ref)
{
	var removeUser = ref.data("controlData");
	var isSelected = ref.hasClass("ui-tabs-selected");
	if(removeUser)
	{
		removeUser = $(document).data("userName") + "~" + removeUser;
		userManager.dataRepo.saveUserInfo("<?xml version=\"1.0\" encoding=\"UTF-8\"?><user type=\"properties\"><username>"+crushFTP.methods.htmlEncode(removeUser)+"</username><password></password><max_logins>0</max_logins><root_dir>/</root_dir></user>", "<?xml version=\"1.0\" encoding=\"UTF-8\"?><vfs type=\"properties\"></vfs>", "<?xml version=\"1.0\" encoding=\"UTF-8\"?><permissions type=\"properties\"><item name=\"/\">(read)(view)(resume)</item></permissions>", removeUser, "delete", function(response){
			crushFTP.UI.hideLoadingIndicator();
			if(response)
			{
				ref.remove();
				userManager.saveButton.trigger("click", [{fromSaveAndContniue:true, callBack : function(flag){
					if(flag)
					{
						crushFTP.UI.growl("Message : ", "VFS Item Removed : " + removeUser, false, 3000);
					}
					else
					{
						crushFTP.UI.growl("Failure : ", "There was a problem while removing extra vfs from user : " + removeUser, true, 3000);
					}
					if(isSelected)
						$("#vfsItemButtons").find(".vfsBtn:first").find("a").trigger("click");
				}}]);
			}
			else
			{
				crushFTP.UI.growl("Failure : ", response, true, true);
			}
		}, false, true);
	}
}

panelSetup.loadVFSInfo = function(ref, cb)
{
	var isChanged = userManager.placeHolder.data("hasChanged");
	panelSetup.extraVFS = ref.parent().data("controlData");
	var vfsLinks = $("#vfsItemButtons").data("extraVfsLinks");
	var defaultDir = crushFTP.serverConfig && crushFTP.serverConfig.userRoot ? crushFTP.serverConfig.userRoot.split(";")[0] : "/";
	panelSetup.userDirSelectList.val(defaultDir);
	if(panelSetup.extraVFS)
	{
		var usrExtraVFS = $(document).data("userName") + "~" + panelSetup.extraVFS;
		var zip, loadPreview;
		if(vfsLinks && vfsLinks[panelSetup.extraVFS]){
			zip = vfsLinks[panelSetup.extraVFS].zip;
			loadPreview = {
				user : usrExtraVFS,
				zip : zip
			};
		}
		if(typeof crushFTP.storage("extraUserInfo"+usrExtraVFS) == "undefined")
		{
			userManager.dataRepo.getUserInfo(usrExtraVFS, function(data, xml){
				ref.parent().addClass("hasUserVFSData");
				crushFTP.storage("extraUserInfo"+usrExtraVFS, data);
				crushFTP.storage("extraUserXML"+usrExtraVFS, xml);
				panelSetup.buildDirPrivs();
				panelSetup.userDirSelectList.change();
				setTimeout(function(){
					userManager.placeHolder.data("hasChanged", isChanged);
					if(cb)
						cb();
				}, 200);
			}, false, true, usrExtraVFS, false, loadPreview);
		}
		else
			panelSetup.userDirSelectList.change();
	}
	else
	{
		panelSetup.userDirSelectList.change();
	}
	setTimeout(function(){
		userManager.placeHolder.data("hasChanged", isChanged);
	}, 200);
}

panelSetup.renameSubVFSItem = function(ref)
{
	if(!ref)return;
	var renameVFS = ref.data("controlData");
	if(renameVFS)
	{
		var vfsItemButtons = $("#vfsItemButtons");
		function renamePrompt(name)
		{
			jPrompt("Rename item : ", name, "Rename", function(value){
				var newName = value;
				if(newName != null)
				{
					if(crushFTP.methods.hasSpecialCharacters(newName, userManager.notAllowedCharsInDirName) || crushFTP.methods.hasSpecialCharacters(newName, userManager.notAllowedCharsInUserName))
					{
						jAlert("You can not use these characters in VFS name : " + userManager.notAllowedCharsInUserName, "Invalid name", function(){
							renamePrompt(newName);
						});
					}
					else if(vfsItemButtons.find("li[_name='"+escape(newName)+"']").length>0)
					{
						jAlert("Same name for extra VFS item exists, please use another name", "Error", function(){
							renamePrompt(newName);
						});
					}
					else
					{
						userManager.data.renameExtraVFSInfo($(document).data("userName") + "~" + renameVFS, $(document).data("userName") + "~" + newName, function(flag){
							if(flag)
							{
								ref.attr("_name", escape(newName)).data("controlData", newName).find("a").text(newName).attr("href", "#vfs-" + escape(newName));
								var oldUserName = $(document).data("userName") + "~" + renameVFS;
								var newUserName = $(document).data("userName") + "~" + newName;

								if(crushFTP.storage("extraUserInfo" + oldUserName))
								{
									crushFTP.storage("extraUserInfo" + newUserName, crushFTP.storage("extraUserInfo" + oldUserName));
									crushFTP.removeStorage("extraUserInfo" + oldUserName);
								}
								if(crushFTP.storage("extraUserXML" + oldUserName))
								{
									crushFTP.storage("extraUserXML" + newUserName, crushFTP.storage("extraUserXML" + oldUserName));
									crushFTP.removeStorage("extraUserXML" + oldUserName);
								}
								if(crushFTP.storage("extraUserDirPrivs" + renameVFS))
								{
									crushFTP.storage("extraUserDirPrivs" + newName, crushFTP.storage("extraUserDirPrivs" + renameVFS));
									crushFTP.removeStorage("extraUserDirPrivs" + renameVFS);
								}
								if(crushFTP.storage("extraUserDirPrivsDefault" + renameVFS))
								{
									crushFTP.storage("extraUserDirPrivsDefault" + newName, crushFTP.storage("extraUserDirPrivsDefault" + renameVFS));
									crushFTP.removeStorage("extraUserDirPrivsDefault" + renameVFS);
								}
								if(ref.hasClass("ui-tabs-selected"))
								{
									if(panelSetup.extraVFS == renameVFS)
										panelSetup.extraVFS = newName;
									ref.find("a").trigger("click");
								}
							}
							else
							{
								crushFTP.UI.growl("Failure", "Failed while renaming VFS subitem, please retry", true, true);
							}
						});
					}
				}
			});
		}
		renamePrompt(renameVFS);
	}
}

panelSetup.addExtraVFS = function(name)
{
	if(name)
	{
		crushFTP.UI.showLoadingIndicator(true);
		var userName = $(document).data("userName") + "~" + name;
		userManager.dataRepo.saveUserInfo("<?xml version=\"1.0\" encoding=\"UTF-8\"?><user type=\"properties\"><username>"+crushFTP.methods.htmlEncode(userName)+"</username><password></password><max_logins>0</max_logins><root_dir>/</root_dir></user>", "<?xml version=\"1.0\" encoding=\"UTF-8\"?><vfs type=\"properties\"></vfs>", "<?xml version=\"1.0\" encoding=\"UTF-8\"?><permissions type=\"properties\"><item name=\"/\">(read)(view)(resume)</item></permissions>", userName, "new", function(response){
			crushFTP.UI.hideLoadingIndicator();
			if(response)
			{
				var vfsItemButtons = $("#vfsItemButtons");
				var btn = $('<li class="ui-state-default ui-corner-top vfsBtn" _name="'+escape(name)+'"><a href="#vfs-'+escape(name)+'">'+name+'</a><span class="ui-icon ui-icon-close pointer" role="presentation" style="float:right;">Remove Tab</span></li>');
				vfsItemButtons.append(btn);
				var listitems = vfsItemButtons.children('li.vfsBtn').get();
				listitems.sort(function(a, b) {
				   return $(a).text().toUpperCase().localeCompare($(b).text().toUpperCase());
				})
				$.each(listitems, function(idx, itm) { vfsItemButtons.append(itm); });
				vfsItemButtons.append(vfsItemButtons.find("#addNewBtn"));
				btn.data("controlData", name);
				userManager.saveButton.trigger("click", [{fromSaveAndContniue:true, callBack : function(flag){
					if(flag)
					{
						crushFTP.UI.growl("Message : ", "Extra VFS created : " + name, false, 3000);
						panelSetup.bindContextMenu();
					}
					else
					{
						crushFTP.UI.growl("Failure : ", "There was a problem while adding extra vfs to user : " + name, true, 3000);
					}
				}}]);
			}
			else
			{
				crushFTP.UI.growl("Failure : ", response, true, true);
			}
		}, false, true);
	}
}

panelSetup.saveExtraVFSItems = function(cb)
{
	var vfsItemButtons = $("#vfsItemButtons");
	if(vfsItemButtons.find(".vfsBtn.hasUserVFSData").length>0)
	{
		var curExtraVFS = panelSetup.extraVFS;
		vfsItemButtons.find(".vfsBtn.hasUserVFSData").each(function(){
			$(this).addClass("pendingSave");
		});

		function saveExtraVFSInfo(user, callback)
		{
			panelSetup.extraVFS = user;
			var privs = panelSetup.generatePrivsXML();
			var vfs = panelSetup.generateVFSXML();
			if(!vfs)
			{
				vfs = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><vfs type=\"properties\"></vfs>";
			}
			if(!privs)
			{
				privs = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><VFS type=\"properties\"><item name=\"/\">(read)(view)(resume)</item></VFS>";
			}
			if($(document).data("userName"))
			{
				var userName = $(document).data("userName") + "~" + user;
				userManager.dataRepo.saveUserInfo("<?xml version=\"1.0\" encoding=\"UTF-8\"?><user type=\"properties\"><username>"+crushFTP.methods.htmlEncode(userName)+"</username><password></password><max_logins>0</max_logins><root_dir>/</root_dir></user>", vfs, privs, userName, "replace", function(response){
					if(!response)
					{
						crushFTP.UI.growl("Failure : ", response, true, true);
					}
					callback();
				}, false, true);
			}
			else
			{
				callback();
			}
		}

		function saveNext()
		{
			crushFTP.UI.showLoadingIndicator({
				message : "Saving Extra VFS Items..",
				title : "Wait..."
			});
			var pendingBtn = vfsItemButtons.find(".pendingSave:first");
			if(pendingBtn.length>0)
			{
				var vfsData = $(pendingBtn).data("controlData");
				if(vfsData)
				{
					saveExtraVFSInfo(vfsData, function(){
						pendingBtn.removeClass("pendingSave");
						saveNext();
					})
				}
			}
			else
			{
				crushFTP.UI.hideLoadingIndicator();
				panelSetup.extraVFS = curExtraVFS;
				if(cb)
					cb();
			}
		}
		saveNext();
	}
	else{
		if(cb)
			cb();
	}
}

panelSetup.showHideServerOperationButtons = function()
{
	var serverItemSelected = panelSetup.serverDirBrowsePanel.find("li.ui-widget-header");
	if(serverItemSelected.length>0)
	{
		panelSetup.serverItemOperations.find("li.moveRight").removeClass("ui-state-disabled");
	}
	else
		panelSetup.serverItemOperations.find("li.moveRight").addClass("ui-state-disabled");
	if(panelSetup.serverDirSelectList.val() == "/")
	{
		panelSetup.serverItemOperations.find("li:not(.moveRight, .show-miniurls)").addClass("ui-state-disabled");
		return false;
	}
	else
	{
		panelSetup.serverItemOperations.find("li.newFolder").removeClass("ui-state-disabled");
	}
	var items = panelSetup.serverItemOperations.find("li.remove, li.rename").addClass("ui-state-disabled");
	if(serverItemSelected.length>0)
	{
		items.removeClass("ui-state-disabled");
	}
}

panelSetup.showHideVFSOperationButtons = function()
{
	panelSetup.vfsItemOperations.find("li:not(.show-miniurls)").addClass("ui-state-disabled");
	var userItemSelected = panelSetup.vfsItemsDirList.find("li.ui-widget-header");
	if(userItemSelected.length>0)
	{
		var name = unescape($(userItemSelected).attr("name"));
		var curPath = panelSetup.userDirSelectList.val();
		var matchedElem = panelSetup.checkIfCurrentDirIsVFSItem(curPath, name);
		if(matchedElem)
		{
			panelSetup.vfsItemOperations.find("li.remove, li.rename").removeClass("ui-state-disabled");
			if(matchedElem.url.length>0)
			{
				panelSetup.vfsItemOperations.find("li.properties,li.duplicate,li.copy").removeClass("ui-state-disabled");
			}
			else
			{
				panelSetup.vfsItemOperations.find("li.properties,li.duplicate,li.copy").addClass("ui-state-disabled");
			}
		}
	}
	var curPath = panelSetup.userDirSelectList.val();
	if(panelSetup.checkIfCurrentDirIsVFSItem(curPath))
	{
		panelSetup.vfsItemOperations.find("li.newFolder, li.newItem").removeClass("ui-state-disabled");
		var copiedVFSItems = $(document).data("copiedVFSItems");
		if(copiedVFSItems && copiedVFSItems.length>0)
		{
			panelSetup.vfsItemOperations.find("li.paste").removeClass("ui-state-disabled").find('span.count').text(copiedVFSItems.length);
		}
		else
			panelSetup.vfsItemOperations.find("li.paste").addClass("ui-state-disabled");
	}
}

panelSetup.updateOrAddVFSPropertiesForItemByName = function(name, properties, newName)
{
	var matchedElem = panelSetup.updateVFSPropertiesForItemByName(name, properties, false, newName);
	if(!matchedElem)
	{
		var currentUser = crushFTP.storage("currentUser");
		if(panelSetup.extraVFS)
		{
			var usrExtraVFS = $(document).data("userName") + "~" + panelSetup.extraVFS;
			currentUser = crushFTP.storage("extraUserInfo"+usrExtraVFS);
		}

		if(!currentUser.vfs_items)
		{
			currentUser.vfs_items = {};
		}
		if(!currentUser.vfs_items.vfs_items_subitem)
		{
			currentUser.vfs_items.vfs_items_subitem = [];
		}
		crushFTP.methods.rebuildSubItems(currentUser.vfs_items, "vfs_items");
		currentUser.vfs_items.vfs_items_subitem.push({
			vfs_items_subitem_subitem :  properties
		});

		var isRemote = false;
		var matchedElem = panelSetup.checkIfCurrentDirIsVFSItem(properties.path, properties.name);
		if(matchedElem && matchedElem.url && matchedElem.url.length == 0)
		{
			isRemote = true;
		}
		var curName = properties.path + properties.name.toUpperCase() + "/";
		var GUIXMLPrefs = $(document).data("GUIXMLPrefs");
		var parentPrivs = false;
		if(GUIXMLPrefs && GUIXMLPrefs.user_default_folder_privs)
		{
			parentPrivs = GUIXMLPrefs.user_default_folder_privs;
		}
		if(parentPrivs)
		{
			if(isRemote)
			{
				parentPrivs = parentPrivs.replace("(write)","").replace("(delete)","").replace("(deletedir)","").replace("(makedir)","");
			}
			panelSetup.updateItemPrivs(curName.toUpperCase(), parentPrivs);
		}
		if((crushFTP.methods.queryString("tour") == "y" || $.jStorage.get("tour") == "y")){
			nextStep();
			setTimeout(function(){
				nextStep();
			}, 2000)
		}
	}
}

panelSetup.updateVFSPropertiesForItemByName = function(name, properties, remove, newName)
{
	var matchedElem = false;
	var rename = false;
	if(newName)
		rename = name != newName;
	var currentUser = crushFTP.storage("currentUser");
	if(panelSetup.extraVFS)
	{
		var usrExtraVFS = $(document).data("userName") + "~" + panelSetup.extraVFS;
		currentUser = crushFTP.storage("extraUserInfo"+usrExtraVFS);
	}
	if(currentUser.vfs_items && currentUser.vfs_items.vfs_items_subitem)
	{
		crushFTP.methods.rebuildSubItems(currentUser.vfs_items, "vfs_items");
		var curVFSItems = currentUser.vfs_items.vfs_items_subitem;
		for(var i=0;i<curVFSItems.length;i++)
		{
			var curItem = curVFSItems[i];
			if(curItem.vfs_items_subitem_subitem && curItem.vfs_items_subitem_subitem.name)
			{
				var itemName = unescape(curItem.vfs_items_subitem_subitem.name.toLowerCase());
				var path = unescape(curItem.vfs_items_subitem_subitem.path.toLowerCase());
				if(name.toLowerCase() == itemName && properties.path.toLowerCase() == path)
				{
					if(remove)
					{
						matchedElem = curItem.vfs_items_subitem_subitem;
						currentUser.vfs_items.vfs_items_subitem.remove(i);
					}
					else
					{
						curItem.vfs_items_subitem_subitem = properties;
						if(rename)
						{
							curItem.vfs_items_subitem_subitem.name = newName;
							var curPrivs = crushFTP.storage("currentUserDirPrivs") || new Object();
							if(panelSetup.extraVFS)
								curPrivs = crushFTP.storage("extraUserDirPrivs"+panelSetup.extraVFS) || new Object();
							var curName = properties.path + itemName.toUpperCase() + "/";
							var renName = properties.path + newName.toUpperCase() + "/";
							if(curPrivs[curName])
							{
								curPrivs[renName] = curPrivs[curName];
								delete curPrivs[curName];
							}
						}
						var subItem = curItem.vfs_items_subitem_subitem;
						matchedElem = subItem;
					}
					i = curVFSItems.length;
				}
			}
		}
	}
	return matchedElem;
}

panelSetup.getVFSPropertiesForItemByName = function(name, rootDir)
{
	var matchedElem = false;
	var currentUser = crushFTP.storage("currentUser");
	if(panelSetup.extraVFS)
	{
		var usrExtraVFS = $(document).data("userName") + "~" + panelSetup.extraVFS;
		currentUser = crushFTP.storage("extraUserInfo"+usrExtraVFS);
	}
	if(currentUser.vfs_items && currentUser.vfs_items.vfs_items_subitem)
	{
		crushFTP.methods.rebuildSubItems(currentUser.vfs_items, "vfs_items");
		var curVFSItems = currentUser.vfs_items.vfs_items_subitem;
		var itemPath = crushFTP.methods.decodeXML(unescape(rootDir));
		for(var i=0;i<curVFSItems.length;i++)
		{
			var curItem = curVFSItems[i];
			if(curItem.vfs_items_subitem_subitem)
			{
				var subItem = curItem.vfs_items_subitem_subitem;
				var itemName = crushFTP.methods.decodeXML(unescape(subItem.name));
				if(crushFTP.methods.decodeXML(unescape(name)) == itemName  && crushFTP.methods.decodeXML(unescape(subItem.path)) == itemPath)
				{
					matchedElem = $.extend(true, {}, subItem);
					i = curVFSItems.length;
				}
			}
		}
	}
	return matchedElem;
}

panelSetup.checkIfCurrentDirIsVFSItem = function(path, name)
{
	if(unescape(path) == "/" && !name)return true;
	var matchedElem = false;
	var currentUser = crushFTP.storage("currentUser");
	if(!currentUser)return matchedElem;
	if(panelSetup.extraVFS)
	{
		var usrExtraVFS = $(document).data("userName") + "~" + panelSetup.extraVFS;
		currentUser = crushFTP.storage("extraUserInfo"+usrExtraVFS);
	}
	if(currentUser && currentUser.vfs_items && currentUser.vfs_items.vfs_items_subitem)
	{
		crushFTP.methods.rebuildSubItems(currentUser.vfs_items, "vfs_items");
		var curVFSItems = currentUser.vfs_items.vfs_items_subitem;
		for(var i=0;i<curVFSItems.length;i++)
		{
			var curItem = curVFSItems[i];
			if(curItem.vfs_items_subitem_subitem)
			{
				var subItem = curItem.vfs_items_subitem_subitem;
				var itemName = unescape(subItem.name);
				var itemPath = unescape(subItem.path);
				if(name)
				{
					if(crushFTP.methods.decodeXML(unescape(itemPath + itemName + "/")) == crushFTP.methods.decodeXML(unescape(path + name + "/")))
					{
						matchedElem = $.extend(true, {}, subItem);
						i = curVFSItems.length;
					}
				}
				else
				{
					if(crushFTP.methods.decodeXML(unescape(path)) == crushFTP.methods.decodeXML(unescape(itemPath + itemName + "/")) && subItem.url == "")
					{
						matchedElem = $.extend(true, {}, subItem);
						i = curVFSItems.length;
					}
				}
			}
		}
	}
	return matchedElem;
}

panelSetup.bindPropertiesWindowDataForSelectedItem = function(selected)
{
	var name = selected ? unescape(selected.attr("name")) : "";
	var curPath = panelSetup.userDirSelectList.val();
	var root_dir = selected ? unescape(selected.attr("rootDir")) : "/";
	var matchedElem = selected ? panelSetup.getVFSPropertiesForItemByName(name, root_dir) : {
		name : "",
		path : curPath,
		type : "DIR",
		url : "FILE:/",
		acceptAnyCert : "true",
		random_id : "true",
		multithreaded_s3 : "false",
		s3_stat_head_calls : "true",
		s3_stat_head_calls_double : "true"
	};
	if(matchedElem)
	{
		var fieldPropertiesDialog = $("#fieldPropertiesDialog");
		var item_option_itemType = $("#item_option_itemType", fieldPropertiesDialog);
		fieldPropertiesDialog.clearForm();
		fieldPropertiesDialog.find("#itemProperty_option_url").removeData('password');
		$("#itemProperty_option_ftpEncryption", fieldPropertiesDialog).val("false");
		var url = matchedElem.url;
		url = unescape(url);
		var lowCaseURL = url.toLowerCase();
		if(lowCaseURL.indexOf("file:") == 0)
		{
			item_option_itemType.val("file");
		}
		else if(lowCaseURL.indexOf("memory:") == 0)
		{
			item_option_itemType.val("memory");
		}
		else if(lowCaseURL.indexOf("rfile:") == 0)
		{
			item_option_itemType.val("rfile");
		}
		else if(lowCaseURL.indexOf("hadoop:") == 0)
		{
			item_option_itemType.val("hadoop");
		}
		else if(lowCaseURL.indexOf("azure:") == 0)
		{
			item_option_itemType.val("azure");
		}
		else if(lowCaseURL.indexOf("smb:") == 0)
		{
			item_option_itemType.val("smb");
		}
		else if(lowCaseURL.indexOf("smb3:") == 0)
		{
			item_option_itemType.val("smb3");
		}
		else if(lowCaseURL.indexOf("ftp:") == 0)
		{
			item_option_itemType.val("ftp");
		}
		else if(lowCaseURL.indexOf("http:") == 0)
		{
			item_option_itemType.val("http");
		}
		else if(lowCaseURL.indexOf("https:") == 0)
		{
			item_option_itemType.val("https");
		}
		else if(lowCaseURL.indexOf("webdav:") == 0)
		{
			item_option_itemType.val("webdav");
		}
		else if(lowCaseURL.indexOf("webdavs:") == 0)
		{
			item_option_itemType.val("webdavs");
		}
		else if(lowCaseURL.indexOf("ftps:") == 0)
		{
			item_option_itemType.val("ftps");
		}
		else if(lowCaseURL.indexOf("ftpes:") == 0)
		{
			item_option_itemType.val("ftpes");
		}
		else if(lowCaseURL.indexOf("sftp:") == 0)
		{
			item_option_itemType.val("sftp");
		}
		else if(lowCaseURL.indexOf("custom") == 0)
		{
			item_option_itemType.val("custom");
		}
		else if(lowCaseURL.indexOf("s3crush") == 0)
		{
			item_option_itemType.val("s3crush");
		}
		else if(lowCaseURL.indexOf("s3") == 0)
		{
			item_option_itemType.val("s3");
		}
		else if(lowCaseURL.indexOf("gdrive") == 0)
		{
			item_option_itemType.val("gdrive");
		}
		else if(lowCaseURL.indexOf("citrix") == 0)
		{
			item_option_itemType.val("citrix");
		}
		else if(lowCaseURL.indexOf("glacier:") == 0)
		{
			item_option_itemType.val("glacier");
		}
		if(matchedElem.use_dmz && (matchedElem.use_dmz.indexOf("socks://") == 0 || matchedElem.use_dmz.indexOf("internal://") == 0))
        {
            fieldPropertiesDialog.find("#itemProperty_option_use_dmz").find("option[_rel='custom']").attr("value", matchedElem.use_dmz).text(matchedElem.use_dmz + " (custom)");
        }
        window.applyingChanges = true;
        if(typeof matchedElem.random_id == "undefined")
        {
            matchedElem.random_id = "true|||||";
        }
        if(typeof matchedElem.multithreaded_s3 == "undefined")
        {
            matchedElem.multithreaded_s3 = "false|||||";
        }
        if(typeof matchedElem.proxyActivePorts == "undefined")
        {
            matchedElem.proxyActivePorts = "1025-65535|||||";
        }
        if(typeof matchedElem.s3_stat_head_calls == "undefined")
        {
            matchedElem.s3_stat_head_calls = "true|||||";
        }
        if(typeof matchedElem.s3_stat_head_calls_double == "undefined")
        {
            matchedElem.s3_stat_head_calls_double = "true|||||";
        }
		userManager.data.bindValuesFromJson(fieldPropertiesDialog, matchedElem, "_name", true);
		if(matchedElem.use_dmz == "false" || matchedElem.use_dmz == "")
        {
            fieldPropertiesDialog.find("#itemProperty_option_use_dmz").find("option:first").attr("selected", "selected");
        }
		window.applyingChanges = false;
		fieldPropertiesDialog.find("#itemProperty_option_use_dmz").unbind('change.custom').bind("change.custom", function(evt){
            if(window.applyingChanges)return false;
            var that = $(this);
            if ($(this).find(":selected").attr("_rel") == "custom") {
                var dmzCustomOptions = $("#dmzCustomOptions").dialog("open");
                var val = that.val();
                if(that.val() != "")
                {
                    if(val == "internal://")
                    {
                        dmzCustomOptions.find("#customDMZType").val("internal://").change();
                        dmzCustomOptions.find("#customDMZHost").val("");
                        dmzCustomOptions.find("#customDMZPort").val("");
                    }
                    else if(val.indexOf("socks")==0)
                    {
                        var url = val.split("//");
                        dmzCustomOptions.find("#customDMZType").val("socks5").change();
                        if(url[1].indexOf(":")>0)
                        {
                            var items = url[1].split(":");
                            dmzCustomOptions.find("#customDMZHost").val(items[0]);
                            dmzCustomOptions.find("#customDMZPort").val(items[1]);
                        }
                        else
                        {
                            dmzCustomOptions.find("#customDMZHost").val(url[1]);
                        }
                    }
                    else
                    {
                        dmzCustomOptions.find("#customDMZHost").val("");
                        dmzCustomOptions.find("#customDMZPort").val("");
                    }
                }
                window.afterCustomDMZSelection = function(canceled){
                    if(canceled)
                    {
                        if(val == "custom")
                            that.val("false");
                    }
                    else
                    {
                        var type = dmzCustomOptions.find("#customDMZType").val();
                        var host =  dmzCustomOptions.find("#customDMZHost").val();
                        var port =  dmzCustomOptions.find("#customDMZPort").val();
                        var DMZValue = type;
                        if(type == "socks5")
                        {
                            if(port.length>0)
                                DMZValue = "socks://" + host + ":" + port;
                            else
                                DMZValue = "socks://" + host;
                        }
                        that.find(":selected").attr("value", DMZValue);
                        that.find(":selected").text(DMZValue + " (custom)");
                        that.trigger('change');

                        dmzCustomOptions.find("#customDMZHost").val("");
                        dmzCustomOptions.find("#customDMZPort").val("");
                    }
                };
                evt.preventDefault();
                evt.stopPropagation();
                return false;
            };
        });

		if(lowCaseURL.indexOf("glacier") == 0){
			var _url = URI(matchedElem.url);
			var _path = _url.path();
			$("#itemProperty_option_glacierServerURL", fieldPropertiesDialog).val(_url.hostname());
		}
		if(lowCaseURL.indexOf("s3") == 0 || lowCaseURL.indexOf("s3crush") == 0)
		{
			var _url = URI(matchedElem.url);
			var _path = _url.path();
            var _bucket = "";
            if(_path)
            {
                if(_path.indexOf("/")==0)
                {
                    var __path = _path.replace("/", "");
                    _bucket = __path.substr(0, __path.indexOf("/"));
                    _path = _path.replace("/"+_bucket, "");
                }
            }
            if(matchedElem)
            {

	            if(typeof matchedElem.random_id == "undefined")
	            {
	                matchedElem.random_id = "true|||||";
	            }
	            if(typeof matchedElem.multithreaded_s3 == "undefined")
		        {
		            matchedElem.multithreaded_s3 = "false|||||";
		        }
		        if(typeof matchedElem.s3_stat_head_calls == "undefined")
		        {
		            matchedElem.s3_stat_head_calls = "true|||||";
		        }
		        if(typeof matchedElem.s3_stat_head_calls_double == "undefined")
		        {
		            matchedElem.s3_stat_head_calls_double = "true|||||";
		        }
            }
            $("#itemProperty_option_s3serverURL", fieldPropertiesDialog).val(_url.hostname());
            $("#itemProperty_option_s3_bucket", fieldPropertiesDialog).val(_bucket);
            $("#itemProperty_option_s3_path", fieldPropertiesDialog).val(_path);
			$("#itemProperty_option_secretKeyID", fieldPropertiesDialog).val(_url.username()).trigger("textchange");
			$("#itemProperty_option_secretKey", fieldPropertiesDialog).val(_url.password()).trigger("textchange");
			if(lowCaseURL.indexOf("s3-accelerate.amazonaws.com")>=0){
				crushFTP.UI.checkUnchekInput($("#itemProperty_option_s3_accelerate", fieldPropertiesDialog), true);
				setTimeout(function(){
					$("#itemProperty_option_s3serverURL", fieldPropertiesDialog).val("s3.amazonaws.com").trigger('change');
				});
			}
		}
		if(lowCaseURL.indexOf("gdrive") == 0)
		{
			$("#itemProperty_option_gdrive_secretKeyID", fieldPropertiesDialog).trigger("textchange");
		}
		url = fieldPropertiesDialog.find("#itemProperty_option_url").val();
		if(url.indexOf("file:") != 0)
		{
			if(url.indexOf("://")>=0)
			{
				url = url.substr(url.indexOf("://") + 3, url.length);
				if(url.indexOf("@")>=0)
				{
					url = url.substr(0, url.indexOf("@"));
					if(url && url.indexOf(":")>=0)
					{
						var cred = url.split(":");
						if(cred.length>0)
						{
							$("#itemProperty_option_user_name", fieldPropertiesDialog).val(cred[0]);
						}
						if(cred.length>1)
						{
							var pass = fieldPropertiesDialog.find("#itemProperty_option_url").data("password");
							$("#itemProperty_option_password", fieldPropertiesDialog).val(pass);
						}
					}
				}
			}
		}

	    function bindCustomValEvents(elem)
	    {
	        elem.find("input.custVal").bind("textchange", function(){
	            var prnt = $(this).closest("div.customVal");
	            var val = $(this).val();
	            if(val)
	            {
	                var type = prnt.find(".customScriptType").val();
	                prnt.find("textarea.origVal").attr("_name", type + "_" + val.replace(/ /g, "_").replace(/[^a-zA-Z 0-9]/g, '_') + "_script");
	            }
	            else
	            {
	                prnt.find("textarea.origVal").removeAttr("_name");
	            }
	        });

	        elem.find("select.customScriptType").bind("change", function(){
	            var prnt = $(this).closest("div.customVal");
	            var type = $(this).val();
	            var val = prnt.find("input.custVal").val();
	            if(val)
	            {
	                prnt.find("textarea.origVal").attr("_name", type + "_" + val.replace(/ /g, "_").replace(/[^a-zA-Z 0-9]/g, '_') + "_script");
	            }
	            else
	            {
	                prnt.find("textarea.origVal").removeAttr("_name");
	            }
	        });

	        elem.find("textarea.custVal").bind("textchange", function(){
	            var prnt = $(this).closest("div.customVal");
	            var val = $(this).val();
	            prnt.find("textarea.origVal").val(val);
	        });
	    }

	    setTimeout(function(){
	        bindCustomValEvents(fieldPropertiesDialog.find(".customVal"));
	        fieldPropertiesDialog.find(".customVal").find("input, textarea").trigger('textchange');
	        fieldPropertiesDialog.find(".customVal").find("select").trigger('change');
	    }, 300);
	    bindCustomValEvents(fieldPropertiesDialog.find(".customVal"));
		var existingData = [];
		var scriptType = fieldPropertiesDialog.find(".scriptType")
	    for(var item in matchedElem)
	    {
	        if(item.match("script$") && (item.match("^before") || item.match("^after")) && scriptType.find("option[value='"+item+"']").length==0)
	        {
	        	var type = item.split("_")[0];
	            existingData.push({
	                type : item.split("_")[0],
	                verb : item.replace(type+"_", "").replace("_script",""),
	                value : matchedElem[item],
	                id : item
	            });
	        }
	    }
	    panelSetup.rebuildCustomScripts = function(){
	        for (var i = existingData.length - 1; i >= 0; i--) {
	            var id = existingData[i].id;
	            if(fieldPropertiesDialog.find("textarea[_name='"+id+"']").length==0)
	            {
	                try{
	                    delete matchedElem[id];
	                }catch(ex){}
	            }
	        };
	    }
	    fieldPropertiesDialog.find(".customScriptsPanel").hide();
	    fieldPropertiesDialog.find("#scriptType").val("before_login_script").trigger("change");
	    var custom_scripts = fieldPropertiesDialog.find("#custom_scripts");
	    custom_scripts.empty().append(fieldPropertiesDialog.find("#customScriptTemplate").html());
	    custom_scripts.find(".customVal").EnableMultiField({
	        confirmOnRemove: false,
	        data: existingData,
	        linkText : "",
	        linkClass : "addItemFileParser2",
	        removeLinkText : "",
	        removeLinkClass : "removeItemFileParser2",
	        addEventCallback : function(newElem, clonnedFrom){
	            newElem.form();
	            newElem.prepend("<hr style='margin: 3px 0px 10px 0px;border: 1px solid #ccc;border-width:0px 0px 1px 0px;' />");
	            bindCustomValEvents(newElem);
	        },
	        removeEventCallback : function(prev, self, uid){
	        }
	    });

	    if(existingData && existingData.length>0)
	    {
	    	setTimeout(function(){
	    		custom_scripts.find(".removeItemFileParser2:last").click();
	    	}, 100);
	    }
	    setTimeout(function(){
			$("#fieldPropertiesDialog").find(".maskPasswordOnURL").trigger("textchange");
		}, 300);
		fieldPropertiesDialog.data("curItemData", matchedElem);
	}
}

panelSetup.bindEncryptionWindowDataForSelectedItem = function(selected)
{
	if(!selected)return;
	var fieldAdvancedDialog = $("#fieldAdvancedDialog");
	var vfsOptions = $("#vfsOptions", panelSetup._panel);
	var privs = $("#advancedVFSOptions", vfsOptions).data("privs");
	if(!privs)return;
	function bindPopupFields(panel, data)
	{
		var inputs = panel.find("input");
		for(var i in data)
		{
			var curPriv = data[i];
			if(curPriv)
			{
				inputs.each(function(){
					if($(this).attr("_name") == i)
					{
						if($(this).attr("type") == "checkbox")
						{
							crushFTP.UI.checkUnchekInput($(this), curPriv+"" == "true");
						}
						else
						{
							$(this).val(unescape(curPriv));
						}
						return false;
					}
				});
			}
		}
	}

	var encryption = privs.encryption;
	if(encryption)
	{
		bindPopupFields(fieldAdvancedDialog.find(".encryption"), encryption);
	}

	var sync = privs.sync;
	if(sync)
	{
		bindPopupFields(fieldAdvancedDialog.find(".sync"), sync);
	}

	var posix = privs.posix;
	if(posix)
	{
		bindPopupFields(fieldAdvancedDialog.find(".posix"), posix);
	}
	bindPopupFields(fieldAdvancedDialog.find(".extra"), privs);
	fieldAdvancedDialog.attr("isChanged", false);
}

panelSetup.showHideItemPropertiesSettings = function(controlData)
{
	var fieldPropertiesDialog = $("#fieldPropertiesDialog");
	var ftpCredentials = $(".ftpCredentials", fieldPropertiesDialog).show();
	var ftpOptions = $(".ftpOptions", fieldPropertiesDialog).hide();
	var sftpOptions = $(".sftpOptions", fieldPropertiesDialog).hide();
	var ftpsOptions = $(".ftpsOptions", fieldPropertiesDialog).hide();
	var ftpesOptions = $(".ftpesOptions", fieldPropertiesDialog).hide();
	var s3Credentials = $(".s3Credentials", fieldPropertiesDialog).hide();
	var glacierCredentials = $(".glacierCredentials", fieldPropertiesDialog).hide();
	var s3CrushCredentials = $(".s3CrushCredentials", fieldPropertiesDialog).hide();
	var smb3Option = $(".smb3Option", fieldPropertiesDialog).hide();
	var gdriveCredentials = $(".gdriveCredentials", fieldPropertiesDialog).hide();
	var citrixCredentials = $(".citrixCredentials", fieldPropertiesDialog).hide();
	var itemURLOption = $(".itemURLOption", fieldPropertiesDialog).show();
	var HAOptions = $(".HAOptions", fieldPropertiesDialog).show();
	var SSLOptions = $(".SSLOptions", fieldPropertiesDialog).hide();
	var privateOptions = $(".privateOptions", fieldPropertiesDialog).hide();
	var commonFTPOptions = $(".commonFTPOptions", fieldPropertiesDialog).hide();
	var nonSftpOptions = $(".nonSftpOptions", fieldPropertiesDialog);
	var as2Options = $(".as2Options", fieldPropertiesDialog).hide();
	var httpOptions = $(".httpOptions", fieldPropertiesDialog).hide();
	var noFileOption = $(".noFileOption", fieldPropertiesDialog).show();
	var rFileOption = $(".rfileOption", fieldPropertiesDialog).hide();
	fieldPropertiesDialog.find(".hadoop-vfs-option").removeClass('hadoop-vfs-option');
	var hadoopOption = $(".hadoopOption, .hadoopOption2", fieldPropertiesDialog).hide();
	var azureOption = $(".azureOption", fieldPropertiesDialog).hide();

	var item_option_itemType = $("#item_option_itemType", fieldPropertiesDialog).val();
	ftpOptions.find("select").unbind().change(function(){
		if($(this).val() == "true")
		{
			if(item_option_itemType == "ftp"){
				$("#item_option_itemType", fieldPropertiesDialog).val("ftpes").trigger('change');
				$(this).val("false");
			}
		}
		else
		{
			SSLOptions.hide();
		}
	}).trigger("change");

	if(item_option_itemType == "http" || item_option_itemType == "https")
	{
		httpOptions.show();
	}
	if(item_option_itemType == "file")
	{
		ftpCredentials.hide();
		HAOptions.hide();
		noFileOption.hide();
	}
	if(item_option_itemType == "memory")
	{
		ftpCredentials.hide();
		HAOptions.hide();
		noFileOption.hide();
	}
	if(item_option_itemType == "smb" || item_option_itemType == "smb3" || item_option_itemType == "rfile" || item_option_itemType == "glacier")
	{
		ftpCredentials.show();
		HAOptions.hide();
		noFileOption.hide();
	}
	if(item_option_itemType == "smb3"){
		smb3Option.show();
	}
	if(item_option_itemType == "rfile")
	{
		rFileOption.show();
	}
	if(item_option_itemType == "hadoop")
	{
		hadoopOption.show();
		$(".hadoopOption2 td").addClass('hadoop-vfs-option');
	}
	if(item_option_itemType == "azure")
	{
		azureOption.show();
		HAOptions.hide();
	}
	if(item_option_itemType == "s3" || item_option_itemType == "s3crush")
	{
		ftpCredentials.hide();
		s3Credentials.show();
	}
	if(item_option_itemType == "glacier")
	{
		ftpCredentials.hide();
		glacierCredentials.show();
	}
	if(item_option_itemType == "s3crush")
	{
		s3CrushCredentials.show();
	}
	if(item_option_itemType == "gdrive")
	{
		ftpCredentials.hide();
		gdriveCredentials.show();
	}
	if(item_option_itemType == "citrix")
	{
		citrixCredentials.show();
		ftpCredentials.hide();
	}
	if(item_option_itemType == "custom")
	{
		as2Options.show();
		HAOptions.hide();
	}
	if(item_option_itemType == "sftp")
	{
		privateOptions.show();
		sftpOptions.show();
	}
	if(item_option_itemType == "ftps" || item_option_itemType == "ftpes" || item_option_itemType == "https" || item_option_itemType == "webdavs")
	{
		SSLOptions.show();
	}
	if(item_option_itemType == "ftp")
	{
		ftpOptions.show();
	}
	if(item_option_itemType == "ftp" || item_option_itemType == "ftps" || item_option_itemType == "ftpes")
	{
		ftpsOptions.show();
	}
	if(item_option_itemType == "ftps" || item_option_itemType == "ftpes")
	{
		ftpesOptions.show();
	}
	if(item_option_itemType.indexOf("ftp")>=0)
		commonFTPOptions.show();
	if(item_option_itemType == "sftp")
	{
		nonSftpOptions.hide();
	}
	fieldPropertiesDialog.find(".customScriptBtn").unbind().click(function(){
        $(this).closest(".ftpOptions").find(".customScriptsPanel").toggle();
        return false;
    });

    fieldPropertiesDialog.find(".scriptType").unbind().change(function(){
        $(this).closest(".customScriptsPanel").find(".valPanel").hide();
        $(this).closest(".customScriptsPanel").find(".valPanel[rel='"+$(this).val()+"']").show();
        return false;
    }).trigger("change");
}

panelSetup.buildPropertiesURLReverse = function(){
	var fieldPropertiesDialog = $("#fieldPropertiesDialog");
	var itemProperty_option_url = fieldPropertiesDialog.find("#itemProperty_option_url");
	var item_option_itemType = $("#item_option_itemType", fieldPropertiesDialog).addClass('notextChange');
	var cur_url = itemProperty_option_url.val();
	var lowCaseURL = cur_url.toLowerCase();
	if(lowCaseURL.indexOf("file:") == 0)
	{
		item_option_itemType.val("file").trigger("change");
	}
	else if(lowCaseURL.indexOf("memory:") == 0)
	{
		item_option_itemType.val("memory").trigger("change");
	}
	else if(lowCaseURL.indexOf("rfile:") == 0)
	{
		item_option_itemType.val("rfile").trigger("change");
	}
	else if(lowCaseURL.indexOf("hadoop:") == 0)
	{
		item_option_itemType.val("hadoop").trigger("change");
	}
	else if(lowCaseURL.indexOf("azure:") == 0)
	{
		item_option_itemType.val("azure").trigger("change");
	}
	else if(lowCaseURL.indexOf("smb:") == 0)
	{
		item_option_itemType.val("smb").trigger("change");
	}
	else if(lowCaseURL.indexOf("smb3:") == 0)
	{
		item_option_itemType.val("smb3").trigger("change");
	}
	else if(lowCaseURL.indexOf("ftp:") == 0)
	{
		item_option_itemType.val("ftp").trigger("change");
	}
	else if(lowCaseURL.indexOf("http:") == 0)
	{
		item_option_itemType.val("http").trigger("change");
	}
	else if(lowCaseURL.indexOf("https:") == 0)
	{
		item_option_itemType.val("https").trigger("change");
	}
	else if(lowCaseURL.indexOf("webdav:") == 0)
	{
		item_option_itemType.val("webdav").trigger("change");
	}
	else if(lowCaseURL.indexOf("webdavs:") == 0)
	{
		item_option_itemType.val("webdavs").trigger("change");
	}
	else if(lowCaseURL.indexOf("ftps:") == 0)
	{
		item_option_itemType.val("ftps").trigger("change");
	}
	else if(lowCaseURL.indexOf("ftpes:") == 0)
	{
		item_option_itemType.val("ftpes").trigger("change");
	}
	else if(lowCaseURL.indexOf("sftp:") == 0)
	{
		item_option_itemType.val("sftp").trigger("change");
	}
	else if(lowCaseURL.indexOf("custom") == 0)
	{
		item_option_itemType.val("custom").trigger("change");
	}
	else if(lowCaseURL.indexOf("s3crush") == 0)
	{
		item_option_itemType.val("s3crush").trigger("change");
	}
	else if(lowCaseURL.indexOf("s3") == 0)
	{
		item_option_itemType.val("s3").trigger("change");
	}
	else if(lowCaseURL.indexOf("gdrive") == 0)
	{
		item_option_itemType.val("gdrive").trigger("change");
	}
	else if(lowCaseURL.indexOf("citrix") == 0)
	{
		item_option_itemType.val("citrix").trigger("change");
	}
	else if(lowCaseURL.indexOf("glacier:") == 0)
	{
		item_option_itemType.val("glacier").trigger("change");
	}
	cur_url = $.trim(cur_url);
	cur_url = cur_url.replace(/%/g,"%25");
	try{
		var _url = new URI(cur_url);
		var pass;
		if(_url)
		{
			$("#itemProperty_option_user_name, #itemProperty_option_secretKeyID, #itemProperty_option_client_id", fieldPropertiesDialog).addClass("notextChange").val(_url.username()).removeClass("notextChange");
			pass = _url.password();
		}
		if(itemProperty_option_url.data("password")){
			pass = itemProperty_option_url.data("password");
		}
		$("#itemProperty_option_password, #itemProperty_option_secretKey, #itemProperty_option_client_secret", fieldPropertiesDialog).addClass("notextChange").val(pass).removeClass("notextChange");

		if(lowCaseURL.indexOf("s3") == 0 && _url)
		{
			var _path = _url.path();
            var _bucket = "";
            if(_path)
            {
                if(_path.indexOf("/")==0)
                {
                    var __path = _path.replace("/", "");
                    _bucket = __path.substr(0, __path.indexOf("/"));
                    _path = _path.replace("/"+_bucket, "");
                }
            }
            $("#itemProperty_option_s3serverURL", fieldPropertiesDialog).val(_url.hostname());
            $("#itemProperty_option_s3_bucket", fieldPropertiesDialog).val(_bucket);
            $("#itemProperty_option_s3_path", fieldPropertiesDialog).val(_path);
		}

		if(lowCaseURL.indexOf("glacier:") == 0 && _url){
			$("#itemProperty_option_glacierServerURL", fieldPropertiesDialog).val(_url.hostname());
		}
	}
	catch(e){
	}
	item_option_itemType.removeClass('notextChange');
}

panelSetup.buildPropertiesURL = function()
{
	var fieldPropertiesDialog = $("#fieldPropertiesDialog");
	var itemProperty_option_url = fieldPropertiesDialog.find("#itemProperty_option_url");
	var curUrl = itemProperty_option_url.val();
	var staticURL = curUrl;//fieldPropertiesDialog.find("#itemProperty_option_url_static").val();
	if(staticURL.indexOf("://")>=0)
	{
		staticURL = staticURL.substr(staticURL.indexOf("://") + 3, staticURL.length);
		if(staticURL.indexOf("@")>=0)
		{
			staticURL = staticURL.substr(staticURL.indexOf("@") + 1, staticURL.length);
		}
	}
	else if(staticURL.indexOf(":/")>=0)
	{
		staticURL = staticURL.substr(staticURL.indexOf(":/") + 3, staticURL.length);
		if(staticURL.indexOf("@")>=0)
		{
			staticURL = staticURL.substr(staticURL.indexOf("@") + 1, staticURL.length);
		}
	}
	var item_option_itemType = $("#item_option_itemType", fieldPropertiesDialog).val();
	var fileSelected = item_option_itemType == "file"
	var memorySelected = item_option_itemType == "memory"
	var smbSelected = item_option_itemType == "smb";
	var smb3Selected = item_option_itemType == "smb3";
	var rfileSelected = item_option_itemType == "rfile";
	var hadoopSelected = item_option_itemType == "hadoop";
	var azureSelected = item_option_itemType == "azure";
	var ftpSelected = item_option_itemType == "ftp";

	var httpSelected = item_option_itemType == "http";
	var httpsSelected = item_option_itemType == "https";
	var webdavSelected = item_option_itemType == "webdav";
	var webdavsSelected = item_option_itemType == "webdavs";

	var ftpsSelected = item_option_itemType == "ftps";
	var ftpesSelected = item_option_itemType == "ftpes";
	var sftpSelected = item_option_itemType == "sftp";
	var as2Selected = item_option_itemType == "custom";
	var s3Selected = item_option_itemType == "s3" || item_option_itemType == "s3crush";
	var GdriveSelected = item_option_itemType == "gdrive";
	var citrixSelected = item_option_itemType == "citrix";
	var glacierSelected = item_option_itemType == "glacier";

	function clearURL(_url, except){
		var toReplace = ["s3.amazonaws.com/","google.com/","sf-api.com/","glacier.us-east-1.amazonaws.com/","file.core.windows.net/"];
		toReplace = toReplace.removeByVal(except);
		for (var i = 0; i < toReplace.length; i++) {
			_url = _url.replace(toReplace[i], "");
		}
		return _url;
	}

	function addUserPassToURL(url, protocol, addUP, exceptURL)
	{
		url = clearURL(url, exceptURL);
		if(addUP)
		{
			var userName = fixChars($("#itemProperty_option_user_name", fieldPropertiesDialog).val());
			var pass = fixChars($("#itemProperty_option_password", fieldPropertiesDialog).val());
			if(userName.length>0 || pass.length>0)
			{
				url = userName + ":" + pass + "@" + url;
			}
		}
		return protocol + url;
	}

	function addUserPassToURLGdrive(url, protocol, addUP)
	{
		if(addUP)
		{
			var userName = fixChars($("#itemProperty_option_gdrive_secretKeyID", fieldPropertiesDialog).val());
			var pass = fixChars($("#itemProperty_option_gdrive_secretKey", fieldPropertiesDialog).val());
			if(userName.length>0 || pass.length>0)
			{
				url = userName + ":" + pass + "@google.com/" + url;
			}
			else
				url = "google.com/" + url;
		}
		return protocol + url;
	}

	function addUserPassToURLCitrix(url, protocol, addUP)
	{
		url = clearURL(url);
		if(addUP)
		{
			var userName = fixChars($("#itemProperty_option_client_id", fieldPropertiesDialog).val());
			var pass = fixChars($("#itemProperty_option_client_secret", fieldPropertiesDialog).val());
			if(userName.length>0 || pass.length>0)
			{
				url = userName + ":" + pass + "@sf-api.com/" + url;
			}
			else
				url = "sf-api.com/" + url;
		}
		return protocol + url;
	}

	function addUserPassToAzure(url, protocol, addUP)
	{
		return addUserPassToURL(url || "file.core.windows.net/", protocol, addUP, "file.core.windows.net/");
	}

	function addUserPassToGlacier(url, protocol, addUP)
	{
		url = fieldPropertiesDialog.find("#itemProperty_option_glacierServerURL").attr("lastSelected") || url || "glacier.us-east-1.amazonaws.com";
		return addUserPassToURL(url || "glacier.us-east-1.amazonaws.com/", protocol, addUP, "glacier.us-east-1.amazonaws.com/");
	}

	function addUserPassToURLS3(url, protocol, server)
	{
		server = fieldPropertiesDialog.find("#itemProperty_option_s3serverURL").attr("lastSelected") || server || "s3.amazonaws.com";
        var userName = fixChars($("#itemProperty_option_secretKeyID", fieldPropertiesDialog).val());
        var pass = fixChars($("#itemProperty_option_secretKey", fieldPropertiesDialog).val());
        var bucket = $("#itemProperty_option_s3_bucket", fieldPropertiesDialog).val();
        var path = $("#itemProperty_option_s3_path", fieldPropertiesDialog).val();
        if(bucket.length>0 && bucket.lastIndexOf("/") != bucket.length-1)
            bucket += "/";
        if(path.length>0 && path.lastIndexOf("/") != path.length-1)
            path += "/";
        if(path.length>0 && path.indexOf("/") == 0)
        	path = path.replace("/", "");
        if(userName.length>0)
        {
            url = userName + ":" + pass + "@"+server+"/" + bucket + path;
        }
        else
            url = server + "/" + bucket + path;
        return protocol + url;
	}

	if(fileSelected)
	{
		itemProperty_option_url.val(addUserPassToURL(staticURL, "FILE://"));
	}
	else if(memorySelected)
	{
		itemProperty_option_url.val(addUserPassToURL(staticURL, "MEMORY://"));
	}
	else if(smbSelected)
	{
		itemProperty_option_url.val(addUserPassToURL(staticURL, "SMB://", true));
	}
	else if(smb3Selected)
	{
		itemProperty_option_url.val(addUserPassToURL(staticURL, "SMB3://", true));
	}
	else if(rfileSelected)
	{
		itemProperty_option_url.val(addUserPassToURL(staticURL, "rfile://", true));
	}
	else if(hadoopSelected)
	{
		itemProperty_option_url.val(addUserPassToURL(staticURL, "hadoop://", true));
	}
	else if(azureSelected)
	{
		itemProperty_option_url.val(addUserPassToAzure(staticURL, "azure://", true));
	}
	else if(ftpSelected)
	{
		itemProperty_option_url.val(addUserPassToURL(staticURL, "FTP://", true));
		if(!staticURL || staticURL.length==0)
		{
			crushFTP.UI.checkUnchekInput(fieldPropertiesDialog.find("#itemProperty_option_pasv"), true);
		}
	}
	else if(httpSelected)
	{
		itemProperty_option_url.val(addUserPassToURL(staticURL, "HTTP://", true));
	}
	else if(httpsSelected)
	{
		itemProperty_option_url.val(addUserPassToURL(staticURL, "HTTPS://", true));
	}
	else if(webdavSelected)
	{
		itemProperty_option_url.val(addUserPassToURL(staticURL, "WEBDAV://", true));
	}
	else if(webdavsSelected)
	{
		itemProperty_option_url.val(addUserPassToURL(staticURL, "WEBDAVS://", true));
	}
	else if(ftpsSelected)
	{
		itemProperty_option_url.val(addUserPassToURL(staticURL, "FTPS://", true));
	}
	else if(ftpesSelected)
	{
		itemProperty_option_url.val(addUserPassToURL(staticURL, "FTPES://", true));
	}
	else if(sftpSelected)
	{
		itemProperty_option_url.val(addUserPassToURL(staticURL, "SFTP://", true));
	}
	else if(as2Selected)
	{
		itemProperty_option_url.val(addUserPassToURL(staticURL, "CUSTOM_crushftp.server.VFS_AS2://", true));
	}
	else if(s3Selected)
	{
		if(item_option_itemType == "s3crush"){
			var _url = URI("s3crush://"+staticURL);
			var host;
			if(_url)
			{
				host = _url.hostname();
			}
			itemProperty_option_url.val(addUserPassToURLS3(staticURL, "s3crush://", host));
		}
		else{
			var _url = URI("s3://"+staticURL);
			var host;
			if(_url)
			{
				host = _url.hostname();
			}
			itemProperty_option_url.val(addUserPassToURLS3(staticURL, "s3://", host));
		}
	}
	else if(GdriveSelected)
	{
		itemProperty_option_url.val(addUserPassToURLGdrive(staticURL, "GDRIVE://", true));
	}
	else if(citrixSelected)
	{
		itemProperty_option_url.val(addUserPassToURLCitrix(staticURL, "citrix://", true));
	}
	else if(glacierSelected)
	{
		itemProperty_option_url.val(addUserPassToGlacier(staticURL, "glacier://", true));
	}
}

panelSetup.bindContextMenu = function()
{
	$("li", panelSetup.vfsItemsDirList).contextMenu({
			menu: "vfsItemContext"
		},
		function(action, el, pos) {
		if(action == "properties")
		{
			panelSetup.showVFSItemProperties(el);
		}
		else if(action == "rename")
		{
			panelSetup.renameVFSItem(el);
		}
		else if(action == "remove")
		{
			panelSetup.removeVFSItem(el);
		}
		else if(action == "generateURL")
		{
			panelSetup.generateURL(el);
		}
		else if(action == "test")
		{
			panelSetup.testVFSItem(el);
		}
		else if(action == "testAll")
		{
			panelSetup.testVFSItem(el, true);
		}
	}).bind("onBeforeContextMenu", function(){
		var name = unescape($(this).attr("name"));
		var curPath = panelSetup.userDirSelectList.val();
		var matchedElem = panelSetup.checkIfCurrentDirIsVFSItem(curPath, name);
		if(matchedElem)
		{
			$("#vfsItemContext").find(".rename, .remove, .test, .testAll").removeClass("ui-state-disabled");
			if(matchedElem.url.length>0)
			{
				$("#vfsItemContext").find(".properties").removeClass("ui-state-disabled");
			}
			else
			{
				$("#vfsItemContext").find(".properties").addClass("ui-state-disabled");
			}
		}
		else
		{
			$("#vfsItemContext").find(".properties, .rename, .remove, .test, .testAll").addClass("ui-state-disabled");
		}
	});

	var vfsItemButtons = $("#vfsItemButtons");
	vfsItemButtons.find(".vfsBtn").contextMenu({
			menu: "subVFSConfigContext"
		},
		function(action, el, pos) {
			if(action == "rename")
			{
				panelSetup.renameSubVFSItem($(el));
			}
			else if(action == "delete")
			{
				el.find(".ui-icon-close").trigger("click");
			}
	});
}

panelSetup.showVFSItemProperties = function(selected)
{
	panelSetup.bindPropertiesWindowDataForSelectedItem(selected);
	$("#fieldPropertiesDialog").form().dialog("open");
	$("#vfs_expire").unbind("blur.custom").bind("blur.custom", function(){$("#ui-datepicker-div").hide()});
}

panelSetup.showVFSItemEncryption = function(selected)
{
	panelSetup.bindEncryptionWindowDataForSelectedItem(selected);
	$("#fieldAdvancedDialog").form().dialog("open");
}

panelSetup.renameVFSItem = function(selected)
{
	if(selected)
	{
		var currentUser = crushFTP.storage("currentUser");
		if(panelSetup.extraVFS)
		{
			var usrExtraVFS = $(document).data("userName") + "~" + panelSetup.extraVFS;
			currentUser = crushFTP.storage("extraUserInfo"+usrExtraVFS);
		}
		var curVFSItems = false;
		if(currentUser.vfs_items && currentUser.vfs_items.vfs_items_subitem)
		{
			crushFTP.methods.rebuildSubItems(currentUser.vfs_items, "vfs_items");
			 curVFSItems = currentUser.vfs_items.vfs_items_subitem;
		}
		var curPrivs = crushFTP.storage("currentUserDirPrivs") || new Object();
		if(panelSetup.extraVFS)
			curPrivs = crushFTP.storage("extraUserDirPrivs"+panelSetup.extraVFS) || new Object();
		function renameItem(oldName, newName, path, newPath, parentPath)
		{
			for(var i=0;i<curVFSItems.length;i++)
			{
				var curItem = curVFSItems[i];
				if(curItem.vfs_items_subitem_subitem)
				{
					var subItem = curItem.vfs_items_subitem_subitem;
					var itemName = crushFTP.methods.decodeXML(unescape(subItem.name));
					var parent = crushFTP.methods.decodeXML(unescape(subItem.path));
					if(oldName)
					{
						if(crushFTP.methods.decodeXML(unescape(oldName)) == itemName)
						{
							if(parentPath)
							{
								if(parentPath == parent)
								{
									subItem.name = newName;
									curVFSItems[i].vfs_items_subitem_subitem = subItem;
									var curPath = subItem.path + oldName + "/";
									var changedPath = subItem.path + newName + "/";
									if(typeof curPath != "undefined" && typeof changedPath != "undefined")
									{
										var privs = curPrivs[curPath.toUpperCase()];
										if(privs)
										{
											delete curPrivs[curPath.toUpperCase()];
											curPrivs[changedPath.toUpperCase()] = privs;
										}
										renameItem(false, false, curPath, changedPath);
									}
								}
							}
							else
							{
								subItem.name = newName;
								curVFSItems[i].vfs_items_subitem_subitem = subItem;
								var curPath = subItem.path + oldName + "/";
								var changedPath = subItem.path + newName + "/";
								if(typeof curPath != "undefined" && typeof changedPath != "undefined")
								{
									var privs = curPrivs[curPath.toUpperCase()];
									if(privs)
									{
										delete curPrivs[curPath.toUpperCase()];
										curPrivs[changedPath.toUpperCase()] = privs;
									}
									renameItem(false, false, curPath, changedPath);
								}
							}
						}
					}
					if(path)
					{
						if(unescape(subItem.path) == unescape(path))
						{
							var curPath = subItem.path + itemName + "/";
							subItem.path = newPath;
							curVFSItems[i].vfs_items_subitem_subitem = subItem;
							var changedPath = subItem.path + itemName + "/";
							if(typeof curPath != "undefined" && typeof changedPath != "undefined")
							{
								var privs = curPrivs[curPath.toUpperCase()];
								if(privs)
								{
									delete curPrivs[curPath.toUpperCase()];
									curPrivs[changedPath.toUpperCase()] = privs;
								}
								renameItem(false, false, curPath, changedPath);
							}
						}
					}
					panelSetup._panel.trigger("changed", [panelSetup.userDirSelectList]);
				}
			}
		}

		var name = unescape(selected.attr("name"));
		var root_dir = selected ? unescape(selected.attr("rootDir")) : "/";
		var matchedElem = panelSetup.getVFSPropertiesForItemByName(name, root_dir);
		if(matchedElem)
		{
			function renamePrompt(name)
			{
				jPrompt("Rename item : ", name, "Rename", function(value){
					var newName = value;
					if(newName != null)
					{
						if(crushFTP.methods.hasSpecialCharacters(newName, userManager.notAllowedCharsInDirName))
						{
							jAlert("You can not use these characters in name : " + userManager.notAllowedCharsInDirName, "Invalid name", function(){
								renamePrompt(newName);
							});
						}
						else
						{
							renameItem(name, newName, false, false, root_dir);
							panelSetup.userDirSelectList.trigger("change");
						}
						panelSetup._panel.trigger("changed",[panelSetup.userDirSelectList]);
					}
				});
			}
			renamePrompt(name);
		}
	}
}

panelSetup.testVFSItem = function(selected, all){
	var toTest = [];
	if(all){
		panelSetup.vfsItemsDirList.find("li").each(function(){
			var name = unescape($(this).attr("name"));
			var root_dir = unescape($(this).attr("rootDir")) || "/";
			var matchedElem = panelSetup.getVFSPropertiesForItemByName(name, root_dir);
			if(matchedElem)
			{
				toTest.push(matchedElem);
			}
		});
	}
	else if(selected)
	{
		var name = unescape(selected.attr("name"));
		var root_dir = selected ? unescape(selected.attr("rootDir")) : "/";
		var matchedElem = panelSetup.getVFSPropertiesForItemByName(name, root_dir);
		if(matchedElem)
		{
			toTest.push(matchedElem);
		}
	}
	if(toTest.length===1){
		crushFTP.UI.showLoadingIndicator(true);
		panelSetup.testVFSItemCall(toTest[0], function(msg, totalTime){
			crushFTP.UI.hideLoadingIndicator();
			if (msg && msg.childNodes && msg.childNodes.length > 0) {
				var items = $(msg).find("listing").text();
				if($(msg).find("error").text())
				{
					crushFTP.UI.growl("Error : ", "Connection failed. <br>" + $(msg).find("error").text()+ "<br>Time taken to test: "+totalTime, true, 5000);
				}
				else if(items)
				{
					items = items.replace(/\n/g,' ').replace(/\s/g,' ');
					eval(items);
					if(l && jQuery.isArray(l))
					{
						crushFTP.UI.growl("Success : ", "Connection succeed"+ "<br>Time taken to test: "+totalTime, false, 3000);
					}
					else
					{
						crushFTP.UI.growl("Error : ", "Connection failed (or empty directory)"+ "<br>Time taken to test: "+totalTime, true, 5000);
					}
				}
			}
		});
	}
	else{
		var result = [];
		if(toTest.length>0){
			crushFTP.UI.showLoadingIndicator(true);
			for (var i = 0; i < toTest.length; i++) {
				var curItem = toTest[i];
				(function(curItem){
					panelSetup.testVFSItemCall(curItem, function(msg, totalTime){
						var response = "";
						var items = $(msg).find("listing").text();
						if($(msg).find("error").text())
						{
							response = "Connection failed. " + $(msg).find("error").text();
						}
						else if(items)
						{
							items = items.replace(/\n/g,' ').replace(/\s/g,' ');
							eval(items);
							if(l && jQuery.isArray(l))
							{
								response = "Connection succeed";
							}
							else
							{
								response = "Connection failed (or empty directory)";
							}
						}
						var tableRow = "<tr><td><strong>"+curItem.name+"</strong></td><td>"+response+"</td><td>"+totalTime+"</td></tr>"
						result.push(tableRow);
						if(result.length === toTest.length){
							crushFTP.UI.hideLoadingIndicator();
							showTestResult();
						}
					});
				})(curItem);
			}
			function showTestResult(){
				var testResultDialog = $("#testResultDialog");
				testResultDialog.form().dialog({
			        autoOpen: true,
			        title : "Test Result : ",
			        resizable: true,
			        width: 800,
			        closeOnEscape: true,
			        modal: true,
			        height:600,
			        open: function(event, ui){
			            $(event.target).dialog('widget').css({ position: 'fixed' }).position({ my: 'center', at: 'center', of: window });
			            var tbl = testResultDialog.find("table").empty();
			            tbl.append('<tr><th style="width:20%">VFS Item</th><th>Result</th><th style="width:10%">Time Taken</th></tr>');
			            tbl.append(result.join(""));
			            //Test comment
			        },
			        create: function(event, ui) {
			            $(event.target).parent().css('position', 'fixed');
			        },buttons : {
			            "OK" : function(){
							testResultDialog.dialog("close");
			            }
			        }
			    });
			}
		}
	}
}

panelSetup.testVFSItemCall = function(itemPropertiesJSON, callback, name){
	name = name || itemPropertiesJSON.name;
	var path = itemPropertiesJSON.path || "/";
	path = path + name + "/";
	var obj = {
		command : "getUserXMLListing",
		path: path,
		format: "JSON",
		isTestCall : true,
		username : crushFTP.storage("userName"),
		c2f : crushFTP.getCrushAuth(),
		serverGroup : $("#userConnectionGroups").val() || "MainUsers",
		random: Math.random()
	};
	var item = itemPropertiesJSON;
	var xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
	// VFS Items
	xml += "\r\n<vfs_items type=\"vector\">";
	var askUser, curUN, curPass;
	try{
		var url = URI(item.url);
		if(url.username().indexOf("{username}")>=0 || url.password().indexOf("{password}")>=0){
			askUser = true;
			curUN = url.username();
			curPass = url.password();
		}
	}catch(ex){}
	if(!askUser)
	{
		afterUserPass();
	}
	else{
		var userpassDialog = $("#userpassDialog");
		userpassDialog.find("#option_user_name").val("");
		userpassDialog.find("#option_password").val("");
		userpassDialog.form().dialog({
	        autoOpen: true,
	        title : "Enter Credentials : ",
	        resizable: false,
	        width: 300,
	        closeOnEscape: false,
	        open: function(event, ui){
	            $(event.target).dialog('widget').css({ position: 'fixed' }).position({ my: 'center', at: 'center', of: window });
	        },
	        create: function(event, ui) {
	            $(event.target).parent().css('position', 'fixed');
	        },buttons : {
	            "OK" : function(){
	            	var user = curUN.replace(/{username}/g, userpassDialog.find("#option_user_name").val());
	            	var pass = curPass.replace(/{password}/g, userpassDialog.find("#option_password").val());
	            	try{
						var url = URI(item.url);
						url.username(user);
						url.password(pass);
						item.url = unescape(url.toString());
						afterUserPass();
					}catch(ex){}
					userpassDialog.dialog("close");
	            }
	        }
	    });
	}
	function afterUserPass(){
		if(item && item.name)
		{
			var path = item.path || "";
			if(item.name.toLowerCase() == "vfs" && path == "" && item.url == "" && item.type.toLowerCase()=="dir")
			{
				xml += "";
			}
			else
			{
				xml += "\r\n<vfs_items_subitem type=\"properties\">";
					xml += "\r\n<name>"+crushFTP.methods.htmlEncode(unescape(crushFTP.methods.decodeXML(item.name))).replace(/\+/g, "%2B")+"</name>";
					xml += "\r\n<path>"+crushFTP.methods.htmlEncode(unescape(crushFTP.methods.decodeXML(path))).replace(/\+/g, "%2B")+"</path>";
					xml += "\r\n<vfs_item type=\"vector\">";
						xml += "\r\n<vfs_item_subitem type=\"properties\">";
							for(var prop in item)
							{
								if(prop != "name" && prop != "path")
								{
									var val = crushFTP.methods.htmlEncode(unescape(crushFTP.methods.decodeXML(item[prop]))).replace(/\+/g, "%2B");
									if(prop == "type")
									{
										if(val.toLowerCase() == "properties")
											val = "dir";
										xml += "\r\n<"+prop+">" + val.toUpperCase()+ "</"+prop+">";
									}
									else if(prop == "url")
									{
										if(val.indexOf("/////")>=0)
										{
											val	= val.replace("/////", "////");
										}
										xml += "\r\n<"+prop+">" + val + "</"+prop+">";
									}
									else
										xml += "\r\n<"+prop+">" + val + "</"+prop+">";
								}
							}
						xml += "\r\n</vfs_item_subitem>";
					xml += "\r\n</vfs_item>";
				xml += "\r\n</vfs_items_subitem>";
			}
		}
		xml += "\r\n</vfs_items>";
		var perms = panelSetup.generatePrivsXML();
		if(perms)
			obj.permissions = perms;
		obj.vfs_items = xml;
		var startTime = new Date();
		$.ajax({
			type: "POST",
			url: userManager.ajaxCallURL,
			data: obj,
			success: function (msg){
				var endTime = new Date();
				var diff = Math.round(endTime.getTime() - startTime.getTime())/1000;
				var totalTime = crushFTP.methods.formatTime("" + diff);
				callback(msg, totalTime);
			},
			error: function(){
				var endTime = new Date();
				var diff = Math.round(endTime.getTime() - startTime.getTime())/1000;
				var totalTime = crushFTP.methods.formatTime("" + diff);
				callback(false, totalTime);
			}
		});
	}
}

panelSetup.generateURL = function(selected)
{
	if(selected)
	{
		var miniURLHost = window.location.protocol.toString() + "//" + window.location.host.toString() + "/";
		function saveMiniURL(path, expire, callback)
		{
			expire = expire || "";
			if(!path)return;
			var currentUser = crushFTP.storage("currentUser");
			if(panelSetup.extraVFS)
			{
				var usrExtraVFS = $(document).data("userName") + "~" + panelSetup.extraVFS;
				currentUser = crushFTP.storage("extraUserInfo"+usrExtraVFS);
			}
			var userName = currentUser.user.crush_value1 || currentUser.user.user_name;
			var userPass = currentUser.user.crush_value2 || currentUser.user.password;
			var key = crushFTP.methods.generateRandomPassword(10, true);
			crushFTP.data.encryptPass(userPass, function(data){
				if(data)
				{
					generatedPass = unescape(data.response[0].text);
					crushFTP.data.getXMLPrefsDataFromServer("GUIXMLPrefs", function(allPrefs){
						var prefsJSON = $.xml2json(allPrefs);
						var xmlString = [];
						if(prefsJSON.miniURLHost)
							miniURLHost = prefsJSON.miniURLHost;
						if(prefsJSON && prefsJSON.miniURLs)
						{
							crushFTP.methods.rebuildSubItems(prefsJSON.miniURLs, "miniURLs");
							for(var i=0;i<prefsJSON.miniURLs.miniURLs_subitem.length;i++)
							{
								var curURL = prefsJSON.miniURLs.miniURLs_subitem[i];
								var _key = curURL.key || "";
								if(_key != "null")
								{
									xmlString.push("<miniURLs_subitem type=\"properties\">");
									xmlString.push("<user>"+crushFTP.methods.htmlEncode(curURL.user)+"</user>");
									var _expire = curURL.expire || "";
									xmlString.push("<expire>"+_expire+"</expire>");
									xmlString.push("<key>"+crushFTP.methods.htmlEncode(_key)+"</key>");
									var _pass = curURL.pass || "";
									xmlString.push("<pass>"+crushFTP.methods.htmlEncode(_pass)+"</pass>");
									var _redirect = curURL.redirect || "";
									xmlString.push("<redirect>"+crushFTP.methods.htmlEncode(_redirect)+"</redirect>");
									xmlString.push("</miniURLs_subitem>");
								}
							}
						}
						xmlString.push("<miniURLs_subitem type=\"properties\">");
						xmlString.push("<user>"+crushFTP.methods.htmlEncode(userName)+"</user>");
						xmlString.push("<expire>"+expire+"</expire>");
						xmlString.push("<key>"+crushFTP.methods.htmlEncode(key)+"</key>");
						xmlString.push("<pass>"+crushFTP.methods.htmlEncode(generatedPass)+"</pass>");
						xmlString.push("<redirect>"+crushFTP.methods.htmlEncode(path)+"</redirect>");
						xmlString.push("</miniURLs_subitem>");
						var formSubItem = xmlString.join("");
						formSubItem = "<miniURLs type=\"vector\">" + formSubItem + "</miniURLs>";
						crushFTP.data.setXMLPrefs("server_settings/miniURLs/0"
							, "vector"
							, "reset"
							, formSubItem
							, function(data){
								data = $.xml2json(data, true);
								if(data.response_status && data.response_status[0] && data.response_status[0].text == "OK")
								{
									if(callback)
									{
										callback(true, key);
									}
								}
								else
								{
									if(callback)
									{
										callback(false);
									}
								}
							}
						);
					});
				}
			});
		}

		var path = unescape(selected.attr("curPath"));
		if(selected.attr("_type").toLowerCase()=="dir" && path.match("/$")!="/")
			path = path + "/";

		function urlPathPrompt(name)
		{
			jPrompt("This is what the MiniURL will point to (You may edit it) : ", name, "Generate MiniURL", function(value, other, expire){
				var newName = value;
				if(newName != null)
				{
					crushFTP.UI.showLoadingIndicator(true);
					saveMiniURL(newName, expire, function(flag, key){
						crushFTP.UI.hideLoadingIndicator();
						if(flag)
						{
							var urlLoc = miniURLHost;
							if(!urlLoc.endsWith("/"))
								urlLoc += "/";
							jPrompt("MiniURL generated : ", urlLoc + key, "Generate MiniURL", function(){

							}, false, false, {
								hideCancelButton : true,
								appendAfterInput : '&nbsp;<a href="javascript:void(0);" class="button copytoclip slim" style="padding:2px 10px;"><span style="display:inline-block;margin:0px 3px 0px -7px;float:left;" class="pointer ui-icon ui-icon-clipboard"></span>Copy to Clipboard</a>'
							});
							setTimeout(function(){
								$("#popup_message").find("a.copytoclip").button().unbind().bind("click", function(){
									copyToClipboard($('#popup_message').find("input").val());
									alert("URL copied to clipboard");
								});
							}, 100);
						}
						else
							crushFTP.UI.growl("Generate MiniURL : ", "There was a proble while generating Mini URL, please try again.", true, 3000);

					});
				}
			}, false, false, {
				appendAfterInput : '<p style="text-align:center;"><label for="mini_url_expire">Expiration Date : </label> <input type="text" class="extraItem date time" id="mini_url_expire" name="mini_url_expire" /> <a href="#" id="quickSet" class="button slim" style="padding:2px 10px;"><span style="display:inline-block;margin:0px 3px 0px -7px;float:left;" class="pointer ui-icon ui-icon-calendar"></span>Set Days</a></p>'
			});
			setTimeout(function(){
				var input = $("#mini_url_expire");
				$("#popup_message").find("a#quickSet").button().click(function(){
					var selDate = input.datepicker("getDate");
					var myDate = new Date();
					var defaultDays = 1.5;
					if(selDate)
					{
						var t2 = selDate.getTime();
						var t1 = myDate.getTime();
						defaultDays = parseInt((t2-t1)/(24*3600*1000)) + 1;
					}
					var value = prompt("Enter the number of days from now until this account expires : ", defaultDays);
					var days = parseInt(value);
					if(days != null && days != NaN)
					{
						if (days == NaN) days = 0;
						if (days > 0) {
							myDate.setDate(myDate.getDate() + days);
							input.datepicker( "setDate" , myDate );
						}
					}
					$("#ui-datepicker-div").hide();
					return false;
				});
				input.datetimepicker({
                    timeFormat: 'hh:mm TT',
                    ampm: true,
                    showOn: "focus"//,
                    //buttonImage: "/WebInterface/Resources/images/calendar.png",
                    //buttonImageOnly: true
                });
			}, 100);
		}
		urlPathPrompt(path);
	}
}

panelSetup.removeVFSItem = function(selected)
{
	if(selected)
	{
		var currentUser = crushFTP.storage("currentUser");
		if(panelSetup.extraVFS)
		{
			var usrExtraVFS = $(document).data("userName") + "~" + panelSetup.extraVFS;
			currentUser = crushFTP.storage("extraUserInfo"+usrExtraVFS);
		}
		var curVFSItems = false;
		if(currentUser.vfs_items && currentUser.vfs_items.vfs_items_subitem)
		{
			crushFTP.methods.rebuildSubItems(currentUser.vfs_items, "vfs_items");
			curVFSItems = currentUser.vfs_items.vfs_items_subitem;
		}
		var curPrivs = crushFTP.storage("currentUserDirPrivs") || new Object();
		if(panelSetup.extraVFS)
			curPrivs = crushFTP.storage("extraUserDirPrivs"+panelSetup.extraVFS) || new Object();
		function deteleItem(name, path, isFile)
		{
			for(var i=0;i<curVFSItems.length;i++)
			{
				var curItem = curVFSItems[i];
				if(curItem.vfs_items_subitem_subitem)
				{
					var subItem = curItem.vfs_items_subitem_subitem;
					var itemName = crushFTP.methods.decodeXML(unescape(subItem.name));
					var itemPath = crushFTP.methods.decodeXML(unescape(subItem.path));
					if(name && path)
					{
						if(crushFTP.methods.decodeXML(unescape(name)) == itemName && crushFTP.methods.decodeXML(unescape(path)) == itemPath)
						{
							var changedPath = subItem.path + name;
							if(!isFile)
								changedPath = changedPath + "/";
							if(typeof changedPath != "undefined")
							{
								curVFSItems[i] = "##";
								delete curPrivs[changedPath.toUpperCase()];
								for(var entry in curPrivs){
									if(entry.startsWith(changedPath.toUpperCase()))
										delete curPrivs[entry];
								}
								deteleItem(false, changedPath, isFile);
							}
						}
					}
					else if(name)
					{
						if(crushFTP.methods.decodeXML(unescape(name)) == itemName)
						{
							var changedPath = subItem.path + name;
							if(!isFile)
								changedPath = changedPath + "/";
							if(typeof changedPath != "undefined")
							{
								curVFSItems[i] = "##";
								delete curPrivs[changedPath.toUpperCase()];
								deteleItem(false, changedPath, isFile);
							}
						}
					}
					else if(path)
					{
						if(unescape(subItem.path) == unescape(path))
						{
							var changedPath = subItem.path + itemName;
							if(!isFile)
								changedPath = changedPath + "/";
							if(typeof changedPath != "undefined")
							{
								curVFSItems[i] = "##";
								delete curPrivs[changedPath.toUpperCase()];
								deteleItem(false, changedPath, isFile);
							}
						}
					}
					panelSetup._panel.trigger("changed", [panelSetup.userDirSelectList]);
				}
			}
		}

		if(selected.length==1)
		{
			var name = unescape(selected.attr("name"));
			var root_dir = selected ? unescape(selected.attr("rootDir")) : "/";
			var matchedElem = panelSetup.getVFSPropertiesForItemByName(name, root_dir);
			if(matchedElem)
			{
				jConfirm("Are you sure you want to delete this virtual item? <br/> <br/>" + name  + "<br/>", "Delete?", function(value){
					if(value)
					{
						deteleItem(name, matchedElem.path, matchedElem.type.toLowerCase() == "file");
						var _tempVFSItems = [];
						for(var i=0;i<curVFSItems.length;i++)
						{
							 if(curVFSItems[i].toString() != "##")
							 {
								_tempVFSItems.push($.extend(true, {},  curVFSItems[i]));
							 }
						}
						var vfsItems = $.extend(true, {},  _tempVFSItems);
						var vfsSubItems = [];
						for(var itm in vfsItems)
						{
							var curvfsItm = vfsItems[itm];
							if(curvfsItm && curvfsItm.vfs_items_subitem_subitem)
							{
								vfsSubItems.push(curvfsItm);
							}
						}
						currentUser.vfs_items.vfs_items_subitem = vfsSubItems;
						panelSetup.userDirSelectList.trigger("change");
						panelSetup._panel.trigger("changed", [panelSetup.userDirSelectList]);
					}
				});
			}
		}
		else
		{
			var names = [];
			var elems = [];
			$(selected).each(function(){
				var name = unescape($(this).attr("name"));
				var root_dir = unescape($(this).attr("rootDir"));
				var matchedElem = panelSetup.getVFSPropertiesForItemByName(name, root_dir);
				if(matchedElem)
				{
					names.push(name);
					elems.push(matchedElem);
				}
			});
			jConfirm("Are you sure you want to delete these virtual item(s)? <br/> <br/>" + names.join("<br/>")  + "<br/>", "Delete?", function(value){
				if(value)
				{
					for(var j=0;j<names.length;j++)
					{
						var matchedElem = elems[j];
						var name = names[j];
						deteleItem(name, matchedElem.path, matchedElem.type.toLowerCase() == "file");
					}
					var _tempVFSItems = [];
					for(var i=0;i<curVFSItems.length;i++)
					{
						 if(curVFSItems[i].toString() != "##")
						 {
							_tempVFSItems.push($.extend(true, {},  curVFSItems[i]));
						 }
					}
					var vfsItems = $.extend(true, {},  _tempVFSItems);
					var vfsSubItems = [];
					for(var itm in vfsItems)
					{
						var curvfsItm = vfsItems[itm];
						if(curvfsItm && curvfsItm.vfs_items_subitem_subitem)
						{
							vfsSubItems.push(curvfsItm);
						}
					}
					currentUser.vfs_items.vfs_items_subitem = vfsSubItems;
					panelSetup.userDirSelectList.trigger("change");
					panelSetup._panel.trigger("changed", [panelSetup.userDirSelectList]);
				}
			});
		}
	}
}

panelSetup.addServerItem = function()
{
	function newFolderPrompt(name)
	{
		jPrompt("Folder Name : ", name, "Create New Folder", function(value){
			var newName = value;
			if(newName != null)
			{
				if(crushFTP.methods.hasSpecialCharacters(newName, userManager.notAllowedCharsInDirName))
				{
					jAlert("You can not use these characters in name : " + userManager.notAllowedCharsInDirName, "Invalid name", function(){
						newFolderPrompt(newName);
					});
				}
				else
				{
					var result = "OK";
					var resultItem = "response_status";
					var obj = {
						command: 'adminAction',
						action: 'newFolder',
						path : encodeURIComponent(unescape(panelSetup.serverDirSelectList.val())),
						name : newName
					};
					if(userManager.isUserLimitedAdmin)
					{
						obj = {
							command: 'makedir',
							path : encodeURIComponent(unescape(panelSetup.serverDirSelectList.val() + newName)),
							random: Math.random()
						};
						result = "";
						resultItem = "response";
					}
					crushFTP.data.serverRequest(obj,
					function(data){
						if(data)
						{
							panelSetup.lastCreatedFolder = false;
							var usersData = $.xml2json(data, false);
							if(usersData && typeof usersData[resultItem] != "undefined" && usersData[resultItem]== result)
							{
								panelSetup.serverDirSelectList.trigger("change.local");
								panelSetup._panel.trigger("changed",[panelSetup.userDirSelectList]);
								panelSetup.lastCreatedFolder = newName;
							}
							else
							{
								crushFTP.UI.growl("Failure", $(data).text(), true, true);
							}
						}
					});
				}
			}
		});
	}
	newFolderPrompt();
}

panelSetup.renameServerItem = function(selected)
{
	if(selected)
	{
		function renamePrompt(name)
		{
			jPrompt("Rename item : ", name, "Rename", function(value){
				var newName = value;
				if(newName != null)
				{
					if(crushFTP.methods.hasSpecialCharacters(newName, userManager.notAllowedCharsInDirName))
					{
						jAlert("You can not use these characters in name : " + userManager.notAllowedCharsInDirName, "Invalid name", function(){
							renamePrompt(newName);
						});
					}
					else
					{
						var result = "OK";
						var resultItem = "response_status";
						var obj = {
							command: 'adminAction',
							action: 'renameItem',
							path : panelSetup.serverDirSelectList.val(),
							name : selected.attr("name"),
							newName : newName
						};
						if(userManager.isUserLimitedAdmin)
						{
							obj = {
								command: "rename",
								path: panelSetup.serverDirSelectList.val(),
								name1: selected.attr("name"),
								name2: encodeURIComponent(unescape(newName)),
								random: Math.random()
							};
							result = "";
							resultItem = "response";
						}
						crushFTP.data.serverRequest(obj,
						function(data){
							if(data)
							{
								var usersData = $.xml2json(data, false);
								if(usersData && typeof usersData[resultItem] != "undefined" && usersData[resultItem]== result)
								{
									panelSetup.serverDirSelectList.trigger("change.local");
									panelSetup._panel.trigger("changed", [panelSetup.userDirSelectList]);
								}
								else
								{
									crushFTP.UI.growl("Failure", $(data).text(), true, true);
								}
							}
						});
					}
				}
			});
		}
		renamePrompt(selected.attr("name"));
	}
}

panelSetup.removeServerItem = function(selected)
{
	if(selected)
	{
		var name = selected.attr("name");
		jConfirm("Are you sure you want to delete this item? <br/> <br/>" + name  + "<br/>", "Delete?", function(value){
			if(value)
			{
				var result = "OK";
				var resultItem = "response_status";
				var obj = {
					command: 'adminAction',
					action: 'deleteItem',
					path : panelSetup.serverDirSelectList.val(),
					name : selected.attr("name")
				};
				if(userManager.isUserLimitedAdmin)
				{
					obj = {
						command: "delete",
						names: encodeURIComponent(unescape(panelSetup.serverDirSelectList.val() + selected.attr("name"))),
						random: Math.random()
					};
					result = "";
					resultItem = "response";
				}
				crushFTP.data.serverRequest(obj,
				function(data){
					if(data)
					{
						var usersData = $.xml2json(data, false);
						if(usersData && typeof usersData[resultItem] != "undefined" && usersData[resultItem]== result)
						{
							panelSetup.serverDirSelectList.trigger("change.local");
							panelSetup._panel.trigger("changed",[panelSetup.userDirSelectList]);
						}
						else
						{
							crushFTP.UI.growl("Failure", $(data).text(), true, true);
						}
					}
				});
			}
		});
	}
}

panelSetup.buildDirPrivs = function(useThisExtra)
{
	var currentUserXML = crushFTP.storage("currentUserXML");
	if(panelSetup.extraVFS || useThisExtra)
	{
		useThisExtra = useThisExtra || panelSetup.extraVFS;
		var usrExtraVFS = $(document).data("userName") + "~" + useThisExtra;
		currentUserXML = crushFTP.storage("extraUserXML"+usrExtraVFS);
	}
	$(currentUserXML).find("permissions").find("item").each(function(){
		panelSetup.updateItemPrivs(unescape($(this).attr("name")), crushFTP.methods.decodeXML($(this).text()));
	});
	if(useThisExtra)
	{
		var currentUserDirPrivs = crushFTP.storage("extraUserDirPrivs"+useThisExtra);
		var defaultPrivs = $.extend(true, {}, currentUserDirPrivs);
		crushFTP.storage("extraUserDirPrivsDefault"+useThisExtra, defaultPrivs);
	}
	else
	{
		var currentUserDirPrivs = crushFTP.storage("currentUserDirPrivs");
		var defaultPrivs = $.extend(true, {}, currentUserDirPrivs);
		crushFTP.storage("currentUserDirPrivsDefault", defaultPrivs);
	}
}

panelSetup.updatePrivsForSelectedItem = function(pathToUse)
{
	var selectedDir = $("li.ui-widget-header", panelSetup.vfsItemsDirList);
	if(selectedDir && selectedDir.length>0)
	{
		var privs = panelSetup.createPrivsForItem();
		if(selectedDir.length>1)
		{
			$(selectedDir).each(function(){
				if(typeof $(this).attr !="undefined")
				{
					var selected = $(this);
					pathToUse = $(this).data("hrefPath");
					if(!selected.hasClass("vfsOrigItem"))
					{
						var sepPrivs = privs.replace("(write)","").replace("(delete)","").replace("(deletedir)","").replace("(makedir)","");
						panelSetup.updateItemPrivs(pathToUse, sepPrivs);
					}
					else
					{
						panelSetup.updateItemPrivs(pathToUse, privs);
					}
				}
			});
		}
		else
		{
			if(typeof $(selectedDir).attr !="undefined")
			{
				pathToUse = pathToUse || $(selectedDir).data("hrefPath");
				var selected = $(selectedDir);
				if(!selected.hasClass("vfsOrigItem"))
				{
					privs = privs.replace("(write)","").replace("(delete)","").replace("(deletedir)","").replace("(makedir)","");
				}
				panelSetup.updateItemPrivs(pathToUse, privs);
			}
		}
	}
}

panelSetup.updateItemPrivs = function(item, privs, remove)
{
	if(typeof item == "undefined") return;
	var curPrivs = crushFTP.storage("currentUserDirPrivs") || new Object();
	if(panelSetup.extraVFS)
		curPrivs = crushFTP.storage("extraUserDirPrivs"+panelSetup.extraVFS) || new Object();

	item = unescape(item).toUpperCase();
	if(remove)
	{
		var defaultPrivs = crushFTP.storage("currentUserDirPrivsDefault") || new Object();
		if(panelSetup.extraVFS)
		{
			defaultPrivs = crushFTP.storage("extraUserDirPrivsDefault"+panelSetup.extraVFS) || new Object();
		}
		if(defaultPrivs[item])
		{
			delete defaultPrivs[item];
		}
		if(curPrivs[item])
		{
			delete curPrivs[item];
		}
	}
	else
	{
		curPrivs[item] = privs;
	}
	if(panelSetup.extraVFS)
	{
		crushFTP.storage("extraUserDirPrivs"+panelSetup.extraVFS, curPrivs);
	}
	else
		crushFTP.storage("currentUserDirPrivs", curPrivs);
}

panelSetup.createPrivsForItem = function()
{
	var selectedDir = $("li.ui-widget-header", panelSetup.vfsItemsDirList);
	if(selectedDir && selectedDir.length>0)
	{
		var privs = "";
		var vfsOptions = $("#vfsOptions", panelSetup._panel);
		vfsOptions.find("input[id^='setup_']:checkbox:checked, #setup_quota, #advancedVFSOptions").each(function(){
			var id = $(this).attr("id");
			id = id.replace("setup_", "");
			if(id.indexOf("quota")==0)
			{
				var MB = $("#setup_quota", vfsOptions).val();
				if(crushFTP.methods.isNumeric(MB))
				{
					MB = parseInt(MB) * 1024 * 1024;
					privs += "("+id+ MB + ")";
				}
			}
			else if(id == "advancedVFSOptions")
			{
				var advancedPrivs = $(this).data("privs");
				if(advancedPrivs)
				{
					var encryptPrivs = advancedPrivs.encryption;
					if(encryptPrivs)
					{
						for(var i in encryptPrivs)
						{
							privs += "(" + i + "=" + crushFTP.methods.htmlEncode(encryptPrivs[i]) + ")";
						}
					}
					var syncPrivs = advancedPrivs.sync;
					if(syncPrivs)
					{
						for(var i in syncPrivs)
						{
							privs += "(" + i + "=" + crushFTP.methods.htmlEncode(syncPrivs[i]) + ")";
						}
					}
					var posixPrivs = advancedPrivs.posix;
					if(posixPrivs)
					{
						var permissions = posixPrivs.posixPermissions || "";
						var user = posixPrivs.posixUser || "";
						var group = posixPrivs.posixGroup || "";
						if(permissions || user || group){
							privs += "(posix:" + permissions + ":" + user + ":" + group + ")";
						}

						var permissionsFolder = posixPrivs.posixFolderPermissions || "";
						var userFolder = posixPrivs.posixFolderUser || "";
						var groupFolder = posixPrivs.posixFolderGroup || "";
						if(permissionsFolder || userFolder || groupFolder){
							privs += "(dir_posix:" + permissionsFolder + ":" + userFolder + ":" + groupFolder + ")";
						}
					}
					if(advancedPrivs.dynamic_size){
						privs += "(dynamic_size="+advancedPrivs.dynamic_size+")";
					}
					if(advancedPrivs.ratio){
						privs += "(ratio="+advancedPrivs.ratio+")";
					}
				}
			}
			else
			{
				if(id == "replicate")
				{
					privs += "("+id+")";
				}
				else
					privs += "("+id+")";
			}
		});
		var comment = $.trim($("#setup_comment", vfsOptions).val());
		if(comment && comment.length>0)
		{
			comment = comment.replace(/\(/g, "#LPR#").replace(/\)/g, "#RPR#");
			comment = crushFTP.methods.textEncode(crushFTP.methods.stripScripts(comment));
			privs += "(comment"+comment+")";
		}
		return privs;
	}
	else
	{
		return false;
	}
}

panelSetup.vfsItemSelected = function(list, selectedItems)
{
	if(!selectedItems)return;
	var selected = [];
	if(selectedItems.length>1)
	{
		var virtualDir = panelSetup.vfsItemsDirList.find("li.ui-widget-header:not(.vfsOrigItem):first");
		if(virtualDir.length>0)
			selected = virtualDir;
		else if(selected.length>0)
		{
			selected = selected[0];
		}
	}
	else if(selectedItems.length>0)
	{
		var virtualDir = panelSetup.vfsItemsDirList.find("li.ui-widget-header:not(.vfsOrigItem):first");
		if(virtualDir.length>0)
			selected = virtualDir;
		else
			selected = selectedItems[0];
	}
	selected = $(selected);
	if(!selected.attr("privs"))
	{
		var selectedWithPrivs = panelSetup.vfsItemsDirList.find("li.ui-widget-header[privs]:first");
		if(selectedWithPrivs.length>0)
			selected = selectedWithPrivs;
	}
	panelSetup.showHideVFSOperationButtons();
	var vfsOptions = $("#vfsOptions", panelSetup._panel);
	vfsOptions.find("input[type='checkbox']").each(function(){
		crushFTP.UI.checkUnchekInput($(this), false);
		$(this).attr("disabled", "disabled");
		$("#privsOptions", vfsOptions).addClass("ui-priority-secondary");
	});
	$("#setup_quota", vfsOptions).val("");
	$("#setup_comment", vfsOptions).val("");
	var privs = selected.attr("privs");
	var curPrivs = crushFTP.storage("currentUserDirPrivs") || new Object();
	if(panelSetup.extraVFS)
		curPrivs = crushFTP.storage("extraUserDirPrivs"+panelSetup.extraVFS) || new Object();
	var path = selected.data("hrefPath");
	if(typeof path == "string")
	{
		var changedPrivs = curPrivs[path.toUpperCase()];
		if(changedPrivs)
		{
			privs = changedPrivs;
		}
	}
	$("#privsOptions", vfsOptions).find(".replicate-async").hide();
	if(privs && privs.length>0)
	{
		$("#privsOptions", vfsOptions).find("input[type='checkbox']").removeAttr("disabled");
		privs = privs.split(")(").join("|");
		privs = privs.substr(0, privs.lastIndexOf(")"));
		privs = privs.substr(1, privs.length);
		privs = privs.split("|");
		var isInherited = false;
		var encryption = {};
		var sync = {};
		var posix = {};
		var dynamic_size = false;
		var ratio;
		for(var i=0; i<=privs.length;i++)
		{
			if(privs[i])
			{
				var lowerPriv = privs[i].toLowerCase();
				if(lowerPriv.indexOf("quota")==0)
				{
					var MB = parseInt(privs[i].replace("quota",""));
					if(MB)
					{
						var val = Math.round(MB/(1024*1024));
						$("#setup_quota", vfsOptions).val(val);
					}
				}
				else if(lowerPriv.indexOf("comment")==0)
				{
					$("#setup_comment", vfsOptions).val(privs[i].replace("comment","").replace(/\#LPR#/g, "(").replace(/\#RPR#/g, ")"));
				}
				else if(lowerPriv.indexOf("pgpdecryptupload") == 0)
				{
					encryption["pgpDecryptUpload"] = privs[i].replace("pgpDecryptUpload=","");
				}
				else if(lowerPriv.indexOf("pgpprivatekeyuploadpassword") == 0)
				{
					encryption["pgpPrivateKeyUploadPassword"] = privs[i].replace("pgpPrivateKeyUploadPassword=","");
				}
				else if(lowerPriv.indexOf("pgpprivatekeyuploadpath") == 0)
				{
					encryption["pgpPrivateKeyUploadPath"] = privs[i].replace("pgpPrivateKeyUploadPath=","");
				}
				else if(lowerPriv.indexOf("pgpencryptupload") == 0)
				{
					encryption["pgpEncryptUpload"] = privs[i].replace("pgpEncryptUpload=","");
				}
				else if(lowerPriv.indexOf("pgppublickeyuploadpath") == 0)
				{
					encryption["pgpPublicKeyUploadPath"] = privs[i].replace("pgpPublicKeyUploadPath=","");
				}
				else if(lowerPriv.indexOf("pgpdecryptdownload") == 0)
				{
					encryption["pgpDecryptDownload"] = privs[i].replace("pgpDecryptDownload=","");
				}
				else if(lowerPriv.indexOf("pgpprivatekeydownloadpassword") == 0)
				{
					encryption["pgpPrivateKeyDownloadPassword"] = privs[i].replace("pgpPrivateKeyDownloadPassword=","");
				}
				else if(lowerPriv.indexOf("pgpprivatekeydownloadpath") == 0)
				{
					encryption["pgpPrivateKeyDownloadPath"] = privs[i].replace("pgpPrivateKeyDownloadPath=","");
				}
				else if(lowerPriv.indexOf("pgpencryptdownload") == 0)
				{
					encryption["pgpEncryptDownload"] = privs[i].replace("pgpEncryptDownload=","");
				}
				else if(lowerPriv.indexOf("pgppublickeydownloadpath") == 0)
				{
					encryption["pgpPublicKeyDownloadPath"] = privs[i].replace("pgpPublicKeyDownloadPath=","");
				}
				else if(lowerPriv.indexOf("pgpasciiupload") == 0)
				{
					encryption["pgpAsciiUpload"] = privs[i].replace("pgpAsciiUpload=","");
				}
				else if(lowerPriv.indexOf("pgpasciidownload") == 0)
				{
					encryption["pgpAsciiDownload"] = privs[i].replace("pgpAsciiDownload=","");
				}
				else if(lowerPriv.indexOf("syncname") == 0)
				{
					sync["syncName"] = privs[i].replace("syncName=","");
				}
				else if(lowerPriv.indexOf("syncrevisionspath") == 0)
				{
					sync["syncRevisionsPath"] = privs[i].replace("syncRevisionsPath=","");
				}
				else if(lowerPriv.indexOf("syncrevisions") == 0)
				{
					sync["syncRevisions"] = privs[i].replace("syncRevisions=","");
				}
				else if(lowerPriv.indexOf("syncuploadonly") == 0)
				{
					sync["syncUploadOnly"] = privs[i].replace("syncUploadOnly=","");
				}
				else if(lowerPriv.indexOf("dir_posix") == 0)
				{
					var values = privs[i].split(":");
					posix["posixFolderPermissions"] = values[1] || "";
					posix["posixFolderUser"] = values[2] || "";
					posix["posixFolderGroup"] = values[3] || "";
				}
				else if(lowerPriv.indexOf("posix") == 0)
				{
					var values = privs[i].split(":");
					posix["posixPermissions"] = values[1] || "";
					posix["posixUser"] = values[2] || "";
					posix["posixGroup"] = values[3] || "";
				}
				else if(lowerPriv.indexOf("dynamic_size") == 0)
				{
					dynamic_size = privs[i].replace("dynamic_size=","") == "true";
				}
				else if(lowerPriv.indexOf("ratio") == 0)
				{
					ratio = privs[i].replace("ratio=","");
				}
				else
				{
					crushFTP.UI.checkUnchekInput(vfsOptions.find("#setup_" + privs[i]), true);
					if(privs[i] == "replicate"){
						$("#privsOptions", vfsOptions).find(".replicate-async").show();
					}
				}
				if(lowerPriv.indexOf("inherited") == 0)
				{
					isInherited = true;
				}
			}
		}
		$("#advancedVFSOptions", vfsOptions).data("privs", {"encryption":encryption, "sync":sync, "posix": posix, dynamic_size: dynamic_size, ratio: ratio});
		var name = unescape(selected.attr("name"));
		var root_dir = unescape(selected.attr("rootDir"));
		if(!selected.hasClass("vfsOrigItem"))
		{
			var privsOptions = $("#privsOptions", vfsOptions).removeClass("ui-priority-secondary");
			privsOptions.find("input.noVirtualItemOpt").each(function(){
				var that = $(this);
				that.closest("div").addClass("ui-priority-secondary");
				that.attr("disabled", "disabled");
			});
		}
		else
		{
			var privsOptions = $("#privsOptions", vfsOptions).removeClass("ui-priority-secondary");
			privsOptions.find("input.noVirtualItemOpt").each(function(){
				var that = $(this);
				that.closest("div").removeClass("ui-priority-secondary");
				that.removeAttr("disabled");
			});
		}
		if(isInherited)
		{
			$("#privsOptions", vfsOptions).addClass("ui-priority-secondary");
		}
	}
	else
	{
		$("#privsOptions", vfsOptions).addClass("ui-priority-secondary");
		$("#privsOptions", vfsOptions).find("input[type='checkbox']").attr("disabled", "disabled");
		panelSetup.showParentDirPrivs();
	}
}

panelSetup.showParentDirPrivs = function()
{
	var curDirLoaded = panelSetup.userDirSelectList.find("option:selected");
	var vfsOptions = $("#vfsOptions", panelSetup._panel);
	var parentPrivs;
	if(curDirLoaded && curDirLoaded.attr("privs"))
		parentPrivs = curDirLoaded.attr("privs");
	if(!parentPrivs)
	{
		var GUIXMLPrefs = $(document).data("GUIXMLPrefs");
		if(GUIXMLPrefs && GUIXMLPrefs.user_default_folder_privs)
		{
			parentPrivs = GUIXMLPrefs.user_default_folder_privs;
		}
	}
	if(parentPrivs && parentPrivs.length>0)
	{
		parentPrivs = parentPrivs.split(")(").join("|");
		parentPrivs = parentPrivs.substr(0, parentPrivs.lastIndexOf(")"));
		parentPrivs = parentPrivs.substr(1, parentPrivs.length);
		parentPrivs = parentPrivs.split("|");
		for(var i=0; i<=parentPrivs.length;i++)
		{
			if(parentPrivs[i])
			{
				var lowerPriv = parentPrivs[i].toLowerCase();
				if(lowerPriv.indexOf("quota")==0)
				{
					var MB = parseInt(parentPrivs[i].replace("quota",""));
					if(MB)
					{
						var val = Math.round(MB/(1024*1024));
						$("#setup_quota", vfsOptions).val(val);
					}
				}
				else if(lowerPriv.indexOf("comment")==0)
				{
					$("#setup_comment", vfsOptions).val(parentPrivs[i].replace("comment",""));
				}
				else if(lowerPriv.indexOf("posix") < 0 && lowerPriv.indexOf("dir_posix") < 0)
				{
					try{
						crushFTP.UI.checkUnchekInput(vfsOptions.find("#setup_" + parentPrivs[i].split("=")[0]), true);
					}catch(ex){
						console.log(ex);
					}
				}
			}
		}
	}
}

panelSetup.serverDirSelected = function(selected, userStuff)
{
	if(selected)
	{
		var goToDir = selected.attr("path");
		if(selected.attr("upLevel"))
		{
			var curDir = selected.attr("curLevel");
			if(curDir.lastIndexOf("/")==curDir.length-1)
			{
				curDir = curDir.substr(0, curDir.lastIndexOf("/"));
			}
			goToDir = curDir.substr(0, curDir.lastIndexOf("/"));
			if(goToDir.length == 0) goToDir = false;
			var dirDropDown = panelSetup.serverDirSelectList
			if(userStuff)
				dirDropDown = panelSetup.userDirSelectList;
			var curLevel = escape(selected.attr("curLevel"));
			dirDropDown.find("option[value='"+curLevel+"']").nextAll("option").remove();
			dirDropDown.find("option[value='"+curLevel+"']").remove();
			dirDropDown.find("option:last").attr("selected", "selected").trigger("change.combo");
			panelSetup.bindServerDirsToBrowse(goToDir, true, userStuff);
		}
		else if(selected.attr("_type") == "dir")
		{
			var parentPrivs = selected.attr("privs");
			panelSetup.bindServerDirsToBrowse(goToDir, false, userStuff, false, parentPrivs);
		}
	}
}

panelSetup.formatDirListingItems = function(list)
{
	list = list || panelSetup.serverDirBrowsePanel;
	list.find("li").each(function(){
		var fileName = $(this).text();
		if(fileName.indexOf("/") == 0)
		{
			fileName = fileName.substr(1, fileName.length-1);
			$(this).text(fileName);
		}
		$(this).find("span.ui-icon").remove();
		$(this).prepend('<span style="display: inline-block; margin: -2px 3px 0px -7px;float: left;" class="pointer ui-icon"></span>');
		if($(this).attr("upLevel"))
		{
			$(this).find("span.ui-icon").addClass("ui-icon-arrowreturnthick-1-n");
		}
		else if($(this).attr("_type").toLowerCase()== "dir")
		{
			$(this).find("span.ui-icon").addClass("ui-icon-folder-collapsed");
		}
		else
		{
			$(this).find("span.ui-icon").addClass("ui-icon-document");
		}
	});
	var selected = $([]), offset = {top:0, left:0};
	panelSetup.serverDirBrowsePanel.find("li:not(.uplevelLink)").addClass("serverItem").draggable({
		appendTo: "body",
		helper: "clone",
		zIndex : "99999",
	    start: function(ev, ui) {
	    	if(panelSetup.serverDirBrowsePanel.find("li.ui-widget-header").length>0)
	        	ui.helper.addClass('dragging').append(" + " + panelSetup.serverDirBrowsePanel.find("li.ui-widget-header").length + " more..");
	        else
	        	ui.helper.addClass('dragging');
	    }
	});
	if(list.attr("id") == panelSetup.vfsItemsDirList.attr("id"))
	{
		panelSetup.bindContextMenu();
	}
}

panelSetup.sortListingItems = function(items, userStuff){
	if(items)
    {
        var dirItems = [];
        var fileItems = [];
        for(var i=0;i<items.length;i++)
        {
            var type = items[i].type;
            if(typeof type != "undefined" && type == "DIR")
                dirItems.push(items[i]);
            else
                fileItems.push(items[i]);
        }

        dirItems.sort(function(a, b) {
          if (a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
          if (a.name.toLowerCase() > b.name.toLowerCase()) { return  1; }
          return 0;
        });

        fileItems.sort(function(a, b) {
          if (a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
          if (a.name.toLowerCase() > b.name.toLowerCase()) { return  1; }
          return 0;
        });

        if(window.alphanumericalSorting)
        {
            dirItems.sort(function(a, b) {
              return parseInt(a.name.match(/\d+/),10) - parseInt(b.name.match(/\d+/),10);
            });

            fileItems.sort(function(a, b) {
              return parseInt(a.name.match(/\d+/),10) - parseInt(b.name.match(/\d+/),10);
            });
            dirItems.sort(function(a, b) {
              return parseInt(a.name.match(/\d+/),10) - parseInt(b.name.match(/\d+/),10);
            });

            fileItems.sort(function(a, b) {
              return parseInt(a.name.match(/\d+/),10) - parseInt(b.name.match(/\d+/),10);
            });
        }
        if(userStuff){
	        var sortBy = "";
		    var direction = 0;
	        var sort = $("#sortVFSItems").val() || "";
	        sortBy = sort;
	        direction = 0;
			if(sort == "name"){
				sortBy = "name";
			}
			else if(sort == "name-d"){
				sortBy = "name";
				direction = 1;
			}
			else if(sort == "type"){
				sortBy = "type";
			}
			else if(sort == "type-d"){
				sortBy = "type";
				direction = 1;
			}
			else if(sort == "date"){
				sortBy = "date";
			}
			else if(sort == "date-d"){
				sortBy = "date";
				direction = 1;
			}
			if(!sortBy){
				items = dirItems.concat(fileItems);
			}
			else if(sortBy == "name"){
				items = dirItems.concat(fileItems);
				if(!direction){
					items.sort(function(a, b){
						return a.name.localeCompare(b.name);
					});
				}
				else{
					items.sort(function(b, a){
						return a.name.localeCompare(b.name);
					});
				}
			}
			else if(sortBy == "type"){
				items = dirItems.concat(fileItems);
				if(!direction){
					items.sort(function(a, b){
						return a.typeR.localeCompare(b.typeR);
					});
				}
				else{
					items.sort(function(b, a){
						return a.typeR.localeCompare(b.typeR);
					});
				}
			}
			else if(sortBy == "date"){
				items = dirItems.concat(fileItems);
				if(!direction){
					items.sort(function(a, b){
						return a.modified.localeCompare(b.modified);
					});
				}
				else{
					items.sort(function(b, a){
						return a.modified.localeCompare(b.modified);
					});
				}
			}
        }
        else
        	items = dirItems.concat(fileItems);
    }
    return items;
}

panelSetup.bindServerDirsToBrowse = function(curDir, loadingFromSelect, userStuff, keepSelection, parentPrivs)
{
	var defaultDir = !userStuff && crushFTP.serverConfig && crushFTP.serverConfig.userRoot ? crushFTP.serverConfig.userRoot.split(";")[0] : "/";
	curDir = curDir || defaultDir;
	if(!userStuff && curDir == "/")
		curDir = defaultDir;
	if(curDir.toString() == "null"){
		if(!userStuff)
			curDir = defaultDir;
		else
			curDir = "/";
	}
	if(curDir != defaultDir && !loadingFromSelect)
	{
		if(userStuff)
		{
			if(unescape(panelSetup.userDirSelectList.val()) != "/")
				curDir = unescape(panelSetup.userDirSelectList.val()) + curDir;
			else if(curDir.indexOf("/")<0)
				curDir = "/" + curDir;
		}
		else
		{
			if(unescape(panelSetup.serverDirSelectList.val()) != "/")
				curDir = unescape(panelSetup.serverDirSelectList.val()) + curDir;
			else if(curDir.indexOf("/")<0)
				curDir = "/" + curDir;
		}
	}
	if(curDir.lastIndexOf("/")!=curDir.length-1)
	{
		curDir = curDir + "/";
	}
	curDir = unescape(curDir);
	var obj = {
		command: "getAdminXMLListing",
		format: "JSON",
		file_mode : "user",
		path: curDir.replace(/\+/g, "%2B"),
		random: Math.random()
	};
	obj.serverGroup = $("#userConnectionGroups").val() || "MainUsers";
	obj.c2f = crushFTP.getCrushAuth();
	if(userStuff)
	{
		obj.username = panelSetup.loadUser || crushFTP.storage("userName");
		obj.command = "getUserXMLListing";
		if(!panelSetup.loadUser)
		{
			var perms = panelSetup.generatePrivsXML();
			if(perms)
				obj.permissions = perms;
			var xml = panelSetup.generateVFSXML();
			if(xml)
				obj.vfs_items = xml;
			if(!obj.vfs_items || obj.vfs_items.length == 0)
			{
				obj.vfs_items = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><vfs type=\"vector\"></vfs>";
			}
		}

		if(panelSetup.extraVFS)
		{
			obj.serverGroup = userManager.extraVFSServerGroup;
			obj.username = crushFTP.storage("userName") + "~" + panelSetup.extraVFS;
			if(!obj.permissions)
				obj.permissions = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><VFS type=\"properties\"><item name=\"/\">(read)(view)(resume)</item></VFS>";
		}
	}

	/*Get VFS Item details by name, useful to get meta info*/
	function getVFSDetailsByName(name){
		if(!name || !obj.vfs_items)
			return false;
		var toReturn;
		$(obj.vfs_items).find("vfs_items_subitem").each(function(){
			if($(this).find("name").text() == name)
				toReturn = $(this);
		});
		return toReturn;
	}

	/* Make a call and receive list */
	var itemsPanel = panelSetup.serverDirBrowsePanel;
	if(userStuff)
	{
		itemsPanel = panelSetup.vfsItemsDirList;

		var vfsOptions = $("#vfsOptions", panelSetup._panel);
		vfsOptions.find("input[type='checkbox']").each(function(){
			crushFTP.UI.checkUnchekInput($(this), false);
		});
		vfsOptions.find("input[type='text'], textarea").each(function(){
			$(this).val("");
		});
		$("#privsOptions", vfsOptions).addClass("ui-priority-secondary");
	}
	crushFTP.UI.showIndicator(false, itemsPanel.closest("td"), "Wait..");
	$.ajax({
		type: "POST",
		url: userManager.ajaxCallURL,
		data: obj,
		success: function (msg){
			crushFTP.UI.hideIndicator(false, itemsPanel.closest("td"));
			if (msg && msg.childNodes && msg.childNodes.length > 0) {
				itemsPanel.data("curLoadedDir", obj.path);
				var items = $(msg).find("listing").text();
				if(items)
				{
					items = items.replace(/\n/g,' ').replace(/\s/g,' ');
					eval(items);
					if(l && jQuery.isArray(l))
					{
						for(var i=0; i<=l.length;i++)
						{
							var curItem = l[i];
							if(curItem && unescape(curItem.name).length>0)
							{
								var name = unescape(curItem.name.toString());
								if(name.indexOf(".")!=0 || $(itemsPanel).attr("id")=='vfsItems')
								{
									if(userStuff){
										if(curDir == "/")
										{
											var curVFSInfo = getVFSDetailsByName(curItem.name);
											if(curVFSInfo){
												var realURL = curVFSInfo.find("url").text();
												curItem.typeR = realURL.split(":")[0];
											}
										}
									}
								}
								curItem.typeR = curItem.typeR || curItem.type;
							}
						}
					}
					itemsPanel.data("records", l);
					panelSetup.renderList(itemsPanel, userStuff, keepSelection, curDir, parentPrivs);
				}
				else{
					itemsPanel.data("records", []);
					panelSetup.renderList(itemsPanel, userStuff, keepSelection, curDir, parentPrivs);
				}
			}
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			if(userStuff){
				var curLoadedDir = itemsPanel.data("curLoadedDir");
				var dirDropDown = panelSetup.userDirSelectList;
				if(dirDropDown.find("option[value='"+escape(curLoadedDir)+"']").length==0)
				{
					dirDropDown.append("<option selected value='"+escape(curLoadedDir)+"'>"+curLoadedDir+"</option>").trigger("change.combo");
				}
				else
				{
					dirDropDown.find("option[value='"+escape(curLoadedDir)+"']").attr("selected", "selected");
				}
			}
			errorThrown = errorThrown || "The path requested is not accessible or no longer available : \"" + obj.path + "\"";
			crushFTP.UI.growl("Error : ", errorThrown, true, 5000);
			crushFTP.UI.hideIndicator(false, itemsPanel.closest("td"));
		}
	});
}

panelSetup.filterItems = function(records, phrase){
 var result = [];
 for (var i = 0; i < records.length; i++) {
 	var curItem = records[i];
 	if(curItem.name.toLowerCase().indexOf(phrase)>=0)
 		result.push(curItem);
 }
 return result;
};

panelSetup.renderList = function(itemsPanel, userStuff, keepSelection, curDir, parentPrivs, curPage, offSet, items){
	if(!items){
		var records = itemsPanel.data("records");
		if(!records)
			return;
	}
	else{
		records = items;
	}
	records = panelSetup.sortListingItems(records, userStuff);
	if(userStuff){
		$('#sortVFSItems').unbind().bind("change", function(){
			panelSetup.renderList(itemsPanel, userStuff, keepSelection, curDir, parentPrivs, curPage, undefined, items);
			return;
		});
		panelSetup.filterUserItems = function(phrase)
		{
			if(phrase){
				records = itemsPanel.data("records");
				var _items = panelSetup.filterItems(records, phrase.toLowerCase());
				panelSetup.renderList(itemsPanel, userStuff, keepSelection, curDir, parentPrivs, 0, undefined, _items);
			}
			else if(items)
				panelSetup.renderList(itemsPanel, userStuff, keepSelection, curDir, parentPrivs);
		}
	}
	else{
		panelSetup.filterServerItems = function(phrase)
		{
			if(phrase){
				records = itemsPanel.data("records");
				var _items = panelSetup.filterItems(records, phrase.toLowerCase());
				panelSetup.renderList(itemsPanel, userStuff, keepSelection, curDir, parentPrivs, 0, undefined, _items);
			}
			else if(items)
				panelSetup.renderList(itemsPanel, userStuff, keepSelection, curDir, parentPrivs);
		}
	}
	var selectedItems;
	if(userStuff && keepSelection)
	{
		selectedItems = itemsPanel.find(".ui-widget-header");
	}
	itemsPanel.empty();
	var pageSize = 500;
	var hasPaging = records.length > pageSize;
	var start = 0;
	var end = hasPaging ? pageSize : records.length;
	var pagingNote = itemsPanel.closest("td").find(".list-paging");
	if(hasPaging){
		pagingNote.show();
		curPage = curPage || 0;
		offSet = offSet || 0;
		curPage += offSet;
		if(curPage){
			start = pageSize * curPage;
			if(start<0)
				start = 0;
			end = start + pageSize;
			if(end>records.length)
				end = records.length;
			if(end<0)
				end = 0;
		}
		pagingNote.find(".from").text(start || 1);
		pagingNote.find(".to").text(end);
		pagingNote.find(".total").text(records.length);
		if(end<records.length){
			pagingNote.find("a.next").unbind().removeProp("disabled").removeClass('ui-state-disabled').click(function(){
					panelSetup.renderList(itemsPanel, userStuff, keepSelection, curDir, parentPrivs, curPage, 1, items);
				return false;
			});
		}
		else{
			pagingNote.find("a.next").unbind().prop("disabled", "disabled").addClass('ui-state-disabled');
		}
		if(curPage>0){
			pagingNote.find("a.prev").unbind().removeProp("disabled").removeClass('ui-state-disabled').click(function(){
				panelSetup.renderList(itemsPanel, userStuff, keepSelection, curDir, parentPrivs, curPage, -1, items);
				return false;
			});
		}
		else{
			pagingNote.find("a.prev").unbind().prop("disabled", "disabled").addClass('ui-state-disabled');
		}
		start-=1;
		if(start<0)
			start = 0;
		end-=1;
		if(end<0)
			end = 0;
		panelSetup.vfsItemSelected(itemsPanel, []);
	}
	else{
		pagingNote.hide();
	}

	for(var i=start; i<end;i++)
	{
		var curItem = records[i];
		if(curItem && unescape(curItem.name).length>0)
		{
			var name = unescape(curItem.name.toString());
			if(name.indexOf(".")!=0 || $(itemsPanel).attr("id")=='vfsItems')
			{
				var hrefPath = curDir + name;
				if(curItem.type.toLowerCase() == "dir")
				{
					 hrefPath += "/";
				}
				var privs = curItem.privs;
				if(!userStuff)
				{
					var GUIXMLPrefs = $(document).data("GUIXMLPrefs");
					if(GUIXMLPrefs && GUIXMLPrefs.user_default_folder_privs)
					{
						privs = GUIXMLPrefs.user_default_folder_privs;
					}
				}
				if(privs.length==0)
					privs = "(comment)";

				var metainfo = "";
				var createdDate = curItem.modified;
				var type = "-";
				if(userStuff){
					if(curDir == "/")
					{
						type = curItem.typeR;
					}
					else{
						type = curItem.type;
					}
					var createdDateF = moment(parseInt(createdDate)).format("MM/DD/YYYY hh:mm:ss A");
					metainfo = "<div class='metainfo'><span class='type'>"+type+"</span><span class='date' date='"+createdDate+"'>"+createdDateF+"</span></div><div class='clear'></div>";
				}

				var newElem = $("<li hrefPath=\""+escape(hrefPath)+"\" curPath=\""+escape(curItem.href_path)+"\" rootDir=\""+escape(curItem.root_dir)+"\" name=\""+curItem.name+"\" path=\""+escape(curItem.name)+"\" privs=\""+privs+"\" date='"+createdDate+"' type='"+type+"' _type='"+curItem.type.toLowerCase()+"'>"+crushFTP.methods.textEncode(unescape(name))+metainfo+"</li>");
				var matchedElem = panelSetup.checkIfCurrentDirIsVFSItem(curItem.root_dir, name);
				newElem.addClass("vfsOrigItem");
				if(matchedElem && matchedElem.url.length == 0)
					newElem.removeClass("vfsOrigItem");
				itemsPanel.append(newElem);
				newElem.data("hrefPath", crushFTP.methods.decodeXML(hrefPath));
			}
		}
	}
	if(userStuff && keepSelection && selectedItems)
	{
		selectedItems.each(function(){
			itemsPanel.find("li[hrefPath='"+$(this).attr("hrefPath")+"']").addClass("ui-selected ui-widget-header");
		});
		panelSetup.vfsItemSelected(itemsPanel, itemsPanel.find("li.ui-widget-header"), true);
	}
	if(curDir && curDir != null && curDir != "/")
	{
		if(userStuff)
		{
			if(panelSetup.userDirSelectList.find("option[value='"+escape(curDir)+"']").length==0)
			{
				panelSetup.userDirSelectList.append("<option privs='"+parentPrivs+"' selected value='"+escape(curDir)+"'>"+curDir+"</option>");
			}
			else
			{
				var curDirItemInDD = panelSetup.userDirSelectList.find("option[value='"+escape(curDir)+"']").attr("selected", "selected");
				if(parentPrivs)
					curDirItemInDD.attr("privs", parentPrivs);
			}
		}
		else
		{
			if(panelSetup.serverDirSelectList.find("option[value='"+escape(curDir)+"']").length==0)
			{
				panelSetup.serverDirSelectList.append("<option selected value='"+escape(curDir)+"'>"+curDir+"</option>").trigger("change.combo");
			}
			else
			{
				panelSetup.serverDirSelectList.find("option[value='"+escape(curDir)+"']").attr("selected", "selected");
			}
		}
		itemsPanel.prepend("<li name='' type='' date='' curLevel=\""+curDir+"\" class='uplevelLink' upLevel=\"true\">..</li>");
	}
	else if(curDir && curDir != null)
	{
		if(userStuff)
		{
			panelSetup.userDirSelectList.val(escape(curDir)).find("option:selected").nextAll("option").remove();
		}
		else
		{
			panelSetup.serverDirSelectList.val(escape(curDir)).find("option:selected").nextAll("option").remove();
		}
	}
	if(itemsPanel.find("li:first").length>0)
		itemsPanel.parent().scrollTo(itemsPanel.find("li:first"));

	panelSetup.formatDirListingItems(itemsPanel);
	if(userStuff)
	{
		if(itemsPanel.find("li:not(.uplevelLink)").length==1)
		{
			panelSetup.vfsItemSelected(itemsPanel, itemsPanel.find("li:not(.uplevelLink):first").addClass("ui-selected ui-widget-header"), true);
		}
		else if(panelSetup.lastDroppedItem)
		{
			var matchedElem = $();
			itemsPanel.find("li").each(function(){
				if($(this).data("hrefPath") == panelSetup.lastDroppedItem)
				{
					matchedElem = $(this);
					return;
				}
			});
			panelSetup.vfsItemSelected(itemsPanel, matchedElem.addClass("ui-selected ui-widget-header"), true);
			panelSetup.lastDroppedItem = false;
		}
		else
		{
			if(!keepSelection)
				panelSetup.showParentDirPrivs();
		}
		panelSetup.showHideVFSOperationButtons();
		if(!items)
			$("#filterUsersFiles", panelSetup._panel).val("").trigger("keyup");
		$('#showmetaInfo').trigger('change');
	}
	else
	{
		panelSetup.showHideServerOperationButtons();
		if(!items)
			$("#filterServersFiles", panelSetup._panel).val("").trigger("keyup");
		if(panelSetup.lastCreatedFolder)
		{
			var listToFilter = panelSetup.serverDirBrowsePanel;
			var newItem = listToFilter.find("li").filter(function() { return $.text([this]).toLowerCase() == panelSetup.lastCreatedFolder.toLowerCase(); });
			if(newItem && newItem.length>0)
			{
				listToFilter.find(".ui-widget-header").removeClass("ui-selected ui-widget-header");
				newItem.addClass("ui-selected ui-widget-header").trigger("click");
				listToFilter.parent().scrollTo(newItem);
			}
		}
		panelSetup.lastCreatedFolder = false;
		var defaultDir = crushFTP.serverConfig && crushFTP.serverConfig.userRoot ? crushFTP.serverConfig.userRoot.split(";")[0] : "/";
		panelSetup.serverDirSelectList.find("option[value='"+escape(defaultDir)+"']").prevAll("option").remove();
	}
}

panelSetup.showRecentServerItemOption = function(){
	var recentlyUsedServerItems = $.jStorage.get("recentlyUsedServerItems") || [];
	if(recentlyUsedServerItems.length>0)
	{
		$("#showServerItemHistory").show();
		var elem = $("#lastServerPathHistory").empty();
		for (var i = 0; i < recentlyUsedServerItems.length; i++) {
			var curItem = recentlyUsedServerItems[i];
			var curElem = $("<li>"+crushFTP.methods.textEncode(unescape(curItem))+"</li>");
			curElem.data("path", unescape(curItem));
			elem.append(curElem);
		}
	}
	else
	{
		$("#showServerItemHistory, #lastServerPathHistory").hide();
	}
}

panelSetup.generateVFSXML = function(curUserJson, noExtra, useThisExtra)
{
	var xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
	// VFS Items
	xml += "\r\n<vfs_items type=\"vector\">";
	var itemsAvailable = false;
	curUserJson = curUserJson || crushFTP.storage("currentUser");
	if((panelSetup.extraVFS || useThisExtra) && !noExtra)
	{
		useThisExtra = useThisExtra || panelSetup.extraVFS;
		var usrExtraVFS = $(document).data("userName") + "~" + useThisExtra;
		curUserJson = crushFTP.storage("extraUserInfo"+usrExtraVFS);
	}
	if(curUserJson && curUserJson.vfs_items && curUserJson.vfs_items.vfs_items_subitem)
	{
		var items = curUserJson.vfs_items.vfs_items_subitem;
		if(items)
		{
			for(var curItem in items)
			{
				var item = items[curItem].vfs_items_subitem_subitem;
				if(!item)item = items[curItem];
				if(item && item.name)
				{
					var path = item.path || "";
					if(item.name.toLowerCase() == "vfs" && path == "" && item.url == "" && item.type.toLowerCase()=="dir")
					{
						xml += "";
					}
					else
					{
						xml += "\r\n<vfs_items_subitem type=\"properties\">";
							xml += "\r\n<name>"+crushFTP.methods.htmlEncode(unescape(crushFTP.methods.decodeXML(item.name))).replace(/\+/g, "%2B")+"</name>";
							xml += "\r\n<path>"+crushFTP.methods.htmlEncode(unescape(crushFTP.methods.decodeXML(path))).replace(/\+/g, "%2B")+"</path>";
							xml += "\r\n<vfs_item type=\"vector\">";
								xml += "\r\n<vfs_item_subitem type=\"properties\">";
									for(var prop in item)
									{
										if(prop != "name" && prop != "path")
										{
											var val = crushFTP.methods.htmlEncode(unescape(crushFTP.methods.decodeXML(item[prop]))).replace(/\+/g, "%2B");
											if(prop == "type")
											{
												if(val.toLowerCase() == "properties")
													val = "dir";
												xml += "\r\n<"+prop+">" + val.toUpperCase()+ "</"+prop+">";
											}
											else if(prop == "url")
											{
												if(val.indexOf("/////")>=0)
												{
													val	= val.replace("/////", "////");
												}
												xml += "\r\n<"+prop+">" + val + "</"+prop+">";
											}
											else
												xml += "\r\n<"+prop+">" + val + "</"+prop+">";
										}
									}
								xml += "\r\n</vfs_item_subitem>";
							xml += "\r\n</vfs_item>";
						xml += "\r\n</vfs_items_subitem>";
						itemsAvailable = true;
					}
				}
			}
		}
	}
	if(!itemsAvailable)
	{
		return false;
	}
	else
	{
		xml += "\r\n</vfs_items>";
		return xml;
	}
}

panelSetup.generatePrivsXML = function(flag, noExtra, useThisExtra)
{
	var currentUserDirPrivs = crushFTP.storage("currentUserDirPrivs");
	if((panelSetup.extraVFS || useThisExtra) && !noExtra)
	{
		useThisExtra = useThisExtra || panelSetup.extraVFS;
		currentUserDirPrivs = crushFTP.storage("extraUserDirPrivs"+useThisExtra);
	}
	var xml = "";
	var itemsAvailable = false;
	if(currentUserDirPrivs)
	{
		// Privs for items
		xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
		xml += "\r\n<VFS type=\"properties\">";
		for(var curItem in currentUserDirPrivs)
		{
			var privs = currentUserDirPrivs[curItem];
			if(typeof privs  != "undefined" && typeof curItem  != "undefined")
			{
				var pathName = crushFTP.methods.htmlEncode(unescape(crushFTP.methods.decodeXML(curItem.toUpperCase()))).replace(/\+/g, "%2B");
				var privsValue = crushFTP.methods.htmlEncode(unescape(crushFTP.methods.decodeXML(privs))).replace(/\+/g, "%2B");
				xml += "\r\n<item name=\""+pathName+"\">"+privsValue+"</item>";
				itemsAvailable = true;
			}
		}
		xml += "\r\n</VFS>";
	}
	if(!itemsAvailable)
	{
		return false;
	}
	else
	{
		return xml;
	}
}

panelSetup.generateSpecialItemsXML = function(name, type)
{
    type = type || "add";
    var xml = "";
    if(name == "LinkedVFS")
    {
        if(type == "add")
        {
            //Linked VFS
			if(panelSetup._panel.find("#linkedVFSCheck").find("input:checked").length>0)
			{
				xml += "\r\n<linked_vfs type=\"vector\">";
				var vfsLinks = $("#vfsLinks", panelSetup._panel);
				vfsLinks.find("li").each(function(){
					var vfsData = $(this).data("controlData");
					if(vfsData)
					{
						xml += "\r\n<linked_vfs_subitem>"+ vfsData +"</linked_vfs_subitem>";
					}
				});
				if(vfsLinks.find("li").length==0)
					xml += "\r\n<linked_vfs_subitem>null</linked_vfs_subitem>";
				xml += "\r\n</linked_vfs>";
			}
        }
        else
            xml = "linked_vfs";
    }
    else if(name == "VFS")
    {
        if(type == "add")
        {
            return false;
        }
        else
            xml = "root_dir";
    }
    else if(name == "ExtraVFS")
    {
    	if(!panelSetup.extraVFS)
    	{
	    	if(type == "add")
	        {
	            //Extra VFS
				if(panelSetup._panel.find("#vfsCheckBox").find("input:checked").length>0)
				{
					xml += "\r\n<extra_vfs type=\"vector\">";
					var vfsItemButtons = $("#vfsItemButtons");
					vfsItemButtons.find(".vfsBtn").each(function(){
						var vfsData = $(this).data("controlData");
						if(vfsData)
						{
							xml += "\r\n<extra_vfs_subitem>"+ vfsData +"</extra_vfs_subitem>";
						}
					});
					xml += "\r\n</extra_vfs>";
				}
	        }
	        else
	            xml = "extra_vfs";
	    }
	    else
	        xml = "";
    }
    return xml;
}

panelSetup.generateXML = function()
{
	var xml = "";
	//General items
	panelSetup._panel.find("td.checkboxArea").not(".specialProperty").find("input:checked").each(function(){
		var formPanel = $(this).closest("td").next();
		xml += "\r\n" + userManager.data.buildXMLToSubmitForm(formPanel);
	});
	xml += panelSetup.generateSpecialItemsXML("LinkedVFS");
	var _extraVFS = panelSetup.extraVFS;
	panelSetup.extraVFS = false;
	xml += panelSetup.generateSpecialItemsXML("ExtraVFS");
	panelSetup.extraVFS = _extraVFS;
	xml.replace(/crush_value1/g, 'user_name').replace(/crush_value2/g, 'password');
	return xml;
}

panelSetup.generatePasswordUsingPrefs = function(){
	var passwords = [];
	var maxChars = parseInt($(document).data("GUIXMLPrefs").random_password_length) || 8;
	passwords.push(crushFTP.methods.generateRandomPassword(maxChars));

	var minNumeric = $(document).data("GUIXMLPrefs").min_password_numbers || 0;
	var minLower = $(document).data("GUIXMLPrefs").min_password_lowers || 0;
	var minUpper = $(document).data("GUIXMLPrefs").min_password_uppers || 0;
	var minSpecial = $(document).data("GUIXMLPrefs").min_password_specials || 0;
	var unsafeChars = $(document).data("GUIXMLPrefs").unsafe_password_chars || "";
	var specialChars = userManager.specialCharactersInUserPass + "";
	for (var i = 0; i < unsafeChars.length; i++) {
		specialChars = specialChars.split(unsafeChars.charAt(i)).join('');
	}
	if(minNumeric>0 || minLower>0 || minUpper>0 || minSpecial>0)
	{
		passwords = [];
		if(minNumeric>0)
		{
			passwords.push(crushFTP.methods.generateRandomPassword(minNumeric, true));
		}
		if(minLower>0)
		{
			passwords.push(crushFTP.methods.generateRandomPassword(minLower, false, 'abcdefghijklmnopqrstuvwxyz'));
		}
		if(minUpper>0)
		{
			passwords.push(crushFTP.methods.generateRandomPassword(minUpper, false, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'));
		}
		if(minSpecial>0)
		{
			passwords.push(crushFTP.methods.generateRandomPassword(minSpecial, false, specialChars));
		}
	}
	passwords.sort(function(a,b){ return( parseInt( Math.random()*10 ) %2 );});
	var pass = passwords.join("");
	pass = pass.shuffle();
	if(pass.length>maxChars)
	{
		pass = pass.substr(0, maxChars);
	}
	else if(pass.length<maxChars)
	{
		pass += crushFTP.methods.generateRandomPassword(maxChars - pass.length, true);
	}
	pass = pass.shuffle();
	return pass;
}
