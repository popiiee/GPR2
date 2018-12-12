/****************************
CrushFTP GUI Panel custom js
*****************************/
/* Do not change these lines */
var panelEncryption = {};
panelEncryption.localization = {};
/****************************/

// Panel details
var panelName = "Encryption";
var _panel = $("#pnl" + panelName);

panelEncryption.saveParams = {};

// Localizations
panelEncryption.localization = {
    headerText: "",
    lblPasswordTabText: "Password",
    lblSSLTabText: "SSL",
    lblFilesTabText: "Files",
    lblPasswordTypeDESText: "DES",
    lblPasswordTypeDESDescText: " (If you have users that often want you to lookup their password, use this option.) ",
    lblPasswordTypeSHAText: "SHA",
    lblPasswordTypeMD5Text: "MD5",
    lblPasswordTypeSHAMD5DescText: " (If you never want a password to be reversible, and want added security, use this option.) ",
    lblFormAllowUseOfBlankPasswordText: " Allow users with blank passwords to login.",
    lblNumberOfCharactersForRandomPasswordText: "Number of characters for random passwords :",
    lblNewPasswordMinimumLengthText: "New password minimum length :",
    lblMinimumNumericCharsText: "Minimum numeric characters :",
    lblMinimumLowerCaseCharsText: "Minimum lower case characters :",
    lblMinimumUpperCaseCharsText: "Minimum upper case characters :",
    lblMinimumSpecialCharsText: "Minimum special characters :",
    lblPasswordHistoryCountText: "Password history count :",
    lblSSLTabNoteText: "This is a SSL certificate. It is used for HTTPS connections and FTPS. ",
    btnGenerateSelfSignedCertiText: " Generate Now ",
    lblKeystoreLocationText: "Keystore Location :",
    btnKeyStoreLocationBrowseText: "Browse ",
    lblKeystorePasswordText: "Keystore Password :",
    btnKeyStorePasswordTestCertificateText: "Test Certificate ",
    lblKeyPasswordText: "Key Password :",
    lblFormRequireValidClientCertificateText: " Require valid client certificate.",
    btnApplyToWebInterfacesCrushUploaderText: "Apply to WebInterface's CrushUploader ",
    lblDisabledCiphersText: " Disabled Ciphers (Generally keep all ciphers enabled) ",
    lblEncryptFilesText: " Encrypt Files",
    lblPGPKeyText: "Public PGP Key : ",
    lblDecryptFilesText: " Decrypt Files",
    lblPrivatePGPKeyText: "Private PGP Key : ",
    lblPrivatePGPKeyPassText: "Private PGP Key Pass : ",
    btnGenerateEncryptionKeyText: "Generate Encryption Key",
    lblPGPKeyOldText: "Key Location : ",
    lblKeyLocationText: "Key Location :",
    btnKeyStoreLocationBrowseText: "Browse ",
    pnlFilesHelpText: "<p> File based encryption allows you to store files on your drive in an encrypted format. These files will be unusable to anything outside of CrushFTP, and with the right key. This encryption however provides security in that if the physical files are compromised, they will be useless to whoever has gotten them. </p> <p> lf any of the below warnings do not make sense, or you do not understand them fully, <br> <strong>I highly recommend you do not use this feature</strong> <br> as you can potentially turn many files into unrecoverable encrypted files! <br> </p> <p> <strong>Caution</strong> should be taken in guarding the keyfile. Placing it on a network location is the ideal solution. </p> <p> <strong>WARNING:</strong> Changing the keyfile once files have been encrypted will cause the files to be unrecoverable. You must transfer all files that are encrypted through CrushFTP to another location so that they are not encrypted. At this point you can change the key file, and transfer the files back through CrushFTP to re-encrypt them using the new keyfile. </p> ",
    btnGenerateEncryptionKeyText: "Generate Key",
    btnResetText: "Reset To Default",
    btnCancelText: "Cancel",
    btnOKText: "Save"
};

// Assign localizations
localizations.panels[panelName] = $.extend(panelEncryption.localization, localizations.panels[panelName]);

// Interface methods
panelEncryption.init = function() {
    panelEncryption.saveParams = {};
    applyLocalizations(panelName, localizations.panels);
    crushFTP.methods.setPageTitle(panelEncryption.localization.Header, true);
    panelEncryption.bindData();
    panelEncryption.bindEvents();
    crushFTP.Replication.init(common.data.ServerPrefs(), "Preferences", _panel, panelName, "#saveContent", function(prefs, _panelname){
        panelEncryption.saveParams.ui_save_preferences = prefs;
        panelEncryption.saveParams.ui_save_preferences_item = _panelname;
        itemsChanged(true);
        _panel.find("#saveContent").click();
        crushFTP.Replication.popupVisible(false);
    });
}

panelEncryption.defaultPopupData = {
    algorithm: "RSA",
    sigalgorithm: "SHA256withRSA",
    validityDays: "365",
    keySize: "2048",
    domainName: "www.domain.com",
    city: "no_city",
    country: "US"
};

panelEncryption.rebindCiphers = function() {
    var serverInfo = $(document).data("server_info");
    if (serverInfo && serverInfo["ciphers"]) {
        var ciphers = serverInfo["ciphers"];
        if (ciphers && ciphers.length > 0) {
            var nameList = $("#disabled_ciphers", _panel).empty();
            var disabled_ciphersOl = $("#disabled_ciphersOl", _panel);
            var undisabled_ciphersOl = $("#undisabled_ciphersOl", _panel).empty();

            ciphers = ciphers.split(",").sort();
            for (var i = 0; i < ciphers.length; i++) {
                var curItem = ciphers[i];
                if (curItem) {

                    var newControl_02 = $("<li class='ui-widget-content' key='" + curItem + "'><div><input type=\"hidden\" id=\"dchdn_" + curItem + "\" style='dispaly:none;'/><label for=\"dc_" + curItem + "\">" + curItem + "</label></div><span class='drag ui-icon ui-icon-grip-dotted-vertical'></span></li>");

                        if (curItem.toString().toLowerCase().indexOf("aes")!=-1)
                            undisabled_ciphersOl.prepend(newControl_02);
                        else
                            undisabled_ciphersOl.append(newControl_02);
                   }
                }

            disabled_ciphersOl.sortable({
                update: function(evt, ui) {
                    itemsChanged(true);
                }
            });

            //sort Div
            var $divs = $("#disabled_ciphersOl li", _panel);
            var alphabeticallyOrderedDivs = $divs.sort(function(a, b) {
                return $(a).find("input").val() > $(b).find("input").val();
            });
            $("#disabled_ciphersOl").html(alphabeticallyOrderedDivs);

            // UnDisabled Sortable
            undisabled_ciphersOl.on('click', 'li', function(e) {
                if (e.ctrlKey || e.metaKey) {
                    $(this).toggleClass('ui-selected ui-widget-header');
                } else if (e.shiftKey) {

                    // Get the first possible element that is selected.
                    var currentSelectedIndex = undisabled_ciphersOl.find("li").index(panelEncryption.lastUnDisabled_clickLI);
                    // Get the shift+click element
                    var selectedElementIndex = undisabled_ciphersOl.find("li").index($(this));

                    undisabled_ciphersOl.find("li").removeClass("ui-selected ui-widget-header");
                    if (currentSelectedIndex < selectedElementIndex) {
                        for (var indexOfRows = currentSelectedIndex; indexOfRows <= selectedElementIndex; indexOfRows++) {
                            undisabled_ciphersOl.find("li").eq(indexOfRows).addClass('ui-selected ui-widget-header ');
                        }
                    } else {
                        for (var indexOfRows = selectedElementIndex; indexOfRows <= currentSelectedIndex; indexOfRows++) {
                            undisabled_ciphersOl.find("li").eq(indexOfRows).addClass('ui-selected ui-widget-header ');
                        }
                    }
                } else {
                    $(this).addClass('ui-selected').siblings().removeClass('ui-selected');
                    $(this).addClass('ui-widget-header').siblings().removeClass('ui-widget-header');
                }
                panelEncryption.lastUnDisabled_clickLI = $(this);

            }).sortable({
                connectWith: disabled_ciphersOl,
                connectToSortable: disabled_ciphersOl,
                delay: 150, //Needed to prevent accidental drag when trying to select
                revert: 0,
                helper: function(e, item) {
                    var helper = $('<li/>');
                    if (!item.hasClass('ui-selected')) {
                        item.addClass('ui-selected ui-widget-header').siblings().removeClass('ui-selected ui-widget-header');
                    }
                    var elements = item.parent().children('.ui-selected').clone();
                    item.data('multidrag', elements).siblings('.ui-selected').remove();
                    return helper.append(elements);
                },
                stop: function(e, info) {
                    info.item.after(info.item.data('multidrag')).remove();
                    if ($("#undisabled_ciphersOl li", _panel).length == 0)
                        $("#cipherDisabledWarning").show();
                },
                update: function(evt, ui) {
                    itemsChanged(true);
                }
            });

            // Disabled Sortable
            disabled_ciphersOl.on('click', 'li', function(e) {
                if (e.ctrlKey || e.metaKey) {
                    $(this).toggleClass('ui-selected ui-widget-header');
                } else if (e.shiftKey) {

                    // Get the first possible element that is selected.
                    var currentSelectedIndex = disabled_ciphersOl.find("li").index(panelEncryption.lastDisabled_clickLI);
                    // Get the shift+click element
                    var selectedElementIndex = disabled_ciphersOl.find("li").index($(this));

                    disabled_ciphersOl.find("li").removeClass("ui-selected ui-widget-header");
                    if (currentSelectedIndex < selectedElementIndex) {
                        for (var indexOfRows = currentSelectedIndex; indexOfRows <= selectedElementIndex; indexOfRows++) {
                            disabled_ciphersOl.find("li").eq(indexOfRows).addClass('ui-selected ui-widget-header');
                        }
                    } else {
                        for (var indexOfRows = selectedElementIndex; indexOfRows <= currentSelectedIndex; indexOfRows++) {
                            disabled_ciphersOl.find("li").eq(indexOfRows).addClass('ui-selected ui-widget-header');
                        }
                    }
                } else {
                    $(this).addClass('ui-selected ui-widget-header').siblings().removeClass('ui-selected ui-widget-header');
                }
                panelEncryption.lastDisabled_clickLI = $(this);

            }).sortable({
                connectWith: undisabled_ciphersOl,
                connectToSortable: undisabled_ciphersOl,
                delay: 150, //Needed to prevent accidental drag when trying to select
                revert: 0,
                helper: function(e, item) {
                    var helper = $('<li/>');
                    if (!item.hasClass('ui-selected')) {
                        item.addClass('ui-selected ui-widget-header').siblings().removeClass('ui-selected ui-widget-header');
                    }
                    var elements = item.parent().children('.ui-selected').clone();
                    item.data('multidrag', elements).siblings('.ui-selected').remove();
                    return helper.append(elements);
                },
                stop: function(e, info) {
                    info.item.after(info.item.data('multidrag')).remove();
                    if ($("#undisabled_ciphersOl li", _panel).length != 0)
                        $("#cipherDisabledWarning").hide();
                }
            });

        }
    }
};


panelEncryption.bindData = function() {
    var prefs = common.data.ServerPrefs();
    bindValuesFromXML(_panel, prefs);
    if ($("#fileEncryptionKey").val() != "") {
        $(".oldEncryption", _panel).show();
    } else {
        $(".oldEncryption", _panel).hide();
    }
    crushFTP.UI.checkUnchekInput($("#password_encryption_" + crushFTP.data.getTextValueFromXMLNode(prefs.password_encryption, ""), _panel), true);

    panelEncryption.rebindCiphers();

    var disabled_ciphers = crushFTP.data.getTextValueFromXMLNode(prefs.disabled_ciphers, "");
    disabled_ciphers = disabled_ciphers.split(")");

    var undisabled_ciphersOl = $("#undisabled_ciphersOl", _panel);
    var disabled_ciphersOl = $("#disabled_ciphersOl", _panel).empty();

    var disabled_ciphers_list = $("#disabled_ciphers", _panel);
    //for (var item in disabled_ciphers) {
    for(var item=0;item<disabled_ciphers.length;item++){
        var curItem = $.trim(disabled_ciphers[item]);
        if (curItem.split(";")[1] == undefined){
    		// Disabled Data
            curItem = $.trim(curItem);
	        if (curItem.length > 0 && curItem.substr) {
	          curItem = curItem.substr(1, curItem.length);
	          if (curItem && curItem.length > 0) {
	            var hdnLiId = undisabled_ciphersOl.find("input#dchdn_" + curItem);
	            var newControl_01 = hdnLiId.closest("li");
	            hdnLiId.closest("li").remove();
	            disabled_ciphersOl.append(newControl_01);
	          }
	        }
         }
        else{   // Enabled Data
    		if (curItem.length > 0 && curItem.substr) {
	        curItem = curItem.substr(1, curItem.length);

	        if (curItem && curItem.length > 0) {
	            var hdnLiId = undisabled_ciphersOl.find("input#dchdn_" + curItem.split(";")[1]);

		            if(hdnLiId!=undefined && hdnLiId !='')
		            {
		            var newControl_01 = hdnLiId.closest("li").addClass('EnabledDataLoadcls');
		            hdnLiId.closest("li").remove();

					if($("#undisabled_ciphersOl .EnabledDataLoadcls", _panel).length==0){

						if($("#undisabled_ciphersOl li",_panel).length==0)
		            		$("#undisabled_ciphersOl", _panel).append(newControl_01);
		            	else
		            		$("#undisabled_ciphersOl li:first", _panel).before(newControl_01);
		            }
		        	else
		        		$("#undisabled_ciphersOl .EnabledDataLoadcls:last", _panel).after(newControl_01);
			        }

	            }
	        }
        }
    }
}

panelEncryption.bindEvents = function() {
    $("a#selectAllCiphers", _panel).click(function() {
        $("#filter_undisabled_ciphers").val("");
        $("#filter_disabled_ciphers").val("");
        $("#undisabled_ciphersOl", _panel).find("li").show();
        $("#disabled_ciphersOl", _panel).find("li").show();
        $("#disabled_ciphersOl", _panel).append($("#undisabled_ciphersOl", _panel).find("li"));

        itemsChanged(true);
        $("#cipherDisabledWarning").show();
        return false;
    });

    $(".ssl-guide", _panel).sslGuideButton();

    $("a#deselectAllCiphers", _panel).click(function() {
        $("#filter_disabled_ciphers").val("");
        $("#filter_undisabled_ciphers").val("");
        $("#disabled_ciphersOl", _panel).find("li").show();
        $("#undisabled_ciphersOl", _panel).find("li").show();
        $("#undisabled_ciphersOl", _panel).append($("#disabled_ciphersOl", _panel).find("li"));
        itemsChanged(true);
        $("#cipherDisabledWarning").hide();
        return false;
    });

    $("a#selectAll_disabled_ciphersOl", _panel).click(function() {
        $("#disabled_ciphersOl", _panel).find("li:visible").addClass('ui-selected ui-widget-header');
        return false;
    });

    $("a#selectAll_undisabled_ciphersOl", _panel).click(function() {
        $("#undisabled_ciphersOl", _panel).find("li:visible").addClass('ui-selected ui-widget-header');
        return false;
    });

    $("a#deselectAll_disabled_ciphersOl", _panel).click(function() {
        $("#disabled_ciphersOl", _panel).find("li:visible").removeClass('ui-selected ui-widget-header');
        return false;
    });

    $("a#deselectAll_undisabled_ciphersOl", _panel).click(function() {
        $("#undisabled_ciphersOl", _panel).find("li:visible").removeClass('ui-selected ui-widget-header');
        return false;
    });

    $("a#Moveto_disabled_ciphersOl", _panel).click(function() {

        $("#disabled_ciphersOl", _panel).append($("#undisabled_ciphersOl .ui-selected", _panel).filter(':visible'));

        if ($("#undisabled_ciphersOl li", _panel).length == 0)
            $("#cipherDisabledWarning").show();

		itemsChanged(true);
        return false;
    });

    $("a#Moveto_undisabled_ciphersOl", _panel).click(function() {
        $("#undisabled_ciphersOl", _panel).append($("#disabled_ciphersOl .ui-selected", _panel).filter(':visible'));

        if ($("#undisabled_ciphersOl li", _panel).length != 0)
            $("#cipherDisabledWarning").hide();

			itemsChanged(true);
        return false;
    });

    $('.lblTestTrigger').dblclick(function(event) {
        $("a#testCertificate", _panel).trigger('click', [true]);
        return false;
    });

    var filter_disabled_ciphers = $("#filter_disabled_ciphers", _panel).unbind("keyup").keyup(function(evt) {

        var evt = (evt) ? evt : ((event) ? event : null);
        var phrase = this.value;
        delay(function() {
            filter_Customizations(phrase);
        }, 500);
    });


    var filter_undisabled_ciphers = $("#filter_undisabled_ciphers", _panel).unbind("keyup").keyup(function(evt) {
        var evt = (evt) ? evt : ((event) ? event : null);
        var phrase = this.value;
        delay(function() {
            filter_Customizations(phrase, true);
            window.last_searched_usd_c = phrase;
        }, 500);
    });

    $("#clearFilter_disabled_ciphers", _panel).click(function() {
        filter_disabled_ciphers.val("").trigger("keyup");
        return false;
    });

    $("#clearFilter_undisabled_ciphers", _panel).click(function() {
        filter_undisabled_ciphers.val("").trigger("keyup");
        return false;
    });

    function filter_Customizations(phrase, isUsed) {
        var listToFilter;
        if (isUsed)
            listToFilter = $("#undisabled_ciphersOl", _panel);
        else
            listToFilter = $("#disabled_ciphersOl", _panel);

        listToFilter.find("li").hide();

        listToFilter.find("li:Contains('" + phrase + "')").show();
    }

    var delay = (function() {
        var timer = 0;
        return function(callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();


    $("a#deselectUnsecureCiphers", _panel).click(function() {
        var undisabled_ciphersOl = $("#undisabled_ciphersOl", _panel);
        var disabled_ciphersOl = $("#disabled_ciphersOl", _panel);

        var insecureItems = ['Null', 'empty', 'anon', 'export', '_DHE_', 'rc4', 'rsa_with_des_cbc_sha', 'sl_rsa_with_3des_ede_cbc_sha', 'ls_ecdhe_rsa_with_3des_ede_cbc_sha', 'ls_rsa_with_aes_128_cbc_sha','ls_rsa_with_aes_128_cbc_sha256','ls_rsa_with_aes_128_gcm_sha256','ls_rsa_with_aes_256_cbc_sha','ls_rsa_with_aes_256_cbc_sha256','ls_rsa_with_aes_256_gcm_sha384'];
        $("#undisabled_ciphersOl", _panel).find("li").each(function(index, el) {
            var that = $(this);
            for (var i = 0; i < insecureItems.length; i++) {
                var curItem = insecureItems[i].toLowerCase();
                if (that.attr("key").toLowerCase().indexOf(curItem) > 0) {
                    var newControl_01 = that;
                    that.remove();
                    disabled_ciphersOl.append(newControl_01);
                }
            }
        });

        $("#disabled_ciphersOl", _panel).find("li").each(function(index, el) {
            var that = $(this);
            var notinArry=true;
            for (var i = 0; i < insecureItems.length; i++) {
                var curItem = insecureItems[i].toLowerCase();
                if (that.attr("key").toLowerCase().indexOf(curItem) > 0) {
                    //that.addClass("ui-selected ui-widget-header selected");
                    notinArry=false;
                }
            }
        	if(notinArry)
            {
            	var newControl_01 = that;
                that.remove();
                undisabled_ciphersOl.append(newControl_01);
            }
        });

        if ($("#undisabled_ciphersOl li", _panel).length == 0)
            $("#cipherDisabledWarning").show();
        else
        	$("#cipherDisabledWarning").hide();

        itemsChanged(true);
        return false;
    });

    $("a#resetCiphersToDefatul", _panel).click(function() {
        jConfirm("Are you sure you want to restore default settings for <strong>Disabled Ciphers</strong>?", "Confirm", function(value) {
            if (value) {
                panelEncryption.rebindCiphers();
                var prefs = $(document).data("GUIXMLPrefs_default");

                var disabled_ciphers = crushFTP.data.getTextValueFromXMLNode(prefs.disabled_ciphers, "");
                disabled_ciphers = disabled_ciphers.split(")");

                var undisabled_ciphersOl = $("#undisabled_ciphersOl", _panel);
                var disabled_ciphersOl = $("#disabled_ciphersOl", _panel).empty();

                var disabled_ciphers_list = $("#disabled_ciphers", _panel);
                for (var item in disabled_ciphers) {
                    var curItem = disabled_ciphers[item];
                    if (curItem.length > 0 && curItem.substr) {
                        curItem = curItem.substr(1, curItem.length);
                        if (curItem && curItem.length > 0) {
                            var hdnLiId = '';
                            if (curItem.split(";")[1] == undefined)
                                hdnLiId = undisabled_ciphersOl.find("input#dchdn_" + curItem);
                            else
                                hdnLiId = undisabled_ciphersOl.find("input#dchdn_" + curItem.split(";")[1]);

                            var newControl_01 = hdnLiId.closest("li");
                            hdnLiId.closest("li").remove();
                            disabled_ciphersOl.append(newControl_01);
                        }
                    }
                }

                disabled_ciphers_list.form();
                crushFTP.UI.growl("Restored to default values", "Disabled Ciphers reset to defatul. <br><strong>Your still need to save your changes.</strong>", false, 10000);
                itemsChanged(true);
            }
        }, {
            okButtonText: "Yes",
            cancelButtonText: "No"
        });
        return false;
    });

    $("a.serverFilePickButton", _panel).each(function() {
        $(this).unbind("click").click(function() {
            var curElem = $(this);
            curElem.crushFtpLocalFileBrowserPopup({
                type: curElem.attr("PickType") || 'file',
                existingVal: $("#" + curElem.attr("rel")).val(),
                callback: function(selectedPath) {
                    $("#" + curElem.attr("rel")).val(selectedPath).trigger("change");
                }
            });
            return false;
        });
    });

    $("#generateCertiPopup", _panel).form().dialog({
        autoOpen: false,
        height: 590,
        width: 600,
        title: "Generate Self Signed Certificate",
        modal: true,
        resizable: false,
        closeOnEscape: false,
        buttons: {
            "Cancel": function() {
                $(this).dialog("close");
            },
            "OK": function() {
                var pass1 = $("#generateCertiPopup").find("#password1").val();
                var pass2 = $("#generateCertiPopup").find("#password2").val();
                if (pass1 != pass2) {
                    jAlert("Password does not match the confirm password", "Error", function() {
                        $("#generateCertiPopup").find("#password2").focus().select();
                    });
                    return false;
                }
                var params = {
                    command: "generateSSL"
                };
                $("#generateCertiPopup").find("input").each(function() {
                    params[$(this).attr("id")] = escape($(this).val());
                });
                $("#generateCertiPopup").parent().block({
                    message: '<span><span style="float: left; margin-right: 0.3em;" class="ui-icon ui-icon-refresh"></span>Wait..</span>',
                    css: {
                        border: 'none',
                        padding: '5px',
                        backgroundColor: '#000',
                        '-webkit-border-radius': '10px',
                        '-moz-border-radius': '10px',
                        opacity: .5,
                        color: '#fff',
                        'text-align': 'center'
                    }
                });
                crushFTP.data.serverRequest(params, function(msg) {
                    $("#generateCertiPopup").parent().unblock();
                    crushFTP.UI.growl("Generating Certificate", decodeURIComponent($(msg).text()), false, false);
                    $(this).dialog("close");
                });
            }
        },
        open: function() {
            $("#generateCertiPopup").find("input").each(function() {
                var curVal = panelEncryption.defaultPopupData[$(this).attr("id")] || "";
                $(this).val(curVal);
            });
        }
    });

    $("a#portaclePanelSwitch", _panel).click(function() {
        $("#portacleAdvancedPanel").toggle();
        return false;
    });

    $("a#generateSelfSignedCerti", _panel).click(function() {
        $("#generateKeystoreDialog").dialog("open");
        $("#generateKeystoreDialog").find("input, select").each(function() {
            var curVal = panelEncryption.defaultPopupData[$(this).attr("id").replace("keystoreDialog_", "")] || "";
            $(this).val(curVal);
            if ($(this).is("#keystoreDialog_domainName")) {
                var that = $(this);
                setTimeout(function() {
                    that.trigger('textchange');
                }, 100);
            }
            $(".validationErrorMessage", "#generateKeystoreDialog").remove();
        });
        window.afterKeySSLGeneration = function(data) {
            $("#cert_path", _panel).val(data.keystore_path);
            $("#globalKeystorePass", _panel).val(data.key_pass);
            $("#globalKeystoreCertPass", _panel).val(data.key_pass);

            $("#generateCSRDialog_path").val(data.keystore_path);
            $("#generateCSRDialog_pass").val(data.key_pass);
            itemsChanged(true);
        }
        return false;
    });

    $("a#generateSelfSignedCertiUtil", _panel).click(function() {
        $("#generateKeystoreDialog").dialog("open");
        $("#generateKeystoreDialog").find("input, select").each(function() {
            var curVal = panelEncryption.defaultPopupData[$(this).attr("id").replace("keystoreDialog_", "")] || "";
            $(this).val(curVal);
            if ($(this).is("#keystoreDialog_domainName")) {
                var that = $(this);
                setTimeout(function() {
                    that.trigger('textchange');
                }, 100);
            }
            $(".validationErrorMessage", "#generateKeystoreDialog").remove();
        });
        window.afterKeySSLGeneration = function(data) {
            $("#ksUtil_keystore_path", _panel).val(data.keystore_path);
            $("#ksUtil_keystore_pass", _panel).val(data.key_pass);
        }
        return false;
    });

    $("#btnGenerateCSR", _panel).click(function(event) {
        if ($.trim($("#cert_path", _panel).val()) == "builtin") {
            jAlert("Please select correct Keystore to continue", "Error", function() {
                $("#cert_path", _panel).focus().select().effect("highlight", {
                    color: "red"
                }, 1500);
            });
            return false;
        }
        $("#generateCSRDialog").dialog("open");
        $("#generateCSRDialog_path").val($("#cert_path", _panel).val());
        $("#generateCSRDialog_pass").val($("#globalKeystorePass", _panel).val());
        return false;
    });

    $("#btnImportSSL", _panel).click(function(event) {
        $("#importSSLDialog").dialog("open");
        return false;
    });

    $("a#testCertificate", _panel).click(function(evt, param) {
        if ($(this).attr("disabled")) return false;
        var obj = {
            command: "testKeystore",
            keystorePath: crushFTP.methods.htmlEncode($("#cert_path", _panel).val()),
            keystorePass: crushFTP.methods.htmlEncode($("#globalKeystorePass", _panel).val()),
            keyPass: crushFTP.methods.htmlEncode($("#globalKeystoreCertPass", _panel).val())
        };
        if(param)
        {
            obj.dump_pass = "true";
        }
        $("a#testCertificate", _panel).block({
            message: 'Wait..',
            css: {
                border: 'none',
                padding: '0px 10px',
                backgroundColor: '#000',
                '-webkit-border-radius': '10px',
                '-moz-border-radius': '10px',
                opacity: .5,
                color: '#fff',
                'text-align': 'left'
            }
        }).attr("disabled", "disabled");

        crushFTP.data.serverRequest(obj, function(msg) {
            $("a#testCertificate", _panel).unblock().removeAttr("disabled");
            crushFTP.UI.growl("Testing Certificate", decodeURIComponent($(msg).text()), false, false);
        });
        return false;
    });

    /*$("a#buildFileKey", _panel).click(function(){
		if($(this).attr("disabled"))return false;
		var obj = {
			command : "generateFileKey",
			keyPath : $("#fileEncryptionKey", _panel).val()
		};
		$("a#buildFileKey", _panel).block({
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
			$("a#buildFileKey", _panel).unblock().removeAttr("disabled");
			crushFTP.UI.growl("Generating file key", decodeURIComponent($(msg).text()), false, false);
		});
		return false;
	});*/

    $("#pgpEncryptionGenerateButton", _panel).unbind().click(function() {
        if ($("#pgpPivateKeyPathGenerate", _panel).val().indexOf(".key") < 0) {
            $("#pgpPivateKeyPathGenerate", _panel).val($("#pgpPivateKeyPathGenerate", _panel).val() + "private.key");
        }
        function fixChars(val)
        {
            return val.replace(/@/g,"{at}").replace(/:/g,"{colon}").replace(/&/g,"{amp}").replace(/\?/g,"{question}").replace(/\//g,"{slash}").replace(/\\/g,"{backslash}").replace(/#/g,"{hash}").replace(/>/g,"%3E").replace(/</g,"%3C");
        }
        var obj = {
            command: "pgpGenerateKeyPair",
            pgpCommonNameGenerate: crushFTP.methods.htmlEncode($("#pgpCommonNameGenerate", _panel).val()),
            pgpKeySizeGenerate: $("#pgpKeySizeGenerate", _panel).val(),
            pgpKeyDaysGenerate: $("#pgpKeyDaysGenerate", _panel).val(),
            pgpPrivateKeyPasswordGenerate: fixChars($("#pgpPrivateKeyPasswordGenerate", _panel).val()).split(' ').join('%20'),
            pgpPivateKeyPathGenerate: crushFTP.methods.htmlEncode($("#pgpPivateKeyPathGenerate", _panel).val()),
            random: Math.random()
        };
        obj.c2f = crushFTP.getCrushAuth();
        $.ajax({
            type: "POST",
            url: window.ajaxCallURL,
            data: obj,
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                errorThrown = errorThrown || "pgpGenerateKeyPair failed";
                crushFTP.UI.growl("Error : ", errorThrown, true, true);
            },
            success: function(msg) {
                var responseText = msg;
                try {
                    var response = msg.getElementsByTagName("response");
                    response = crushFTP.data.getTextContent(response[0]).textContent;
                    alert(response);
                    if (response.toLowerCase() == "success")
                        $("#generateKeyPanel", _panel).find("input").val("");
                } catch (ex) {}
            }
        });
        return false;
    });

    $("#removeOldEncryptionMethod", _panel).unbind().click(function() {
        $("#fileEncryptionKey", _panel).val("").trigger("change");
        if ($("#fileEncryptionKey", _panel).val() != "") {
            $(".oldEncryption", _panel).show();
        } else {
            $(".oldEncryption", _panel).hide();
        }
        return false;
    });

    $("#disabled_ciphers", _panel).find("input").bind("change", function() {
        if ($(this).is(":checked"))
            $(this).closest("div").addClass('disabledCipher');
        else
            $(this).closest("div").removeClass('disabledCipher');

        if ($("#disabled_ciphers", _panel).find("input").length > 0 && $("#disabled_ciphers", _panel).find("input:checked").length === 0) {
            $("#cipherDisabledWarning").hide();
        } else if ($("#disabled_ciphers", _panel).find("input").length > 0 && $("#disabled_ciphers", _panel).find("input:checked").length === $("#disabled_ciphers", _panel).find("input").length)
            $("#cipherDisabledWarning").show();
        else
            $("#cipherDisabledWarning").hide();
    });

    $("#listSSLContent", _panel).click(function(event) {
        if (_panel.find(".hasPendingCall").length > 0) {
            window.pendingEncryptionCall = function() {
                $("#listSSLContent", _panel).trigger("click");
            };
            return false;
        }
        var keyPath = $("#ksUtil_keystore_path").val();
        var keyPass = $("#ksUtil_keystore_pass").val();
        if (keyPath) {
            var obj = {
                command: "listSSL",
                keystore_path: crushFTP.methods.htmlEncode(keyPath),
                keystore_pass: crushFTP.methods.htmlEncode(keyPass),
                random: Math.random()
            };
            obj.c2f = crushFTP.getCrushAuth();
            crushFTP.UI.showIndicator(false, false, "Please wait..");
            crushFTP.data.serverRequest(obj, function(msg) {
                crushFTP.UI.hideIndicator();
                var responseText = msg;
                var sslDetailsPanel = $('#sslDetailsPanel', _panel).show();
                var aliases = sslDetailsPanel.find("#aliases").empty();
                var count = 0;
                var txt = $(responseText).find("response").text();
                if (txt && txt.indexOf("Error") == 0) {
                    crushFTP.UI.growl("Error", unescape(txt), true);
                    sslDetailsPanel.hide();
                    return false;
                }
                $(responseText).find("SSL_subitem").each(function() {
                    var aliasName = $(this).find("alias").text();
                    var isPrivate = $(this).find("private").text() == "true" ? " :: <strong> Private </strong>" : "";
                    var expires = $(this).find("expires").text();
                    try {
                        expires = new Date(parseInt(expires));
                        expires = expires.format("mm/dd/yyyy hh:nn:ss a/p");
                    } catch (ex) {}
                    var newControl = $("<li class='ui-widget-content'><span class='name'>" + aliasName + "</span> " + isPrivate + " || Expires : " + expires + "</li>");
                    aliases.append(newControl);
                    newControl.data("controlData", $(this));
                });

                var keyDetails = $("#keyDetails").hide();

                function showDetails() {
                    var selected = aliases.find(".ui-selected:first");
                    aliases.find(".ui-selected").removeClass('ui-state-focus ui-selected ui-state-active ui-state-highlight');
                    selected.addClass('ui-state-focus ui-selected ui-state-active');
                    if (selected && selected.length > 0) {
                        var data = selected.data("controlData");
                        keyDetails.show().empty().append("<ul class='certi-details'></ul>");
                        data.find("*").each(function() {
                            if ($(this)[0].tagName.toLowerCase() == "expires") {
                                var expires = $(this).text();
                                try {
                                    expires = new Date(parseInt(expires));
                                    expires = expires.format("mm/dd/yyyy hh:nn:ss a/p");
                                } catch (ex) {}
                                keyDetails.find("ul").append('<li><span class="label">' + $(this)[0].tagName + '</span><span class="value">' + expires + '</span></li>');
                            } else
                                keyDetails.find("ul").append('<li><span class="label">' + $(this)[0].tagName + '</span><span class="value">' + $(this).text() + '</span></li>');
                        });
                    } else {
                        keyDetails.hide();
                    }
                }

                aliases.selectableAdvanced({
                    select: function(event, ui) {
                        var selected = $(ui.selection);
                        selected.parent().find(".ui-state-highlight").removeClass("ui-state-highlight");
                        showDetails();
                        return false;
                    },
                    change: function(event, ui) {
                        var selected = $(ui.selection).filter(":last");
                        selected.parent().find(".ui-state-highlight").removeClass("ui-state-highlight");
                        showDetails();
                        return false;
                    },
                    remove: function(event, ui) {
                        $("a#removeAlias", _panel).click();
                        return false;
                    }
                });
            });
        } else {
            crushFTP.UI.growl("Error", "Please select keystore first.", true, 2000);
        }
        return false;
    });

    $("#editAlias", _panel).click(function(event) {
        var selected = $("#aliases").find(".ui-selected:first");
        if (selected && selected.length > 0) {
            var alias = selected.find(".name").text();
            jPrompt("Enter alias name :", selected.find(".name").text(), "Alias", function(value) {
                if (value)
                    value = $.trim(value);
                if (value && value != alias) {
                    var keyPath = $("#ksUtil_keystore_path").val();
                    var keyPass = $("#ksUtil_keystore_pass").val();
                    var obj = {
                        command: "renameSSL",
                        keystore_path: crushFTP.methods.htmlEncode(keyPath),
                        keystore_pass: crushFTP.methods.htmlEncode(keyPass),
                        alias1: crushFTP.methods.htmlEncode(alias),
                        alias2: crushFTP.methods.htmlEncode(value),
                        random: Math.random()
                    };
                    crushFTP.UI.showIndicator(false, false, "Please wait..");
                    crushFTP.data.serverRequest(obj, function(msg) {
                        crushFTP.UI.hideIndicator();
                        $("#listSSLContent", _panel).trigger("click");
                    });
                }
            });
        }
        return false;
    });

    $("#removeAlias", _panel).click(function(event) {
        var selected = $("#aliases").find(".ui-selected:first");
        if (selected && selected.length > 0) {
            var alias = selected.find(".name").text();
            jConfirm("Are you sure you want to delete " + alias + " from the keystore?", "Confirm", function(value) {
                if (value) {
                    var keyPath = $("#ksUtil_keystore_path").val();
                    var keyPass = $("#ksUtil_keystore_pass").val();
                    var obj = {
                        command: "deleteSSL",
                        keystore_path: crushFTP.methods.htmlEncode(keyPath),
                        keystore_pass: crushFTP.methods.htmlEncode(keyPass),
                        alias: crushFTP.methods.htmlEncode(alias),
                        random: Math.random()
                    };
                    crushFTP.UI.showIndicator(false, false, "Please wait..");
                    crushFTP.data.serverRequest(obj, function(msg) {
                        crushFTP.UI.hideIndicator();
                        $("#listSSLContent", _panel).trigger("click");
                    });
                }
            });
        }
        return false;
    });

    var addSSLDialog = $("#addSSLDialog", _panel);
    addSSLDialog.form().dialog({
        autoOpen: false,
        width: 700,
        title: "Add SSL",
        modal: true,
        resizable: false,
        closeOnEscape: false,
        buttons: {
            "Cancel": function() {
                $(this).dialog("close");
            },
            "OK": function() {
                if (addSSLDialog.find(".hasPendingCall").length > 0) {
                    window.pendingEncryptionCall = function() {
                        if (window.afterAddSSLDialog)
                            window.afterAddSSLDialog();
                    };
                } else {
                    if (window.afterAddSSLDialog)
                        window.afterAddSSLDialog();
                }
            }
        },
        open: function() {
            addSSLDialog.find("input").text("");
            $("a.serverFilePickButton", addSSLDialog).each(function() {
                $(this).unbind("click").click(function() {
                    var curElem = $(this);
                    curElem.crushFtpLocalFileBrowserPopup({
                        type: curElem.attr("PickType") || 'file',
                        existingVal: $("#" + curElem.attr("rel"), addSSLDialog).val(),
                        callback: function(selectedPath) {
                            $("#" + curElem.attr("rel"), addSSLDialog).val(selectedPath).trigger("change");
                        }
                    });
                    return false;
                });
            });
        }
    });

    var exportCertiDialog = $("#exportCertiDialog", _panel);
    exportCertiDialog.form().dialog({
        autoOpen: false,
        width: 700,
        title: "Export :",
        modal: true,
        resizable: false,
        closeOnEscape: false,
        buttons: {
            "Cancel": function() {
                $(this).dialog("close");
            },
            "OK": function() {
                var alias = exportCertiDialog.find("#exportCertiDialog_alias").val();
                var keyPath = $("#ksUtil_keystore_path").val();
                var keyPass = $("#ksUtil_keystore_pass").val();
                var obj = {
                    keystore_path: crushFTP.methods.htmlEncode(keyPath),
                    keystore_pass: crushFTP.methods.htmlEncode(keyPass),
                    alias: crushFTP.methods.htmlEncode(alias),
                    command: "exportSSL",
                    random: Math.random()
                };
                obj.c2f = crushFTP.getCrushAuth();
                crushFTP.UI.showIndicator(false, false, "Please wait..");
                crushFTP.data.serverRequest(obj, function(msg) {
                    crushFTP.UI.hideIndicator();
                    var responseText = unescape($(msg).find("response").text());
                    jAlert("", "Success", function(){
                        exportCertiDialog.dialog("close");
                    }, {
                        appendAfterInput : "<textarea style='width:590px;height:210px;padding:2px;margin:2px;'>"+responseText+"</textarea>"
                    });
                });

            }
        }
    });

    $("#exportSSL").click(function(event) {
        var keyPath = $("#ksUtil_keystore_path").val();
        var keyPass = $("#ksUtil_keystore_pass").val();
        if (keyPath) {
            exportCertiDialog.dialog("open");
        }
        return false;
    });

    $("#ksUtil_keystore_path", _panel).bind("textchange", function() {
        $("#sslDetailsPanel", _panel).hide();
    });

    $("#addPrivateSSL,#addPublicSSL").click(function(event) {
        var keyPath = $("#ksUtil_keystore_path").val();
        var keyPass = $("#ksUtil_keystore_pass").val();
        if (keyPath) {
            addSSLDialog.dialog("open");
            var isPublic = false;
            if ($(this).is("#addPublicSSL")) {
                addSSLDialog.find(".passitem").hide();
                isPublic = true;
            } else
                addSSLDialog.find(".passitem").show();
            window.afterAddSSLDialog = function() {
                var path = addSSLDialog.find("#addSSLDialog_path").val();
                var pass = addSSLDialog.find("#addSSLDialog_pass").val();
                var alias = addSSLDialog.find("#addSSLDialog_alias").val();
                if (!alias) {
                    crushFTP.UI.growl("Error", "Please enter alias.", true, 2000);
                    return;
                }
                if (!path) {
                    crushFTP.UI.growl("Error", "Please select key to add.", true, 2000);
                    return;
                }
                var keyPath = $("#ksUtil_keystore_path").val();
                var keyPass = $("#ksUtil_keystore_pass").val();
                var obj = {
                    keystore_path: crushFTP.methods.htmlEncode(keyPath),
                    keystore_pass: crushFTP.methods.htmlEncode(keyPass),
                    alias: crushFTP.methods.htmlEncode(alias),
                    key_path: crushFTP.methods.htmlEncode(path),
                    random: Math.random()
                };
                if (!isPublic) {
                    obj.key_pass = crushFTP.methods.htmlEncode(pass);
                    obj.command = "addPrivateSSL";
                } else {
                    obj.command = "addPublicSSL";
                }
                obj.c2f = crushFTP.getCrushAuth();
                crushFTP.UI.showIndicator(false, false, "Please wait..");
                crushFTP.data.serverRequest(obj, function(msg) {
                    crushFTP.UI.hideIndicator();
                    var responseText = msg;
                    crushFTP.UI.growl("Response", unescape($(msg).text()));
                    addSSLDialog.dialog("close");
                    $("#listSSLContent", _panel).trigger("click");
                });
            };
        } else {
            crushFTP.UI.growl("Error", "Please select keystore first.", true, 2000);
        }
        return false;
    });

    $("a.testPGPButton", _panel).each(function () {
        $(this).testPGPButton();
    });
}

panelEncryption.saveContent = function() {
    if (placeHolder.data("hasChanged")) {
        crushFTP.UI.showIndicator(false, false, "Please wait..");
        var xmlData = '<server_prefs type="properties">' + panelEncryption.buildXMLData(_panel) + '</server_prefs>';
        crushFTP.data.setXMLPrefs("server_settings/server_prefs/", "properties", "update", xmlData, function(data) {
            data = $.xml2json(data, true);
            if (data.response_status && crushFTP.data.getTextValueFromXMLNode(data.response_status) && crushFTP.data.getTextValueFromXMLNode(data.response_status) == "OK") {
                common.data.updateLocalPrefs(function() {
                    crushFTP.UI.hideIndicator();
                    crushFTP.UI.growl("Data saved", "Your changes are saved", false, 5000);
                    placeHolder.removeData("hasChanged");
                });
            } else {
                crushFTP.UI.growl("Error while saving", "Your changes are not saved", true);
            }
        }, panelEncryption.saveParams);
    } else {
        crushFTP.UI.growl("No changes made", "", false, 3000);
    }
}

panelEncryption.buildXMLData = function() {
    var xmlString = buildXMLToSubmitForm(_panel);
    var password_encryption = "";
    $("input.encryptionType:checked", _panel.find("#EncryptionPassword")).each(function() {
        password_encryption += $(this).attr("id").replace("password_encryption_", "").toUpperCase();
    });
    xmlString += "\r\n<password_encryption>" + password_encryption + "</password_encryption>";

    var disabled_ciphers = "";
    var i = 1;
    $("#undisabled_ciphersOl", _panel).find("li").each(function() {
        disabled_ciphers += "(" + i + ';' + $(this).attr("key") + ")";
        i++;
    });

    $("#disabled_ciphersOl", _panel).find("li").each(function() {
        disabled_ciphers += "(" + $(this).attr("key") + ")";
    });
    //

    xmlString += "\r\n<disabled_ciphers>" + disabled_ciphers + "</disabled_ciphers>";
    return xmlString;
}