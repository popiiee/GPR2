/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelAdmin = {};
panelAdmin.localization = {};
/****************************/

// Panel details
var panelName = "Admin";
panelAdmin._panel = $("#pnl" + panelName);

// Localizations
panelAdmin.localization = {
};

// Assign localizations
localizations.panels[panelName] = $.extend(panelAdmin.localization, localizations.panels[panelName]);

// Interface methods
panelAdmin.init = function(){
	applyLocalizations(panelName, localizations.panels);
	window.dataBindEvents.push(panelAdmin.bindData);
	panelAdmin.bindEvents();
}

panelAdmin.clearItems = function(dataPanel)
{
	dataPanel.find("input.siteField:checked").each(function(){
		crushFTP.UI.checkUnchekInput($(this), false);
	});
}

panelAdmin.bindData = function(userInfo, jsonDeep, panel)
{
	var dataPanel = panel || panelAdmin._panel;
	if(panel)
	{
		panel.removeClass("inheritValSet");
	}
	panelAdmin.clearItems(dataPanel);
	if(userInfo.user)
	{
		userManager.data.bindValuesFromJson(dataPanel, userInfo.user, false, panel);

		var dataInheritedFrom = false;
		var curData = userManager.methods.seperateValueAndInheritValue(crushFTP.data.getValueFromJson(userInfo.user, "site"));
		var value = curData.value;
		dataInheritedFrom = curData.inherit || dataInheritedFrom;
		var sitePrefs = value.toLowerCase();
		$("#limitedUserRolesPanel").find("input").removeAttr("checked");
		$("input.siteField").each(function(){
			if(sitePrefs.indexOf($(this).attr("id"))>=0)
			{
				crushFTP.UI.checkUnchekInput($(this), true);
			}
		});
		if(!panel)
		{
			userManager.data.setInheritPropertyOfSection($("div.siteSettings", dataPanel), "site", true);
		}
		userManager.methods.showInheritValueLabel($("div.siteSettings", dataPanel), dataInheritedFrom);
	}
	userManager.UI.panelsPostbindEvent(dataPanel, panel);
	if (!$(document).data("crushftp_enterprise"))
	{
		$("#site_proxy").attr("disabled", "disabled").parent().parent().addClass("ui-state-disabled");
		$(".enterpriseFeatureTag", panel).show();
	}
	else
	{
		$(".enterpriseFeatureTag", panel).hide();
	}
	$("#user_admin,#connect", panelAdmin._panel).trigger('change');
};

panelAdmin.bindEvents = function()
{
	userManager.UI.togglePanels(panelAdmin._panel);
	$(".checkboxArea>input[type='checkbox']", panelAdmin._panel).change(function(){
		var curUserData = crushFTP.storage("currentUserInherited");
		if(!$(this).is(":checked"))
		{
			curUserData = {user: crushFTP.storage("currentUsersLowerLevelsData")};
			$(this).closest("fieldset").addClass("inheritSet");
		}
		else
			$(this).closest("fieldset").removeClass("inheritSet");
		if(!$(this).closest("fieldset").hasClass("notInheritable"))
			panelAdmin.bindData(curUserData, false, $(this).closest("fieldset"));
	});

	var limitedUserRoles = $("#limitedUserRoles").addClass('ui-state-disabled');
	/*$("#user_admin", panelAdmin._panel).change(function(){
		if(!$(this).is(":checked"))
		{
			var changedItem = $(this);
			var editingUserData = crushFTP.storage("currentUser");
			if(editingUserData && editingUserData.user && editingUserData.user.username)
			{
				var loggedInUser = crushFTP.storage("username");
				var editingUser = editingUserData.user.username;
				if(loggedInUser.toLowerCase() == editingUser.toLowerCase())
				{
					jConfirm("You are making changes to current logged in user, this setting may restrict you from using web interface, Are you sure you want to do that?", "Confirm", function(value){
						crushFTP.UI.checkUnchekInput(changedItem, !value);
					});
				}
			}
		}
	});*/
	var limitedUserRolesPanel = $("#limitedUserRolesPanel");
	limitedUserRolesPanel.dialog("destroy").find("input").removeAttr("checked");
	$("#connect", panelAdmin._panel).change(function(){
		if(!$("#connect", panelAdmin._panel).is(":checked"))
		{
			limitedUserRoles.removeClass('ui-state-disabled');
			/*$("#adminSiteSettings").find(".siteField:not(#connect)").each(function(){
				$(this).removeAttr("disabled");
				$(this).parent().next().removeClass('ui-state-disabled');
			});*/
		}
		else
		{
			limitedUserRoles.addClass('ui-state-disabled');
			limitedUserRolesPanel.find("input").each(function(){
				$(this).removeAttr("checked");
			});
		}
	});

	limitedUserRolesPanel.dialog({
		title : "Limited Admin Roles: ",
		autoOpen: false,
		width: 800,
		modal: true,
		resizable: false,
		closeOnEscape: true,
		buttons: {
			"OK" : function(){
				$(this).dialog( "close" );
			}
		},
		open : function(){
			setTimeout(function(){
				$("#user_admin").trigger('change');
        $(".roleGroup").find("input").trigger("change")
        setTimeout(function(){
          $("#limitedUserRolesPanel").find("input[type='checkbox'][rel]:checked").trigger("change");
        },100);
			}, 100);
		}
	});

	$("#limitedUserRoles", panelAdmin._panel).click(function(event) {
		if($(this).hasClass('ui-state-disabled'))return false;
		limitedUserRolesPanel.dialog("open");
	});

	limitedUserRolesPanel.find("input").change(function(event) {
		if($(this).attr('rel'))
		{
			if($(this).is(":checked"))
			{
				limitedUserRolesPanel.find($(this).attr('rel')).attr('checked', 'checked').attr("disabled", "disabled");
			}
			else
				limitedUserRolesPanel.find($(this).attr('rel')).removeAttr("disabled");

			$(this).removeAttr("disabled");
		}
		if($(this).attr('reverserel'))
		{
			if($(this).is(":checked"))
			{
				limitedUserRolesPanel.find($(this).attr('reverserel')).removeAttr('checked').attr("disabled", "disabled");
			}
			else
				limitedUserRolesPanel.find($(this).attr('reverserel')).removeAttr("disabled");

			$(this).removeAttr("disabled");
		}
		// if($(this).is("#report_run"))
		// {
		// 	if(!$(this).is(":checked"))
		// 		limitedUserRolesPanel.find("#report_edit").removeAttr('checked');
		// }
		// if($(this).is("#report_edit"))
		// {
		// 	if(!$(this).is(":checked"))
		// 		limitedUserRolesPanel.find("#report_run").removeAttr('checked');
		// }
		if($(this).is("#user_admin"))
		{
			if($(this).is(":checked"))
				limitedUserRolesPanel.find("input").not("#user_admin").removeAttr('checked').attr("disabled", "disabled");
			else
				limitedUserRolesPanel.find("input").removeAttr("disabled");
		}
	});

	limitedUserRolesPanel.find('.multicheck, .multicheckAll').find("a").click(function(){
		if($(this).hasClass('all'))
		{
			$(this).closest('div.roleGroup').find('input').attr('checked', 'checked').trigger('change');
		}
		else if($(this).hasClass('none'))
			$(this).closest('div.roleGroup').find('input').removeAttr('checked').trigger('change');
		else if($(this).hasClass('everything'))
		{
			limitedUserRolesPanel.find(".roles").find('input').attr('checked', 'checked').trigger('change');
		}
		else
			limitedUserRolesPanel.find(".roles").find('input').removeAttr('checked').trigger('change');
		return false;
	});
};

panelAdmin.getDataXML = function(data)
{
	data = data || {};
	data.site = "";
	panelAdmin._panel.find("input.siteField:checked").each(function(){
		if(typeof $(this).attr("id") != "undefined")
			data.site += "("+$(this).attr("id").toUpperCase()+")";
	});
	return data;
}

panelAdmin.generateSpecialItemsXML = function(name, type)
{
    type = type || "add";
    var xml = "";
    if(name == "SitePrefs")
    {
        if(type == "add")
        {
            if(panelAdmin._panel.find("#sitePrefsCheck").find("input:checked").length>0)
			{
				xml += "\r\n<site>";
				$("input.siteField:checked").each(function(){
					if(typeof $(this).attr("id") != "undefined")
						xml += "(" + $(this).attr("id").toUpperCase() + ")";
				});
				xml += "\r\n</site>";
			}
        }
        else
            xml = "site";
    }
    return xml;
}

panelAdmin.generateXML = function()
{
	var xml = "";

	//General items
	panelAdmin._panel.find("td.checkboxArea").not(".specialProperty").find("input:checked").each(function(){
		var formPanel = $(this).closest("td").next();
		xml += "\r\n" + userManager.data.buildXMLToSubmitForm(formPanel);
	});
	xml += panelAdmin.generateSpecialItemsXML("SitePrefs");
	return xml;
}