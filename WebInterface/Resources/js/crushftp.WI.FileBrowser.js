/*!
 * CrushFTP WebInterface File Browsing
 *
 * http://crushFTP.com/
 *
 * Copyright 2013, CrushFTP
 *
 * Date: Mon, Oct 28 2013
 *
 * Author: Vipul Limbachiya
 *
 * http://vipullimbachiya.com
 */

(function($) {
    $.crushFtpLocalFileBrowserPopup = function(el, options) {
        var base = this;
        base.$el = $(el);
        base.el = el;
        base.ajaxCallURL = "/WebInterface/function/";
        base.$el.data("crushFtpLocalFileBrowserPopup", base);
        base.getFileExtension = function(filename) {
            var ext = /^.+\.([^.]+)$/.exec(filename);
            return ext == null ? "" : ext[1].toLowerCase();
        }

        function fixChars(val)
        {
            return val.replace(/@/g,"{at}").replace(/:/g,"{colon}").replace(/&/g,"{amp}").replace(/\?/g,"{question}").replace(/\//g,"{slash}").replace(/\\/g,"{backslash}").replace(/#/g,"{hash}").replace(/"/g,"{quote}").replace(/'/g,"{apos}");
        }

        function revertFixChars(val)
        {
            return crushFTP.methods.decodeXML(val);
            // return val.replace(/\{at\}/g,"@").replace(/\{colon\}/g,":").replace(/\{amp\}/g,"&").replace(/\{question\}/g,"?").replace(/\{slash\}/g, "/").replace(/\{backslash\}/g, "\\").replace(/\{hash\}/g,"#").replace(/\{quote\}/g,"\"").replace(/\{apos\}/g,"'");
        }

        base.init = function() {
            if(window.crushFTP && crushFTP.ajaxCallURL){
                base.ajaxCallURL = crushFTP.ajaxCallURL;
            }
            base.options = $.extend({}, $.crushFtpLocalFileBrowserPopup.defaultOptions, options);
            base.htmlTemplate = "";
            var html = [];
            html.push('<div class="safari7Help"><div class="helpItem"><div class="ui-priority-primary">Java is blocked by your browser settings. Follow these steps to fix it :</div><div style="margin-top:10px;">Go to the Safari menu, Preferences, Security, Manage Website Settings…</div><div class="imgDiv"><img src="/WebInterface/Resources/images/java_safari_help1.jpg?1" style="border:0px;" alt="Safari Java Help 1" /></div><div style="margin-top:10px;">Select the site from the currently open websites, and change from allow to “Run in Unsafe mode”.  Click trust to trust the site…and then reload the web page.</div><div class="imgDiv"><img src="/WebInterface/Resources/images/java_safari_help2.png" style="border:0px;" alt="Safari Java Help 1" /></div></div></div><div class="loadingFS"></div><table class="localFileBrowser">');
            html.push('<tr>');
            html.push('<td colspan="2">');
            html.push('<select class="dropdown dirSelect browse-panel">');
            html.push('</select>');
            html.push('<a class="refreshImg" href="javascript:void(0);">');
            html.push('<img src="/WebInterface/Resources/images/arrow_refresh_small.png" style="border:0px;" alt="Refresh" />');
            html.push('</a>');
            html.push('<span class="systemFilesPanel"><label><input class="showSystemFiles" type="checkbox" />Show system files?</label></span>');
            html.push('<span class="filterPanelPopup" style="margin-top:4px;">Filter : <input class="filter" /><img src="/WebInterface/jQuery/images/cancel.png" style="border:0px;" alt="Clear" class="clearFilter" /></span>');
            html.push('</td>');
            html.push('</tr>');
            html.push('<tr>');
            html.push('<td class="firstColumn">');
            html.push('<div class="ui-corner-all ui-widget-content nobg contentDiv">');
            html.push('<div class="sideScroll quickAccessLinks">');
            html.push('<div class="quickLinksHolder">');
            html.push('<div class="ui-priority-primary ui-widget-content panelHeader">Quick Access</div>');
            html.push('<ul>');
            html.push('<li class="_home" rel="~/">Home</li>');
            html.push('<li class="_documents" rel="~/Documents">Documents</li>');
            html.push('<li class="_desktop" rel="~/Desktop">Desktop</li>');
            html.push('<li class="_downloads" rel="~/Downloads">Downloads</li>');
            html.push('<li class="_pictures" rel="~/Pictures">Pictures</li>');
            html.push('<li class="_videos" rel="~/Videos">Videos</li>');
            html.push('</ul>');
            html.push('</div>');
            html.push('<div class="deviceListHolder">');
            html.push('<div class="ui-priority-primary ui-widget-content panelHeader">Devices</div>');
            html.push('<ul class="devices">');
            html.push('</ul>');
            html.push('</div>');
            html.push('</div>');
            html.push('</div>');
            html.push('</td>');
            html.push('<td class="secondColumn">');
            html.push('<div class="ui-corner-all ui-widget-content nobg contentDiv">');
            html.push('<table class="listing">');
            html.push('<thead>');
            html.push('<tr class="ui-widget-content">');
            html.push('<td class="chekbox"><input type="checkBox" class="chkBoxAll" /></td>');
            html.push('<td class="name">Name</td>');
            html.push('<td class="size">Size</td>');
            html.push('<td class="date">Date Modified</td>');
            html.push('</tr>');
            html.push('</thead>');
            html.push('</table>');
            html.push('<div class="sideScroll scrollableList">');
            html.push('<table class="listing files">');
            html.push('<tbody>');
            html.push('</tbody>');
            html.push('</table>');
            html.push('</div>');
            html.push('</div>');
            html.push('</td>');
            html.push('</tr>');
            html.push('</table>');
            base.htmlTemplate = html.join("");
            base.thisElemId = "BrowsePanel_" + Math.random().toString(36).substring(7);
            base.initBrowses(base.options);
        };

        base.initBrowses = function(options) {
            var browsePanel = $("#" + base.thisElemId);
            var dialogHeight = 630;
            if (browsePanel.length == 0) {
                var htmlToAppend = "<div id=\"" + base.thisElemId + "\" style='overflow:hidden;'>";
                htmlToAppend += base.htmlTemplate;
                htmlToAppend += "</div>";
                $("body").append(htmlToAppend);
                browsePanel = $("#" + base.thisElemId).hide();
                if(base.options.note)
                {
                    browsePanel.prepend("<div class='notes ui-state-highlight ui-corner-all' style='margin:1px;padding:5px;'>"+ base.options.note +"</div>");
                    dialogHeight += 30;
                }
                else
                {
                    dialogHeight = 630;
                    browsePanel.find("div.notes").remove();
                }
            };
            browsePanel.dialog({
                autoOpen: false,
                title: "Select Files :",
                dialogClass: "localFileBrowserPopup",
                height: dialogHeight,
                width: 840,
                modal: true,
                zIndex : 10000,
                resizable: false,
                closeOnEscape: true,
                buttons: {
                    "Cancel": function() {
                        $(this).dialog("close");
                        if (options.callbackClose) {
                            options.callbackClose();
                        }
                    },
                    "OK": function() {
                        var opts = browsePanel.data("options") || base.options;
                        var clbkMethod = opts.callback;
                        if(base.options.singleSelection)
                        {
                            var dir = false;
                            var hasSelection = false;
                            var selected = browsePanel.find("table.listing.files").find(".selected:visible:first").each(function() {
                                hasSelection = true;
                                dir = $(this).data("curData").path;
                            });
                            if(!dir || dir.length == 0)
                            {
                                dir = base.curLoadedPath;
                            }
                            if(!dir)
                                return false;
                            if(dir.indexOf("~")==0)
                            {
                                if(typeof window.runAppletCommand != "undefined")
                                {
                                    dir = runAppletCommand(true, "COMMAND=RESOLVE:::PATH=" + dir);
                                }
                            }
                            else
                            {
                                if(base.options.inJavaFormat)
                                {
                                    dir = "path=" + dir + ":::name"+ dir + ";;;";
                                }
                            }
                            if(!base.options.allowRootSelection && dir == "/")
                            {
                                $.growlUI("Not allowed", "Can not select this path", 2000, "growlError", false);
                                return false;
                            }
                            if(opts.isFTPBrowse)
                            {
                                var path = dir;
                                var isUNC = path.indexOf("//") == 0;
                                var ftpServerInfo = browsePanel.data("ftpServerInfo");
                                if(ftpServerInfo.url)
                                    ftpServerInfo.url = crushFTP.methods.decodeXML(revertFixChars(ftpServerInfo.url));
                                if(!hasSelection && base.remoteLoadedPath && !isUNC)
                                {
                                    if(ftpServerInfo.url.toLowerCase().indexOf("file:/")>=0)
                                        path = base.curLoadedPath;
                                    else
                                        path = base.remoteLoadedPath;
                                }
                                if(path)
                                    path = unescape(path);
                                if(path.indexOf("/cfhd/")==0)
                                    path = path.replace("/cfhd/", "");
                                if(isUNC)
                                {
                                    if(path.indexOf("//") == 0 || path.indexOf("////") == 0){
                                        ftpServerInfo.url = "file:" + path;
                                    }
                                    else
                                        ftpServerInfo.url = "file:/" + path;
                                }
                                else
                                {
                                    if(ftpServerInfo && ftpServerInfo.url.toLowerCase().indexOf("file:/")<0 && ftpServerInfo.url.indexOf(path)<0)
                                    {
                                        if(path.indexOf("/")==0)
                                            path = path.replace("/", "");
                                        ftpServerInfo.url += path;
                                    }
                                    else if(ftpServerInfo.url.toLowerCase().indexOf("file:/")>=0)
                                    {
                                        if(path.indexOf("//") == 0 || path.indexOf("////") == 0){
                                            ftpServerInfo.url = "file:" + path;
                                        }
                                        else
                                            ftpServerInfo.url = "file:/" + path;
                                    }
                                }
                                clbkMethod("", ftpServerInfo);
                            }
                            else
                            {
                                var volume =  "/" + dir.split("/")[1] + "/";
                                if($(".devices").find("li[rel='"+volume+"'][isBoot='true']").length>0)
                                {
                                    dir = dir.replace(volume, "/");
                                }
                                if(base.options.returnDirListing)
                                {
                                    var data = [];
                                    var selectedDir = dir;
                                    if (selectedDir && selectedDir.length > 0) {
                                        selectedDir = selectedDir.split(";;;");
                                        for (var i = 0; i < selectedDir.length; i++) {
                                            selectedDir[i] = selectedDir[i].split(":::");
                                        }
                                        for (var j = 0; j < selectedDir.length; j++) {
                                            var strItem = selectedDir[j];
                                            var item = {};
                                            for (var i = 0; i < strItem.length; i++) {
                                                var curItem = strItem[i];
                                                if (curItem) {
                                                    var ind = curItem.indexOf("=");
                                                    if (ind >= 0) {
                                                        var key = curItem.substring(0, ind);
                                                        var val = curItem.substring(ind + 1, curItem.length);
                                                        item[key] = val;
                                                    }
                                                }
                                            };
                                            data.push(item);
                                        }
                                    }
                                    var dirList = [];
                                    if(data.length>0)
                                    {
                                        var items = runAppletCommand(true, "COMMAND=LIST:::PATH=" + data[0].path);
                                        if (items && items.length > 0) {
                                            items = items.split(";;;");
                                            for (var i = 0; i < items.length; i++) {
                                                items[i] = items[i].split(":::");
                                            }
                                            for (var j = 0; j < items.length; j++) {
                                                var strItem = items[j];
                                                var item = {};
                                                for (var i = 0; i < strItem.length; i++) {
                                                    var curItem = strItem[i];
                                                    if (curItem) {
                                                        var ind = curItem.indexOf("=");
                                                        if (ind >= 0) {
                                                            var key = curItem.substring(0, ind);
                                                            var val = curItem.substring(ind + 1, curItem.length);
                                                            item[key] = val;
                                                        }
                                                    }
                                                };
                                                dirList.push(item);
                                            }
                                        }
                                    }
                                    if (base.options.callback)
                                        base.options.callback(dir, dirList);
                                }
                                else{
                                    if (base.options.callback)
                                        base.options.callback(dir);
                                }
                            }
                            $(this).dialog("close");
                            if(opts.isFTPBrowse)
                            {
                                $("#browsePopupFTPDialog").dialog("close");
                                $("#browsePopupFTPDialog").remove();
                            }
                        }
                        else
                        {
                            var items = [];
                            browsePanel.find("table.listing.files").find("input[checked]:visible").each(function() {
                                items.push($(this).closest('tr').data('curData'));
                            });
                            if (base.options.callback)
                                base.options.callback(items);
                            $(this).dialog("close");
                        }
                        if(!opts.isFTPBrowse && !base.options.syncOpts && !base.options.isServerBrowse)
                        {
                            var options = {
                                path: '/',
                                expires: 60
                            };
                            $.cookie("localFileBrowserPopupLastSelection", base.curLoadedPath, options);
                        }
                    }
                },
                beforeClose: function() {
                    return true;
                },
                open: function() {
                    $([document, window]).unbind('.dialog-overlay');
                    var height = $(document).height();
                    $(".ui-widget-overlay").css('height',height);
                    base.listDevices();
                    var ignoreExistingPaths = ["builtin"];
                    if(base.options.existingVal && $.trim(base.options.existingVal).length>0 && !ignoreExistingPaths.has($.trim(base.options.existingVal).toLowerCase()))
                    {
                        var val = base.options.existingVal;
                        var toCheckExtension = val;
                        if(base.options.type == "file" && val.lastIndexOf("/")==val.length-1)
                        {
                            toCheckExtension = val.substring(0, val.lastIndexOf("/"));
                        }
                        if(base.getFileExtension(toCheckExtension)!="")
                        {
                            val = toCheckExtension.substring(0, toCheckExtension.lastIndexOf("/"));
                        }
                        if(val.lastIndexOf("/")!=val.length-1)
                        {
                            val = val + "/";
                        }
                        base.listItems(val);
                    }
                    else
                    {
                        setTimeout(function(){
                            if($.cookie && !base.options.syncOpts && !base.options.isFTPBrowse)
                            {
                                var lastChosenItem = $.cookie("localFileBrowserPopupLastSelection");
                                if(lastChosenItem)
                                {
                                    if(base.getFileExtension(lastChosenItem)!="" || lastChosenItem.lastIndexOf("/")>=0)
                                    {
                                        lastChosenItem = lastChosenItem.substring(0, lastChosenItem.lastIndexOf("/"));
                                    }
                                    if(lastChosenItem.lastIndexOf("/")!=lastChosenItem.length-1)
                                    {
                                        lastChosenItem = lastChosenItem + "/";
                                    }
                                    if(lastChosenItem)
                                        base.listItems(lastChosenItem, false, true);
                                    else
                                        base.listItems();
                                }
                                else
                                    base.listItems();
                            }
                            else
                                base.listItems();
                        }, 1500);
                    }
                }
            });
            if(base.options.isFTPBrowse)
            {
                if($("#browsePopupFTPDialog").length==0)
                {
                    var ftpDialogHTML = $('<div id="browsePopupFTPDialog"></div>');
                    crushFTP.UI.showIndicator(false, false, "Please wait..");
                    ftpDialogHTML.load("/WebInterface/Resources/templates/remoteVFSItemForm.html", function(){
                        $("body").append(ftpDialogHTML);
                        if(!$(document).data("crushftp_enterprise"))
                        {
                            $('#remoteVFSItem_option_itemType').find("option[value='rfile']").remove();
                        }
                        var browsePopupFTPDialog = $("#browsePopupFTPDialog").form().hide();
                        var attr = base.$el.attr("rel");

                        var useDmzs = browsePopupFTPDialog.find('select[_name="use_dmz"]').empty();
                        if(crushFTP.jobsKioskMode)
                        {
                            $("#mainServerInstance", window.parent.document).find("option").each(function(){
                                if($(this).text().toLowerCase() != "main")
                                    useDmzs.append("<option value='"+$(this).text()+"'>"+$(this).text()+"</option>");
                            });
                        }
                        else
                        {
                            $("#mainServerInstance").find("option").each(function(){
                                if($(this).text().toLowerCase() != "main")
                                    useDmzs.append("<option value='"+$(this).text()+"'>"+$(this).text()+"</option>");
                            });
                        }
                        useDmzs.prepend("<option value='true'>Any</option>");
                        useDmzs.prepend("<option value='false' selected>No</option>");
                        useDmzs.append("<option value='false' _rel='custom'>Custom</option>");

                        useDmzs.find("option:first").attr("selected", "selected");
                        browsePopupFTPDialog.find("[_name='destPath']").attr("_name", attr);
                        browsePopupFTPDialog.find(".button").button();
                        base.bindFTPFormEvents(browsePopupFTPDialog, base.options.existingData);
                        browsePopupFTPDialog.dialog("open");
                        crushFTP.UI.hideIndicator();
                    });
                }
                else
                {
                    var browsePopupFTPDialog = $("#browsePopupFTPDialog");
                    base.bindFTPFormEvents(browsePopupFTPDialog, base.options.existingData);
                    browsePopupFTPDialog.dialog("open");
                }
                browsePanel.find(".firstColumn").hide().css("width","0px");
                browsePanel.find(".secondColumn").css("width","800px");
                browsePanel.find("table.files").parent().css("width","802px");
                browsePanel.find("table").css("width","800px");
            }
            else
            {
                browsePanel.dialog("open");
                base.bindListingEvents();
                browsePanel.find(".showSystemFiles").unbind().bind('change', function() {
                    base.showHideSystemFiles();
                });
                browsePanel.find(".firstColumn").show().css("width","200px");
                browsePanel.find(".secondColumn").css("width","600px");
                browsePanel.find("table.files").css("width","600px");

                if(base.options.syncOpts)
                {
                    browsePanel.find(".firstColumn").hide().css("width","0px");
                    browsePanel.find(".secondColumn").css("width","800px");
                    browsePanel.find("table.files").parent().css("width","802px");
                    browsePanel.find("table").css("width","800px");
                }
            }
        };

        base.bindFTPFormEvents = function(fieldPropertiesDialog){
            var opts = base.options;
            var notAllowedCharsInDirName = ":/\\&#?<>";
            function showHideItemPropertiesSettings()
            {
                var ftpCredentials = $(".ftpCredentials", fieldPropertiesDialog).show();
                var noFileOption = $(".noFileOption", fieldPropertiesDialog).show();
                var smbOption = $(".smbOption", fieldPropertiesDialog).show();
                var smb3Option = $(".smb3Option", fieldPropertiesDialog).hide();
                var sftpOptions = $(".sftpOptions", fieldPropertiesDialog).hide();
                var rfileOption = $(".rfileOption", fieldPropertiesDialog).hide();
                var hadoopOption = $(".hadoopOption", fieldPropertiesDialog).hide();
                var azureOptions = $(".azureOptions", fieldPropertiesDialog).hide();
                var noAzureOptions = $(".noAzureOptions", fieldPropertiesDialog);
                var ftpOptions = $(".ftpOptions", fieldPropertiesDialog).hide();
                var ftpsOptions = $(".ftpsOptions", fieldPropertiesDialog).hide();
                var ftpesOptions = $(".ftpesOptions", fieldPropertiesDialog).hide();
                var s3Credentials = $(".s3Credentials", fieldPropertiesDialog).hide();
                var glacierCredentials = $(".glacierCredentials", fieldPropertiesDialog).hide();
                var s3CrushCredentials = $(".s3CrushCredentials", fieldPropertiesDialog).hide();
                var noS3Options = $(".noS3Options", fieldPropertiesDialog).show();
                var noCitrixOption = $(".noCitrixOption", fieldPropertiesDialog).show();
                var gdriveCredentials = $(".gdriveCredentials", fieldPropertiesDialog).hide();
                var citrixCredentials = $(".citrixCredentials", fieldPropertiesDialog).hide();
                var HAOptions = $(".HAOptions", fieldPropertiesDialog).show();
                var SSLOptions = $(".SSLOptions", fieldPropertiesDialog).hide();
                var privateOptions = $(".privateOptions", fieldPropertiesDialog).hide();
                var commonFTPOptions = $(".commonFTPOptions", fieldPropertiesDialog).hide();
                var nonSftpOptions = $(".nonSftpOptions", fieldPropertiesDialog);

                var remoteVFSItem_option_itemType = $("#remoteVFSItem_option_itemType", fieldPropertiesDialog).val();
                ftpOptions.find("select").unbind().change(function(){
                    if($(this).val() == "true")
                    {
                        if(remoteVFSItem_option_itemType == "ftp"){
                            $("#remoteVFSItem_option_itemType", fieldPropertiesDialog).val("ftpes").trigger('change');
                            $(this).val("false");
                        }
                    }
                    else
                    {
                        SSLOptions.hide();
                    }
                }).trigger("change");

                var remoteVFSItem_option_port = $("#remoteVFSItem_option_port", fieldPropertiesDialog);
                if(remoteVFSItem_option_itemType == "file")
                {
                    ftpCredentials.hide();
                    HAOptions.hide();
                    noFileOption.hide();
                    remoteVFSItem_option_port.val("");
                }
                if(remoteVFSItem_option_itemType == "memory")
                {
                    ftpCredentials.hide();
                    HAOptions.hide();
                    noFileOption.hide();
                    remoteVFSItem_option_port.val("");
                }
                if(remoteVFSItem_option_itemType == "smb" || remoteVFSItem_option_itemType == "smb3" || remoteVFSItem_option_itemType == "rfile" || remoteVFSItem_option_itemType == "glacier")
                {
                    ftpCredentials.show();
                    HAOptions.hide();
                    noFileOption.hide();
                    smbOption.show();
                    remoteVFSItem_option_port.val("");
                }
                if(remoteVFSItem_option_itemType == "smb3")
                {
                    smb3Option.show();
                }
                if(remoteVFSItem_option_itemType == "rfile")
                {
                    rfileOption.show();
                }
                if(remoteVFSItem_option_itemType == "hadoop")
                {
                    HAOptions.hide();
                    hadoopOption.show();
                }
                if(remoteVFSItem_option_itemType == "azure")
                {
                    HAOptions.hide();
                    azureOptions.show();
                    noAzureOptions.hide();
                }
                if(remoteVFSItem_option_itemType == "glacier"){
                    glacierCredentials.show();
                }
                if(remoteVFSItem_option_itemType == "s3" || remoteVFSItem_option_itemType == "s3crush")
                {
                    ftpCredentials.hide();
                    s3Credentials.show();
                    noS3Options.hide();
                    remoteVFSItem_option_port.val("");
                }
                if(remoteVFSItem_option_itemType == "s3crush")
                {
                    s3CrushCredentials.show();
                }
                if(remoteVFSItem_option_itemType == "gdrive")
                {
                    ftpCredentials.hide();
                    gdriveCredentials.show();
                    remoteVFSItem_option_port.val("");
                }
                if(remoteVFSItem_option_itemType == "citrix")
                {
                    ftpCredentials.hide();
                    noCitrixOption.hide();
                    citrixCredentials.show();
                }
                if(remoteVFSItem_option_itemType == "sftp")
                {
                    privateOptions.show();
                    if(remoteVFSItem_option_port.val()=="")
                        remoteVFSItem_option_port.val("22");
                }
                if(remoteVFSItem_option_itemType == "ftps" || remoteVFSItem_option_itemType == "https" || remoteVFSItem_option_itemType == "webdavs" || remoteVFSItem_option_itemType == "ftpes")
                {
                    SSLOptions.show();
                }
                if(remoteVFSItem_option_itemType == "ftps" || remoteVFSItem_option_itemType == "ftpes")
                {
                    ftpesOptions.show();
                }
                if(remoteVFSItem_option_itemType == "ftp")
                {
                    ftpOptions.show();
                    if(remoteVFSItem_option_port.val()=="")
                        remoteVFSItem_option_port.val("21");
                }
                if(remoteVFSItem_option_itemType == "http" || remoteVFSItem_option_itemType == "webdav" || remoteVFSItem_option_itemType == "s3" || remoteVFSItem_option_itemType == "s3crush")
                {
                    if(remoteVFSItem_option_port.val()=="")
                        remoteVFSItem_option_port.val("80");
                }
                if(remoteVFSItem_option_itemType == "https" || remoteVFSItem_option_itemType == "webdavs")
                {
                    if(remoteVFSItem_option_port.val()=="")
                        remoteVFSItem_option_port.val("443");
                }
                if(remoteVFSItem_option_itemType == "ftps")
                {
                    if(remoteVFSItem_option_port.val()=="")
                        remoteVFSItem_option_port.val("989");
                }
                if(remoteVFSItem_option_itemType == "ftp" || remoteVFSItem_option_itemType == "ftps" || remoteVFSItem_option_itemType == "ftpes")
                {
                    ftpsOptions.show();
                }
                if(remoteVFSItem_option_itemType.indexOf("ftp")>=0)
                    commonFTPOptions.show();
                if(remoteVFSItem_option_itemType == "sftp")
                {
                    nonSftpOptions.hide();
                    sftpOptions.show();
                }
            };

            function buildPropertiesURLReverse(){
                var fieldPropertiesDialog = $("#browsePopupFTPDialog");
                var remoteVFSItem_option_url = fieldPropertiesDialog.find("#remoteVFSItem_option_url");
                var item_option_itemType = $("#remoteVFSItem_option_itemType", fieldPropertiesDialog).addClass('notextChange');
                var url = remoteVFSItem_option_url.val();
                var lowCaseURL = "file:";
                if(url)
                    lowCaseURL = url.toLowerCase();
                if(lowCaseURL.indexOf("file:") == 0)
                {
                    item_option_itemType.val("file").trigger("change");
                }
                else if(lowCaseURL.indexOf("memory:") == 0)
                {
                    item_option_itemType.val("memory").trigger("change");
                }
                else if(lowCaseURL.indexOf("smb:") == 0)
                {
                    item_option_itemType.val("smb").trigger("change");
                }
                else if(lowCaseURL.indexOf("smb3:") == 0)
                {
                    item_option_itemType.val("smb3").trigger("change");
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
                try{
                    var _url = URI(url);
                    $("#remoteVFSItem_option_user_name, #remoteVFSItem_option_secretKeyID, #remoteVFSItem_option_client_id", fieldPropertiesDialog).addClass("notextChange").val(_url.username()).removeClass("notextChange");
                    $("#remoteVFSItem_option_password, #remoteVFSItem_option_secretKey, #remoteVFSItem_option_client_secret", fieldPropertiesDialog).addClass("notextChange").val(_url.password()).removeClass("notextChange");

                    if(lowCaseURL.indexOf("s3") == 0)
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
                        var hostname = _url.hostname();
                        var serverURL = fieldPropertiesDialog.find("#remoteVFSItem_option_s3serverURL");
                        if(serverURL.find("option[value='"+hostname+"']").length==0){
                            serverURL.find("option[custom]").remove();
                            serverURL.append('<option custom="true" value="'+hostname+'"></option>');
                            serverURL.attr("lastSelected", hostname);
                        }
                        serverURL.val(hostname);
                        $("#remoteVFSItem_option_s3_bucket", fieldPropertiesDialog).val(_bucket);
                        $("#remoteVFSItem_option_s3_path", fieldPropertiesDialog).val(_path);
                    }
                    else if(lowCaseURL.indexOf(glacier) == 0){
                        var hostname = _url.hostname();
                        var serverURL = fieldPropertiesDialog.find("#remoteVFSItem_option_glacierServerURL");
                        if(serverURL.find("option[value='"+hostname+"']").length==0){
                            serverURL.find("option[custom]").remove();
                            serverURL.append('<option custom="true" value="'+hostname+'"></option>');
                            serverURL.attr("lastSelected", hostname);
                        }
                        serverURL.val(hostname);
                    }
                }
                catch(e){}
                item_option_itemType.removeClass('notextChange');
            }

            function buildPropertiesURL()
            {
                var remoteVFSItem_option_url = fieldPropertiesDialog.find("#remoteVFSItem_option_url");
                var curUrl = remoteVFSItem_option_url.val();
                var staticURL = curUrl;
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
                var remoteVFSItem_option_itemType = $("#remoteVFSItem_option_itemType", fieldPropertiesDialog).val();
                var fileSelected = remoteVFSItem_option_itemType == "file";
                var memorySelected = remoteVFSItem_option_itemType == "memory";
                var smbSelected = remoteVFSItem_option_itemType == "smb";
                var smb3Selected = remoteVFSItem_option_itemType == "smb3";
                var rfileSelected = remoteVFSItem_option_itemType == "rfile";
                var hadoopSelected = remoteVFSItem_option_itemType == "hadoop";
                var azureSelected = remoteVFSItem_option_itemType == "azure";
                var ftpSelected = remoteVFSItem_option_itemType == "ftp";

                var httpSelected = remoteVFSItem_option_itemType == "http";
                var httpsSelected = remoteVFSItem_option_itemType == "https";
                var webdavSelected = remoteVFSItem_option_itemType == "webdav";
                var webdavsSelected = remoteVFSItem_option_itemType == "webdavs";

                var ftpsSelected = remoteVFSItem_option_itemType == "ftps";
                var ftpesSelected = remoteVFSItem_option_itemType == "ftpes";
                var sftpSelected = remoteVFSItem_option_itemType == "sftp";
                var s3Selected = remoteVFSItem_option_itemType == "s3" || remoteVFSItem_option_itemType == "s3crush";
                var gdriveSelected = remoteVFSItem_option_itemType == "gdrive";
                var citrixSelected = remoteVFSItem_option_itemType == "citrix";
                var glacierSelected = remoteVFSItem_option_itemType == "glacier";

                function clearURL(_url, except){
                    var toReplace = ["s3.amazonaws.com/","google.com/","sf-api.com/","glacier.us-east-1.amazonaws.com/","file.core.windows.net/"];
                    toReplace = toReplace.removeByVal(except);
                    for (var i = 0; i < toReplace.length; i++) {
                        _url = _url.replace(toReplace[i], "");
                    }
                    return _url;
                }

                function addUserPassToURL(url, protocol, addUP, except)
                {
                    url = clearURL(url, except);
                    if(addUP)
                    {
                        var userName = fixChars(crushFTP.methods.decodeXML(revertFixChars($("#remoteVFSItem_option_user_name", fieldPropertiesDialog).val())));
                        var pass = fixChars(crushFTP.methods.decodeXML(revertFixChars($("#remoteVFSItem_option_password", fieldPropertiesDialog).val())));
                        if(userName.length>0)
                        {
                            url = userName + ":" + pass + "@" + url;
                        }
                    }
                    return protocol + url;
                }

                function addUserPassToAzure(url, protocol, addUP)
                {
                    return addUserPassToURL(url || "file.core.windows.net", protocol, addUP, "file.core.windows.net/");
                }

                function addUserPassToGlacier(url, protocol, addUP)
                {
                    if(url.indexOf("amazonaws.com")<0){
                        url = "";
                        $("#remoteVFSItem_option_host", fieldPropertiesDialog).val("glacier.us-east-1.amazonaws.com");
                    }
                    return addUserPassToURL(url || "glacier.us-east-1.amazonaws.com", protocol, addUP, "glacier.us-east-1.amazonaws.com/");
                }

                function addUserPassToURLGDrive(url, protocol)
                {
                    url = url.replace("s3.amazonaws.com/", "").replace("google.com/", "").replace("sf-api.com/", "");
                    var userName = fixChars(crushFTP.methods.decodeXML(revertFixChars($("#remoteVFSItem_option_gdrive_secretKeyID", fieldPropertiesDialog).val())));
                    var pass = fixChars(crushFTP.methods.decodeXML(revertFixChars($("#remoteVFSItem_option_gdrive_secretKey", fieldPropertiesDialog).val())));
                    if(userName.length>0)
                    {
                        url = userName + ":" + pass + "@www.google.com/" + url;
                    }
                    else
                        url = "www.google.com/" + url;
                    return protocol + url;
                }

                function addUserPassToURLCitrix(url, protocol)
                {
                    fieldPropertiesDialog.find("#remoteVFSItem_option_port").val("");
                    url = url.replace("s3.amazonaws.com/", "").replace("google.com/", "").replace("sf-api.com/", "");
                    var userName = fixChars(crushFTP.methods.decodeXML(revertFixChars($("#remoteVFSItem_option_client_id", fieldPropertiesDialog).val())));
                    var pass = fixChars(crushFTP.methods.decodeXML(revertFixChars($("#remoteVFSItem_option_client_secret", fieldPropertiesDialog).val())));
                    if(userName.length>0 || pass.length>0)
                    {
                        url = userName + ":" + pass + "@sf-api.com/" + url;
                    }
                    else
                        url = "sf-api.com/" + url;
                    return protocol + url;
                }

                function addUserPassToURLS3(url, protocol, server)
                {
                    server = server || fieldPropertiesDialog.find("#remoteVFSItem_option_s3serverURL").attr("lastSelected") || "s3.amazonaws.com";
                    var userName = fixChars(crushFTP.methods.decodeXML(revertFixChars($("#remoteVFSItem_option_secretKeyID", fieldPropertiesDialog).val())));
                    var pass = fixChars(crushFTP.methods.decodeXML(revertFixChars($("#remoteVFSItem_option_secretKey", fieldPropertiesDialog).val())));
                    var bucket = $("#remoteVFSItem_option_s3_bucket", fieldPropertiesDialog).val().toLowerCase();
                    var path = $("#remoteVFSItem_option_s3_path", fieldPropertiesDialog).val();
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
                    if(typeof base.options.existingData.random_id == "undefined")
                    {
                        crushFTP.UI.checkUnchekInput($("#remoteVFSItem_option_random_id", fieldPropertiesDialog), true);
                        base.options.existingData.random_id = true;
                    }
                    if(typeof base.options.existingData.s3_stat_head_calls == "undefined")
                    {
                        crushFTP.UI.checkUnchekInput($("#remoteVFSItem_option_s3_stat_head_calls", fieldPropertiesDialog), true);
                        base.options.existingData.s3_stat_head_calls = true;
                    }
                    if(typeof base.options.existingData.s3_stat_head_calls_double == "undefined")
                    {
                        crushFTP.UI.checkUnchekInput($("#remoteVFSItem_option_s3_stat_head_calls_double", fieldPropertiesDialog), false);
                        base.options.existingData.s3_stat_head_calls_double = false;
                    }
                    if(typeof base.options.existingData.multithreaded_s3 == "undefined")
                    {
                        crushFTP.UI.checkUnchekInput($("#remoteVFSItem_option_multithreaded_s3", fieldPropertiesDialog), false);
                        base.options.existingData.multithreaded_s3 = false;
                    }
                    return protocol + url;
                }

                if(fileSelected)
                {
                    remoteVFSItem_option_url.val(addUserPassToURL(staticURL, "file://"));
                }
                else if(memorySelected)
                {
                    remoteVFSItem_option_url.val(addUserPassToURL(staticURL, "MEMORY://"));
                }
                else if(smbSelected)
                {
                    remoteVFSItem_option_url.val(addUserPassToURL(staticURL, "SMB://", true));
                }
                else if(smb3Selected)
                {
                    remoteVFSItem_option_url.val(addUserPassToURL(staticURL, "SMB3://", true));
                }
                else if(rfileSelected)
                {
                    remoteVFSItem_option_url.val(addUserPassToURL(staticURL, "rfile://", true));
                }
                else if(hadoopSelected)
                {
                    remoteVFSItem_option_url.val(addUserPassToURL(staticURL, "hadoop://", true));
                }
                else if(azureSelected)
                {
                    remoteVFSItem_option_url.val(addUserPassToAzure(staticURL, "azure://", true)).trigger("applymask");
                    // $("#remoteVFSItem_option_host", fieldPropertiesDialog).val("file.core.windows.net");
                }
                else if(ftpSelected)
                {
                    remoteVFSItem_option_url.val(addUserPassToURL(staticURL, "FTP://", true));
                }
                else if(httpSelected)
                {
                    remoteVFSItem_option_url.val(addUserPassToURL(staticURL, "HTTP://", true));
                }
                else if(httpsSelected)
                {
                    remoteVFSItem_option_url.val(addUserPassToURL(staticURL, "HTTPS://", true));
                }
                else if(webdavSelected)
                {
                    remoteVFSItem_option_url.val(addUserPassToURL(staticURL, "WEBDAV://", true));
                }
                else if(webdavsSelected)
                {
                    remoteVFSItem_option_url.val(addUserPassToURL(staticURL, "WEBDAVS://", true));
                }
                else if(ftpsSelected)
                {
                    remoteVFSItem_option_url.val(addUserPassToURL(staticURL, "FTPS://", true));
                }
                else if(ftpesSelected)
                {
                    remoteVFSItem_option_url.val(addUserPassToURL(staticURL, "FTPES://", true));
                }
                else if(sftpSelected)
                {
                    remoteVFSItem_option_url.val(addUserPassToURL(staticURL, "SFTP://", true));
                }
                else if(glacierSelected)
                {
                    remoteVFSItem_option_url.val(addUserPassToGlacier(staticURL, "glacier://", true));
                    var _url;
                    try{
                        _url = URI(curUrl);
                    }catch(ex){
                        _url = URI(encodeURI(curUrl));
                    }
                    var hostname = _url.hostname();
                    var serverURL = fieldPropertiesDialog.find("#remoteVFSItem_option_glacierServerURL");
                    if(serverURL.find("option[value='"+hostname+"']").length==0){
                        serverURL.find("option[custom]").remove();
                        serverURL.append('<option custom="true" value="'+hostname+'"></option>');
                        serverURL.attr("lastSelected", hostname);
                        serverURL.val(hostname);
                    }
                    var server = serverURL.attr("lastSelected") || "glacier.us-east-1.amazonaws.com";
                    $("#remoteVFSItem_option_host", fieldPropertiesDialog).val(server);
                }
                else if(s3Selected)
                {
                    var _url;
                    try{
                        _url = URI(curUrl);
                    }catch(ex){
                        _url = URI(encodeURI(curUrl));
                    }
                    var hostname = _url.hostname();
                    var serverURL = fieldPropertiesDialog.find("#remoteVFSItem_option_s3serverURL");
                    if(serverURL.find("option[value='"+hostname+"']").length==0){
                        serverURL.find("option[custom]").remove();
                        serverURL.append('<option custom="true" value="'+hostname+'"></option>');
                        serverURL.attr("lastSelected", hostname);
                        serverURL.val(hostname);
                    }
                    var server = serverURL.attr("lastSelected") || "s3.amazonaws.com";
                    $("#remoteVFSItem_option_host", fieldPropertiesDialog).val(server);
                    if(remoteVFSItem_option_itemType == "s3crush")
                        remoteVFSItem_option_url.val(addUserPassToURLS3("", "s3crush://"));
                    else
                        remoteVFSItem_option_url.val(addUserPassToURLS3("", "s3://"));
                }
                else if(gdriveSelected)
                {
                    remoteVFSItem_option_url.val(addUserPassToURLGDrive("", "gdrive://"));
                    $("#remoteVFSItem_option_host", fieldPropertiesDialog).val("www.google.com");
                }
                else if(citrixSelected)
                {
                    remoteVFSItem_option_url.val(addUserPassToURLCitrix("", "citrix://"));
                    $("#remoteVFSItem_option_host", fieldPropertiesDialog).val("sf-api.com");
                }
                curUrl = remoteVFSItem_option_url.val();
                var path = $("#remoteVFSItem_option_path", fieldPropertiesDialog).val();
                var bucket = "";
                if(s3Selected)
                {
                    path = $("#remoteVFSItem_option_s3_path", fieldPropertiesDialog).val();
                    bucket = $("#remoteVFSItem_option_s3_bucket", fieldPropertiesDialog).val();
                    if(bucket && bucket.length>0)
                    {
                        if(bucket.lastIndexOf("/") != bucket.length - 1 && path.indexOf("/") != 0)
                        {
                            path = bucket+ "/" + path;
                        }
                        else
                            path = bucket + path;
                    }
                }
                path = path || "/";
                if(base.options.existingData)
                {
                    base.options.existingData.path = path;
                }
                if(curUrl.toLowerCase().indexOf("file:/")==0)
                {
                    if(path.indexOf("//") == 0 || path.indexOf("////") == 0)
                        curUrl = "file:" + path;
                    else
                        curUrl = "file:/" + path;
                }
                else
                {
                    var port = $("#remoteVFSItem_option_port", fieldPropertiesDialog).val();
                    var host = $("#remoteVFSItem_option_host", fieldPropertiesDialog).val();
                    var value = curUrl;
                    var _url = value;
                    try{
                        _url = URI(value);
                    }catch(ex){
                        _url = URI(encodeURI(value));
                    }
                    if(host){
                        if(host.indexOf("@")>=0){
                            var hold = host.split("@")
                            var userpass = hold[0].split(":");
                            host = hold[1];
                            if(userpass && userpass.length>0){
                                if(userpass[0] && userpass[0].length>0)
                                    $("#remoteVFSItem_option_user_name", fieldPropertiesDialog).val(userpass[0]);
                                if(userpass[1] && userpass[1].length>0)
                                    $("#remoteVFSItem_option_password", fieldPropertiesDialog).val(userpass[1]);
                                $("#remoteVFSItem_option_host", fieldPropertiesDialog).val(host);
                            }
                        }
                        _url.hostname(fixChars(host));
                    }
                    if(typeof path != "undefined")
                    {
                        _url.path(path);
                    }
                    if(!azureSelected && !s3Selected && !smbSelected && !smb3Selected){
                        if(port && crushFTP.methods.isNumeric(port))
                            _url.port(""+port);
                    }
                    else{
                        _url.port("");
                    }
                    curUrl = unescape(_url.toString());
                }
                remoteVFSItem_option_url.val(curUrl);
            };

            function bindFTPFormData()
            {
                var attr = base.$el.attr("rel");
                var matchedElem = base.options.existingData || {
                    name : "",
                    path : "/",
                    type : "DIR",
                    url : "file:/"
                };
                fieldPropertiesDialog.find("#remoteVFSItem_option_use_dmz").find("option:first").attr("selected", "selected");
                if(matchedElem)
                {
                    var item_option_itemType = $("#remoteVFSItem_option_itemType", fieldPropertiesDialog);
                    fieldPropertiesDialog.clearForm();
                    var url = matchedElem[attr];
                    if($.isArray(url))
                        url = url[0].text;
                    if(!url)
                    {
                        url = "file://";
                    }
                    var lowCaseURL = url.toLowerCase();

                    if(lowCaseURL.indexOf("file:") == 0)
                    {
                        item_option_itemType.val("file");
                    }
                    else if(lowCaseURL.indexOf("memory:") == 0)
                    {
                        item_option_itemType.val("memory");
                    }
                    else if(lowCaseURL.indexOf("smb:") == 0)
                    {
                        item_option_itemType.val("smb");
                    }
                    else if(lowCaseURL.indexOf("smb3:") == 0)
                    {
                        item_option_itemType.val("smb3");
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
                    else if(lowCaseURL.indexOf("ftp:") == 0)
                    {
                        item_option_itemType.val("ftp");
                        fieldPropertiesDialog.find("#remoteVFSItem_option_pasv").attr('checked', 'checked').trigger('change');
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
                    if(lowCaseURL.indexOf("ftpes:") == 0)
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
                        $("#remoteVFSItem_option_glacierServerURL", fieldPropertiesDialog).val(matchedElem.host).trigger("change");
                    }
                    // else{
                    //     if(url.indexOf("//") == 0 || url.indexOf("////") == 0)
                    //         url = "file:" + url;
                    //     else
                    //         url = "file:/" + url;
                    // }
                    if(item_option_itemType.val()==null)
                    {
                        item_option_itemType.val("file");
                    }
                    var value = url;
                    var val = value;
                    try{
                        val = URI(value);
                    }catch(ex){
                        val = URI(encodeURI(value));
                    }
                    var path = val.path();
                    var shareName;
                    if(lowCaseURL.indexOf("azure:") == 0){
                        if(path){
                            try{
                                path = path.split("/");
                                var tmp = path[1];
                                if(tmp){
                                    shareName = tmp;
                                    if(!shareName.startsWith("/"))
                                        shareName = "/" + shareName;
                                    if(!shareName.endsWith("/"))
                                        shareName = shareName + "/";
                                    path.shift();
                                    path.shift();
                                    path = path.join('/');
                                    if(!path.startsWith("/"))
                                        path = "/" + path;
                                    if(!path.endsWith("/"))
                                        path = path + "/";
                                }
                                matchedElem.shareName = shareName;
                            }catch(e){}
                        }
                    }
                    matchedElem.path = path;
                    matchedElem.host = val.hostname();
                    matchedElem.port = val.port();

                    if(val && val.username())
                        $("#remoteVFSItem_option_user_name, #remoteVFSItem_option_secretKeyID", fieldPropertiesDialog).addClass("notextChange").val(val.username()).removeClass("notextChange");
                    if(val && val.password())
                        $("#remoteVFSItem_option_password, #remoteVFSItem_option_secretKey", fieldPropertiesDialog).addClass("notextChange").val(val.password()).removeClass("notextChange");

                    if(matchedElem && typeof matchedElem.proxyActivePorts == "undefined")
                    {
                        matchedElem.proxyActivePorts = "1025-65535";
                    }
                    if(url.toLowerCase().indexOf("file:/")==0)
                        matchedElem.path = url.replace(/file:/i,"")
                    if(!matchedElem.path.startsWith("////") && !matchedElem.path.startsWith("///")){
                        if(matchedElem.path.startsWith("//"))
                            matchedElem.path = url.replace(/file:\//i,"")
                    }
                    if(typeof window.userManager != "undefined")
                        window.userManager.data.bindValuesFromJson(fieldPropertiesDialog, matchedElem, "_name");
                    else if(typeof window.adminPanel != "undefined")
                        window.adminPanel.data.bindValuesFromJson(fieldPropertiesDialog, matchedElem, "_name");
                    else if(typeof window.bindValuesFromJson != "undefined")
                        window.bindValuesFromJson(fieldPropertiesDialog, matchedElem, "_name");

                    if(matchedElem.use_dmz && (matchedElem.use_dmz.indexOf("socks://") == 0 || matchedElem.use_dmz.indexOf("internal://") == 0 || matchedElem.use_dmz.indexOf("variable") == 0))
                    {
                        fieldPropertiesDialog.find("#remoteVFSItem_option_use_dmz").find("option[_rel='custom']").attr("value", matchedElem.use_dmz).text(matchedElem.use_dmz + " (custom)").attr("selected", "selected");
                    }
                    if(matchedElem.use_dmz == "false" || matchedElem.use_dmz == "")
                    {
                        fieldPropertiesDialog.find("#remoteVFSItem_option_use_dmz").find("option:first").attr("selected", "selected");
                    }

                    url = fieldPropertiesDialog.find("#remoteVFSItem_option_url").trigger("change").val();
                    if(url && url.indexOf("file:") != 0)
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
                                        $("#remoteVFSItem_option_user_name,#remoteVFSItem_option_secretKeyID,#remoteVFSItem_option_gdrive_secretKeyID,#remoteVFSItem_option_client_id", fieldPropertiesDialog).val(cred[0]);
                                    }
                                    if(cred.length>1)
                                    {
                                        $("#remoteVFSItem_option_password,#remoteVFSItem_option_secretKey,#remoteVFSItem_option_gdrive_secretKey,#remoteVFSItem_option_client_secret", fieldPropertiesDialog).val(cred[1]);
                                    }
                                }
                            }
                        }
                    }
                    if(lowCaseURL && (lowCaseURL.indexOf("s3") == 0 || lowCaseURL.indexOf("s3crush") == 0))
                    {
                        var _path = matchedElem.path;
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
                        if(typeof matchedElem.random_id == "undefined")
                        {
                            matchedElem.random_id = true;
                        }
                        if(typeof matchedElem.multithreaded_s3 == "undefined")
                        {
                            matchedElem.multithreaded_s3 = false;
                        }
                        if(typeof matchedElem.s3_stat_head_calls == "undefined")
                        {
                            matchedElem.s3_stat_head_calls = true;
                        }
                        if(typeof matchedElem.s3_stat_head_calls_double == "undefined")
                        {
                            matchedElem.s3_stat_head_calls_double = false;
                        }
                        $("#remoteVFSItem_option_s3serverURL", fieldPropertiesDialog).val(matchedElem.host).trigger("change");
                        $("#remoteVFSItem_option_s3_bucket", fieldPropertiesDialog).val(_bucket);
                        $("#remoteVFSItem_option_s3_path", fieldPropertiesDialog).val(_path);
                        $("#remoteVFSItem_option_secretKeyID", fieldPropertiesDialog).trigger("textchange");
                        if(lowCaseURL.indexOf("s3-accelerate.amazonaws.com")>=0){
                            crushFTP.UI.checkUnchekInput($("#remoteVFSItem_option_s3_accelerate", fieldPropertiesDialog), true);
                            setTimeout(function(){
                                $("#remoteVFSItem_option_s3serverURL", fieldPropertiesDialog).val("s3.amazonaws.com").trigger('change');
                            });
                        }
                    }
                    if(lowCaseURL && lowCaseURL.indexOf("gdrive") == 0)
                    {
                        $("#remoteVFSItem_option_gdrive_secretKeyID", fieldPropertiesDialog).trigger("textchange");
                    }
                    if(lowCaseURL && lowCaseURL.indexOf("citrix") == 0)
                    {
                        $("#remoteVFSItem_option_client_id", fieldPropertiesDialog).trigger("textchange");
                    }
                    setTimeout(function() {
                        if(matchedElem.port != "" && matchedElem.port != $("#remoteVFSItem_option_port", fieldPropertiesDialog).val())
                        {
                            $("#remoteVFSItem_option_port", fieldPropertiesDialog).val(matchedElem.port).trigger("change");
                        }
                    }, 100);

                    fieldPropertiesDialog.find("#remoteVFSItem_option_use_dmz").unbind('change.custom').bind("change.custom", function(evt){
                        var that = $(this);
                        if ($(this).find(":selected").attr("_rel") == "custom") {
                            var dmzCustomOptions = $("#dmzCustomOptionsFileBrowser").dialog("open");
                            var val = that.val();
                            if(that.val() != "")
                            {
                                if(val == "internal://")
                                {
                                    dmzCustomOptions.find("#customDMZType").val("internal://").change();
                                    dmzCustomOptions.find("#customDMZHost").val("");
                                    dmzCustomOptions.find("#customDMZPort").val("");
                                    dmzCustomOptions.find("#customDMZVariable").val("");
                                }
                                else if(val.indexOf("variable")==0)
                                {
                                    dmzCustomOptions.find("#customDMZType").val("variable").change();
                                    dmzCustomOptions.find("#customDMZHost").val("");
                                    dmzCustomOptions.find("#customDMZPort").val("");
                                    dmzCustomOptions.find("#customDMZVariable").val(val.replace("variable:", ""));
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
                                    dmzCustomOptions.find("#customDMZVariable").val("");
                                }
                            }
                            window.afterCustomDMZSelectionWIFB = function(canceled){
                                if(canceled)
                                {
                                    if(val == "custom")
                                        that.val("false");
                                }
                                else
                                {
                                    var type = dmzCustomOptions.find("#customDMZType").val();
                                    var host =  dmzCustomOptions.find("#customDMZHost").val();
                                    var variable = dmzCustomOptions.find("#customDMZVariable").val();
                                    var port =  dmzCustomOptions.find("#customDMZPort").val();
                                    var DMZValue = type;
                                    if(type == "socks5")
                                    {
                                        if(port.length>0)
                                            DMZValue = "socks://" + host + ":" + port;
                                        else
                                            DMZValue = "socks://" + host;
                                    }
                                    else if(type == "variable")
                                    {
                                        DMZValue = "variable:" + variable;
                                    }
                                    that.find(":selected").attr("value", DMZValue);
                                    that.find(":selected").text(DMZValue + " (custom)");
                                    that.trigger('change');

                                    dmzCustomOptions.find("#customDMZHost").val("");
                                    dmzCustomOptions.find("#customDMZPort").val("");
                                    dmzCustomOptions.find("#customDMZVariable").val("")
                                }
                            };
                            evt.preventDefault();
                            evt.stopPropagation();
                            return false;
                        };
                    });

                    fieldPropertiesDialog.find("#remoteVFSItem_option_verifyHost").unbind().change(function(event) {
                        if($(this).is(":checked"))
                            fieldPropertiesDialog.find(".onlyVerifyHost").show();
                        else
                            fieldPropertiesDialog.find(".onlyVerifyHost").hide();
                    }).trigger('change');
                }
            }

            var dmzCustomOptions = $("#dmzCustomOptionsFileBrowser", fieldPropertiesDialog).form().dialog({
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
                    setTimeout(function(){
                        dmzCustomOptions.find("#customDMZType").change();
                    }, 100);
                },
                create: function(event, ui) {
                    $(event.target).parent().css('position', 'fixed');
                },buttons : {
                    "OK" : function(){
                        // if(dmzCustomOptions.find("#customDMZType").val() == "variable")
                        // {
                        //     var val = $("#customDMZVariable", dmzCustomOptions).val();
                        //     if(val.indexOf("{")!=0 && val.lastIndexOf("}")!= val.length)
                        //     {
                        //         alert("Enter valid variable.");
                        //         $("#customDMZVariable", dmzCustomOptions).select().focus();
                        //         return false;
                        //     }
                        // }
                        if(window.afterCustomDMZSelectionWIFB)
                        {
                            window.afterCustomDMZSelectionWIFB();
                            delete window.afterCustomDMZSelectionWIFB;
                        }
                        $(this).dialog("close");
                    },
                    "Cancel" : function(){
                        $(this).dialog("close");
                    }
                },
                close : function(){
                    setTimeout(function(){
                        if(window.afterCustomDMZSelectionWIFB)
                            window.afterCustomDMZSelectionWIFB(true);
                    },100);
                },
                resizeStop: function(event, ui) {
                    var position = [(Math.floor(ui.position.left) - $(window).scrollLeft()),
                                     (Math.floor(ui.position.top) - $(window).scrollTop())];
                    $(event.target).parent().css('position', 'fixed');
                    $(dlg).dialog('option','position',position);
                }
            });

            dmzCustomOptions.find("#customDMZType").unbind().change(function(){
                dmzCustomOptions.find("div.socksOptions").hide();
                dmzCustomOptions.find("div.variableOptions").hide();
                if($(this).val() == "socks5"){
                    dmzCustomOptions.find("div.socksOptions").show();
                }
                else if($(this).val() == "variable"){
                    dmzCustomOptions.find("div.variableOptions").show();
                }
            });

            fieldPropertiesDialog.find("#remoteVFSItem_option_s3serverURL").unbind().change(function(){
                var val = $(this).val();
                $(this).attr('lastSelected', val);
                buildPropertiesURL();
            });

            fieldPropertiesDialog.find("#remoteVFSItem_option_glacierServerURL").unbind().change(function(){
                var val = $(this).val();
                $(this).attr('lastSelected', val);
                buildPropertiesURL();
            });

            fieldPropertiesDialog.find("#remoteVFSItem_option_url").focus(function(){
                if ($(this).val().indexOf("s3")==0)
                    $(this).closest("td").find("#warningText").show();
            }).bind("blur", function(){
                $(this).closest("td").find("#warningText").hide();
            }).bind("textchange",function(){
                buildPropertiesURLReverse();
            });

            fieldPropertiesDialog.dialog({
                autoOpen: false,
                width: 700,
                modal: true,
                resizable: false,
                closeOnEscape: false,
                title : "Browse Remote Item : ",
                buttons: {
                    "Cancel" : function(){
                        $("#browsePopupFTPDialog").dialog("close");
                        $("#browsePopupFTPDialog").remove();
                        $(this).dialog("close");
                    },
                    "Connect": function() {
                        if(fieldPropertiesDialog.find(".ui-state-error:visible").length>0)
                        {
                            crushFTP.UI.growl("Error : ", "Fix the errors on form to continue", true, 2000);
                            return false;
                        }
                        var that = $(this);
                        fieldPropertiesDialog.find(".ftpCredentials,.s3Credentials,.gdriveCredentials").find("input:not(#remoteVFSItem_option_url,#remoteVFSItem_option_url_static,#remoteVFSItem_option_name_static,#remoteVFSItem_option_type_static,#remoteVFSItem_option_s3_bucket,#remoteVFSItem_option_s3_path,#remoteVFSItem_option_server_side_encrypt_kms)").each(function(){
                            var fixedChars = fixChars($(this).val());
                            $(this).val(fixedChars);
                        })
                        buildPropertiesURL();
                        fieldPropertiesDialog.data("options", opts);
                        function continueProcess()
                        {
                            var name = $("#remoteVFSItem_option_name_static", fieldPropertiesDialog).val();
                            var newName = $("#remoteVFSItem_option_name", fieldPropertiesDialog).val();
                            var urlField = $("#remoteVFSItem_option_url", fieldPropertiesDialog);
                            var shareNameField = $("#remoteVFSItem_option_sharename", fieldPropertiesDialog);
                            var S3Selected = $("#remoteVFSItem_option_itemType", fieldPropertiesDialog).val() == "s3" || $("#remoteVFSItem_option_itemType", fieldPropertiesDialog).val() == "s3crush";
                            var url = unescape(urlField.val());
                            if(url.lastIndexOf("/") != url.length - 1)
                            {
                                url = url + "/";
                            }
                            urlField.val(url);
                            var path = unescape($("#remoteVFSItem_option_path", fieldPropertiesDialog).val());
                            if(S3Selected){
                                path = $("#remoteVFSItem_option_s3_path", fieldPropertiesDialog).val();
                                var bucket = $("#remoteVFSItem_option_s3_bucket", fieldPropertiesDialog).val();
                                if(bucket && bucket.length>0)
                                {
                                    if(bucket.lastIndexOf("/") != bucket.length - 1 && path.indexOf("/") != 0)
                                    {
                                        path = bucket+ "/" + path;
                                    }
                                    else
                                        path = bucket + path;
                                }
                            }
                            if(path.lastIndexOf("/") != path.length - 1)
                            {
                                path = path + "/";
                            }
                            if(base.getFileExtension(path)!="" || path.lastIndexOf("/")>=0)
                            {
                                path = path.substring(0, path.lastIndexOf("/"));
                            }
                            if(!path || path.lastIndexOf("/") != path.length - 1)
                            {
                                path = path + "/";
                            }
                            path = path.replace(/\\/g,'/');
                            var isUNC = path.indexOf("//") == 0;
                            // path = path.replace(/\/\//g,'/');
                            if(isUNC)
                            {
                                if(url.indexOf("//") == 0 || url.indexOf("////") == 0){
                                    url = "file:" + path;
                                }
                                else
                                    url = "file:/" + path;

                                urlField.val(url);
                                $("#remoteVFSItem_option_path", fieldPropertiesDialog).val(path);
                                $("#" + base.thisElemId).data("isUNC", true);
                            }
                            else
                            {
                                $("#" + base.thisElemId).removeData("isUNC");
                            }
                            $("#remoteVFSItem_option_path", fieldPropertiesDialog).val(path);
                            base.options.existingVal = path;
                            var expireDate = $("#vfs_expire", fieldPropertiesDialog).val();
                            $("#remoteVFSItem_option_itemType", fieldPropertiesDialog).trigger("change");
                            if(crushFTP.methods.hasSpecialCharacters(newName, notAllowedCharsInDirName))
                            {
                                jAlert("You can not use these characters in name : \"" + notAllowedCharsInDirName + "\"", "Invalid name", function(){
                                    $("#remoteVFSItem_option_name", fieldPropertiesDialog).focus();
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

                            if(S3Selected)
                            {
                                fieldPropertiesDialog.find(".privateOptions").find("input").addClass("excludeXML");
                                fieldPropertiesDialog.find("*[name*='s3']").removeClass("excludeXML");
                                fieldPropertiesDialog.find(".s3Credentials").find(".excludeXML").removeClass("excludeXML");
                                if($("#remoteVFSItem_option_itemType", fieldPropertiesDialog).val() == "s3crush")
                                {
                                    fieldPropertiesDialog.find(".s3CrushCredentials").find(".excludeXML").removeClass("excludeXML");
                                }
                            }
                            else
                            {
                                fieldPropertiesDialog.find("*[name*='s3']").addClass("excludeXML");
                                fieldPropertiesDialog.find(".privateOptions").find("input").removeClass("excludeXML");
                            }
                            var GdriveSelected = $("#remoteVFSItem_option_itemType", fieldPropertiesDialog).val() == "gdrive";
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
                            fieldPropertiesDialog.find("#remoteVFSItem_option_port").removeClass("excludeXML");
                            var citrixSelected = $("#remoteVFSItem_option_itemType", fieldPropertiesDialog).val() == "citrix";
                            if(citrixSelected)
                            {
                                fieldPropertiesDialog.find("#remoteVFSItem_option_client_id, #remoteVFSItem_option_client_secret").removeClass("excludeXML");
                                fieldPropertiesDialog.find("#remoteVFSItem_option_port").addClass("excludeXML");
                            }
                            var hadoopSelected = $("#remoteVFSItem_option_itemType", fieldPropertiesDialog).val() == "hadoop";
                            if(hadoopSelected)
                            {
                                fieldPropertiesDialog.find(".hadoopOption").find("input").removeClass("excludeXML");
                            }
                            else
                            {
                                fieldPropertiesDialog.find(".hadoopOption").find("input").addClass("excludeXML");
                            }
                            var SSLOptionSelected = $("#remoteVFSItem_option_itemType", fieldPropertiesDialog).val() == "ftps" || $("#remoteVFSItem_option_itemType", fieldPropertiesDialog).val() == "https" || $("#remoteVFSItem_option_itemType", fieldPropertiesDialog).val() == "webdavs" || $("#remoteVFSItem_option_itemType", fieldPropertiesDialog).val() == "ftpes";
                            var ftpSelected = $("#remoteVFSItem_option_itemType", fieldPropertiesDialog).val() == "ftp";
                            if(SSLOptionSelected || (ftpSelected && $("#remoteVFSItem_option_ftpEncryption", fieldPropertiesDialog).val() == "true"))
                            {
                                fieldPropertiesDialog.find(".SSLOptions").find("input").removeClass("excludeXML");
                            }
                            else
                            {
                                fieldPropertiesDialog.find(".SSLOptions").find("input").addClass("excludeXML");
                            }
                            if(ftpSelected)
                            {
                                fieldPropertiesDialog.find(".ftpOptions").find("select, input").removeClass("excludeXML");
                            }
                            else
                            {
                                fieldPropertiesDialog.find(".ftpOptions").find("select, input").addClass("excludeXML");
                            }
                            var AzureSelected = $("#remoteVFSItem_option_itemType", fieldPropertiesDialog).val() == "azure";
                            if(AzureSelected){
                                var shareName = shareNameField.val();
                                if(shareName.indexOf("/") !=0 )
                                    shareName = "/" + shareName;
                                url = url.replace("file.core.windows.net", "file.core.windows.net" + shareName);
                                url = url.replace("blob.core.windows.net", "blob.core.windows.net" + shareName);
                                urlField.val(url);
                            }
                            var urlFieldName = urlField.attr("_name");
                            urlField.attr("_name", "url");
                            var itemProperties;
                            if(typeof window.userManager != "undefined")
                                itemProperties = userManager.data.buildXMLToSubmitForm(fieldPropertiesDialog, true, "_name");
                            else if(typeof window.adminPanel != "undefined")
                                itemProperties = adminPanel.data.buildXMLToSubmitForm(fieldPropertiesDialog, true, "_name");
                            else if(typeof window.buildXMLToSubmitForm != "undefined")
                                itemProperties = buildXMLToSubmitForm(fieldPropertiesDialog, true, "_name");
                            else
                            {
                                alert("No library available for : buildXMLToSubmitForm");
                                return false;
                            }
                            var type = "DIR";
                            if(url.lastIndexOf("/") != url.length - 1 && url.lastIndexOf("\\") != url.length - 1)
                                type = "file";
                            var itemPropertiesJSON = $.xml2json("<item>" +  unescape(itemProperties) + "<type>" + type + "</type>" + "</item>");
                            url = unescape(url);
                            if(url.toLowerCase().indexOf("file:")==0)
                            {
                                itemPropertiesJSON.path = unescape($("#remoteVFSItem_option_path", fieldPropertiesDialog).val());
                            }
                            else
                            {
                                var value = url;
                                var val = value;
                                try{
                                    val = URI(value);
                                }catch(ex){
                                    val = URI(encodeURI(value));
                                }
                                itemPropertiesJSON.path = val.path();
                            }
                            var host = itemPropertiesJSON.host;
                            try{
                                if(itemPropertiesJSON.filePath)
                                    host = URI(itemPropertiesJSON.filePath).hostname();
                            }catch(ex){}
                            itemPropertiesJSON.host = host;
                            if(urlFieldName != "url")
                                itemPropertiesJSON[urlFieldName] = itemPropertiesJSON.url;

                            var suggestions = fieldPropertiesDialog.find(".suggested:visible").find("#suggestedSettingsUsed").find("li");
                            if(suggestions && suggestions.length>0){
                                suggestions.each(function(){
                                    itemPropertiesJSON[$(this).attr("key")] = $(this).attr("_value");
                                });
                            }

                            var removedSuggestions = fieldPropertiesDialog.find(".suggested:visible").find("#suggestedSettingsAvailable").find("li");
                            if(removedSuggestions && removedSuggestions.length>0){
                                removedSuggestions.each(function(){
                                    delete itemPropertiesJSON[$(this).attr("key")];
                                });
                            }
                            var browsePanel = $("#" + base.thisElemId);
                            browsePanel.removeData("isUNC");
                            browsePanel.data("ftpServerInfo", itemPropertiesJSON);
                            browsePanel.data("ftpServerInfoInit", true);
                            browsePanel.dialog("open");
                            urlField.attr("_name", urlFieldName);
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
                },
                beforeClose : function(){
                    return true;
                },
                close: function(){
                    fieldPropertiesDialog.find("#remoteVFSItem_option_s3serverURL").removeAttr('lastSelected');
                    fieldPropertiesDialog.find("#remoteVFSItem_option_glacierServerURL").removeAttr('lastSelected');
                },
                open: function(){
                    $([document, window]).unbind('.dialog-overlay');
                    bindFTPFormData();
                    showHideItemPropertiesSettings();
                    fieldPropertiesDialog.find(".tabs").tabs();
                    $("a.serverFilePickButton", fieldPropertiesDialog).each(function(){
                        $(this).unbind().click(function(){
                            var curElem = $(this);
                            var opts = $("#browsePopupFTPDialog").data("options");
                            $("#browsePopupFTPDialog").removeData("options");
                            curElem.crushFtpLocalFileBrowserPopup({
                                type : curElem.attr("PickType") || 'dir',
                                file_mode : curElem.attr("FileMode") || 'server',
                                existingVal : $("#" + curElem.attr("rel"), fieldPropertiesDialog).val(),
                                callback : function(selectedPath){
                                    $("#" + curElem.attr("rel"), fieldPropertiesDialog).val(selectedPath).trigger("change");
                                    $("#browsePopupFTPDialog").data("options", opts);
                                },
                                callbackClose : function(){
                                    $("#browsePopupFTPDialog").data("options", opts);
                                }
                            });
                            return false;
                        });
                    });
                    fieldPropertiesDialog.dialog("option", "position", "center");
                    fieldPropertiesDialog.find(".refreshGoogleToken").unbind().click(function(){
                        base.refreshGoogleToken(fieldPropertiesDialog);
                        return false;
                    });
                    fieldPropertiesDialog.find(".refreshCitrixToken").unbind().click(function(){
                        base.refreshCitrixToken(fieldPropertiesDialog);
                        return false;
                    });
                    var curItemData = base.options.existingData;
                    fieldPropertiesDialog.find(".sftp-suggested-settings").suggestedSettings({
                        suggestions : configSuggestions.sftp,
                        existing: curItemData
                    });
                }
            });

            $("#remoteVFSItem_option_itemType", fieldPropertiesDialog).unbind().change(function(){
                if($(this).val() == "azure"){
                    var curHost = $("#remoteVFSItem_option_host", fieldPropertiesDialog).val();
                    if(!curHost || curHost.indexOf("windows.net")<0){
                        $("#remoteVFSItem_option_host", fieldPropertiesDialog).val("file.core.windows.net");
                    }
                }
                showHideItemPropertiesSettings();
                if(!$(this).hasClass('notextChange'))
                    buildPropertiesURL();
            });

            fieldPropertiesDialog.find("#remoteVFSItem_option_user_name, #remoteVFSItem_option_password, #remoteVFSItem_option_secretKeyID, #remoteVFSItem_option_secretKey, #remoteVFSItem_option_path, #remoteVFSItem_option_port, #remoteVFSItem_option_host, #remoteVFSItem_option_gdrive_secretKeyID, #remoteVFSItem_option_gdrive_secretKey, #remoteVFSItem_option_s3_bucket, #remoteVFSItem_option_s3_path, #remoteVFSItem_option_client_secret, #remoteVFSItem_option_client_id").unbind().bind("textchange", function(){
                if($(this).hasClass('notextChange'))return false;
                if($(this).is("#remoteVFSItem_option_s3_bucket"))
                {
                    var val = $(this).val().toLowerCase();
                    $(this).val(val);
                    if(crushFTP.methods.hasSpecialCharacters(val, "!@#$%^&*()+=[]\\\';,/{}|\":<>?~"))
                    {
                        $(this).addClass('ui-state-error').closest("td").find(".error").show();
                        return;
                    }
                    else
                    {
                        $(this).removeClass('ui-state-error').closest("td").find(".error").hide();
                    }
                    // return;
                }
                buildPropertiesURL();
            }).bind("blur", function(){
                $(this).val($.trim($(this).val())).trigger('textchange');
            });

        };

        base.refreshCitrixToken = function(dialog){
            var client_id = dialog.find("#remoteVFSItem_option_client_id").val() || "";
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
                        dialog.find("#remoteVFSItem_option_client_secret").val(code).trigger("textchange");
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

        base.refreshGoogleToken = function(dialog){
            var baseURL = window.location.protocol + "//" + window.location.host + "/";
            var curURL = baseURL + "%3Fcommand%3Dregister_gdrive_api";
            var google_client_id = dialog.find("#remoteVFSItem_option_gdrive_secretKeyID").val().split("~")[0];
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
                    google_client_info: dialog.find("#remoteVFSItem_option_gdrive_secretKeyID").val(),
                    serverGroup : $("#userConnectionGroups").val() || "MainUsers",
                    server_url : curURL
                },
                function(data){
                    var code = data ? $.trim($(data).find("response").text()) : "";
                    if(data && code && code != "null")
                    {
                        dialog.find("#remoteVFSItem_option_gdrive_secretKey").val(code).trigger("textchange");
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

        base.listDevices = function() {
            var browsePanel = $("#" + base.thisElemId);
            var listElem = browsePanel.find('ul.devices');
            var deviceListHolder = listElem.parent().hide();
            if(base.options.isFTPBrowse || base.options.syncOpts)
            {
                base.bindListingEvents();
                return false;
            }
            if (base.options.useApplet && typeof window.runAppletCommand != "undefined") {
                if(!!navigator.userAgent.match(' Safari/') && !navigator.userAgent.match(' Chrom'))
                {
                    var apps = runAppletCommand(true, "COMMAND=LIST:::PATH=/Applications") + "";
                    if($.trim(apps).length==0)
                    {
                        var browsePanel = $("#" + base.thisElemId);
                        browsePanel.find(".loadingFS").hide();
                        browsePanel.find(".safari7Help").show();
                        return false;
                    }
                }
                var items = runAppletCommand(true, "COMMAND=LIST:::PATH=/Volumes");
                if (items && items.length > 0) {
                    items = items.split(";;;");
                    for (var i = 0; i < items.length; i++) {
                        items[i] = items[i].split(":::");
                    }
                    for (var j = 0; j < items.length; j++) {
                        var strItem = items[j];
                        var item = {};
                        for (var i = 0; i < strItem.length; i++) {
                            var curItem = strItem[i];
                            if (curItem) {
                                var ind = curItem.indexOf("=");
                                if (ind >= 0) {
                                    var key = curItem.substring(0, ind);
                                    var val = curItem.substring(ind + 1, curItem.length);
                                    item[key] = val;
                                }
                            }
                        };
                        items[j] = item;
                    }
                    if (items && items.length > 0) {
                        items = items.sort(function(a,b){return a.name.toLowerCase()<b.name.toLowerCase();});
                        for (var i = 0; i < items.length; i++) {
                            var curItem = items[i];
                            if(curItem.name.indexOf(".")!=0)
                            {
                                var curHTML = $('<li rel="' + curItem.path + '">' + curItem.name + '</li>');
                                curHTML.data("curData", curItem);
                                listElem.append(curHTML);
                            }
                        };
                        deviceListHolder.slideDown('slow');
                    }
                }
            }
            else
            {
                if(parent && parent.$.CrushFTPOS)
                   $.CrushFTPOS = parent.$.CrushFTPOS;
                var path = "/Volumes/";
                if($.CrushFTPOS == "windows")
                    path = "/";
                else if($.CrushFTPOS == "linux")
                    path = "/mnt/";
                else if($.CrushFTPOS == "mac")
                    path = "/";
                else
                {
                    deviceListHolder.hide();
                    return false;
                }
                var obj = {
                    command: "getAdminXMLListing",
                    format: "JSON",
                    file_mode : base.options.file_mode,
                    path: path,
                    random: Math.random()
                };
                //obj.path = crushFTP.methods.htmlEncode(unescape(obj.path)).replace(/\+/g, "%2B");
                obj.path = encodeURIComponent(unescape(obj.path)).replace(/\+/g, "%2B");
                obj.c2f = crushFTP.getCrushAuth();
                $.ajax({
                    type: "POST",
                    url: base.ajaxCallURL,
                    data: obj,
                    success: function (msg){
                        if (msg && msg.childNodes && msg.childNodes.length > 0) {
                            var items = $(msg).find("listing").text();
                            if(items)
                            {
                                items = items.replace(/\n/g,' ').replace(/\s/g,' ');
                                eval(items);
                                if(l && jQuery.isArray(l))
                                {
                                    items = l;
                                    if (items && items.length > 0) {
                                        for (var i = 0; i < items.length; i++) {
                                            var curItem = items[i];
                                            if(curItem.type)
                                                curItem.type = curItem.type.toLowerCase();
                                            if(curItem.href_path)
                                            {
                                                curItem.path = curItem.href_path;
                                                if(curItem.type == "dir" && curItem.path.lastIndexOf("/")!=curItem.path.length-1)
                                                {
                                                    curItem.path = path + curItem.name + "/";
                                                }
                                                else if(curItem.type == "file")
                                                {
                                                    curItem.path = path + curItem.name;
                                                }
                                                var isUNC = browsePanel.data("isUNC");
                                                if(isUNC)
                                                {
                                                    curItem.path = "/" + curItem.path;
                                                }
                                            }
                                            if(curItem.name.indexOf(".")!=0)
                                            {
                                                var curHTML = $('<li rel="' + curItem.path + '">' + curItem.name + '</li>');
                                                if(curItem.boot == "true")
                                                {
                                                    curHTML = $('<li isBoot="true" rel="/' + curItem.name  + '/">' + curItem.name + '</li>');
                                                }
                                                curHTML.data("curData", curItem);
                                                listElem.append(curHTML);
                                            }
                                        };
                                        deviceListHolder.slideDown('slow');
                                        base.bindListingEvents();
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }

        base.listItems = function(pathToLoad, quickAccess, fromCookie, isBoot) {
            $("#cluetip").hide();
            var opts = options;
            var defaultDir = "/";
            var browsePanel = $("#" + base.thisElemId);
            var isFtpBrowse = opts && opts.isFTPBrowse;
            var serverInfo = browsePanel.data("ftpServerInfo");
            if(opts && serverInfo && serverInfo.url && serverInfo.url.toLowerCase().indexOf("file")==0)
                isFtpBrowse = false;
            opts.isFTPBrowse = isFtpBrowse;
            if (!opts.useApplet && !isFtpBrowse && !opts.syncOpts)
            {
                defaultDir = crushFTP.serverConfig && crushFTP.serverConfig.userRoot ? crushFTP.serverConfig.userRoot.split(";")[0] : "/";
            }
            if(base.options.file_mode == "server"){
                defaultDir = crushFTP.serverConfig && crushFTP.serverConfig.serverRoot ? crushFTP.serverConfig.serverRoot.split(";")[0] : "/";
            }
            else{
                defaultDir = crushFTP.serverConfig && crushFTP.serverConfig.userRoot ? crushFTP.serverConfig.userRoot.split(";")[0] : "/";
            }
            pathToLoad = pathToLoad || defaultDir;
            var dropdown = browsePanel.find(".dropdown");
            if (pathToLoad == "/") {
                dropdown.empty().append("<option value='/'>/</option>");
            }
            // if(pathToLoad.indexOf("////")==0)
            //     pathToLoad = pathToLoad.replace("////", "//");
            var okBtn = $("div.localFileBrowserPopup:visible").find(".ui-dialog-buttonset").find("button:last");
            base.curLoadedPath = pathToLoad;
            if (opts.useApplet && typeof window.runAppletCommand != "undefined") {
                browsePanel.find(".loadingFS").show();
                setTimeout(function() {
                    if(quickAccess)
                    {
                        dropdown.find("option[value='/']:first").nextAll("option").remove();
                    }
                    var items = runAppletCommand(true, "COMMAND=LIST:::PATH=" + pathToLoad);
                    if (items && items.length > 0) {
                        items = items.split(";;;");
                        for (var i = 0; i < items.length; i++) {
                            items[i] = items[i].split(":::");
                        }
                        for (var j = 0; j < items.length; j++) {
                            var strItem = items[j];
                            var item = {};
                            for (var i = 0; i < strItem.length; i++) {
                                var curItem = strItem[i];
                                if (curItem) {
                                    var ind = curItem.indexOf("=");
                                    if (ind >= 0) {
                                        var key = curItem.substring(0, ind);
                                        var val = curItem.substring(ind + 1, curItem.length);
                                        item[key] = val;
                                    }
                                }
                            };
                            items[j] = item;
                        }
                        base.renderListing(items, pathToLoad);
                    } else {
                        base.renderListing([], pathToLoad);
                    }
                    if(pathToLoad){
                        if(!pathToLoad.startsWith("/"))
                            pathToLoad = "/" + pathToLoad;
                        if(!pathToLoad.endsWith("/"))
                            pathToLoad = pathToLoad + "/";
                    }
                    if(pathToLoad && pathToLoad.indexOf("/cfhd/")==0)
                        pathToLoad = pathToLoad.replace("/cfhd", "");
                    var _path = pathToLoad.split("/");
                    dropdown.empty();
                    if(_path.length>0)
                    {
                        var items = [];
                        for (var i = 0; i < _path.length; i++) {
                            var calPath = "/" + _path.slice(1, i+1).join("/");
                            if(calPath.lastIndexOf("/")!=calPath.length-1)
                            {
                                calPath = calPath + "/";
                            }
                            if(dropdown.find("option[value='"+escape(calPath)+"']").length==0)
                            {
                                if(i == _path.length-1)
                                    dropdown.append("<option selected value='" + escape(calPath) + "'>" + unescape(calPath) + "</option>");
                                else
                                    dropdown.append("<option value='" + escape(calPath) + "'>" + unescape(calPath) + "</option>");
                            }
                            else
                            {
                                dropdown.find("option[value='"+escape(calPath)+"']").attr('selected', 'selected');
                            }
                        };
                    }
                    else
                    {
                        dropdown.append("<option value='/'>/</option>");
                    }
                    if(!quickAccess)
                    {
                        browsePanel.find(".quickLinkActive").removeClass('quickLinkActive');
                    }
                    if(base.options.type == "file")
                    {
                        okBtn.attr("disabled","disabled").addClass("ui-state-disabled");
                    }
                    else
                    {
                        okBtn.removeAttr("disabled").removeClass("ui-state-disabled");
                    }
                    setTimeout(function() {
                        browsePanel.find(".loadingFS").hide();
                    }, 10);
                }, 10);
            }
            else if(opts.isFTPBrowse || opts.syncOpts)
            {
                browsePanel.find(".loadingFS").show();
                var obj = {
                    command: "getAdminXMLListing",
                    file_mode : base.options.file_mode,
                    format: "JSON",
                    path: pathToLoad,
                    random: Math.random()
                };
                if(opts.isServerBrowse)
                {
                    obj.command = "getXMLListing";
                }
                else if(opts.syncOpts)
                {
                    obj = {
                        command: "getAdminXMLListing",
                        file_mode : base.options.file_mode,
                        format: "JSON",
                        get_from_agentid : opts.syncOpts.syncData.clientid,
                        admin_password : encodeURIComponent(opts.syncOpts.password),
                        path: pathToLoad,
                        random: Math.random()
                    };
                }
                if(opts.isFTPBrowse && browsePanel.data("ftpServerInfo"))
                {
                    opts.ftpServerInfo = browsePanel.data("ftpServerInfo");
                    obj.serverGroup = $("#mainServerInstance").val() || "MainUsers";
                    obj.username = crushFTP.storage("username");
                    obj.command = "getUserXMLListing";
                    var isParentDir = false;
                    var isUNC = browsePanel.data("isUNC");
                    var isInit;
                    if(browsePanel.data("ftpServerInfoInit"))
                    {
                        isInit = true;
                        var providedPath = opts.ftpServerInfo.path;
                        var ignoreExistingPaths = ["/builtin/", "/{path}/", "{path}", "{path}/"];
                        if(ignoreExistingPaths.has($.trim(providedPath).toLowerCase()))
                        {
                            providedPath = "/";
                        }
                        if(providedPath)
                        {
                            var toCheckExtension = providedPath;
                            if(opts.type == "file" && providedPath.lastIndexOf("/")==providedPath.length-1)
                            {
                                toCheckExtension = providedPath.substring(0, providedPath.lastIndexOf("/"));
                            }
                            if(base.getFileExtension(toCheckExtension)!="")
                            {
                                providedPath = toCheckExtension.substring(0, toCheckExtension.lastIndexOf("/"));
                            }
                            if(providedPath.lastIndexOf("/") != providedPath.length - 1)
                            {
                                providedPath = opts.ftpServerInfo.path = providedPath + "/";
                            }
                            if(providedPath.indexOf("/") != 0)
                                providedPath = "/" + providedPath;
                            obj.path = providedPath;
                        }
                        browsePanel.removeData("ftpServerInfoInit");
                        isUNC = opts.ftpServerInfo.path.indexOf("//") == 0;
                        browsePanel.data("isUNC", isUNC);
                    }
                    var item = opts.ftpServerInfo;
                    var xml = "";
                    var bucket;
                    var isDirBrowse = false;
                    if(item)
                    {
                        var path = pathToLoad || "/";
                        if(quickAccess)
                            path = item.path || "/";
                        var attr = "url";
                        var itemType = item[attr].toLowerCase().indexOf("file:")==0 ? "DIR" : undefined;
                        if(typeof itemType != "undefined" && itemType != "DIR" && path.indexOf("/cfhd/")<0){
                            if(path.indexOf("/")==0)
                                path = "/cfhd" + path;
                            else
                                path = "/cfhd/" + path;
                        }
                        if(typeof itemType != "undefined")
                            delete item.type;
                        path = path.replace(/\/\//g,'/');
                        if(itemType == "DIR")
                        {
                            if(url.indexOf("//") == 0 || url.indexOf("////") == 0){
                                url = "file:" + path;
                                item.url = item[attr] = "file:" + item.path;
                            }
                            else
                                item.url = item[attr] = "file:/" + item.path;

                            if(typeof item.host != "undefined")
                                delete item.host;
                            if(typeof item.port != "undefined")
                                delete item.port;
                        }
                        var urlAdded = false;
                        if(item.url && item.url.toLowerCase().indexOf("file:")==0)
                        {
                            var _path = unescape(obj.path);
                            if(_path.indexOf("/cfhd/")==0)
                            {
                                _path = _path.replace("/cfhd/", "");
                            }
                            if(url.indexOf("//") == 0 || url.indexOf("////") == 0){
                                url = "file:" + path;
                                item.url = item[attr] = "file:" + _path;
                            }
                            else
                                item.url = item[attr] = "file:/" + _path;
                            obj.path = "/cfhd/";
                        }
                        else if(obj.path.indexOf("/cfhd/")<0)
                        {
                            if(isInit && item.url && item.url.toLowerCase().indexOf("s3://")===0)
                            {
                                var paths = pathToLoad.split("/").removeByVal("");
                                bucket = paths.shift();
                                paths.splice(0,0,"");
                                paths.push("");
                                pathToLoad = paths.join("/");
                                var url = item.url;
                                try{
                                    url = URI(url);
                                }catch(ex){
                                    url = URI(encodeURI(url));
                                }
                                item.url = item.url.substr(0, item.url.lastIndexOf(url.path())) + "/" + bucket + "/";
                            }
                            if(pathToLoad.indexOf("/")==0)
                                obj.path = "/cfhd" + pathToLoad;
                            else
                                obj.path = "/cfhd/" + pathToLoad;
                        }
                        xml += "\r\n<vfs_items_subitem type=\"properties\">";
                            xml += "\r\n<name>"+crushFTP.methods.htmlEncode(unescape(crushFTP.methods.decodeXML("cfhd"))).replace(/\+/g, "%2B")+"</name>";
                            xml += "\r\n<path>"+crushFTP.methods.htmlEncode(unescape(crushFTP.methods.decodeXML("/"))).replace(/\+/g, "%2B")+"</path>";
                            xml += "\r\n<vfs_item type=\"vector\">";
                                xml += "\r\n<vfs_item_subitem type=\"properties\">";
                                    if(item.url && item.url.toLowerCase().indexOf("s3://")===0)
                                    {
                                        delete item.port;
                                    }
                                    for(var prop in item)
                                    {
                                        if(prop && prop != "name" && prop != "path")
                                        {
                                            var val = crushFTP.methods.htmlEncode(unescape(crushFTP.methods.decodeXML(item[prop]))).replace(/\+/g, "%2B");
                                            if(prop == "url" || prop == "destPath" || prop == "findUrl")
                                            {
                                                if(!urlAdded)
                                                {
                                                    prop = "url";
                                                    if(!isUNC)
                                                    {
                                                        if(itemType != "DIR")
                                                        {
                                                            var value = val;
                                                            var url = value;
                                                            try{
                                                                url = URI(value);
                                                            }catch(ex){
                                                                url = URI(encodeURI(value));
                                                            }
                                                            if(item.url && item.url.toLowerCase().indexOf("s3://")!==0)
                                                                val = val.substr(0, val.lastIndexOf(url.path())) + "/";
                                                            if(url.protocol() == "azure"){
                                                                var shareName = item.shareName || "";
                                                                if(shareName && !shareName.endsWith("/"))
                                                                    shareName = shareName + "/";
                                                                if(shareName && shareName.startsWith("/"))
                                                                    shareName = shareName.substr(1);
                                                                val += shareName;
                                                            }
                                                        }
                                                        else
                                                        {
                                                            xml += "\r\n<type>DIR</type>";
                                                            isDirBrowse = true;
                                                        }
                                                        item.url = val;
                                                    }
                                                    else
                                                    {
                                                        if(url.indexOf("//") == 0 || url.indexOf("////") == 0){
                                                            url = "file:" + path;
                                                            item.url = val = "file:" + path;
                                                        }
                                                        else
                                                            item.url = val = "file:/" + path;
                                                    }
                                                    xml += "\r\n<"+prop+">" + val + "</"+prop+">";
                                                    urlAdded = true;
                                                }
                                            }
                                            else if(prop != "type" && prop != "findUrl" && prop != "destPath")
                                            {
                                                xml += "\r\n<"+prop+">" + val + "</"+prop+">";
                                            }
                                        }
                                    }
                                xml += "\r\n</vfs_item_subitem>";
                            xml += "\r\n</vfs_item>";
                        xml += "\r\n</vfs_items_subitem>";
                    }
                    if(isUNC)
                        obj.path = "/cfhd/";
                    obj.path = obj.path.replace(/\/\//g,'/');
                    obj.permissions = '<?xml version="1.0" encoding="UTF-8"?><VFS type="properties"><item name="/">(read)(view)(resume)</item></VFS>';
                    obj.vfs_items = '<?xml version="1.0" encoding="UTF-8"?><vfs_items type="vector">'+xml+'</vfs_items>';

                    browsePanel.data("ftpServerInfo", obj.ftpServerInfo);
                }

                // obj.path = crushFTP.methods.htmlEncode(unescape(obj.path)).replace(/\+/g, "%2B");
                // if(opts.isServerBrowse)
                // {
                //     obj.path = encodeURIComponent(unescape(obj.path)).replace(/\+/g, "%2B");
                // }
                obj.path = encodeURIComponent(unescape(obj.path)).replace(/\+/g, "%2B");
                base.remoteLoadedPath = obj.path;
                /* Make a call and receive list */
                obj.c2f = crushFTP.getCrushAuth();
                $.ajax({
                    type: "POST",
                    url: base.ajaxCallURL,
                    data: obj,
                    success: function (msg){
                        setTimeout(function() {
                            browsePanel.find(".loadingFS").hide();
                        }, 10);
                        base.reloaded = false;
                        if (msg && msg.childNodes && msg.childNodes.length > 0) {
                            var items = $(msg).find("listing").text();
                            if(items)
                            {
                                items = items.replace(/\n/g,' ').replace(/\s/g,' ');
                                eval(items);
                                if(l && jQuery.isArray(l))
                                {
                                    setTimeout(function() {
                                        if(quickAccess)
                                        {
                                            dropdown.find("option[value='/']:first").nextAll("option").remove();
                                        }
                                        items = l;
                                        var pathToUse = opts.syncOpts || bucket ? pathToLoad : path;
                                        if(quickAccess)
                                        {
                                            base.curLoadedPath = pathToUse = $(msg).find("path:first").text();
                                        }
                                        if (items && items.length > 0) {
                                            base.renderListing(items, pathToUse);
                                        } else {
                                            base.renderListing([], pathToUse);
                                        }
                                        _path = opts.syncOpts ? unescape(pathToUse) : unescape(obj.path);

                                        if(_path && _path.indexOf("/cfhd/")<0)
                                        {
                                            if(_path.indexOf("/")==0)
                                                _path = "/cfhd" + _path;
                                            else
                                                _path = "/cfhd/" + _path;
                                        }
                                        else if(!_path)
                                        {
                                            _path = obj.path;
                                        }
                                        if(_path && _path.indexOf("/cfhd/")==0)
                                            _path = _path.replace("/cfhd", "");
                                        _path = _path.split("/");
                                        dropdown.empty();
                                        if(_path.length>0)
                                        {
                                            var items = [];
                                            for (var i = 0; i < _path.length; i++) {
                                                var calPath = "/" + _path.slice(1, i+1).join("/");
                                                if(calPath.lastIndexOf("/")!=calPath.length-1)
                                                {
                                                    calPath = calPath + "/";
                                                }
                                                if(dropdown.find("option[value='"+escape(calPath)+"']").length==0)
                                                {
                                                    if(i == _path.length-1)
                                                        dropdown.append("<option selected value='" + escape(calPath) + "'>" + unescape(calPath) + "</option>");
                                                    else
                                                        dropdown.append("<option value='" + escape(calPath) + "'>" + unescape(calPath) + "</option>");
                                                }
                                                else
                                                {
                                                    dropdown.find("option[value='"+escape(calPath)+"']").attr('selected', 'selected');
                                                }
                                            };
                                        }
                                        else
                                        {
                                            dropdown.append("<option value='/'>/</option>");
                                        }

                                        if(!quickAccess)
                                        {
                                            browsePanel.find(".quickLinkActive").removeClass('quickLinkActive');
                                        }
                                        if(base.options.type == "file")
                                        {
                                            okBtn.attr("disabled","disabled").addClass("ui-state-disabled");
                                        }
                                        else
                                        {
                                            okBtn.removeAttr("disabled").removeClass("ui-state-disabled");
                                        }
                                        if(base.options.syncOpts && base.options.isServerBrowse)
                                        {
                                            var privs = $(msg).find("privs:first").text();
                                            if(privs && privs.indexOf("syncName=")!=-1){
                                                okBtn.removeAttr("disabled").removeClass("ui-state-disabled");
                                            }
                                            else
                                            {
                                                okBtn.attr("disabled","disabled").addClass("ui-state-disabled");
                                            }
                                        }
                                    }, 10);
                                }
                            }
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        setTimeout(function() {
                            browsePanel.find(".loadingFS").hide();
                        }, 10);
                        errorThrown = errorThrown ||  obj.command + " failed";
                        if(crushFTP && crushFTP.UI && crushFTP.UI.growl)
                        {
                            if(!fromCookie)
                                crushFTP.UI.growl("Error", "Specified path not found, please choose another path.", true, 3000);
                            else
                            {
                                if(!base.reloaded)
                                {
                                    base.reloaded = true;
                                    base.listItems();
                                }
                                return false;
                            }
                        }
                        else
                            alert("Error : " + errorThrown);
                        if(!base.reloaded)
                        {
                            base.reloaded = true;
                            base.listItems();
                        }
                        return false;
                    }
                });
            }
            else
            {
                var obj = {
                    command: "getAdminXMLListing",
                    file_mode : base.options.file_mode,
                    format: "JSON",
                    path: pathToLoad,
                    random: Math.random()
                };
                obj.path = encodeURIComponent(unescape(obj.path)).replace(/\+/g, "%2B");
                // if(opts.isServerBrowse)
                // {
                //     obj.path = encodeURIComponent(unescape(obj.path)).replace(/\+/g, "%2B");
                // }
                // else
                //     obj.path = crushFTP.methods.htmlEncode(unescape(obj.path)).replace(/\+/g, "%2B");
                browsePanel.find(".loadingFS").show();
                /* Make a call and receive list */
                obj.c2f = crushFTP.getCrushAuth();
                $.ajax({
                    type: "POST",
                    url: base.ajaxCallURL,
                    data: obj,
                    success: function (msg){
                        base.reloaded = false;
                        setTimeout(function() {
                            browsePanel.find(".loadingFS").hide();
                        }, 10);
                        if (msg && msg.childNodes && msg.childNodes.length > 0) {
                            var items = $(msg).find("listing").text();
                            if(items)
                            {
                                items = items.replace(/\n/g,' ').replace(/\s/g,' ');
                                eval(items);
                                if(l && jQuery.isArray(l))
                                {
                                    setTimeout(function() {
                                        if(quickAccess)
                                        {
                                            dropdown.find("option[value='/']:first").nextAll("option").remove();
                                        }
                                        items = l;
                                        if(quickAccess)
                                        {
                                            if(isBoot)
                                                base.curLoadedPath = pathToLoad;
                                            else
                                                base.curLoadedPath = pathToLoad = $(msg).find("path:first").text();
                                        }
                                        if (items && items.length > 0) {
                                            base.renderListing(items, pathToLoad);
                                        } else {
                                            base.renderListing([], pathToLoad);
                                        }
                                        if(pathToLoad && pathToLoad.indexOf("/cfhd/")==0)
                                            pathToLoad = pathToLoad.replace("/cfhd", "");
                                        var isUNC = pathToLoad.indexOf("//") == 0;
                                        var _path = pathToLoad.split("/");
                                        dropdown.empty();
                                        if(_path.length>0)
                                        {
                                            var items = [];
                                            for (var i = 0; i < _path.length; i++) {
                                                var calPath = "/" + _path.slice(1, i+1).join("/");
                                                if(i==0 && isUNC)
                                                {
                                                    calPath = "/" + calPath;
                                                }
                                                if(calPath.lastIndexOf("/")!=calPath.length-1)
                                                {
                                                    calPath = calPath + "/";
                                                }
                                                if(dropdown.find("option[value='"+escape(calPath)+"']").length==0)
                                                {
                                                    if(i == _path.length-1)
                                                        dropdown.append("<option selected value='" + escape(calPath) + "'>" + unescape(calPath) + "</option>");
                                                    else
                                                        dropdown.append("<option value='" + escape(calPath) + "'>" + unescape(calPath) + "</option>");
                                                }
                                                else
                                                {
                                                    dropdown.find("option[value='"+escape(calPath)+"']").attr('selected', 'selected');
                                                }
                                            };
                                        }
                                        else
                                        {
                                            dropdown.append("<option value='/'>/</option>");
                                        }

                                        dropdown.find("option[value='"+escape(defaultDir)+"']").prevAll("option").remove();

                                        if(!quickAccess)
                                        {
                                            browsePanel.find(".quickLinkActive").removeClass('quickLinkActive');
                                        }

                                        if(base.options.type == "file")
                                        {
                                            okBtn.attr("disabled","disabled").addClass("ui-state-disabled");
                                        }
                                        else
                                        {
                                            okBtn.removeAttr("disabled").removeClass("ui-state-disabled");
                                        }
                                    }, 10);
                                }
                            }
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        setTimeout(function() {
                            browsePanel.find(".loadingFS").hide();
                        }, 10);
                        errorThrown = errorThrown ||  obj.command + " failed";
                        if(crushFTP && crushFTP.UI && crushFTP.UI.growl)
                        {
                            if(!fromCookie)
                                crushFTP.UI.growl("Error", "Specified path not found, please choose another path.", true, 3000);
                            else
                            {
                                setTimeout(function() {
                                    if(!base.reloaded)
                                    {
                                        base.reloaded = true;
                                        base.listItems();
                                    }
                                }, 15);
                                return false;
                            }
                        }
                        else
                            alert("Error : " + errorThrown);
                        if(!base.reloaded)
                        {
                            base.reloaded = true;
                            base.listItems();
                        }
                        return false;
                    }
                });
            }
        };

        base.utils = {
            formatBytes: function(bytes) {
                if ((bytes / 1024).toFixed(0) == 0) return bytes + " bytes";
                else if ((bytes / 1024 / 1024).toFixed(0) == 0) return (bytes / 1024).toFixed(1) + " KB";
                else if ((bytes / 1024 / 1024 / 1024).toFixed(0) == 0) return (bytes / 1024 / 1024).toFixed(1) + " MB";
                else if ((bytes / 1024 / 1024 / 1024 / 1024).toFixed(0) == 0) return (bytes / 1024 / 1024 / 1024).toFixed(1) + " GB";
                else if ((bytes / 1024 / 1024 / 1024 / 1024 / 1024).toFixed(0) == 0) return (bytes / 1024 / 1024 / 1024 / 1024).toFixed(1) + " TB";
            },
            formatDate: function(d, f) {
                var zf = function(n, width, z) {
                    z = z || '0';
                    n = n + '';
                    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
                }

                var gsMonthNames = new Array(
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December'
                );

                var gsDayNames = new Array(
                    'Sunday',
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday'
                );
                return f.replace(/(yyyy|mmmm|mmm|mm|dddd|ddd|dd|hf|hh|nn|ss|a\/p)/gi,
                    function($1) {
                        switch ($1.toLowerCase()) {
                            case 'yyyy':
                                return d.getFullYear();
                            case 'mmmm':
                                return gsMonthNames[d.getMonth()];
                            case 'mmm':
                                return gsMonthNames[d.getMonth()].substr(0, 3);
                            case 'mm':
                                return zf((d.getMonth() + 1), 2);
                            case 'dddd':
                                return gsDayNames[d.getDay()];
                            case 'ddd':
                                return gsDayNames[d.getDay()].substr(0, 3);
                            case 'dd':
                                return zf(d.getDate(), 2);
                            case 'hf':
                                return d.getHours();
                            case 'hh':
                                return zf(((h = d.getHours() % 12) ? h : 12), 2);
                            case 'nn':
                                return zf(d.getMinutes(), 2);
                            case 'ss':
                                return zf(d.getSeconds(), 2);
                            case 'a/p':
                                return d.getHours() < 12 ? 'AM' : 'PM';
                        }
                    }
                );
            },
            clearRangeSelection: function() {
                setTimeout(function() {
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
                }, 100);
            }
        };

        base.bindListingEvents = function() {
            var browsePanel = $("#" + base.thisElemId);
            var delay = (function() {
                var timer = 0;
                return function(callback, ms) {
                    clearTimeout(timer);
                    timer = setTimeout(callback, ms);
                };
            })();

            var listing = browsePanel.find("table.listing.files");

            function filterListing(phrase) {
                if (base.last_search_item && base.last_search_item === phrase) {
                    return false;
                }
                if (!phrase)
                    listing.find("tr").show();
                else {
                    listing.find("tr").hide();
                    listing.find("td.name:Contains(" + phrase + ")").parent().show();
                }
            }

            var fltr = browsePanel.find('.filter').unbind("keyup").keyup(function(evt) {
                var evt = (evt) ? evt : ((event) ? event : null);
                var val = this.value;

                function startFilter() {
                    setTimeout(function() {
                        filterListing(val);
                    }, 10);
                }
                if (evt.keyCode == 13) {
                    startFilter();
                } else if (evt.keyCode == 27) {
                    $(this).val("");
                    val = "";
                    startFilter();
                } else {
                    delay(function() {
                        startFilter();
                    }, 700);
                }
            });

            browsePanel.find('.clearFilter').unbind().click(function(event) {
                fltr.val("").trigger('keyup');
                return false;
            });

            var dropdown = browsePanel.find('.dropdown').unbind().change(function(event) {
                base.listItems(unescape($(this).val()));
                base.utils.clearRangeSelection();
                return false;
            });

            browsePanel.find('.refreshImg').unbind().click(function(event) {
                dropdown.addClass('nochange');
                dropdown.trigger('change');
                setTimeout(function(){
                    dropdown.removeClass('nochange');
                }, 100);
                return false;
            });

            browsePanel.find('.chkBoxAll').unbind().change(function(event) {
                if ($(this).is(":checked")) {
                    listing.find('input:checkbox:not(:disabled)').attr('checked', 'checked');
                } else {
                    listing.find('input:checkbox').removeAttr('checked');
                }
                return false;
            });

            browsePanel.find('.quickAccessLinks').find("li").unbind().click(function(event) {
                var rel = $(this).attr("rel");
                var isboot = $(this).attr("isBoot");
                if(rel)
                {
                    if (options.useApplet)
                    {
                        if(rel.indexOf("~")==0)
                        {
                            rel = runAppletCommand(true, "COMMAND=RESOLVE:::PATH=" + rel);
                            var items = rel.split(";;;");
                            for (var i = 0; i < items.length; i++) {
                                items[i] = items[i].split(":::");
                            }
                            for (var j = 0; j < items.length; j++) {
                                var strItem = items[j];
                                var item = {};
                                for (var i = 0; i < strItem.length; i++) {
                                    var curItem = strItem[i];
                                    if (curItem) {
                                        var ind = curItem.indexOf("=");
                                        if (ind >= 0) {
                                            var key = curItem.substring(0, ind);
                                            var val = curItem.substring(ind + 1, curItem.length);
                                            item[key] = val;
                                        }
                                    }
                                };
                                items[j] = item;
                            }
                            rel = items[0].path;
                        }
                        base.listItems(rel, true);
                    }
                    else
                    {
                        if(rel.lastIndexOf("/")!=rel.length-1)
                        {
                            rel = rel + "/";
                        }
                        base.listItems(rel, true, false, isboot);
                    }
                    browsePanel.find(".quickLinkActive").removeClass('quickLinkActive');
                    $(this).addClass('quickLinkActive');
                }
                return false;
            }).hover(function(){
                $(this).addClass('quickLinkHover');
            },function(){
                $(this).removeClass('quickLinkHover');
            });
        }

        base.showHideSystemFiles = function() {
            var browsePanel = $("#" + base.thisElemId);
            if (browsePanel.find(".showSystemFiles").is(":checked"))
                browsePanel.find("table.listing.files").removeClass('NoHiddenFiles');
            else
                browsePanel.find("table.listing.files").addClass('NoHiddenFiles');
        }

        base.bindRowEvents = function() {
            var browsePanel = $("#" + base.thisElemId);
            var listing = browsePanel.find("table.listing.files");
            if(base.options.type == "dir")
            {
                listing.find('td._file').parent().addClass('ui-state-disabled').find('input:checkbox').removeAttr('checked').attr('disabled', 'disabled');
            }
            if(base.options.singleSelection)
            {
                browsePanel.find('input:checkbox:not(.showSystemFiles)').css("visibility", "hidden");
                var okBtn = $("div.localFileBrowserPopup:visible").find(".ui-dialog-buttonset").find("button:last");
                listing.find('td._dir, td._file').parent().unbind("click").bind('click', function() {
                    listing.find('.selected').removeClass('selected');
                    if(base.options.type == "dir" && $(this).find("td._file").length>0)
                    {
                        okBtn.attr("disabled","disabled").addClass("ui-state-disabled");
                    }
                    else if(base.options.type == "file" && $(this).find("td._dir").length>0)
                    {
                        okBtn.attr("disabled","disabled").addClass("ui-state-disabled");
                    }
                    else
                    {
                        okBtn.removeAttr("disabled").removeClass("ui-state-disabled");
                    }
                    $(this).addClass('selected');
                    base.utils.clearRangeSelection();
                    return false;
                });
            }
            if(base.options.syncOpts && base.options.isServerBrowse)
            {
                var okBtn = $("div.localFileBrowserPopup:visible").find(".ui-dialog-buttonset").find("button:last");
                listing.find('td._dir').parent().unbind("click").bind('click', function() {
                    listing.find('.selected').removeClass('selected');
                    var curData = $(this).data("curData");
                    if(curData && curData.privs && curData.privs.indexOf("syncName=")!=-1){
                        okBtn.removeAttr("disabled").removeClass("ui-state-disabled");
                    }
                    else{
                        okBtn.attr("disabled","disabled").addClass("ui-state-disabled");
                    }
                    $(this).addClass('selected');
                    base.utils.clearRangeSelection();
                    return false;
                });
            }
            listing.find('td._dir').parent().unbind("dblclick").bind('dblclick', function() {
                var curData = $(this).data("curData");
                if (curData && curData.path) {
                    if(curData.root_dir == "/Volumes/")
                    {
                        if(curData.boot == "false")
                        {
                            if(curData.name.endsWith("/"))
                                base.listItems("/Volumes/" + curData.name);
                            else
                                base.listItems("/Volumes/" + curData.name + "/");
                            base.utils.clearRangeSelection();
                        }
                        else
                        {
                            if(curData.name.endsWith("/"))
                                base.listItems("/" + curData.name, false, false, true);
                            else
                                base.listItems("/" + curData.name + "/", false, false, true);
                            base.utils.clearRangeSelection();
                        }
                    }
                    else
                    {
                        base.listItems(curData.path);
                        base.utils.clearRangeSelection();
                    }
                }
                return false;
            });

            if(base.options.type != "dir")
            {
                listing.find('td._file').parent().unbind("dblclick").bind('dblclick', function() {
                    $(this).prev().find("input").prop("checked", "checked");
                    var okBtn = $("div.localFileBrowserPopup:visible").find(".ui-dialog-buttonset").find("button:last");
                    okBtn.click();
                    return false;
                });
            }

            if(typeof $.cluetip != "undefined")
            {
                listing.find(".vtip").cluetip({
                    splitTitle: '^',
                    showTitle: false,
                    width: 'auto',
                    cluetipClass: 'default',
                    clickThrough : true,
                    arrows: true,
                    tracking: true,
                    positionBy: 'mouse',
                    mouseOutClose: true,
                    dropShadowSteps: 2,
                    dynamicLeftOffset: true,
                    leftOffset: -250,
                    topOffset: 0
                });
            }

            listing.find('td._parent').parent().unbind().bind('dblclick', function() {
                var dropdown = browsePanel.find('.dropdown');
                dropdown.find('option:last').prev().attr('selected', 'selected');
                // if(dropdown.find("option[value='"+dropdown.next().val()+"']").length>0)
                //     dropdown.find("option[value='"+dropdown.next().val()+"']").removeAttr('selected').prev().attr('selected', 'selected');
                // else
                dropdown.trigger("change.local");
                return false;
            });

            listing.find('input:checkbox').click(function(evt) {
                if (evt.shiftKey) {
                    if (typeof base.lastSelected != "undefined") {
                        var baseElem = $(listing.find('tr').get(base.lastSelected));
                        var curIndex = $(this).closest('tr').index();
                        var isChecked = baseElem.find('input:checkbox').is(":checked");
                        var start = curIndex < base.lastSelected ? curIndex : base.lastSelected;
                        var end = curIndex < base.lastSelected ? base.lastSelected : curIndex;
                        for (var i = start; i < end; i++) {
                            if (isChecked)
                                $(listing.find('tr').get(i)).find('input:checkbox').attr('checked', 'checked');
                            else
                                $(listing.find('tr').get(i)).find('input:checkbox').removeAttr('checked');
                        };
                        listing.find('input:checkbox:first').trigger('change');
                    }
                }
                base.lastSelected = $(this).closest('tr').index();
            });

            listing.find('input:checkbox').unbind().change(function(event) {
                if (listing.find("input:not([checked]):visible").length > 0)
                    browsePanel.find(".chkBoxAll").removeAttr('checked');
                else
                    browsePanel.find(".chkBoxAll").attr('checked', 'checked');
            });
            setTimeout(function(){
                var dropdown = browsePanel.find(".dropdown");
                if(dropdown.data("hasCBAttached"))
                    dropdown.combobox("destroy");
                dropdown.data("hasCBAttached", true).combobox();
                base.bindDropDownEvents(dropdown);
            }, 10);
        }

        base.bindDropDownEvents = function(dropdown){
            // if(!dropdown.data("eventAdded"))
            {
                dropdown.data("eventAdded", true);
                dropdown.unbind("change.local").bind("change.local", function(){
                    if(dropdown.hasClass('nochange'))
                        return false;
                    base.listItems(unescape($(this).val()));
                    base.utils.clearRangeSelection();
                    $(this).find("option:selected").nextAll("option").remove();
                    return false;
                });
                dropdown.attr("justEnter", true).unbind("change.local2").bind("change.local2", function(){
                    if(dropdown.hasClass('nochange'))
                        return false;
                    var path = unescape($(this).next().val());
                    if(path.lastIndexOf("/")!=path.length-1)
                    {
                        path = path + "/";
                    }
                    base.listItems(path);
                    base.utils.clearRangeSelection();
                    $(this).find("option:selected").nextAll("option").remove();
                    return false;
                });
            }
        };

        base.renderListing = function(items, path) {
            if(path && path.indexOf("file:/")==0)
                path = path.replace("file:/", "");
            var browsePanel = $("#" + base.thisElemId);
            var listElem = browsePanel.find("table.listing.files").find("tbody").empty();
            if (items && items.length > 0) {
                function dynamicSort(property) {
                    var sortOrder = 1;
                    if (property[0] === "-") {
                        sortOrder = -1;
                        property = property.substr(1);
                    }
                    return function(a, b) {
                        var result = (a[property].toUpperCase() < b[property].toUpperCase()) ? -1 : (a[property].toUpperCase() > b[property].toUpperCase()) ? 1 : 0;
                        return result * sortOrder;
                    }
                }

                function dynamicSortMultiple() {
                    var props = arguments;
                    return function(obj1, obj2) {
                        var i = 0,
                            result = 0,
                            numberOfProperties = props.length;
                        while (result === 0 && i < numberOfProperties) {
                            result = dynamicSort(props[i])(obj1, obj2);
                            i++;
                        }
                        return result;
                    }
                }
                items = items.sort(dynamicSortMultiple("type", "name"));
                var nameLength = 35;
                for (var i = 0; i < items.length; i++) {
                    var curItem = items[i];
                    if(curItem.type)
                        curItem.type = curItem.type.toLowerCase();
                    var syncedItemClass = "";
                    if(base.options.syncOpts && base.options.isServerBrowse)
                    {
                        syncedItemClass = (curItem.privs && curItem.privs.indexOf("syncName=")!=-1) ? "<div class='syncItem new'></div>" : "";
                    }
                    if(curItem.href_path)
                    {
                        curItem.path = curItem.href_path;
                        if(curItem.type == "dir" && curItem.path.lastIndexOf("/")!=curItem.path.length-1)
                        {
                            curItem.path = path + curItem.name + "/";
                        }
                        else if(curItem.type == "file")
                        {
                            curItem.path = path + curItem.name;
                        }
                        var isUNC = browsePanel.data("isUNC");
                        if(isUNC)
                        {
                            curItem.path = "/" + curItem.path;
                        }
                    }
                    var size = curItem.type == "file" ? base.utils.formatBytes(curItem.size) : " - ";
                    var date = " - ";
                    if(curItem.modified && curItem.modified != "0")
                        date = base.utils.formatDate(new Date(parseInt(curItem.modified)), "mm/dd/yyyy");
                    var sysFile = curItem.name.indexOf(".") == 0 ? "class=sysFile" : "";
                    var name = curItem.name;
                    if (name && name.length >= nameLength) {
                        if(curItem.type == "file")
                        {
                            name = name.substr(0, nameLength-4) + ".." + base.getFileExtension(curItem.name);
                        }
                        else
                            name = name.substr(0, nameLength) + "...";
                    }
                    name = $('<div/>').text(name).html();
                    var curHTML = $('<tr ' + sysFile + '><td class="chekbox"><input class="chkBox" type="checkbox"></td><td title="'+(curItem.name)+'" class="vtip name lft _' + curItem.type + '">' + syncedItemClass + name + '</td><td class="size">' + size + '</td><td class="date">' + date + '</td></tr>');
                    curHTML.data("curData", curItem);
                    listElem.append(curHTML);
                };
            }
            if (path != "/") {
                var listElem = browsePanel.find("table.listing.files").find("tbody");
                listElem.prepend('<tr style="position: absolute;height: 20px;background-color: #eee;width: 801px;z-index:9;"><td colspan="4" class="name lft _parent">..</td></tr><tr style="position: relative;height: 25px;"><td colspan="4"></td></tr>');
            }
            listElem.closest('.scrollableList').scrollTop(0);
            base.showHideSystemFiles();
            base.bindRowEvents();
        };

        // Run initializer
        base.init();
    };

    $.crushFtpLocalFileBrowserPopup.defaultOptions = {
        type: 'file',
        file_mode : "server",
        singleSelection : true,
        allowRootSelection : false
    };

    $.fn.crushFtpLocalFileBrowserPopup = function(options) {
        return this.each(function() {
            (new $.crushFtpLocalFileBrowserPopup(this, options));
        });
    };
})(jQuery);

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

jQuery.expr[':'].Contains = function(a, i, m) {
    if (m[3].trim()=="" || m[3].trim()=="''")
        return true
    else
        return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
};