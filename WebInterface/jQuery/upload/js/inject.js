$(function() {
    var loadingIndicatorUpload = $("#loadingIndicatorUpload").hide();
    loadingIndicatorUpload.dialog({
        autoOpen: true,
        dialogClass: "loadingIndicatorWindow",
        closeOnEscape: false,
        draggable: false,
        width: window.loadingIndicatorDialogWidth || 150,
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
    $('body').append('<div style="visibility:hidden;" id="fileUploadModule"><div class="fileListHeader ui-widget-header ui-corner-all"><span class="fileRepoHeader">Files to upload</span><span style="position:absolute;cursor:pointer;right:7px;top:6px;" class="ui-icon ui-icon-closethick" id="toggleUploadPanel"></span></div><div class="widget-content"><iframe frameborder="0" id="fileUploadIframe" src="/WebInterface/jQuery/upload/index.html?embed=true"></iframe></div></div>').find('#fileUploadIframe').on('load', function() {
        loadingIndicatorUpload.dialog("destroy");
        $("body").trigger("newUploadPanelLoaded");
        if(window.onUploadReady){
            window.onUploadReady();
        }
    });

    var fileUploadModule = $('#fileUploadModule');
    fileUploadModule.css("top", 190);
    var fileUploadIframe = $('#fileUploadIframe');
    var toggleUploadPanel = $('#toggleUploadPanel');
    var browseFileButtonPanel = $('#browseFileButtonPanel');
    var viewFileQueue = $('#viewFileQueue');
    toggleUploadPanel.click(function(){
        window.hideUploadPanel();
    });

    var maxChunkSizeSet = requestRetriesSizeSet = false;
    window.resizeiFramePanel = function(width, height, progress){
        if(width){
            fileUploadIframe.width(width);
            fileUploadModule.width(width);
        }
        if(height){
            fileUploadIframe.height(height);
        }
        fileUploadModule.css("visibility", "visible");
        window.crushUpload = fileUploadIframe[0].contentWindow.crushUpload;
        if(typeof window.maxChunkSize != "undefined" && !maxChunkSizeSet){
            maxChunkSizeSet = true;
            window.crushUpload.maxChunkSize = parseInt(window.maxChunkSize);
        }
        if(typeof window.requestRetries != "undefined" && !requestRetriesSizeSet){
            requestRetriesSizeSet = true;
            window.crushUpload.requestRetries = parseInt(window.requestRetries);
        }
        if(progress){
            window.resizeiFrame();
        }
    }

    window.hideUploadPanel = function(flag){
        $("body").removeClass('upload-window-open');
        if(flag)
            fileUploadModule.hide();
        else
            fileUploadModule.slideUp("fast");
        browseFileButtonPanel.show();
        viewFileQueue.show();
    }

    window.showUploadPanel = function(browse){
        $("body").addClass('upload-window-open');
        viewFileQueue.hide();
        fileUploadModule.slideDown("fast");
        browseFileButtonPanel.hide();
        if(window.crushUpload){
            window.crushUpload.resizeiFrame();
            if(browse)
                window.crushUpload.browseFiles();
        }
        $(window).scrollTop(0);
    }

    window.uploadCancelledNotify = function(){
        $("#mainContent").find("span.refreshButton").trigger("click");
        $.titleAlert("** Cancelled "+locale.fileupload.uploadCompletedText+"**", {
            duration  : 2000
        });
    }

    window.setFocus = function(selected){
        setTimeout(function(){
            $("#fileUploadIframe").contents().find("#filter").click();
        });
    };

    window.uploadDoneNotify = function(selected){
        $("#mainContent").find("span.refreshButton").trigger("click");

        $.titleAlert("**"+locale.fileupload.uploadCompletedText+"**", {
            duration  : 2000
        });

        if(window.showUploadNotification)
        {
            if(Notification.permission !== 'granted'){
                Notification.requestPermission();
            }
            var n = new Notification(locale.fileupload.uploadCompletedText, {
                body: locale.fileupload.uploadedMultipleFilesText
            });
        }

        if(window.runBatchCompletedCommandAfterUploadQueueFinishes)
        {
            window.batchComplete();
        }
        if(typeof window.onUploadComplete == "function"){
            window.onUploadComplete();
        }
        if(window.hideUploadBarAfterUpload)
        {
            window.hideUploadPanel();
        }

        var autoShareUploadedItem = $(document).data("autoShareUploadedItem");
        var autoShareUploadedItemNotify = $(document).data("autoShareUploadedItemNotify");
        if(autoShareUploadedItem && autoShareUploadedItem.toLowerCase()=="true")
        {
            setTimeout(function(){
                if(window.crushUpload)
                {
                    var res = window.crushUpload.getItemsToShare();
                    if(res && ((res.paths || res.files) && (res.paths.length>0 || res.files.length>0))){
                        var shareMethodUploadedItem = $(document).data("shareMethodUploadedItem");
                        var _continueShare = function() {
                            if(shareMethodUploadedItem && shareMethodUploadedItem.toLowerCase() == "quick")
                            {
                                window.quickShareFile(false, res.paths.join("\r\n"), false, res.files.join("\r\n"));
                            }
                            else
                                window.shareFile(false, res.paths.join("\r\n"), res.files.join("\r\n"));
                        }
                        setTimeout(_continueShare);
                    }
                    if(autoShareUploadedItemNotify)
                    {
                        setTimeout(function(){
                            var shareReadyMsg = window.localizations.shareUploadedItemsMessage || "Your files are uploaded and ready to share.";
                            $.crushNotify({
                                message : shareReadyMsg,
                                playSound : true,
                                flashTitle : true,
                                browserNotification : true
                            })
                        },1000);
                    }
                    setTimeout(function(){
                        if(window.autoRemoveUploadedItemFromList)
                        {
                            window.crushUpload.removeUploaded();
                            window.hideUploadPanel();
                        }
                    }, 100);
                }
            }, 100);
        }
        else
        {
            setTimeout(function(){
                if(window.autoRemoveUploadedItemFromList)
                {
                    window.crushUpload.removeUploaded();
                    window.hideUploadPanel();
                }
            }, 100);
        }
    }

    window.shareUploaded = function(){
        if(window.crushUpload)
        {
            var res = window.crushUpload.getItemsToShare();
            if(res && ((res.paths || res.files) && (res.paths.length>0 || res.files.length>0))){
                var shareMethodUploadedItem = $(document).data("shareMethodUploadedItem");
                var _continueShare = function() {
                    if(shareMethodUploadedItem && shareMethodUploadedItem.toLowerCase() == "quick")
                    {
                        window.quickShareFile(false, res.paths.join("\r\n"), false, res.files.join("\r\n"));
                    }
                    else
                        window.shareFile(false, res.paths.join("\r\n"), res.files.join("\r\n"));
                }
                setTimeout(_continueShare);
            }
        }
    }

    window.currentPath = function(){
        var path = window.defaultUploadPath || hashListener.getHash().toString().replace("#", "");
        try{
            path = decodeURIComponent(path);
        }catch(ex){
            path = unescape(path);
        }
        return path;
    }

    window.resizeiFrame = function(){
        if(fileUploadModule.data("resized"))
        {
            var width = fileUploadModule.width();
            var height = fileUploadModule.height();
            window.crushUpload.resizeList(width, height);
        }
    }

    fileUploadModule.draggable({
        handle : ".fileListHeader",
        containment : "document",
        iframeFix : true
    }).resizable({
        containment: "document",
        minHeight: 350,
        minWidth: 640,
        helper: "ui-resizable-helper",
        start: function(event, ui) {
            fileUploadIframe.css('pointer-events','none');
        },
        stop: function(event, ui) {
            fileUploadModule.data("resized", true);
            fileUploadIframe.css('pointer-events','auto');
            resizeiFrame(ui.size);
            //window.crushUpload.resizeList(size.width, size.height);
        }
    });

    window.getReverseProxyPath = function(){
        try{
            var ajaxURL = window.ajaxCallURL;
            var proxy = ajaxURL.substring(0, ajaxURL.indexOf("/Web" + "Interface/"));
            return proxy;
        }
        catch(ex){
            return "";
        }
    }

    window.autoStartUpload = function(){
        return $.cookie($.CrushFTP.Options.CookieAutoUploadFlag) + "" == "true";
    };

    window.isCommonFormShown = function(){
        return window.commonUploadFormShown;
    };

    window.getMetaInfo = function(){
        return window.metaInfo;
    };

    window.maxFilesAllowedInQueue = function(){
        return localStorage["wi_upload_count"] ? parseInt(localStorage["wi_upload_count"]) : window.maxFilesInQueue;
    };

    window.maxFilesnameLength = function(){
        return window.maxFileNameLengthInUpload || 0;
    };

    window.maxFilesReached = function(){
        $.growlUI(getLocalizationKeyExternal("MaxUploadFilesCountReachedGrowlText"), getLocalizationKeyExternal("MaxUploadFilesCountReachedGrowlDesc") + window.maxFilesAllowedInQueue(), 3000, "growlError");
    }

    window.folderUploadNotAllowed = function(){
        $.growlUI(getLocalizationKeyExternal("AdvancedUploadDirNotAllowedText"), getLocalizationKeyExternal("AdvancedUploadDirNotAllowedDescText"), 3000, "growlError");
    }

    window.showUploadFormAdvanced = function(showCommonForm, index, items, direct){
        if(items && items.length)
        {
            if(window.maxUploadItemsBeforeShowingWarning && items.length>window.maxUploadItemsBeforeShowingWarning){
                $.growlUI("Warning", window.maxUploadItemsWarningMessage || getLocalizationKeyExternal("maxUploadItemsWarningMessage"), 3000, "growlError", true);
            }
        }
        return $.CrushFTP.showUploadFormAdvanced(showCommonForm, index, items, direct);
    };

    window.fileExistsOnServer = function(name, path, realCheck){
        return $.CrushFTP.checkFileExistOnServer(name, path, realCheck);
    }

    window.folderExistsOnServer = function(folder){
        return $.CrushFTP.checkFolderExistOnServer(folder);
    }

    window.isFileTypeAllowed = function(name){
        return $.CrushFTP.isFileTypeAllowed(name);
    }

    window.doesFileSizeExceed = function(size){
        return $.CrushFTP.doesFileSizeExceed(size);
    }

    window.doesFileNameSizeExceed = function(name){
        return $.CrushFTP.doesFileNameSizeExceed(name);
    }

    window.doesFileSizeExceedAllowedSize = function(size){
        return $.CrushFTP.doesFileSizeExceedAllowedSize(size);
    }

    window.checkCommonUploadForm = function(){
        $.CrushFTP.checkUploadForm();
    }

    window.uploadInProgress = function(flag){
        $.CrushFTP.UploadProgressing = flag;
    }

    window.tempFileExtensionWhileUploading = function(){
        return window.temp_upload_ext;
    }

    window.alternateDomains = function(){
        return window.alternate_domains || [];
    }

    window.uploadShowNameInsteadOfPath = function() {
        return window.uploadWindowShowNameInsteadOfFullPath;
    }

    window.disableDND = function() {
        return window.disableDragDropUpload;
    }

    window.disableUploadingDirs = function() {
        return window.blockUploadingDirs;
    }

    window.hasWritePermission = function(){
        var privs = $(document).data("curDirPrivs");
        var flag = true;
        if(privs)
            flag = privs.indexOf("(write)") >= 0;
        if(!flag)
        {
            var destinationPath = encodeURIComponent(hashListener.getHash().toString().replace("#", ""));
            destinationPath = destinationPath || "/";
            var path = destinationPath;
            $.growlUI(getLocalizationKeyExternal("NoUploadInDirGrowlText"), getLocalizationKeyExternal("NoUploadInDirGrowlDesc") + "<br/>" + unescape(path), 3000, "growlError");
        }
        return flag;
    }

    window.uploadNotifications = function(type){
        if(window.parent.postMessage){
            window.parent.postMessage(type, "*");
        }
    }

    window.useNewUpload = true;
});